from typing import Optional

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.oauth2 import verify_token
from app.auth.permissions import farmer_required
from app.database.session import get_db
from app.schemas.soil import (
    SoilDashboardStats,
    SoilReportCreate,
    SoilReportListResponse,
    SoilReportResponse,
    SoilReportUpdate,
    SoilSuitabilityResponse,
)
from app.services.farm_service import FarmService
from app.services.soil_service import SoilService

router = APIRouter(
    prefix="/soil",
    tags=["Soil"]
)

# NOTE: routes with a literal first path segment ("/reports", ...) are
# declared before the trailing "/{farm_id}" catch-all route below, so
# they're matched first — otherwise "/soil/reports" would be captured
# as farm_id="reports".


@router.get(
    "/reports",
    response_model=SoilReportListResponse
)
def list_soil_reports(
    search: Optional[str] = None,
    fertility: Optional[str] = None,
    health: Optional[str] = None,
    page: int = 1,
    page_size: int = 10,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = SoilService(db)
    return service.list_reports(
        int(token["sub"]), search, fertility, health, page, page_size
    )


@router.get(
    "/reports/dashboard-stats",
    response_model=SoilDashboardStats
)
def get_soil_dashboard_stats(
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = SoilService(db)
    return service.dashboard_stats(int(token["sub"]))


@router.post(
    "/reports",
    response_model=SoilReportResponse
)
def create_soil_report(
    request: SoilReportCreate,
    token=Depends(farmer_required),
    db: Session = Depends(get_db)
):

    service = SoilService(db)
    return service.create_report(token, request)


@router.get(
    "/reports/{report_id}",
    response_model=SoilReportResponse
)
def get_soil_report(
    report_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = SoilService(db)
    return service.get_report(report_id, token)


@router.put(
    "/reports/{report_id}",
    response_model=SoilReportResponse
)
def update_soil_report(
    report_id: int,
    request: SoilReportUpdate,
    token=Depends(farmer_required),
    db: Session = Depends(get_db)
):

    service = SoilService(db)
    return service.update_report(report_id, token, request)


@router.delete("/reports/{report_id}")
def delete_soil_report(
    report_id: int,
    token=Depends(farmer_required),
    db: Session = Depends(get_db)
):

    service = SoilService(db)
    service.delete_report(report_id, token)

    return {"success": True}


@router.get(
    "/{farm_id}",
    response_model=SoilSuitabilityResponse
)
def get_soil_suitability(
    farm_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    farm_service = FarmService(db)
    farm_service.get_farm(farm_id, token)

    soil_service = SoilService(db)
    return soil_service.assess_farm_soil(farm_id)
