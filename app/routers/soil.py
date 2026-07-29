from fastapi import APIRouter
from app.services.soil import get_soil_data

router = APIRouter()

@router.get("/soil")
def soil():
    return get_soil_data()