from pydantic import BaseModel
from datetime import datetime


class WeatherResponse(BaseModel):

    farm_id: int

    temperature: float

    humidity: float

    rainfall: float

    pressure: float

    wind_speed: float

    weather_condition: str

    weather_icon: str

    recorded_at: datetime

    class Config:
        from_attributes = True