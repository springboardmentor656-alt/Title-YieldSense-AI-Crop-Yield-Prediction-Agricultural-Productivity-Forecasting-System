"""Agricultural analytics service for YieldSense AI.

Every figure returned here is computed directly from stored data —
prediction_history, weather_records and farm ownership — with no
fabricated numbers or invented ML claims. Farm-scoped methods enforce
ownership through FarmService.get_farm, matching the pattern used by
PredictionService and SoilService.
"""

import csv
import io
import statistics
from typing import Any, Dict, List, Optional

from sqlalchemy.orm import Session

from app.core.exceptions import ResourceNotFoundException
from app.repositories.farm_repository import FarmRepository
from app.repositories.prediction_history_repository import (
    PredictionHistoryRepository,
)
from app.repositories.weather_repository import WeatherRepository
from app.services.farm_service import FarmService

# A prediction more than this many standard deviations from a farm's
# own mean is flagged as an anomaly.
ANOMALY_ZSCORE_THRESHOLD = 1.5

# Rainfall/temperature buckets used by weather_impact. Boundaries
# roughly track the training dataset's 25th/75th percentiles
# (rainfall ~593mm/~1668mm) rather than arbitrary round numbers.
RAINFALL_BUCKETS = [
    ("low (<600mm)", None, 600.0),
    ("moderate (600-1700mm)", 600.0, 1700.0),
    ("high (>=1700mm)", 1700.0, None),
]

TEMPERATURE_BUCKETS = [
    ("cool (<15C)", None, 15.0),
    ("moderate (15-25C)", 15.0, 25.0),
    ("warm (>=25C)", 25.0, None),
]


