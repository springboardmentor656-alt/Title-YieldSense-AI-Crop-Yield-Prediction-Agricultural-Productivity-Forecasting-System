from enum import Enum


class UserRole(str, Enum):
    ADMIN = "Admin"
    FARMER = "Farmer"
    RESEARCHER = "Researcher"


class API:
    PREFIX = "/api/v1"
    TITLE = "YieldSense AI"
    VERSION = "1.0.0"


class WeatherProvider:
    OPENWEATHER = "OpenWeather"
    NASA = "NASA POWER"