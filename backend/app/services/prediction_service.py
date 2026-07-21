"""Crop yield prediction service for YieldSense AI.

Loads the trained model pipeline (see app.ml.train_model) once per
process, resolves any missing inputs from a farm's stored weather and
soil data, runs inference, applies a soil-suitability adjustment, and
persists the result to PredictionHistory.
"""

import json
from datetime import datetime
from functools import lru_cache
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import pandas as pd
from sklearn.pipeline import Pipeline
from sqlalchemy.orm import Session

from app.core.exceptions import (
    InvalidPredictionInputException,
    ResourceNotFoundException,
)
from app.core.logging import logger
from app.models.farm import Farm
from app.models.prediction_history import PredictionHistory
from app.repositories.farm_repository import FarmRepository
from app.repositories.prediction_history_repository import (
    PredictionHistoryRepository,
)
from app.repositories.soil_repository import SoilRepository
from app.repositories.weather_repository import WeatherRepository
from app.schemas.prediction import PredictionRequest
from app.services.soil_service import SoilService

BASE_DIR = Path(__file__).resolve().parents[2]  # backend/
MODEL_PATH = BASE_DIR / "models" / "crop_yield_model.pkl"
METADATA_PATH = BASE_DIR / "models" / "model_metadata.json"

# Confidence bands (test-set R2 as a percentage) used by _compute_risk_level.
CONFIDENCE_HIGH_THRESHOLD = 80.0
CONFIDENCE_MEDIUM_THRESHOLD = 60.0

# Rainfall bands (mm/year) used by _compute_risk_level. The training
# dataset's rainfall ranges from 51mm to 3240mm (25th pct ~593mm, 75th
# pct ~1668mm), so values inside the normal band are unremarkable and
# values far outside it make the prediction less trustworthy.
RAINFALL_NORMAL_RANGE = (500.0, 2000.0)
RAINFALL_ACCEPTABLE_RANGE = (300.0, 2500.0)

# How many of a farm's most recent same-crop predictions to use when
# estimating a trend, and the minimum relative slope (per prediction
# step) required to call the trend "improving"/"declining" rather than
# "stable".
TREND_WINDOW = 5
TREND_RELATIVE_SLOPE_THRESHOLD = 0.02


@lru_cache(maxsize=1)
def _load_pipeline() -> Pipeline:
    """Load the trained model pipeline from disk exactly once per process."""
    import joblib

    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            f"No trained model found at {MODEL_PATH}. Run "
            "`python -m app.ml.train_model` first."
        )

    logger.info(f"Loading prediction model from {MODEL_PATH}")
    return joblib.load(MODEL_PATH)


@lru_cache(maxsize=1)
def _load_metadata() -> Dict[str, Any]:
    """Load the model metadata (features, target, metrics) exactly once."""
    if not METADATA_PATH.exists():
        raise FileNotFoundError(f"No model metadata found at {METADATA_PATH}.")

    with open(METADATA_PATH) as f:
        return json.load(f)


