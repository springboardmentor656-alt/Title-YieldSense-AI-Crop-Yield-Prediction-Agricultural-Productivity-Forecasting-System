"""Rule-based recommendation engine for YieldSense AI.

Combines a farm's latest soil report and weather record with fixed
reference tables and threshold rules to produce crop suggestions,
fertilizer advice, an irrigation plan, pest management tips and best
practices. There is no ML involved here: every output is traceable to
an explicit rule, which keeps the advice auditable and explainable.
"""

from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundException
from app.core.logging import logger
from app.repositories.soil_repository import SoilRepository
from app.repositories.weather_repository import WeatherRepository
from app.services.farm_service import FarmService
from app.services.soil_service import NUTRIENT_REFERENCE_LEVELS, OPTIMAL_PH_RANGE, SoilService

# Rule table: crops suited to a soil pH type x fertility category
# combination. Deliberately small and hand-curated — not derived from
# any model. Sources: general agronomic pH/fertility tolerance ranges.
CROP_REFERENCE_TABLE: Dict[str, Dict[str, List[str]]] = {
    "acidic": {
        "high": ["Tea", "Coffee", "Potato", "Pineapple"],
        "medium": ["Rice", "Sweet Potato", "Rye"],
        "low": ["Blueberry", "Cassava"],
    },
    "neutral": {
        "high": ["Maize", "Wheat", "Soybean", "Sugarcane"],
        "medium": ["Barley", "Sorghum", "Cotton"],
        "low": ["Millet", "Groundnut"],
    },
    "alkaline": {
        "high": ["Barley", "Alfalfa", "Sugar Beet"],
        "medium": ["Cotton", "Date Palm"],
        "low": ["Sorghum", "Safflower"],
    },
}

# A nutrient reading below this fraction of its reference sufficiency
# level (see NUTRIENT_REFERENCE_LEVELS) is treated as deficient; above
# this fraction it is treated as being in excess.
DEFICIENCY_RATIO = 0.6
EXCESS_RATIO = 1.3

FERTILIZER_REMEDIES = {
    "nitrogen": "urea or ammonium sulfate",
    "phosphorus": "single super phosphate (SSP) or DAP",
    "potassium": "muriate of potash (MOP)",
}

# Rainfall bands (mm, from the farm's latest weather record) used to
# derive an irrigation frequency/volume heuristic.
LOW_RAINFALL_MM = 50.0
MODERATE_RAINFALL_MM = 100.0
HIGH_TEMPERATURE_C = 30.0

# Above this relative humidity, fungal disease pressure rises sharply
# and is called out regardless of crop.
HIGH_HUMIDITY_PERCENT = 70.0

# Crop-specific pest scouting tips, keyed by lowercase crop name.
CROP_PEST_TIPS: Dict[str, List[str]] = {
    "rice": [
        "Monitor for stem borer and leaf folder damage on leaf blades.",
        "Keep field water levels shallow and even to discourage pest buildup.",
    ],
    "wheat": [
        "Scout regularly for aphids and armyworm, especially after warm, humid spells.",
        "Use pheromone traps for early detection of pod borer.",
    ],
    "maize": [
        "Inspect leaf whorls for fall armyworm frass and larvae.",
        "Rotate with a non-cereal crop to break the pest cycle.",
    ],
    "cotton": [
        "Use pheromone traps to monitor bollworm populations.",
        "Encourage natural predators such as ladybird beetles over broad-spectrum sprays.",
    ],
    "sugarcane": [
        "Check young cane for early shoot borer damage.",
        "Remove and destroy affected shoots promptly.",
    ],
    "potato": [
        "Watch for late blight symptoms, particularly in cool, humid weather.",
        "Inspect tubers for potato tuber moth damage before storage.",
    ],
    "soybean": [
        "Scout for pod borer and whitefly on the underside of leaves.",
        "Use yellow sticky traps to monitor whitefly pressure.",
    ],
    "coffee": [
        "Inspect berries for coffee berry borer.",
        "Maintain shade cover to regulate pest-favoring microclimates.",
    ],
    "tea": [
        "Monitor young shoots for tea mosquito bug damage.",
        "Prune regularly to improve canopy airflow and reduce pest refuge.",
    ],
}

GENERIC_PEST_TIPS = [
    "Inspect crops weekly for early signs of pest or disease damage.",
    "Remove crop residue and weeds that can harbor pests between seasons.",
]


