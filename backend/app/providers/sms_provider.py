import requests

from app.config.settings import settings
from app.core.exceptions import (
    IntegrationNotConfiguredException,
    IntegrationRequestException,
)


class SMSProvider:
    """
    SMS delivery client for Twilio's REST API, called directly via `requests`
    (no `twilio` SDK dependency) using Twilio's documented Messages resource:

        POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json

    authenticated with HTTP Basic auth (AccountSid / AuthToken), matching
    Twilio's real, documented REST API contract.
    """

    BASE_URL = "https://api.twilio.com/2010-04-01"

    @classmethod
    def send_sms(cls, to: str, message: str) -> dict:

        if not settings.TWILIO_ACCOUNT_SID or not settings.TWILIO_AUTH_TOKEN or not settings.TWILIO_FROM_NUMBER:
            raise IntegrationNotConfiguredException("SMS (Twilio)")

        url = f"{cls.BASE_URL}/Accounts/{settings.TWILIO_ACCOUNT_SID}/Messages.json"

        data = {
            "To": to,
            "From": settings.TWILIO_FROM_NUMBER,
            "Body": message,
        }

        try:
            response = requests.post(
                url,
                data=data,
                auth=(settings.TWILIO_ACCOUNT_SID, settings.TWILIO_AUTH_TOKEN),
                timeout=15
            )

            response.raise_for_status()

        except requests.RequestException as exc:
            raise IntegrationRequestException("SMS (Twilio)", str(exc))

        return response.json()
