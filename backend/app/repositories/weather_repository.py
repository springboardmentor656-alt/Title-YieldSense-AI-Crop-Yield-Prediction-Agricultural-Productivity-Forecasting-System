from sqlalchemy.orm import Session

from app.models.weather import WeatherRecord


class WeatherRepository:

    def __init__(self, db: Session):

        self.db = db

    def create(self, weather):

        self.db.add(weather)

        self.db.commit()

        self.db.refresh(weather)

        return weather

    def latest(self, farm_id):

        return (

            self.db.query(WeatherRecord)

            .filter(
                WeatherRecord.farm_id == farm_id
            )

            .order_by(
                WeatherRecord.recorded_at.desc()
            )

            .first()

        )

    def get_by_farm(self, farm_id, limit=None):

        query = (

            self.db.query(WeatherRecord)

            .filter(
                WeatherRecord.farm_id == farm_id
            )

            .order_by(
                WeatherRecord.recorded_at.desc()
            )

        )

        if limit is not None:
            query = query.limit(limit)

        return query.all()