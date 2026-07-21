from sqlalchemy.orm import Session

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
