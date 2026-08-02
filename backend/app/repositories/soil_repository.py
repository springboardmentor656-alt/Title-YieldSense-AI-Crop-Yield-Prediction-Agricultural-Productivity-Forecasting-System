from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.farm import Farm
from app.models.soil import SoilReport


class SoilRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, soil_report: SoilReport) -> SoilReport:

        self.db.add(soil_report)
        self.db.commit()
        self.db.refresh(soil_report)

        return soil_report

    def latest_for_farm(self, farm_id: int) -> SoilReport | None:

        return (
            self.db.query(SoilReport)
            .filter(SoilReport.farm_id == farm_id)
            .order_by(SoilReport.id.desc())
            .first()
        )

    def get_by_id(self, report_id: int) -> Optional[SoilReport]:

        return (
            self.db.query(SoilReport)
            .filter(SoilReport.id == report_id)
            .first()
        )

    def get_by_farm(self, farm_id: int) -> List[SoilReport]:

        return (
            self.db.query(SoilReport)
            .filter(SoilReport.farm_id == farm_id)
            .order_by(SoilReport.created_at.desc())
            .all()
        )

    def list_for_user(
        self,
        user_id: int,
        search: Optional[str] = None,
    ) -> List[SoilReport]:
        """All soil reports across a user's farms, newest first.

        Filtering by derived fields (fertility/health category) and
        pagination happen in SoilService, since those categories are
        computed from business logic rather than stored columns.
        """
        query = (
            self.db.query(SoilReport)
            .join(Farm, SoilReport.farm_id == Farm.id)
            .filter(Farm.user_id == user_id)
        )

        if search:
            query = query.filter(Farm.farm_name.ilike(f"%{search}%"))

        return query.order_by(SoilReport.created_at.desc()).all()

    def update(self, soil_report: SoilReport) -> SoilReport:

        self.db.commit()
        self.db.refresh(soil_report)

        return soil_report

    def delete(self, soil_report: SoilReport) -> None:

        self.db.delete(soil_report)
        self.db.commit()
