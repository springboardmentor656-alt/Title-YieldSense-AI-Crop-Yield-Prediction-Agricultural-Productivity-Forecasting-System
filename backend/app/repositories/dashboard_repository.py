from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.crop import Crop
from app.models.farm import Farm
from app.models.prediction import Prediction
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