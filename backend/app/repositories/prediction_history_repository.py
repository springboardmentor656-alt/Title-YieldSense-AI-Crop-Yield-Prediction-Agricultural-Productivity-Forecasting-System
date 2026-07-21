from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.prediction_history import PredictionHistory


class PredictionHistoryRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, entry: PredictionHistory) -> PredictionHistory:

        self.db.add(entry)
        self.db.commit()
        self.db.refresh(entry)

        return entry

    def get_by_id(self, entry_id: int) -> Optional[PredictionHistory]:

        return (
            self.db.query(PredictionHistory)
            .filter(PredictionHistory.id == entry_id)
            .first()
        )

    def get_by_farm(
        self,
        farm_id: int,
        limit: Optional[int] = None
    ) -> List[PredictionHistory]:

        query = (
            self.db.query(PredictionHistory)
            .filter(PredictionHistory.farm_id == farm_id)
            .order_by(PredictionHistory.created_at.desc())
        )

        if limit is not None:
            query = query.limit(limit)

        return query.all()

    def get_by_user(
        self,
        user_id: int,
        limit: Optional[int] = None
    ) -> List[PredictionHistory]:

        query = (
            self.db.query(PredictionHistory)
            .filter(PredictionHistory.user_id == user_id)
            .order_by(PredictionHistory.created_at.desc())
        )

        if limit is not None:
            query = query.limit(limit)

        return query.all()

    def update(self, entry: PredictionHistory) -> PredictionHistory:

        self.db.commit()
        self.db.refresh(entry)

        return entry

    def update_actual_yield(
        self,
        entry_id: int,
        actual_yield: float
    ) -> Optional[PredictionHistory]:

        entry = self.get_by_id(entry_id)
        if entry is None:
            return None

        entry.actual_yield = actual_yield

        self.db.commit()
        self.db.refresh(entry)

        return entry

    def delete(self, entry: PredictionHistory) -> None:

        self.db.delete(entry)
        self.db.commit()
