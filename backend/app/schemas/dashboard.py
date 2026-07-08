from pydantic import BaseModel


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