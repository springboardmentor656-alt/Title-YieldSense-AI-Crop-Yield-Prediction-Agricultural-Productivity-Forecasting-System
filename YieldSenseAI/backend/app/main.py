from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import joblib
import numpy as np
from .database import engine, Base
from .routers import auth

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="YieldSense AI Core", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])

# Pydantic schema ensuring the user's input values are clean and validated
class InferencePayload(BaseModel):
    avg_temp: float
    rainfall: float
    soil_ph: float

MODEL_PATH = "data/processed/crop_yield_model.pkl"

@app.post("/api/v1/predict-yield")
def predict_crop_performance(payload: InferencePayload):
    # Verify the model file exists before calculating predictions
    if not os.path.exists(MODEL_PATH):
        raise HTTPException(status_code=503, detail="Prediction model artifact is currently offline or training.")
    try:
        # Load our trained Random Forest model from disk
        model = joblib.load(MODEL_PATH)
        # Convert incoming numbers into a 2D array structure for the model
        input_data = np.array([[payload.avg_temp, payload.rainfall, payload.soil_ph]])
        # Run prediction
        predicted_yield = model.predict(input_data)[0]
        
        # Basic logical conditions to provide weather impact scores and soil assessments
        weather_status = "Optimal" if 20 <= payload.avg_temp <= 30 else "Stress Detected"
        soil_suitability = "High Fertility" if 6.0 <= payload.soil_ph <= 7.5 else "Suboptimal pH"
        
        return {
            "estimated_yield_kg_ha": round(float(predicted_yield), 2),
            "weather_impact_assessment": weather_status,
            "soil_suitability_rating": soil_suitability,
            "confidence_score": 0.92  # Placeholder until advanced confidence modules drop
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "YieldSense Engine Core"}

@app.get("/")
def read_root():
    return {"message": "Welcome to YieldSense AI API"}
