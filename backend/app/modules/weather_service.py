import httpx

class WeatherService:
    """Wraps OpenWeatherMap and normalizes output to our internal
    feature shape (rainfall_mm, avg_temp_c, humidity_pct)."""

    BASE_URL = "https://api.openweathermap.org/data/2.5"

    def __init__(self, api_key: str):
        self.api_key = api_key

    async def get_current_conditions(self, lat: float, lon: float) -> dict:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{self.BASE_URL}/weather",
                params={"lat": lat, "lon": lon, "appid": self.api_key, "units": "metric"},
            )
            resp.raise_for_status()
            data = resp.json()

        return {
            "avg_temp_c": data["main"]["temp"],
            "humidity_pct": data["main"]["humidity"],
            # OpenWeatherMap's free tier gives current/forecast rain, not
            # historical seasonal totals — see note below.
            "rainfall_mm": data.get("rain", {}).get("1h", 0.0),
        }