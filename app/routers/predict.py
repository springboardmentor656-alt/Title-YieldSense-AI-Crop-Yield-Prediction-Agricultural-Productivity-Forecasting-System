from fastapi import APIRouter
from pydantic import BaseModel
import joblib
import os

router = APIRouter()

# Load trained model
model_path = os.path.join("models", "crop_model.pkl")
model = joblib.load(model_path)


class CropInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float


@router.post("/predict")
def predict_crop(data: CropInput):
    values = [[
        data.N,
        data.P,
        data.K,
        data.temperature,
        data.humidity,
        data.ph,
        data.rainfall
    ]]

    prediction = model.predict(values)

    return {
        "recommended_crop": prediction[0]
    }