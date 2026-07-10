from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.database import Base, engine
from app.models.user import User, Role, EmailOTP
from app.api.routes import auth
from app.api.routes import auth, datasets

from app.models.agriculture import (
    HistoricalCropYield,
    StateSoilReference,
    StateWeatherReference,
)
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="YieldSense AI API",
    description="Crop Yield Prediction and Agricultural Productivity Forecasting System",
    version="1.0.0"
)

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


@app.get("/")
def root():
    return {
        "message": "YieldSense AI Backend is running successfully"
    }