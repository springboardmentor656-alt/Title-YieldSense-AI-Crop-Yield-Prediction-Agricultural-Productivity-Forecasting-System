from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app.auth.oauth2 import verify_token
from app.database.session import get_db
from app.schemas.analytics import (
    AccuracyTrackingResponse,
    ActualYieldResponse,
    ActualYieldUpdate,
    AnomalyEntry,
    FarmComparisonEntry,
    WeatherImpactResponse,
    YieldTrendResponse,
)
from app.services.analytics_service import AnalyticsService

router = APIRouter(
    prefix="/analytics",
    tags=["Analytics"]
)


@router.get(
    "/trend/{farm_id}",
    response_model=YieldTrendResponse
)
def get_yield_trend(
    farm_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = AnalyticsService(db)
    return service.yield_trend(farm_id, token)


@router.get(
    "/farm-comparison",
    response_model=list[FarmComparisonEntry]
)
def get_farm_comparison(
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = AnalyticsService(db)
    return service.farm_comparison(int(token["sub"]))


@router.get(
    "/weather-impact/{farm_id}",
    response_model=WeatherImpactResponse
)
def get_weather_impact(
    farm_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = AnalyticsService(db)
    return service.weather_impact(farm_id, token)


@router.get(
    "/risk-anomaly/{farm_id}",
    response_model=list[AnomalyEntry]
)
def get_risk_anomaly(
    farm_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = AnalyticsService(db)
    return service.risk_anomaly(farm_id, token)


@router.get(
    "/accuracy/{farm_id}",
    response_model=AccuracyTrackingResponse
)
def get_accuracy_tracking(
    farm_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = AnalyticsService(db)
    return service.accuracy_tracking(farm_id, token)


@router.get("/predictions/{farm_id}/export")
def export_predictions_csv(
    farm_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = AnalyticsService(db)
    csv_content = service.export_csv(farm_id, token)

    return Response(content=csv_content, media_type="text/csv")


@router.patch(
    "/predictions/{entry_id}/actual-yield",
    response_model=ActualYieldResponse
)
def update_actual_yield(
    entry_id: int,
    request: ActualYieldUpdate,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = AnalyticsService(db)
    return service.set_actual_yield(entry_id, request.actual_yield, token)
