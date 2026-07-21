from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.oauth2 import verify_token
from app.database.session import get_db
from app.schemas.recommendation import RecommendationResponse
from app.services.farm_service import FarmService
from app.services.recommendation_service import RecommendationService

router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)


@router.get(
    "/{farm_id}",
    response_model=RecommendationResponse
)
def get_recommendations(
    farm_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    farm_service = FarmService(db)
    farm_service.get_farm(farm_id, token)

    recommendation_service = RecommendationService(db)
    return recommendation_service.generate(farm_id, token)
