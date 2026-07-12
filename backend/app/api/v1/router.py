"""
YieldSense AI — API v1 Router

Aggregates all v1 API routers into a single router.
"""

from fastapi import APIRouter

from app.api.v1.auth import router as auth_router
from app.api.v1.users import router as users_router
from app.api.v1.farms import router as farms_router
from app.api.v1.notifications import router as notifications_router
from app.api.v1.health import router as health_router
from app.api.v1.prediction import router as prediction_router
from app.api.v1.weather import router as weather_router
from app.api.v1.soil import router as soil_router

api_v1_router = APIRouter()

# Include all v1 routers
api_v1_router.include_router(auth_router)
api_v1_router.include_router(users_router)
api_v1_router.include_router(farms_router)
api_v1_router.include_router(notifications_router)
api_v1_router.include_router(health_router)

# Milestone 2 routers
api_v1_router.include_router(prediction_router)
api_v1_router.include_router(weather_router)
api_v1_router.include_router(soil_router)
