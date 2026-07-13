from fastapi import APIRouter, HTTPException

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.ml.predict import predict_yield, MODEL_VERSION
from app.modules.soil_service import suitability_score

router = APIRouter(prefix="/api/v1/predictions", tags=["predictions"])

@router.post("", response_model=PredictionResponse)
def create_prediction(payload: PredictionRequest):
    try:
        yield_kg_ha = predict_yield(payload.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    soil_score = suitability_score(
        payload.crop_type, payload.soil_ph,
        payload.nitrogen_kg_ha, payload.phosphorus_kg_ha, payload.potassium_kg_ha,
    )

    return PredictionResponse(
        predicted_yield_kg_ha=round(yield_kg_ha, 1),
        soil_suitability_score=soil_score,
        model_version=MODEL_VERSION,
    )