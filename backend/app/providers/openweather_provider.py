import httpx

from app.config.settings import settings
from app.providers.weather_provider import WeatherProvider


class OpenWeatherProvider(WeatherProvider):

    BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

    async def get_current_weather(
        self,
        latitude,
        longitude
    ):

        params = {

            "lat": latitude,

            "lon": longitude,

            "appid": settings.WEATHER_API_KEY,

            "units": "metric"

        }

        async with httpx.AsyncClient() as client:

            response = await client.get(
                self.BASE_URL,
                params=params
            )

            response.raise_for_status()

            return response.json()