from datetime import datetime
from typing import Any, Dict, Optional

from pydantic import BaseModel, Field


class PredictionRequest(BaseModel):
    """Input payload for POST /api/v1/predictions/predict.

    temperature, rainfall and soil_ph are optional overrides. When
    omitted, prediction_service falls back to the farm's latest stored
    weather reading (app.services.weather_service) and soil report
    (app.services.soil_service) respectively.
    """

    farm_id: int
    temperature: Optional[float] = None
    rainfall: Optional[float] = Field(default=None, ge=0)
    soil_ph: Optional[float] = Field(default=None, ge=0, le=14)


class PredictionResponse(BaseModel):

    predicted_yield: float

    confidence: float

    model_used: str

    timestamp: datetime

    risk_level: str

    season_comparison: Optional[Dict[str, Any]] = None

    trend_forecast: Optional[str] = None


class PredictionHistoryResponse(BaseModel):

    id: int

    farm_id: int

    prediction: float

    model_version: str

    features: Dict[str, Any]

    created_at: datetime

    class Config:
        from_attributes = True
