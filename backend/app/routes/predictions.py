from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session

from app.schemas.prediction import PredictionRequest, PredictionResponse
from app.ml.predict import predict_yield, MODEL_VERSION
from app.modules.soil_service import suitability_score
from app.models.prediction import Prediction
from app.db.session import get_db

router = APIRouter(prefix="/api/v1/predictions", tags=["predictions"])

@router.post("", response_model=PredictionResponse)
def create_prediction(payload: PredictionRequest, db: Session = Depends(get_db)):
    try:
        yield_kg_ha = predict_yield(payload.model_dump())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {e}")

    soil_score = suitability_score(
        payload.crop_type, payload.soil_ph,
        payload.nitrogen_kg_ha, payload.phosphorus_kg_ha, payload.potassium_kg_ha,
    )

    record = Prediction(
        **payload.model_dump(),
        predicted_yield_kg_ha=round(yield_kg_ha, 1),
        soil_suitability_score=soil_score,
        model_version=MODEL_VERSION,
    )
    db.add(record)
    db.commit()
    db.refresh(record)

    return record

@router.get("/history", response_model=list[PredictionResponse])
def list_predictions(db: Session = Depends(get_db), limit: int = 20):
    """Simple history endpoint — handy for the 'saved to database' requirement
    and an easy thing to demo to your mentor."""
    return (
        db.query(Prediction)
        .order_by(Prediction.created_at.desc())
        .limit(limit)
        .all()
    )