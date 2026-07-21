from typing import Optional

import requests

from app.config.settings import settings
from app.core.exceptions import (
    IntegrationNotConfiguredException,
    IntegrationRequestException,
)


class GovDataProvider:
    """
    Client for India's Open Government Data (OGD) platform - data.gov.in.

    data.gov.in exposes datasets through a uniform resource API:

        https://api.data.gov.in/resource/{resource_id}?api-key=...&format=json

    Both the API key (free, per-user) and the resource_id (per-dataset) are
    required and are dataset/account specific, so they are read from settings
    rather than hardcoded:
      - DATA_GOV_IN_API_KEY: obtained from https://www.data.gov.in (My Account -> API Keys)
      - DATA_GOV_IN_RESOURCE_ID: the resource id of the specific agriculture
        dataset to query (e.g. a "Variety-wise Daily Market Prices of
        Commodities" dataset) - copy it from that dataset's API page on
        data.gov.in. A placeholder default is set in settings.py and MUST be
        replaced before this provider will work.
    """

    BASE_URL = "https://api.data.gov.in/resource"

    @classmethod
    def get_crop_price_data(
        cls,
        state: Optional[str] = None,
        commodity: Optional[str] = None,
        limit: int = 10
    ) -> dict:

        if not settings.DATA_GOV_IN_API_KEY:
            raise IntegrationNotConfiguredException("data.gov.in Government Open Data")

        if not settings.DATA_GOV_IN_RESOURCE_ID or settings.DATA_GOV_IN_RESOURCE_ID.startswith("REPLACE_WITH"):
            raise IntegrationNotConfiguredException(
                "data.gov.in Government Open Data (DATA_GOV_IN_RESOURCE_ID not set)"
            )

        params = {
            "api-key": settings.DATA_GOV_IN_API_KEY,
            "format": "json",
            "limit": limit,
        }

        # data.gov.in filters fields via filters[<field_name>]=<value>. Exact
        # field names vary per dataset - "state" and "commodity" are the
        # common field names used by the mandi/market-price family of
        # datasets on the portal.
        if state:
            params["filters[state]"] = state

        if commodity:
            params["filters[commodity]"] = commodity

        url = f"{cls.BASE_URL}/{settings.DATA_GOV_IN_RESOURCE_ID}"

        try:
            response = requests.get(
                url,
                params=params,
                timeout=15
            )

            response.raise_for_status()

        except requests.RequestException as exc:
            raise IntegrationRequestException("data.gov.in Government Open Data", str(exc))

        return response.json()
