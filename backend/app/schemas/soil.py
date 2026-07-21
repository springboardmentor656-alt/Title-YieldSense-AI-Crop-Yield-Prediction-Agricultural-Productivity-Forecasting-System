from typing import Optional

from pydantic import BaseModel


class PhAssessment(BaseModel):
    ph: float
    ph_category: str
    is_valid: bool
    yield_multiplier: float


class SoilSuitabilityResponse(BaseModel):
    farm_id: int
    ph: PhAssessment
    nutrient_score: float
    fertility_category: str
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    moisture: Optional[float] = None
