"""Soil analysis service for YieldSense AI.

Provides pH validation, nutrient scoring and fertility classification
on top of the existing SoilReport model. Used both by the standalone
/api/v1/soil endpoint and by prediction_service, which only receives a
raw soil_ph value (not a full soil report) from the /predict request.
"""

from typing import Any, Dict, Optional

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundException
from app.core.logging import logger
from app.models.soil import SoilReport
from app.repositories.soil_repository import SoilRepository

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


class SoilService:
    """Soil suitability and fertility analysis."""

    def __init__(self, db: Session):
        self.db = db
        self.repo = SoilRepository(db)

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
