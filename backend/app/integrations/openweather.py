import requests

from app.config.settings import settings


class OpenWeatherClient:

    BASE_URL = "https://api.openweathermap.org/data/2.5/weather"

    @classmethod
    def get_weather(
        cls,
        latitude: float,
        longitude: float
    ):

        params = {
            "lat": latitude,
            "lon": longitude,
            "appid": settings.OPENWEATHER_API_KEY,
            "units": "metric"
        }

        response = requests.get(
            cls.BASE_URL,
            params=params,
            timeout=15
        )

        response.raise_for_status()

        return response.json()