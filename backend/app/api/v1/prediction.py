"""
YieldSense AI — Prediction Endpoints

Crop yield prediction routes.
"""

import os

from fastapi import APIRouter, HTTPException

from app.schemas.prediction import (
    PredictionRequest,
    PredictionResponse,
    ModelInfoResponse,
    RecommendationRequest,
    RecommendationResponse,
)
from app.services.prediction_service import predict_yield

router = APIRouter(prefix="/prediction", tags=["Prediction"])


@router.post("/predict-yield", response_model=PredictionResponse, summary="Predict crop yield")
async def predict_yield_endpoint(request: PredictionRequest):
    """
    Predict crop yield using the trained ML model.

    The prediction pipeline:
    1. Validates all input parameters
    2. Fetches live weather data (if coordinates provided)
    3. Analyzes soil health
    4. Runs the ML model inference
    5. Returns structured prediction with weather and soil summaries

    **Note:** The ML model must be trained first. Run `python -m ml.train`
    in the backend directory.
    """
    try:
        result = await predict_yield(request.model_dump())
        return PredictionResponse(**result)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Model not available: {str(e)}. Please train the model first.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}",
        )


@router.get("/model-info", response_model=ModelInfoResponse, summary="Get model information")
async def get_model_info():
    """
    Get information about the currently loaded ML model.

    Returns model name, accuracy metrics, and feature list.
    """
    try:
        from ml.inference.predictor import CropYieldPredictor
        predictor = CropYieldPredictor.get_instance()
        info = predictor.get_model_info()
        return ModelInfoResponse(**info)
    except FileNotFoundError:
        return ModelInfoResponse(status="not_trained")
    except Exception as e:
        return ModelInfoResponse(status=f"error: {str(e)[:100]}")


@router.post("/recommend-crop", response_model=RecommendationResponse, summary="Recommend crop based on soil/environment")
async def recommend_crop_endpoint(request: RecommendationRequest):
    """
    Recommend optimal crops using the trained Crop Recommendation model.
    """
    try:
        from ml.inference.predictor import CropRecommendationPredictor
        predictor = CropRecommendationPredictor.get_instance()
        result = predictor.predict(request.model_dump())
        return RecommendationResponse(**result)
    except FileNotFoundError as e:
        raise HTTPException(
            status_code=503,
            detail=f"Model not available: {str(e)}. Please train the model first.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Recommendation failed: {str(e)}",
        )

