from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import get_conn

import numpy as np
import joblib
import os
from datetime import datetime

from routes.weather import weather_status
from routes.soil import soil_status

router = APIRouter()

encoder = joblib.load("crop_encoder.pkl")

print(encoder.classes_)

MODEL_PATH = "yield_model.pkl"
ENCODER_PATH = "crop_encoder.pkl"


if os.path.exists(MODEL_PATH):
    model = joblib.load(MODEL_PATH)
else:
    model = None

if os.path.exists(ENCODER_PATH):
    encoder = joblib.load(ENCODER_PATH)
else:
    encoder = None

CONFIDENCE_PATH = "model_confidence.pkl"

if os.path.exists(CONFIDENCE_PATH):
    confidence = joblib.load(CONFIDENCE_PATH)
else:
    confidence = None
    
class Prediction(BaseModel):
    crop: str
    avg_temp: float
    rainfall: float
    pesticides: float


@router.post("/predict")
def predict(data: Prediction):

    if model is None:
        raise HTTPException(
            status_code=500,
            detail="Model not found"
        )

    if encoder is None:
        raise HTTPException(
            status_code=500,
            detail="Crop encoder not found"
        )

    # Encode crop
    crop_value = encoder.transform([data.crop])[0]

    # AI Prediction
    values = np.array([[
        crop_value,
        data.rainfall,
        data.pesticides,
        data.avg_temp
    ]])

    predicted_yield = float(model.predict(values)[0])

    # Get soil details for selected crop
    conn = get_conn()
    cur = conn.cursor()

    cur.execute("""
        SELECT
        crop_type,
        soil_type,
        soil_ph,
        nitrogen,
        phosphorus,
        potassium
        FROM farms
        WHERE crop_type=%s
        ORDER BY id DESC
        LIMIT 1
    """, (data.crop,))

    row = cur.fetchone()

    cur.close()
    conn.close()

    if row:
        crop_type = row[0]
        soil_type = row[1]
        soil_ph = row[2]
        nitrogen = row[3]
        phosphorus = row[4]
        potassium = row[5]
    else:
        crop_type = data.crop
        soil_type = "Unknown"
        soil_ph = 7
        nitrogen = 50
        phosphorus = 40
        potassium = 40

    weather = weather_status(
        data.avg_temp,
        data.rainfall
    )

    soil = soil_status(
        soil_type,
        crop_type,
        soil_ph,
        nitrogen,
        phosphorus,
        potassium
    )

    if predicted_yield >= 5000:
        yield_potential = "High"
    elif predicted_yield >= 3000:
        yield_potential = "Moderate"
    else:
        yield_potential = "Low"

    if weather == "Poor":
        risk = "High"
    elif weather == "Moderate":
        risk = "Medium"
    else:
        risk = "Low"

    

    return {

        "crop": crop_type,

        "estimated_yield": round(predicted_yield, 2),

        "yield_potential": yield_potential,

        "confidence": confidence,

        "weather_status": weather,

        "risk_level": risk,

        "soil_health": soil["soil_health"],

        "ph_status": soil["ph_status"],

        "nitrogen_status": soil["nitrogen_status"],

        "phosphorus_status": soil["phosphorus_status"],

        "potassium_status": soil["potassium_status"],

        "fertilizer": soil["fertilizer"],

        "irrigation": soil["irrigation"],

        "crop_suitability": soil["crop_suitability"],

        "prediction_time": datetime.now().strftime("%d-%m-%Y %H:%M")
    }