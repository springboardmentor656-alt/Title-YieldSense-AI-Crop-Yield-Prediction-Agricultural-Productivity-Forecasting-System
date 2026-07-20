from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    crop_type: str
    region: str
    soil_ph: float = Field(..., ge=0, le=14)
    nitrogen_kg_ha: float = Field(..., ge=0)
    phosphorus_kg_ha: float = Field(..., ge=0)
    potassium_kg_ha: float = Field(..., ge=0)


class PredictionResponse(BaseModel):
    model_config = {"protected_namespaces": ()}

    predicted_yield_kg_ha: float
    soil_suitability_score: float
    model_version: str