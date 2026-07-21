import requests

from app.config.settings import settings
from app.core.exceptions import IntegrationRequestException


class SatelliteProvider:
    """
    Client for NASA POWER (Prediction Of Worldwide Energy Resources) API.

    NASA POWER's daily point API is a real, public NASA data product that
    provides satellite/model-derived climate data (temperature, precipitation,
    solar radiation, etc.) for a given latitude/longitude and date range:

        https://power.larc.nasa.gov/api/temporal/daily/point

    NOTE on NASA_API_KEY: the NASA POWER API does NOT require an API key -
    it is a public, keyless endpoint. The `NASA_API_KEY` setting already
    present in this codebase was provisioned for a different NASA product
    (e.g. https://api.nasa.gov / Earthdata, which DO require a key) and is
    unused by POWER. Defensively, if NASA_API_KEY has been configured, it is
    passed through as an `api_key` query parameter - POWER simply ignores
    unrecognized query params, so this is a safe no-op unless NASA changes
    that behavior in the future.
    """

    BASE_URL = "https://power.larc.nasa.gov/api/temporal/daily/point"

    # Parameters requested from POWER:
    #   T2M       - Temperature at 2 Meters (deg C)
    #   PRECTOTCORR - Precipitation Corrected (mm/day)
    PARAMETERS = "T2M,PRECTOTCORR"

    @classmethod
    def get_climate_data(
        cls,
        latitude: float,
        longitude: float,
        start_date: str,
        end_date: str
    ) -> dict:
        """
        Fetch daily temperature/precipitation time series for a point.

        start_date / end_date must be in YYYYMMDD format (per NASA POWER's API).
        """

        params = {
            "parameters": cls.PARAMETERS,
            "community": "AG",
            "latitude": latitude,
            "longitude": longitude,
            "start": start_date,
            "end": end_date,
            "format": "JSON",
        }

        if settings.NASA_API_KEY and settings.NASA_API_KEY != "your_nasa_api_key":
            params["api_key"] = settings.NASA_API_KEY

        try:
            response = requests.get(
                cls.BASE_URL,
                params=params,
                timeout=15
            )

            response.raise_for_status()

        except requests.RequestException as exc:
            raise IntegrationRequestException("NASA POWER Satellite", str(exc))

        return response.json()
