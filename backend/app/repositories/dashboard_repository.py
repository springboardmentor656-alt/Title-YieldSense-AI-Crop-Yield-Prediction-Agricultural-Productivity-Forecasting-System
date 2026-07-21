from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.crop import Crop
from app.models.farm import Farm
from app.models.prediction import Prediction
from app.models.prediction_history import PredictionHistory
from app.models.weather import WeatherRecord


class DashboardRepository:

    def __init__(self, db: Session):

        self.db = db

    def total_farms(self, user_id: int):

        return (

            self.db.query(func.count(Farm.id))

            .filter(Farm.user_id == user_id)

            .scalar()

        )

    def total_crops(self, user_id: int):

        return (

            self.db.query(func.count(Crop.id))

            .join(Farm)

            .filter(Farm.user_id == user_id)

            .scalar()

        )

    def prediction_accuracy(self):

        result = (

            self.db.query(func.avg(Prediction.confidence))

            .scalar()

        )

        return round(result or 0, 2)

    def latest_weather(self, user_id: int):

        return (

            self.db.query(WeatherRecord)

            .join(Farm)

            .filter(Farm.user_id == user_id)

            .order_by(

                WeatherRecord.recorded_at.desc()

            )

            .first()

        )

    def prediction_summary(self, user_id: int):

        return (

            self.db.query(

                func.avg(PredictionHistory.prediction),

                func.max(PredictionHistory.prediction),

                func.min(PredictionHistory.prediction),

                func.count(PredictionHistory.id),

            )

            .filter(PredictionHistory.user_id == user_id)

            .first()

        )

    def monthly_prediction_trend(self, user_id: int):

        return (

            self.db.query(

                func.date_trunc(
                    "month", PredictionHistory.created_at
                ).label("month"),

                func.avg(PredictionHistory.prediction).label(
                    "average_yield"
                ),

                func.count(PredictionHistory.id).label("count"),

            )

            .filter(PredictionHistory.user_id == user_id)

            .group_by("month")

            .order_by("month")

            .all()

        )