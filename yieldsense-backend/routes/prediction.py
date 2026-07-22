from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import pandas as pd
import joblib
import os

from database import SessionLocal
from models.prediction import Prediction

router = APIRouter()

# Load trained ML model
MODEL_PATH = os.path.join(
    os.path.dirname(__file__),
    "..",
    "..",
    "data",
    "processed",
    "crop_yield_model.pkl"
)

model = joblib.load(MODEL_PATH)


class PredictionRequest(BaseModel):
    area: str
    item: str
    year: int
    rainfall: float
    pesticides: float
    temperature: float


@router.post("/predict-yield")
def predict_yield(data: PredictionRequest):

    db = SessionLocal()

    try:

        # Temporary encoding for Area & Item
        area_code = abs(hash(data.area)) % 1000
        item_code = abs(hash(data.item)) % 1000

        input_df = pd.DataFrame([{
            "Area": area_code,
            "Item": item_code,
            "Year": data.year,
            "average_rain_fall_mm_per_year": data.rainfall,
            "pesticides_tonnes": data.pesticides,
            "avg_temp": data.temperature
        }])

        prediction = round(float(model.predict(input_df)[0]), 2)

        # Save prediction in PostgreSQL
        new_prediction = Prediction(
            area=data.area,
            item=data.item,
            year=data.year,
            rainfall=data.rainfall,
            pesticides=data.pesticides,
            temperature=data.temperature,
            predicted_yield=prediction
        )

        db.add(new_prediction)
        db.commit()
        db.refresh(new_prediction)

        return {
            "message": "Prediction saved successfully",
            "predicted_yield": prediction
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

    finally:
        db.close()