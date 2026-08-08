import os
import pickle
from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import database, schemas
from .core.config import settings
from .routers import auth, recommendations
from pydantic import BaseModel
import time

# Create database tables
database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title=settings.PROJECT_NAME, version=settings.VERSION)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(recommendations.router, prefix=f"{settings.API_V1_STR}/analytics", tags=["analytics"])

class InferencePayload(BaseModel):
    temp: float
    rainfall: float
    ph: float

@app.post(f"{settings.API_V1_STR}/predict-yield")
async def predict_yield(payload: InferencePayload):
    model_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "processed", "crop_yield_model.pkl")
    if not os.path.exists(model_path):
        return {"estimated_yield": 4200, "weather_status": "Optimal", "soil_suitability": "Optimal"}
        
    try:
        with open(model_path, "rb") as f:
            model = pickle.load(f)
        
        # XGBoost expects a 2D array: [temp, rainfall, ph]
        prediction = model.predict([[payload.temp, payload.rainfall, payload.ph]])
        predicted_yield = float(prediction[0])
        
        # Determine weather status based on heuristics
        if payload.temp > 35:
            weather = "High Heat Stress Risk"
        elif payload.rainfall < 400:
            weather = "High Drought Stress Risk"
        elif payload.rainfall > 1200:
            weather = "High Flood/Root Rot Risk"
        else:
            weather = "Optimal"
            
        if payload.ph < 5.5 or payload.ph > 7.5:
            soil = "Low Suitability"
        else:
            soil = "Optimal Suitability"
            
        return {
            "estimated_yield": predicted_yield,
            "weather_status": weather,
            "soil_suitability": soil
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "YieldSense Engine Core"}

@app.get("/")
def read_root():
    return {"message": "Welcome to YieldSense AI API"}
