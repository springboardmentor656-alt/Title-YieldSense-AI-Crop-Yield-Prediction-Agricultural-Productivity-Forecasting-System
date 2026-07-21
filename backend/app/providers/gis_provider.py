import requests

from app.core.exceptions import IntegrationRequestException


class GISProvider:
    """
    Client for OpenStreetMap's Nominatim geocoding service.

    Nominatim (https://nominatim.org) is free and requires no API key, but
    its usage policy (https://operations.osmfoundation.org/policies/nominatim/)
    requires a descriptive User-Agent (and/or Referer) identifying the
    application making requests, so one is set on every request below.
    """

    BASE_URL = "https://nominatim.openstreetmap.org"

    HEADERS = {
        "User-Agent": "YieldSense-AI/1.0 (crop yield prediction platform; GIS integration)"
    }

    @classmethod
    def geocode(cls, address: str) -> dict:
        """Look up latitude/longitude for a free-text address."""

        params = {
            "q": address,
            "format": "jsonv2",
            "limit": 1,
        }

        try:
            response = requests.get(
                f"{cls.BASE_URL}/search",
                params=params,
                headers=cls.HEADERS,
                timeout=15
            )

            response.raise_for_status()

        except requests.RequestException as exc:
            raise IntegrationRequestException("OpenStreetMap Nominatim (geocode)", str(exc))

        return response.json()

    @classmethod
    def reverse_geocode(cls, latitude: float, longitude: float) -> dict:
        """Look up the address for a given latitude/longitude."""

        params = {
            "lat": latitude,
            "lon": longitude,
            "format": "jsonv2",
        }

        try:
            response = requests.get(
                f"{cls.BASE_URL}/reverse",
                params=params,
                headers=cls.HEADERS,
                timeout=15
            )

            response.raise_for_status()

        except requests.RequestException as exc:
            raise IntegrationRequestException("OpenStreetMap Nominatim (reverse geocode)", str(exc))

        return response.json()
