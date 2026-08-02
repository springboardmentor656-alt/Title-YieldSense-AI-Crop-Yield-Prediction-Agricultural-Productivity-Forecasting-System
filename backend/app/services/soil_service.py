"""Soil analysis service for YieldSense AI.

Provides pH validation, nutrient scoring and fertility classification
on top of the existing SoilReport model. Used both by the standalone
/api/v1/soil endpoint and by prediction_service, which only receives a
raw soil_ph value (not a full soil report) from the /predict request.
"""

from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundException
from app.core.logging import logger
from app.models.soil import SoilReport
from app.repositories.soil_repository import SoilRepository
from app.services.farm_service import FarmService
from app.services.notification_service import NotificationService

# Most agricultural crops tolerate a slightly acidic to neutral pH.
OPTIMAL_PH_RANGE = (6.0, 7.5)
ACCEPTABLE_PH_RANGE = (5.5, 8.0)
VALID_PH_RANGE = (0.0, 14.0)

# Approximate agronomic sufficiency levels in kg/ha, used as the
# denominator when scoring N/P/K on a 0-100 scale.
NUTRIENT_REFERENCE_LEVELS = {
    "nitrogen": 120.0,
    "phosphorus": 60.0,
    "potassium": 100.0,
}

# Typical agronomic sufficiency level for organic carbon, percent by
# soil weight. Used the same way as NUTRIENT_REFERENCE_LEVELS: capped
# at 100% before entering the health index so an excess can't offset
# a deficiency elsewhere.
ORGANIC_CARBON_REFERENCE = 0.75

# Weights for the composite soil health index. pH and nutrients matter
# most for near-term crop suitability; organic carbon reflects
# longer-term soil quality. Sums to 1.0.
HEALTH_INDEX_WEIGHTS = {
    "ph": 0.3,
    "nutrient": 0.4,
    "organic_carbon": 0.3,
}

# Same 80/50 banding as fertility_category, applied to the composite
# health index. Kept as a separate function since the two scores can
# diverge (e.g. good NPK but poor pH/organic carbon).
HEALTHY_THRESHOLD = 80.0
MODERATE_THRESHOLD = 50.0

RECENT_REPORT_WINDOW_DAYS = 30


