from fastapi import APIRouter, HTTPException

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.ml.predict import predict_yield, MODEL_VERSION
from app.modules.soil_service import suitability_score
from app.modules.geocoding_service import get_coordinates
from app.modules.weather_service import WeatherService

router = APIRouter(prefix="/api/v1/predictions", tags=["predictions"])


@router.post("", response_model=PredictionResponse)
async def create_prediction(payload: PredictionRequest):
    try:
        lat, lon = await get_coordinates(payload.region)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))

    try:
        weather_service = WeatherService()
        weather = await weather_service.get_current_conditions(lat, lon)
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"Weather lookup failed: {e}")

    try:
        model_input = {
            "crop_type": payload.crop_type,
            "rainfall_mm": weather["rainfall_mm"],
            "avg_temp_c": weather["avg_temp_c"],
        }
        yield_kg_ha = predict_yield(model_input)
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