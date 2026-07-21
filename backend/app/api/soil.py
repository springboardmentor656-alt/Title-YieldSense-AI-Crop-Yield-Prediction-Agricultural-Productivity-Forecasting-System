from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.oauth2 import verify_token
from app.database.session import get_db
from app.schemas.soil import SoilSuitabilityResponse
from app.services.farm_service import FarmService
from app.services.soil_service import SoilService

router = APIRouter(
    prefix="/soil",
    tags=["Soil"]
)


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