class SoilService:
    """Soil suitability and fertility analysis."""

    def __init__(self, db: Session):
        self.db = db
        self.repo = SoilRepository(db)
        self.farm_service = FarmService(db)
        self.notification_service = NotificationService(db)

    @staticmethod
    def validate_ph(ph: float) -> bool:
        """Return True if ph is a physically valid reading on the 0-14 scale."""
        return VALID_PH_RANGE[0] <= ph <= VALID_PH_RANGE[1]

    @staticmethod
    def evaluate_ph(ph: float) -> Dict[str, Any]:
        """Classify a pH value and derive a yield suitability multiplier.

        Raises:
            ValueError: If ph is outside the physically valid 0-14 range.
        """
        if not SoilService.validate_ph(ph):
            raise ValueError(
                f"soil_ph must be between {VALID_PH_RANGE[0]} and "
                f"{VALID_PH_RANGE[1]}, got {ph}."
            )

        if OPTIMAL_PH_RANGE[0] <= ph <= OPTIMAL_PH_RANGE[1]:
            category, multiplier = "optimal", 1.0
        elif ACCEPTABLE_PH_RANGE[0] <= ph <= ACCEPTABLE_PH_RANGE[1]:
            category, multiplier = "acceptable", 0.9
        else:
            category, multiplier = "poor", 0.75

        return {
            "ph": ph,
            "ph_category": category,
            "is_valid": True,
            "yield_multiplier": multiplier,
        }

    @staticmethod
    def nutrient_score(
        nitrogen: Optional[float],
        phosphorus: Optional[float],
        potassium: Optional[float],
    ) -> float:
        """Score available N/P/K readings on a 0-100 scale.

        Each nutrient is capped at 100% of its reference sufficiency
        level before averaging, so an excess of one nutrient cannot
        mask a deficiency in another. Missing readings are excluded
        from the average rather than treated as zero.
        """
        values = {
            "nitrogen": nitrogen,
            "phosphorus": phosphorus,
            "potassium": potassium,
        }
        available = {k: v for k, v in values.items() if v is not None}
        if not available:
            return 0.0

        scores = [
            min(value / NUTRIENT_REFERENCE_LEVELS[key], 1.0) * 100
            for key, value in available.items()
        ]
        return round(sum(scores) / len(scores), 2)

    @staticmethod
    def fertility_category(score: float) -> str:
        """Map a nutrient score to a human-readable fertility category."""
        if score >= 80:
            return "high"
        if score >= 50:
            return "medium"
        return "low"

    @staticmethod
    def organic_carbon_score(organic_carbon: Optional[float]) -> float:
        """Score an organic carbon reading on a 0-100 scale, capped at
        100% of ORGANIC_CARBON_REFERENCE the same way nutrient_score
        caps each of N/P/K.
        """
        if organic_carbon is None:
            return 0.0
        return round(
            min(organic_carbon / ORGANIC_CARBON_REFERENCE, 1.0) * 100, 2
        )

    @staticmethod
    def soil_health_index(
        ph_multiplier: float,
        nutrient_score: float,
        organic_carbon_score: float,
    ) -> float:
        """Composite 0-100 score combining pH suitability, nutrient
        adequacy and organic carbon, weighted by HEALTH_INDEX_WEIGHTS.
        ph_multiplier (0.75-1.0) is rescaled to 0-100 first so all three
        inputs share the same scale before weighting.
        """
        ph_score = ph_multiplier * 100
        index = (
            ph_score * HEALTH_INDEX_WEIGHTS["ph"]
            + nutrient_score * HEALTH_INDEX_WEIGHTS["nutrient"]
            + organic_carbon_score * HEALTH_INDEX_WEIGHTS["organic_carbon"]
        )
        return round(index, 2)

    @staticmethod
    def health_category(index: float) -> str:
        """Map a soil health index to a human-readable category."""
        if index >= HEALTHY_THRESHOLD:
            return "healthy"
        if index >= MODERATE_THRESHOLD:
            return "moderate"
        return "poor"

    def assess_farm_soil(self, farm_id: int) -> Dict[str, Any]:
        """Build a full structured soil suitability report for a farm.

        Raises:
            ResourceNotFoundException: If the farm has no soil report on file.
        """
        report: Optional[SoilReport] = self.repo.latest_for_farm(farm_id)
        if report is None:
            raise ResourceNotFoundException("Soil report")

        ph_assessment = self.evaluate_ph(report.ph)
        score = self.nutrient_score(
            report.nitrogen, report.phosphorus, report.potassium
        )
        category = self.fertility_category(score)

        logger.info(
            f"Soil assessment for farm {farm_id}: nutrient_score={score}, "
            f"fertility_category={category}, ph_category={ph_assessment['ph_category']}"
        )

        return {
            "farm_id": farm_id,
            "ph": ph_assessment,
            "nutrient_score": score,
            "fertility_category": category,
            "nitrogen": report.nitrogen,
            "phosphorus": report.phosphorus,
            "potassium": report.potassium,
            "moisture": report.moisture,
        }

    def _to_report_response(self, report: SoilReport) -> Dict[str, Any]:
        """Build the full CRUD response dict for one report: raw
        fields plus every derived metric, computed fresh each time.
        """
        ph_assessment = self.evaluate_ph(report.ph)
        nutrient = self.nutrient_score(
            report.nitrogen, report.phosphorus, report.potassium
        )
        fertility = self.fertility_category(nutrient)
        oc_score = self.organic_carbon_score(report.organic_carbon)
        health_index = self.soil_health_index(
            ph_assessment["yield_multiplier"], nutrient, oc_score
        )

        return {
            "id": report.id,
            "farm_id": report.farm_id,
            "farm_name": report.farm.farm_name if report.farm else None,
            "ph": report.ph,
            "nitrogen": report.nitrogen,
            "phosphorus": report.phosphorus,
            "potassium": report.potassium,
            "moisture": report.moisture,
            "organic_carbon": report.organic_carbon,
            "ph_category": ph_assessment["ph_category"],
            "nutrient_score": nutrient,
            "fertility_category": fertility,
            "soil_health_index": health_index,
            "health_category": self.health_category(health_index),
            "created_at": report.created_at,
        }

    def create_report(self, token, payload) -> Dict[str, Any]:
        """Create a soil report for a farm the caller owns."""
        farm = self.farm_service.get_farm(payload.farm_id, token)

        report = SoilReport(
            farm_id=payload.farm_id,
            ph=payload.ph,
            nitrogen=payload.nitrogen,
            phosphorus=payload.phosphorus,
            potassium=payload.potassium,
            moisture=payload.moisture,
            organic_carbon=payload.organic_carbon,
        )
        report = self.repo.create(report)

        logger.info(f"Soil report {report.id} created for farm {payload.farm_id}")

        self.notification_service.create_for_user(
            farm.user_id,
            "Soil Report Generated",
            f"A new soil report was recorded for '{farm.farm_name}'.",
            category="soil",
        )

        return self._to_report_response(report)

    def get_report(self, report_id: int, token) -> Dict[str, Any]:
        """Fetch a single soil report, enforcing ownership of its farm."""
        report = self.repo.get_by_id(report_id)
        if report is None:
            raise ResourceNotFoundException("Soil report")

        self.farm_service.get_farm(report.farm_id, token)

        return self._to_report_response(report)

    def update_report(self, report_id: int, token, payload) -> Dict[str, Any]:
        """Update a soil report's readings, enforcing ownership of its farm."""
        report = self.repo.get_by_id(report_id)
        if report is None:
            raise ResourceNotFoundException("Soil report")

        self.farm_service.get_farm(report.farm_id, token)

        updates = payload.model_dump(exclude_unset=True)
        for field, value in updates.items():
            setattr(report, field, value)

        report = self.repo.update(report)

        return self._to_report_response(report)

    def delete_report(self, report_id: int, token) -> None:
        """Delete a soil report, enforcing ownership of its farm."""
        report = self.repo.get_by_id(report_id)
        if report is None:
            raise ResourceNotFoundException("Soil report")

        self.farm_service.get_farm(report.farm_id, token)

        self.repo.delete(report)

    def list_reports(
        self,
        user_id: int,
        search: Optional[str],
        fertility: Optional[str],
        health: Optional[str],
        page: int,
        page_size: int,
    ) -> Dict[str, Any]:
        """Paginated, searchable, filterable list of a user's soil
        reports across all their farms. Filtering by fertility/health
        category happens in Python since those are derived values, not
        stored columns — acceptable at this data scale (per-user farm
        counts are small).
        """
        reports = self.repo.list_for_user(user_id, search)
        rows = [self._to_report_response(r) for r in reports]

        if fertility:
            rows = [r for r in rows if r["fertility_category"] == fertility]
        if health:
            rows = [r for r in rows if r["health_category"] == health]

        total = len(rows)
        start = (page - 1) * page_size
        page_rows = rows[start:start + page_size]

        return {
            "items": page_rows,
            "total": total,
            "page": page,
            "page_size": page_size,
        }

    def dashboard_stats(self, user_id: int) -> Dict[str, Any]:
        """Soil-health summary cards for the dashboard: average health
        across each farm's LATEST report, healthy/poor farm counts, and
        how many reports were added in the last RECENT_REPORT_WINDOW_DAYS.
        """
        reports = self.repo.list_for_user(user_id)

        latest_per_farm: Dict[int, SoilReport] = {}
        for report in reports:
            if report.farm_id not in latest_per_farm:
                latest_per_farm[report.farm_id] = report

        health_indexes = []
        healthy_farms = 0
        poor_soil_farms = 0
        for report in latest_per_farm.values():
            response = self._to_report_response(report)
            health_indexes.append(response["soil_health_index"])
            if response["health_category"] == "healthy":
                healthy_farms += 1
            elif response["health_category"] == "poor":
                poor_soil_farms += 1

        cutoff = datetime.now(timezone.utc) - timedelta(days=RECENT_REPORT_WINDOW_DAYS)
        recent_reports = sum(
            1 for r in reports if r.created_at and r.created_at >= cutoff
        )

        return {
            "average_soil_health": (
                round(sum(health_indexes) / len(health_indexes), 2)
                if health_indexes else None
            ),
            "healthy_farms": healthy_farms,
            "poor_soil_farms": poor_soil_farms,
            "total_farms_with_reports": len(latest_per_farm),
            "recent_reports": recent_reports,
            "total_reports": len(reports),
        }
