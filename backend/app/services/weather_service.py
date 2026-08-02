from sqlalchemy.orm import Session

from app.providers.openweather_provider import OpenWeatherProvider
from app.repositories.weather_repository import WeatherRepository
from app.repositories.farm_repository import FarmRepository
from app.models.weather import WeatherRecord
from app.services.notification_service import NotificationService
from app.services.recommendation_service import HEAT_STRESS_TEMP_C

# Heavy rain in a single hour (WMO "violent rain" band), distinct from
# the seasonal-total thresholds recommendation_service uses for drought
# / flood risk since this reading is an hourly OpenWeather sample.
HEAVY_RAINFALL_1H_MM = 50.0


class WeatherService:

    def __init__(self, db: Session):

        self.db = db

        self.provider = OpenWeatherProvider()

        self.weather_repo = WeatherRepository(db)

        self.farm_repo = FarmRepository(db)

        self.notification_service = NotificationService(db)

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

        record = self.weather_repo.create(record)

        self._raise_weather_alerts(farm, record)

        return record

    def _raise_weather_alerts(self, farm, record: WeatherRecord) -> None:

        if record.temperature is not None and record.temperature > HEAT_STRESS_TEMP_C:
            self.notification_service.create_for_user(
                farm.user_id,
                "Weather Alert",
                f"Heat stress risk on '{farm.farm_name}': temperature is "
                f"{record.temperature}°C.",
                category="weather",
            )

        if record.rainfall is not None and record.rainfall > HEAVY_RAINFALL_1H_MM:
            self.notification_service.create_for_user(
                farm.user_id,
                "Weather Alert",
                f"Heavy rainfall on '{farm.farm_name}': {record.rainfall} mm "
                "in the last hour — check field drainage.",
                category="weather",
            )

    def latest_weather(self, farm_id):

        return self.weather_repo.latest(farm_id)