from fastapi import APIRouter

from app.api.auth import router as auth_router
from app.api.farms import router as farm_router
from app.api.health import router as health_router
from app.api.weather import router as weather_router
from app.api.dashboard import router as dashboard_router
from app.api.users import router as users_router   # <-- add this
from app.api.soil import router as soil_router
from app.api.predictions import router as predictions_router
from app.api.recommendations import router as recommendations_router
from app.api.analytics import router as analytics_router
from app.api.notifications import router as notifications_router
from app.api.integrations import router as integrations_router
from app.api.crops import router as crops_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(dashboard_router)
api_router.include_router(health_router)
api_router.include_router(auth_router)
api_router.include_router(farm_router)
api_router.include_router(weather_router)
api_router.include_router(users_router)            # <-- add this
api_router.include_router(soil_router)
api_router.include_router(predictions_router)
api_router.include_router(recommendations_router)
api_router.include_router(analytics_router)
api_router.include_router(notifications_router)
api_router.include_router(integrations_router)
api_router.include_router(crops_router)