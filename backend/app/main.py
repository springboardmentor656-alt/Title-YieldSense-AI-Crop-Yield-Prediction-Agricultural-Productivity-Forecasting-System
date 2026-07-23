import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import (
    analytics,
    auth,
    datasets,
    farms,
    predictions,
    soil_analysis,
    weather_analysis,
)
from app.core.logging_config import configure_logging
from app.middleware.request_logging import (
    request_logging_middleware,
)
from app.models.prediction import YieldPrediction
# These imports register the SQLAlchemy models for Alembic/model discovery.
from app.models.agriculture import (
    HistoricalCropYield,
    StateSoilReference,
    StateWeatherReference,
)
from app.models.farm import Farm
from app.models.user import EmailOTP, Role, User
from app.api.routes.crop_recommendation import (
    router as crop_recommendation_router,
)



configure_logging()

logger = logging.getLogger("yieldsense.application")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("YieldSense AI API started successfully")

    yield

    logger.info("YieldSense AI API stopped")


app = FastAPI(
    title="YieldSense AI API",
    description=(
        "Crop Yield Prediction and Agricultural "
        "Productivity Forecasting System"
    ),
    version="1.0.0",
    lifespan=lifespan,
)


app.middleware("http")(request_logging_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth.router)
app.include_router(datasets.router)
app.include_router(farms.router)
app.include_router(predictions.router)
app.include_router(weather_analysis.router)
app.include_router(soil_analysis.router)
app.include_router(analytics.router)
app.include_router(
    crop_recommendation_router,
    prefix="/api",
)

@app.get("/")
def root():
    return {
        "message": "YieldSense AI Backend is running successfully"
    }


@app.get("/test-error", include_in_schema=False)
def test_error():
    raise RuntimeError("Temporary logging test")