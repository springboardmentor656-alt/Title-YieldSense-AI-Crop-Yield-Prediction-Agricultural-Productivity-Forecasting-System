from sqlalchemy.orm import Session

from app.providers.openweather_provider import OpenWeatherProvider
from app.repositories.weather_repository import WeatherRepository
from app.repositories.farm_repository import FarmRepository
from app.models.weather import WeatherRecord


class WeatherService:

    def __init__(self, db: Session):

        self.db = db

        self.provider = OpenWeatherProvider()

        self.weather_repo = WeatherRepository(db)

        self.farm_repo = FarmRepository(db)

    async def refresh_weather(self, farm_id: int):

        farm = self.farm_repo.get_by_id(farm_id)

        if farm is None:
            raise Exception("Farm not found")

        weather = await self.provider.get_current_weather(
            farm.latitude,
            farm.longitude
        )

        record = WeatherRecord(

            farm_id=farm.id,

            temperature=weather["main"]["temp"],

            humidity=weather["main"]["humidity"],

            pressure=weather["main"]["pressure"],

            rainfall=weather.get("rain", {}).get("1h", 0),

            wind_speed=weather["wind"]["speed"],

            weather_condition=weather["weather"][0]["main"],

            weather_icon=weather["weather"][0]["icon"]

        )

        return self.weather_repo.create(record)

    def latest_weather(self, farm_id):

        return self.weather_repo.latest(farm_id)