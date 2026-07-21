from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from app.auth.oauth2 import verify_token
from app.database.session import get_db
from app.schemas.dashboard import DashboardSummary, PredictionAnalyticsResponse
from app.services.dashboard_service import (DashboardService)

router = APIRouter(

    prefix="/dashboard",

    tags=["Dashboard"]

)


@router.get(

    "/summary",

    response_model=DashboardSummary

)

def dashboard_summary(

    token=Depends(verify_token),

    db: Session = Depends(get_db)

):

    service = DashboardService(db)

    return service.summary(

        int(token["sub"])

    )


@router.get(

    "/predictions",

    response_model=PredictionAnalyticsResponse

)

def dashboard_predictions(

    token=Depends(verify_token),

    db: Session = Depends(get_db)

):

    service = DashboardService(db)

    return service.prediction_analytics(
        int(token["sub"])
    )