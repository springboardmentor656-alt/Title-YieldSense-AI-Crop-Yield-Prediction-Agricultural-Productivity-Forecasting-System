from typing import List, Optional

from sqlalchemy.orm import Session

from app.models.crop import Crop


class CropRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, crop: Crop) -> Crop:

        self.db.add(crop)
        self.db.commit()
        self.db.refresh(crop)

        return crop

    def get_by_id(self, crop_id: int) -> Optional[Crop]:

        return (
            self.db.query(Crop)
            .filter(Crop.id == crop_id)
            .first()
        )

    def get_by_farm(self, farm_id: int) -> List[Crop]:

        return (
            self.db.query(Crop)
            .filter(Crop.farm_id == farm_id)
            .order_by(Crop.id.desc())
            .all()
        )

    def update(self, crop: Crop) -> Crop:

        self.db.commit()
        self.db.refresh(crop)

        return crop

    def delete(self, crop: Crop) -> None:

        self.db.delete(crop)
        self.db.commit()
