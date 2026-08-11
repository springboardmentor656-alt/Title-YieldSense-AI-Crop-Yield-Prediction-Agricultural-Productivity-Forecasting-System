from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class ActualYieldUpdate(BaseModel):
    actual_yield: float


class ActualYieldResponse(BaseModel):
    id: int
    farm_id: int
    prediction: float
    actual_yield: Optional[float] = None

    class Config:
        from_attributes = True


class YieldTrendPoint(BaseModel):
    date: datetime
    predicted_yield: float
    crop: Optional[str] = None


class YieldTrendResponse(BaseModel):
    farm_id: int
    points: List[YieldTrendPoint]


class FarmComparisonEntry(BaseModel):
    farm_id: int
    farm_name: str
    crop_name: Optional[str] = None
    latest_yield: Optional[float] = None
    average_yield: Optional[float] = None
    prediction_count: int


class WeatherImpactBucket(BaseModel):
    bucket: str
    average_yield: Optional[float] = None
    count: int


class WeatherImpactResponse(BaseModel):
    farm_id: int
    sample_size: int
    weather_records_on_file: int
    rainfall_buckets: List[WeatherImpactBucket]
    temperature_buckets: List[WeatherImpactBucket]


class AnomalyEntry(BaseModel):
    id: int
    created_at: datetime
    crop: Optional[str] = None
    prediction: float
    z_score: float
    farm_mean: float


class AccuracyEntry(BaseModel):
    id: int
    created_at: datetime
    prediction: float
    actual_yield: float
    absolute_percentage_error: float


class AccuracyTrackingResponse(BaseModel):
    farm_id: int
    sample_size: int
    mape: Optional[float] = None
    entries: List[AccuracyEntry]


class ProductivityScoreResponse(BaseModel):
    productivity_score: Optional[float] = None
    latest_yield: Optional[float] = None
    average_yield: Optional[float] = None
    sample_size: int
    interpretation: Optional[str] = None


class SeasonalComparisonPoint(BaseModel):
    season: str
    yield_amount: float = Field(alias="yield")
    count: int

    class Config:
        populate_by_name = True


class DashboardYieldTrendPoint(BaseModel):
    date: datetime
    yield_amount: float = Field(alias="yield")
    farm_id: int
    crop: Optional[str] = None

    class Config:
        populate_by_name = True
