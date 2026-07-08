from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.farms import router as farm_router
from app.api.health import router as health_router
from app.api.weather import router as weather_router
from app.api.dashboard import router as dashboard_router


api_router = APIRouter(prefix="/api/v1")
api_router.include_router(
    dashboard_router
)

api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(farm_router)
api_router.include_router(weather_router)