class RecommendationService:
    """Derives crop, fertilizer, irrigation, pest and best-practice advice for a farm."""

    def __init__(self, db: Session):
        self.db = db
        self.soil_repo = SoilRepository(db)
        self.weather_repo = WeatherRepository(db)
        self.farm_service = FarmService(db)

    @staticmethod
    def _ph_soil_type(ph: float) -> str:
        """Classify a raw pH reading as acidic/neutral/alkaline.

        Reuses SoilService.OPTIMAL_PH_RANGE as the neutral band so this
        stays consistent with the yield-suitability classification.
        """
        if ph < OPTIMAL_PH_RANGE[0]:
            return "acidic"
        if ph > OPTIMAL_PH_RANGE[1]:
            return "alkaline"
        return "neutral"

    @staticmethod
    def _fertilizer_advice(
        nitrogen: Optional[float],
        phosphorus: Optional[float],
        potassium: Optional[float],
    ) -> str:
        """Compare N/P/K readings to NUTRIENT_REFERENCE_LEVELS and advise."""
        readings = {
            "nitrogen": nitrogen,
            "phosphorus": phosphorus,
            "potassium": potassium,
        }
        messages: List[str] = []

        for nutrient, value in readings.items():
            reference = NUTRIENT_REFERENCE_LEVELS[nutrient]
            remedy = FERTILIZER_REMEDIES[nutrient]

            if value is None:
                messages.append(
                    f"{nutrient.capitalize()} reading unavailable — include it in the "
                    "next soil test."
                )
            elif value < reference * DEFICIENCY_RATIO:
                messages.append(
                    f"{nutrient.capitalize()} is deficient ({value} kg/ha vs a "
                    f"{reference} kg/ha reference) — apply {remedy}."
                )
            elif value > reference * EXCESS_RATIO:
                messages.append(
                    f"{nutrient.capitalize()} is in excess ({value} kg/ha) — hold off "
                    f"further {nutrient} fertilizer to avoid nutrient burn/runoff."
                )

        if not messages:
            messages.append(
                "Nitrogen, phosphorus and potassium are all within the adequate "
                "range — maintain the current fertilization schedule."
            )

        return " ".join(messages)

    @staticmethod
    def _irrigation_plan(
        rainfall: Optional[float],
        temperature: Optional[float],
    ) -> str:
        """Derive an irrigation frequency/volume heuristic from recent weather."""
        if rainfall is None:
            return (
                "No recent rainfall data on file — schedule a soil-moisture check "
                "before setting an irrigation frequency."
            )

        if rainfall < LOW_RAINFALL_MM and temperature is not None and temperature >= HIGH_TEMPERATURE_C:
            return (
                f"Low rainfall ({rainfall} mm) combined with high temperature "
                f"({temperature}°C) — irrigate every 2-3 days, ~25-30mm per session."
            )
        if rainfall < LOW_RAINFALL_MM:
            return (
                f"Low rainfall ({rainfall} mm) — irrigate every 4-5 days, "
                "~20mm per session."
            )
        if rainfall < MODERATE_RAINFALL_MM:
            return (
                f"Moderate rainfall ({rainfall} mm) — supplement with irrigation "
                "every 7 days, ~15mm per session."
            )
        return (
            f"Rainfall is adequate ({rainfall} mm) — rely on rainfed conditions and "
            "irrigate only if a dry spell exceeds 10 days."
        )

    @staticmethod
    def _pest_management_tips(
        crop_name: Optional[str],
        humidity: Optional[float],
    ) -> List[str]:
        """Combine crop-specific pest tips with a humidity-driven disease warning."""
        if crop_name and crop_name.lower() in CROP_PEST_TIPS:
            tips = list(CROP_PEST_TIPS[crop_name.lower()])
        else:
            tips = list(GENERIC_PEST_TIPS)

        if humidity is not None and humidity >= HIGH_HUMIDITY_PERCENT:
            tips.append(
                f"Humidity is currently high ({humidity}%) — fungal disease pressure "
                "(blight, rust, mildew) rises sharply above 70% humidity; improve "
                "field drainage/airflow and consider a preventive fungicide."
            )

        return tips

    @staticmethod
    def _best_practices(
        ph_assessment: Dict[str, Any],
        fertility_category: str,
        rainfall: Optional[float],
    ) -> List[str]:
        """General agronomic tips, phrased against this farm's actual readings."""
        practices = [
            f"Current soil pH is {ph_assessment['ph']} "
            f"({ph_assessment['ph_category']} for general crop suitability) — "
            "retest soil every 6-12 months to track changes.",
            f"Soil fertility is classified as {fertility_category} based on N/P/K "
            "levels — incorporate organic compost or manure to build long-term "
            "soil health.",
            "Practice crop rotation to prevent nutrient depletion and reduce "
            "pest/disease carryover season to season.",
        ]

        if rainfall is not None:
            practices.append(
                f"Latest recorded rainfall is {rainfall} mm — use mulching to "
                "conserve soil moisture between irrigation cycles."
            )

        return practices

    def generate(self, farm_id: int, token) -> Dict[str, Any]:
        """Build the full recommendation set for a farm.

        Raises:
            ResourceNotFoundException: If the farm doesn't exist/isn't
                owned by the caller, or has no soil report on file.
        """
        farm = self.farm_service.get_farm(farm_id, token)

        report = self.soil_repo.latest_for_farm(farm_id)
        if report is None:
            raise ResourceNotFoundException("Soil report")

        ph_assessment = SoilService.evaluate_ph(report.ph)
        nutrient_score = SoilService.nutrient_score(
            report.nitrogen, report.phosphorus, report.potassium
        )
        fertility_category = SoilService.fertility_category(nutrient_score)
        soil_type = self._ph_soil_type(report.ph)

        weather = self.weather_repo.latest(farm_id)
        rainfall = weather.rainfall if weather else None
        temperature = weather.temperature if weather else None
        humidity = weather.humidity if weather else None

        crop_name = (
            max(farm.crops, key=lambda crop: crop.id).crop_name
            if farm.crops
            else None
        )

        crop_suggestions = CROP_REFERENCE_TABLE.get(soil_type, {}).get(
            fertility_category, []
        )

        logger.info(
            f"Recommendations for farm {farm_id}: soil_type={soil_type}, "
            f"fertility_category={fertility_category}, crop={crop_name}"
        )

        return {
            "farm_id": farm_id,
            "crop_suggestions": crop_suggestions,
            "fertilizer_advice": self._fertilizer_advice(
                report.nitrogen, report.phosphorus, report.potassium
            ),
            "irrigation_plan": self._irrigation_plan(rainfall, temperature),
            "pest_management_tips": self._pest_management_tips(crop_name, humidity),
            "best_practices": self._best_practices(
                ph_assessment, fertility_category, rainfall
            ),
        }
