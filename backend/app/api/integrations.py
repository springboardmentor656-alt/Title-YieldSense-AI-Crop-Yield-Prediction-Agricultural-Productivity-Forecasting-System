from typing import Optional

from fastapi import APIRouter, Depends, Query

from app.auth.oauth2 import verify_token
from app.providers.satellite_provider import SatelliteProvider
from app.providers.gov_data_provider import GovDataProvider
from app.providers.gis_provider import GISProvider
from app.providers.email_provider import EmailProvider
from app.providers.sms_provider import SMSProvider

router = APIRouter(
    prefix="/integrations",
    tags=["Integrations"]
)


@router.get("/satellite")
def demo_satellite(
    latitude: float = Query(...),
    longitude: float = Query(...),
    start_date: str = Query(..., description="YYYYMMDD"),
    end_date: str = Query(..., description="YYYYMMDD"),
    token=Depends(verify_token)
):
    """Demo call to NASA POWER for daily climate (temperature/precipitation) data."""

    return SatelliteProvider.get_climate_data(
        latitude=latitude,
        longitude=longitude,
        start_date=start_date,
        end_date=end_date
    )


@router.get("/gov-data")
def demo_gov_data(
    state: Optional[str] = Query(None),
    commodity: Optional[str] = Query(None),
    token=Depends(verify_token)
):
    """Demo call to data.gov.in for crop/commodity price data."""

    return GovDataProvider.get_crop_price_data(
        state=state,
        commodity=commodity
    )


@router.get("/gis/geocode")
def demo_geocode(
    address: str = Query(...),
    token=Depends(verify_token)
):
    """Demo call to OpenStreetMap Nominatim to geocode an address."""

    return GISProvider.geocode(address)


@router.get("/gis/reverse-geocode")
def demo_reverse_geocode(
    latitude: float = Query(...),
    longitude: float = Query(...),
    token=Depends(verify_token)
):
    """Demo call to OpenStreetMap Nominatim to reverse-geocode coordinates."""

    return GISProvider.reverse_geocode(latitude, longitude)


@router.get("/email")
def demo_email(
    to: str = Query(...),
    subject: str = Query("YieldSense AI Test Notification"),
    body: str = Query("This is a test email from the YieldSense AI integrations demo endpoint."),
    token=Depends(verify_token)
):
    """Demo call that sends a real test email via SMTP."""

    EmailProvider.send_email(to=to, subject=subject, body=body)

    return {"status": "sent", "to": to}


@router.get("/sms")
def demo_sms(
    to: str = Query(...),
    message: str = Query("This is a test SMS from the YieldSense AI integrations demo endpoint."),
    token=Depends(verify_token)
):
    """Demo call that sends a real test SMS via Twilio."""

    return SMSProvider.send_sms(to=to, message=message)
