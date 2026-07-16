from pydantic import BaseModel, Field
from datetime import datetime

class PredictionRequest(BaseModel):
    crop_type: str
    region: str
    rainfall_mm: float = Field(..., ge=0)
    avg_temp_c: float
    humidity_pct: float = Field(..., ge=0, le=100)
    soil_ph: float = Field(..., ge=0, le=14)
    nitrogen_kg_ha: float = Field(..., ge=0)
    phosphorus_kg_ha: float = Field(..., ge=0)
    potassium_kg_ha: float = Field(..., ge=0)

class PredictionResponse(BaseModel):
    id: int
    predicted_yield_kg_ha: float
    soil_suitability_score: float
    model_version: str
    created_at: datetime

    class Config:
        from_attributes = True