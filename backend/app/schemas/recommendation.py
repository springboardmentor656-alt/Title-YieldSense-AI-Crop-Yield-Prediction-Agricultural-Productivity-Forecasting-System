from typing import List

from pydantic import BaseModel


class RecommendationResponse(BaseModel):
    """Rule-based farm recommendations derived from stored soil/weather data.

    Every field is produced by deterministic business logic in
    RecommendationService (reference tables + threshold rules) applied to
    the farm's latest soil report and weather record — this is not a
    model prediction.
    """

    farm_id: int
    crop_suggestions: List[str]
    fertilizer_advice: str
    irrigation_plan: str
    pest_management_tips: List[str]
    best_practices: List[str]