class AnalyticsService:
    """Derives yield trend, cross-farm comparison, weather correlation,
    anomaly detection and accuracy tracking from stored prediction and
    weather data.
    """

    def __init__(self, db: Session):
        self.db = db
        self.history_repo = PredictionHistoryRepository(db)
        self.farm_repo = FarmRepository(db)
        self.weather_repo = WeatherRepository(db)
        self.farm_service = FarmService(db)

    @staticmethod
    def _in_bucket(value: Optional[float], low: Optional[float], high: Optional[float]) -> bool:
        if value is None:
            return False
        if low is not None and value < low:
            return False
        if high is not None and value >= high:
            return False
        return True

    def _bucket_predictions(
        self,
        history,
        feature_key: str,
        bucket_defs
    ) -> List[Dict[str, Any]]:
        """Group predictions by the stored feature value that fed them
        (e.g. features["rainfall"]) and average the outcome per bucket.
        """
        buckets = []
        for label, low, high in bucket_defs:
            matching = [
                entry.prediction for entry in history
                if self._in_bucket(entry.features.get(feature_key), low, high)
            ]
            buckets.append({
                "bucket": label,
                "average_yield": round(statistics.mean(matching), 2) if matching else None,
                "count": len(matching),
            })
        return buckets

    def yield_trend(self, farm_id: int, token: dict) -> Dict[str, Any]:
        """Chronological time series of a farm's predictions."""
        self.farm_service.get_farm(farm_id, token)
        history = self.history_repo.get_by_farm(farm_id)

        points = [
            {
                "date": entry.created_at,
                "predicted_yield": entry.prediction,
                "crop": entry.features.get("crop"),
            }
            for entry in reversed(history)  # oldest -> newest
        ]

        return {"farm_id": farm_id, "points": points}

    def farm_comparison(self, user_id: int) -> List[Dict[str, Any]]:
        """Latest and average predicted yield for each of a user's farms."""
        farms = self.farm_repo.get_user_farms(user_id)

        comparison = []
        for farm in farms:
            history = self.history_repo.get_by_farm(farm.id)
            predictions = [entry.prediction for entry in history]
            crop_name = (
                max(farm.crops, key=lambda crop: crop.id).crop_name
                if farm.crops else None
            )

            comparison.append({
                "farm_id": farm.id,
                "farm_name": farm.farm_name,
                "crop_name": crop_name,
                "latest_yield": history[0].prediction if history else None,
                "average_yield": (
                    round(statistics.mean(predictions), 2) if predictions else None
                ),
                "prediction_count": len(predictions),
            })

        return comparison

    def weather_impact(self, farm_id: int, token: dict) -> Dict[str, Any]:
        """Bucket a farm's predictions by the rainfall/temperature that
        fed them and report the average outcome per bucket, so shifts
        in yield across weather conditions become visible. Buckets with
        no matching predictions report a null average rather than 0, so
        they aren't mistaken for a real zero-yield result.
        """
        self.farm_service.get_farm(farm_id, token)
        history = self.history_repo.get_by_farm(farm_id)
        weather_records = self.weather_repo.get_by_farm(farm_id)

        return {
            "farm_id": farm_id,
            "sample_size": len(history),
            "weather_records_on_file": len(weather_records),
            "rainfall_buckets": self._bucket_predictions(
                history, "rainfall", RAINFALL_BUCKETS
            ),
            "temperature_buckets": self._bucket_predictions(
                history, "temperature", TEMPERATURE_BUCKETS
            ),
        }

    def risk_anomaly(self, farm_id: int, token: dict) -> List[Dict[str, Any]]:
        """Flag predictions whose value is more than
        ANOMALY_ZSCORE_THRESHOLD standard deviations from the farm's
        own mean prediction.
        """
        self.farm_service.get_farm(farm_id, token)
        history = self.history_repo.get_by_farm(farm_id)
        predictions = [entry.prediction for entry in history]

        if len(predictions) < 2:
            return []

        mean = statistics.mean(predictions)
        stdev = statistics.stdev(predictions)

        if stdev == 0:
            return []

        anomalies = []
        for entry in history:
            z_score = (entry.prediction - mean) / stdev
            if abs(z_score) > ANOMALY_ZSCORE_THRESHOLD:
                anomalies.append({
                    "id": entry.id,
                    "created_at": entry.created_at,
                    "crop": entry.features.get("crop"),
                    "prediction": entry.prediction,
                    "z_score": round(z_score, 2),
                    "farm_mean": round(mean, 2),
                })

        return anomalies

    def accuracy_tracking(self, farm_id: int, token: dict) -> Dict[str, Any]:
        """Mean absolute percentage error between predicted and actual
        yield, over history entries that have a recorded actual_yield.
        """
        self.farm_service.get_farm(farm_id, token)
        history = self.history_repo.get_by_farm(farm_id)

        entries = []
        errors = []
        for entry in history:
            if entry.actual_yield is None or entry.actual_yield == 0:
                continue

            ape = abs(entry.prediction - entry.actual_yield) / abs(entry.actual_yield) * 100
            errors.append(ape)
            entries.append({
                "id": entry.id,
                "created_at": entry.created_at,
                "prediction": entry.prediction,
                "actual_yield": entry.actual_yield,
                "absolute_percentage_error": round(ape, 2),
            })

        return {
            "farm_id": farm_id,
            "sample_size": len(entries),
            "mape": round(statistics.mean(errors), 2) if errors else None,
            "entries": entries,
        }

    def productivity_score(self, user_id: int) -> Dict[str, Any]:
        """Productivity score = (latest_yield / average_yield) * 100,
        computed across all of a user's predictions (every farm). A
        score above 100 means the most recent prediction beats the
        user's own historical average; below 100 means it trails it.
        """
        history = self.history_repo.get_by_user(user_id)  # newest first
        predictions = [entry.prediction for entry in history]

        if not predictions:
            return {
                "productivity_score": None,
                "latest_yield": None,
                "average_yield": None,
                "sample_size": 0,
                "interpretation": None,
            }

        latest_yield = predictions[0]
        average_yield = statistics.mean(predictions)
        score = (
            round((latest_yield / average_yield) * 100, 2)
            if average_yield else None
        )

        return {
            "productivity_score": score,
            "latest_yield": round(latest_yield, 2),
            "average_yield": round(average_yield, 2),
            "sample_size": len(predictions),
            "interpretation": self._interpret_score(score, len(predictions)),
        }

    @staticmethod
    def _interpret_score(score: Optional[float], sample_size: int) -> Optional[str]:
        if score is None:
            return None
        if sample_size < 2:
            return "Baseline reading - add more predictions to track trend"
        if score >= 110:
            return "Excellent Productivity"
        if score >= 95:
            return "Good Productivity"
        if score >= 80:
            return "Average Productivity"
        return "Needs Attention"

    def seasonal_comparison(self, user_id: int) -> List[Dict[str, Any]]:
        """Groups a user's predictions by the calendar year they were
        made in and averages the predicted yield per year. There is no
        explicit season field on PredictionHistory, so calendar year
        is the closest season-like grouping the stored data supports.
        """
        history = self.history_repo.get_by_user(user_id)

        by_year: Dict[int, List[float]] = {}
        for entry in history:
            year = entry.created_at.year
            by_year.setdefault(year, []).append(entry.prediction)

        return [
            {
                "season": str(year),
                "yield": round(statistics.mean(values), 2),
                "count": len(values),
            }
            for year, values in sorted(by_year.items())
        ]

    def dashboard_yield_trend(self, user_id: int) -> List[Dict[str, Any]]:
        """Chronological time series (oldest -> newest) across all of a
        user's farms, for the dashboard-level yield trend chart.
        """
        history = self.history_repo.get_by_user(user_id)

        return [
            {
                "date": entry.created_at,
                "yield": entry.prediction,
                "farm_id": entry.farm_id,
                "crop": entry.features.get("crop"),
            }
            for entry in reversed(history)  # oldest -> newest
        ]

    def export_csv(self, farm_id: int, token: dict) -> str:
        """Build a CSV export of a farm's full prediction history."""
        self.farm_service.get_farm(farm_id, token)
        history = self.history_repo.get_by_farm(farm_id)

        buffer = io.StringIO()
        writer = csv.writer(buffer)
        writer.writerow([
            "id", "created_at", "crop", "temperature", "rainfall",
            "soil_ph", "prediction", "actual_yield", "model_version",
        ])

        for entry in history:
            features = entry.features or {}
            writer.writerow([
                entry.id,
                entry.created_at.isoformat() if entry.created_at else "",
                features.get("crop", ""),
                features.get("temperature", ""),
                features.get("rainfall", ""),
                features.get("soil_ph", ""),
                entry.prediction,
                entry.actual_yield if entry.actual_yield is not None else "",
                entry.model_version,
            ])

        return buffer.getvalue()

    def set_actual_yield(self, entry_id: int, actual_yield: float, token: dict):
        """Record ground-truth yield for a past prediction, enforcing
        ownership of the farm the prediction belongs to.

        Raises:
            ResourceNotFoundException: If the history entry doesn't exist.
        """
        entry = self.history_repo.get_by_id(entry_id)
        if entry is None:
            raise ResourceNotFoundException("Prediction history entry")

        self.farm_service.get_farm(entry.farm_id, token)

        return self.history_repo.update_actual_yield(entry_id, actual_yield)