class PredictionService:
    """Serves crop yield predictions using the cached ML pipeline."""

    def __init__(self, db: Session):

        self.db = db
        self.farm_repo = FarmRepository(db)
        self.weather_repo = WeatherRepository(db)
        self.soil_repo = SoilRepository(db)
        self.history_repo = PredictionHistoryRepository(db)

        self.pipeline = _load_pipeline()
        self.metadata = _load_metadata()

    def _resolve_farm(self, farm_id: int, user_id: int, role: str) -> Farm:
        """Fetch a farm, enforcing ownership unless the caller is an admin."""
        if role == "Administrator":
            farm = self.farm_repo.get_by_id(farm_id)
        else:
            farm = self.farm_repo.belongs_to_user(farm_id, user_id)

        if farm is None:
            raise ResourceNotFoundException("Farm")

        return farm

    def _resolve_crop_name(self, farm: Farm) -> str:
        """Return the most recently added crop for a farm.

        Raises:
            InvalidPredictionInputException: If the farm has no crops.
        """
        if not farm.crops:
            raise InvalidPredictionInputException(
                "Farm has no crop assigned. Add a crop before requesting "
                "a prediction."
            )

        return max(farm.crops, key=lambda crop: crop.id).crop_name

    def _resolve_climate_inputs(
        self,
        farm_id: int,
        request: PredictionRequest
    ) -> Tuple[float, float]:
        """Resolve temperature/rainfall from the request or latest weather.

        Raises:
            InvalidPredictionInputException: If a value is missing from
                the request and there is no stored weather reading to
                fall back on.
        """
        temperature = request.temperature
        rainfall = request.rainfall

        if temperature is None or rainfall is None:
            latest_weather = self.weather_repo.latest(farm_id)

            if temperature is None:
                if latest_weather is None:
                    raise InvalidPredictionInputException(
                        "temperature was not provided and no stored weather "
                        "reading exists for this farm. Pass temperature "
                        "explicitly or refresh the farm's weather first."
                    )
                temperature = latest_weather.temperature

            if rainfall is None:
                if latest_weather is None:
                    raise InvalidPredictionInputException(
                        "rainfall was not provided and no stored weather "
                        "reading exists for this farm. Pass rainfall "
                        "explicitly or refresh the farm's weather first."
                    )
                rainfall = latest_weather.rainfall

        return temperature, rainfall

    def _resolve_soil_ph(
        self,
        farm_id: int,
        request: PredictionRequest
    ) -> float:
        """Resolve soil_ph from the request or the farm's latest soil report.

        Raises:
            InvalidPredictionInputException: If soil_ph is missing from
                the request and there is no soil report on file.
        """
        if request.soil_ph is not None:
            return request.soil_ph

        report = self.soil_repo.latest_for_farm(farm_id)
        if report is None or report.ph is None:
            raise InvalidPredictionInputException(
                "soil_ph was not provided and no soil report exists for "
                "this farm."
            )

        return report.ph

    def _compute_confidence(self) -> float:
        """Derive a confidence percentage from the model's test-set R2.

        R2 is clipped to [0, 1] before converting to a percentage, since
        a negative R2 (worse than predicting the mean) has no meaningful
        confidence interpretation.
        """
        r2 = self.metadata.get("metrics", {}).get("r2", 0.0)
        return round(max(0.0, min(1.0, r2)) * 100, 2)

    def _compute_risk_level(
        self,
        confidence: float,
        ph_category: str,
        rainfall: float
    ) -> str:
        """Derive an overall risk level from three independent signals.

        Each signal contributes 0 (low), 1 (medium) or 2 (high) risk
        points; the total is mapped back to a single low/medium/high
        category. This keeps the result interpretable instead of
        collapsing everything into an opaque score.
        """
        if confidence >= CONFIDENCE_HIGH_THRESHOLD:
            confidence_risk = 0
        elif confidence >= CONFIDENCE_MEDIUM_THRESHOLD:
            confidence_risk = 1
        else:
            confidence_risk = 2

        ph_risk = {"optimal": 0, "acceptable": 1, "poor": 2}.get(ph_category, 1)

        if RAINFALL_NORMAL_RANGE[0] <= rainfall <= RAINFALL_NORMAL_RANGE[1]:
            rainfall_risk = 0
        elif RAINFALL_ACCEPTABLE_RANGE[0] <= rainfall <= RAINFALL_ACCEPTABLE_RANGE[1]:
            rainfall_risk = 1
        else:
            rainfall_risk = 2

        total_risk = confidence_risk + ph_risk + rainfall_risk

        if total_risk <= 1:
            return "low"
        if total_risk <= 3:
            return "medium"
        return "high"

    def _compute_season_comparison(
        self,
        farm_history: List[PredictionHistory],
        crop_name: str,
        adjusted_yield: float
    ) -> Optional[Dict[str, Any]]:
        """Compare this prediction to the farm's past predictions for
        the same crop. Returns None when there is no prior history to
        compare against.
        """
        crop_history = [
            entry for entry in farm_history
            if entry.features.get("crop") == crop_name
        ]
        if not crop_history:
            return None

        past_yields = [entry.prediction for entry in crop_history]
        average_past_yield = sum(past_yields) / len(past_yields)

        delta_pct = (
            round((adjusted_yield - average_past_yield) / average_past_yield * 100, 2)
            if average_past_yield
            else 0.0
        )

        return {
            "average_past_yield": round(average_past_yield, 2),
            "delta_pct": delta_pct,
            "sample_size": len(crop_history),
        }

    def _compute_trend_forecast(
        self,
        farm_history: List[PredictionHistory],
        crop_name: str
    ) -> Optional[str]:
        """Classify the slope of the farm's last TREND_WINDOW same-crop
        predictions as improving/stable/declining. Returns None when
        there are fewer than two prior same-crop predictions, since a
        slope needs at least two points.
        """
        crop_history = [
            entry for entry in farm_history
            if entry.features.get("crop") == crop_name
        ]
        if len(crop_history) < 2:
            return None

        # farm_history is ordered newest-first; put the most recent
        # TREND_WINDOW entries back into chronological (oldest-first)
        # order before fitting a slope.
        chronological = list(reversed(crop_history[:TREND_WINDOW]))
        values = [entry.prediction for entry in chronological]

        n = len(values)
        mean_x = (n - 1) / 2
        mean_y = sum(values) / n

        numerator = sum((i - mean_x) * (v - mean_y) for i, v in enumerate(values))
        denominator = sum((i - mean_x) ** 2 for i in range(n))

        if denominator == 0 or mean_y == 0:
            return "stable"

        relative_slope = (numerator / denominator) / mean_y

        if relative_slope > TREND_RELATIVE_SLOPE_THRESHOLD:
            return "improving"
        if relative_slope < -TREND_RELATIVE_SLOPE_THRESHOLD:
            return "declining"
        return "stable"

    def predict(
        self,
        user_id: int,
        role: str,
        request: PredictionRequest
    ) -> Dict[str, Any]:
        """Generate a crop yield prediction and persist it to history.

        Raises:
            ResourceNotFoundException: If the farm doesn't exist or
                isn't owned by the caller.
            InvalidPredictionInputException: If required inputs can't
                be resolved or fail validation.
        """
        farm = self._resolve_farm(request.farm_id, user_id, role)
        crop_name = self._resolve_crop_name(farm)
        temperature, rainfall = self._resolve_climate_inputs(farm.id, request)
        soil_ph = self._resolve_soil_ph(farm.id, request)

        try:
            soil_assessment = SoilService.evaluate_ph(soil_ph)
        except ValueError as exc:
            raise InvalidPredictionInputException(str(exc)) from exc

        feature_row = pd.DataFrame([{
            "rainfall": rainfall,
            "temperature": temperature,
            "item": crop_name,
        }])

        try:
            base_yield = float(self.pipeline.predict(feature_row)[0])
        except Exception:
            logger.exception(f"Model inference failed for farm {farm.id}.")
            raise

        adjusted_yield = round(
            base_yield * soil_assessment["yield_multiplier"], 2
        )
        confidence = self._compute_confidence()
        model_used = self.metadata.get("model_name", "unknown")

        # Snapshot prior history BEFORE persisting the new entry so the
        # comparison/trend below are computed against past predictions
        # only, never against the one we're about to create.
        farm_history = self.history_repo.get_by_farm(farm.id)

        risk_level = self._compute_risk_level(
            confidence, soil_assessment["ph_category"], rainfall
        )
        season_comparison = self._compute_season_comparison(
            farm_history, crop_name, adjusted_yield
        )
        trend_forecast = self._compute_trend_forecast(farm_history, crop_name)

        history_entry = self.history_repo.create(
            PredictionHistory(
                user_id=user_id,
                farm_id=farm.id,
                features={
                    "temperature": temperature,
                    "rainfall": rainfall,
                    "soil_ph": soil_ph,
                    "crop": crop_name,
                },
                prediction=adjusted_yield,
                model_version=model_used,
            )
        )

        logger.info(
            f"Prediction for farm {farm.id} (user {user_id}): "
            f"{adjusted_yield} via {model_used}"
        )

        timestamp: datetime = history_entry.created_at

        return {
            "predicted_yield": adjusted_yield,
            "confidence": confidence,
            "model_used": model_used,
            "timestamp": timestamp,
            "risk_level": risk_level,
            "season_comparison": season_comparison,
            "trend_forecast": trend_forecast,
        }
