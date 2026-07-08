from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.auth.oauth2 import verify_token

from app.services.weather_service import WeatherService

router = APIRouter(

    prefix="/weather",

    tags=["Weather"]

)


@router.get("/{farm_id}")

def latest_weather(

    farm_id: int,

    token=Depends(verify_token),

    db: Session = Depends(get_db)

):

    service = WeatherService(db)

    return service.latest_weather(farm_id)


@router.post("/refresh/{farm_id}")

async def refresh(

    farm_id: int,

    token=Depends(verify_token),

    db: Session = Depends(get_db)

):

    service = WeatherService(db)

    return await service.refresh_weather(farm_id)