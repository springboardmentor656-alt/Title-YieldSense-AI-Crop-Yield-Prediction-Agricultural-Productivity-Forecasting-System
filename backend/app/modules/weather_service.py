import httpx
from datetime import date

class WeatherService:
    """Wraps an external weather API and normalizes output to our
    internal feature shape (rainfall_mm, avg_temp_c, humidity_pct)."""

    def __init__(self, base_url: str, api_key: str):
        self.base_url = base_url
        self.api_key = api_key

    async def get_seasonal_averages(self, lat: float, lon: float, start: date, end: date) -> dict:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(
                f"{self.base_url}/historical",
                params={
                    "lat": lat, "lon": lon,
                    "start": start.isoformat(), "end": end.isoformat(),
                    "key": self.api_key,
                },
            )
            resp.raise_for_status()
            payload = resp.json()

        return {
            "rainfall_mm": payload.get("total_precip_mm", 0),
            "avg_temp_c": payload.get("mean_temp_c", 0),
            "humidity_pct": payload.get("mean_humidity_pct", 0),
        }