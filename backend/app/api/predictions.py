from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.oauth2 import verify_token
from app.database.session import get_db
from app.repositories.prediction_history_repository import (
    PredictionHistoryRepository,
)
from app.schemas.prediction import (
    PredictionHistoryResponse,
    PredictionRequest,
    PredictionResponse,
)
from app.services.farm_service import FarmService
from app.services.prediction_service import PredictionService

router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"]
)


@router.post(
    "/predict",
    response_model=PredictionResponse
)
def predict_yield(
    request: PredictionRequest,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = PredictionService(db)

    return service.predict(
        int(token["sub"]),
        token["role"],
        request
    )


@router.get(
    "/history/{farm_id}",
    response_model=list[PredictionHistoryResponse]
)
def get_prediction_history(
    farm_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    farm_service = FarmService(db)
    farm_service.get_farm(farm_id, token)

    repo = PredictionHistoryRepository(db)

    return repo.get_by_farm(farm_id)
