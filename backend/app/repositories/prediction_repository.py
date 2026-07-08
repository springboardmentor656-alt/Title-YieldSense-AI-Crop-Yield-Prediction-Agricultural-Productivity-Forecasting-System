from sqlalchemy.orm import Session

from app.models.prediction import Prediction


class PredictionRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, prediction):

        self.db.add(prediction)

        self.db.commit()

        self.db.refresh(prediction)

        return prediction

    def get_history(self, farm_id: int):

        return (
            self.db.query(Prediction)
            .filter(Prediction.farm_id == farm_id)
            .order_by(Prediction.created_at.desc())
            .all()
        )