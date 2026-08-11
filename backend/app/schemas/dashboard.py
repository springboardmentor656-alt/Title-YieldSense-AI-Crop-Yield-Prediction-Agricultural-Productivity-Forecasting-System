from pydantic import BaseModel

from app.schemas.analytics import (
    DashboardYieldTrendPoint,
    FarmComparisonEntry,
    ProductivityScoreResponse,
    SeasonalComparisonPoint,
)


class WeatherSummary(BaseModel):

    temperature: float

    humidity: float

    rainfall: float


class DashboardSummary(BaseModel):

    total_farms: int

    total_crops: int

    prediction_accuracy: float

    weather_alerts: int

    weather: WeatherSummary | None = None

    productivity_score: ProductivityScoreResponse

    yield_trend: list[DashboardYieldTrendPoint]

    seasonal_comparison: list[SeasonalComparisonPoint]

    farm_comparison: list[FarmComparisonEntry]


class MonthlyTrendPoint(BaseModel):

    month: str

    average_yield: float

    count: int


class PredictionAnalyticsResponse(BaseModel):

    average_predicted_yield: float

    highest_prediction: float

    lowest_prediction: float

    prediction_count: int

    monthly_trend: list[MonthlyTrendPoint]