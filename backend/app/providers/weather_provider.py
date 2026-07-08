from abc import ABC, abstractmethod


class WeatherProvider(ABC):

    @abstractmethod
    async def get_current_weather(
        self,
        latitude: float,
        longitude: float
    ):
        pass