from pydantic import BaseModel
from datetime import datetime


class PredictionRequest(BaseModel):
    farm_id: int


class PredictionResponse(BaseModel):

    id: int

    farm_id: int

    predicted_yield: float

    confidence: float

    recommendation: str

    model_name: str

    created_at: datetime

    class Config:
        from_attributes = True