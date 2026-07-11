"""
routers/predict.py — Milestone 2: /api/v1/predict

Combines three things into one forecast:
  1. The trained Random Forest model (crop item + temperature + rainfall
     -> hg/ha_yield), loaded from data/model_assets.pkl.
  2. A weather estimate for the farm's coordinates (weather_service.py).
  3. A soil adjustment heuristic based on the farm's pH/N/P/K readings.

Soil adjustment is intentionally simple and documented as a heuristic, not
a trained model input — the training dataset (crop yield by region/year)
doesn't include soil chemistry, so soil quality is layered on afterward as
a bounded multiplier rather than presented as something the ML model learned.
"""
import os

import joblib
import pandas as pd
from fastapi import APIRouter, Depends, HTTPException

from auth_handler import get_current_user
from database import get_db_cursor
from models import PredictRequest, PredictResponse
from weather_service import get_weather_estimate

router = APIRouter(prefix="/api/v1/predict", tags=["Prediction"])

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "data", "model_assets.pkl")

_model_cache = None


def _load_model():
    global _model_cache
    if _model_cache is None:
        if not os.path.exists(MODEL_PATH):
            raise HTTPException(
                status_code=503,
                detail="No trained model found. Run 'python train.py' on the backend first.",
            )
        _model_cache = joblib.load(MODEL_PATH)
    return _model_cache


# Rough agronomic reference ranges used only for the soil adjustment
# heuristic below — not scientific thresholds, just reasonable midpoints.
IDEAL_RANGES = {
    "soil_ph": (6.0, 7.0),
    "soil_n": (80.0, 120.0),
    "soil_p": (30.0, 50.0),
    "soil_k": (30.0, 50.0),
}


def _closeness_score(value: float, low: float, high: float) -> float:
    """1.0 if value is inside [low, high], decaying toward 0 the further outside it is."""
    if low <= value <= high:
        return 1.0
    span = high - low
    distance = (low - value) if value < low else (value - high)
    return max(0.0, 1.0 - distance / span)


def _soil_adjustment_factor(farm: dict) -> float:
    """Maps available soil readings to a bounded multiplier in [0.85, 1.15]."""
    scores = []
    for field, (low, high) in IDEAL_RANGES.items():
        value = farm.get(field)
        if value is not None:
            scores.append(_closeness_score(float(value), low, high))

    if not scores:
        return 1.0  # no soil data on file — no adjustment applied

    avg_score = sum(scores) / len(scores)  # 0 (poor) .. 1 (ideal)
    return 0.85 + avg_score * 0.30


@router.post("", response_model=PredictResponse)
def predict_yield(payload: PredictRequest, user: dict = Depends(get_current_user)):
    assets = _load_model()
    pipeline = assets["pipeline"]
    stats = assets["stats"]

    with get_db_cursor() as cur:
        cur.execute(
            """
            SELECT id, user_id, farm_name, latitude, longitude, soil_ph, soil_n, soil_p, soil_k
            FROM farms WHERE id = %s
            """,
            (payload.farm_id,),
        )
        farm = cur.fetchone()

    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    if farm["user_id"] != int(user["sub"]) and user.get("role") != "Admin":
        raise HTTPException(status_code=403, detail="You do not have access to this farm")

    known_crops = stats["known_crops"]
    if payload.crop_name not in known_crops:
        raise HTTPException(
            status_code=400,
            detail=f"Unknown crop '{payload.crop_name}'. Trained crops: {known_crops}",
        )

    weather = get_weather_estimate(float(farm["latitude"]), float(farm["longitude"]))

    input_row = pd.DataFrame([{
        "Item": payload.crop_name,
        "avg_temp": weather["avg_temp"],
        "average_rain_fall_mm_per_year": weather["average_rain_fall_mm_per_year"],
    }])
    base_prediction_hg_ha = float(pipeline.predict(input_row)[0])

    soil_factor = _soil_adjustment_factor(farm)
    adjusted_prediction_hg_ha = base_prediction_hg_ha * soil_factor

    # The training data (and model) work in hg/ha, the Kaggle dataset's native
    # unit. Convert to kg/ha here since that's the unit the product promises.
    HG_TO_KG = 0.1

    return PredictResponse(
        farm_id=farm["id"],
        crop_name=payload.crop_name,
        predicted_yield_kg_ha=round(adjusted_prediction_hg_ha * HG_TO_KG, 2),
        base_model_yield_kg_ha=round(base_prediction_hg_ha * HG_TO_KG, 2),
        soil_adjustment_factor=round(soil_factor, 4),
        weather_used=weather,
        model_r2_score=round(stats["r2_score"], 4),
        note=(
            "Model trained on hg/ha, converted to kg/ha here. Adjusted by a "
            "soil-quality heuristic (not a learned feature). Weather source: "
            + weather["source"] + "."
        ),
    )
