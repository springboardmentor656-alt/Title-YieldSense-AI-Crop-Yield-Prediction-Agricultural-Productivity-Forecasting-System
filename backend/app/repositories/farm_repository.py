from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload
from app.models.farm import Farm


class FarmRepository:

    def __init__(self, db: Session):
        self.db = db

    def create(self, farm: Farm):

        self.db.add(farm)
        self.db.commit()
        self.db.refresh(farm)

        return farm

    def get_all(self):

        return self.db.query(Farm).all()

    def get_by_id(self, farm_id: int):

        return (
            self.db.query(Farm)
            .filter(Farm.id == farm_id)
            .first()
        )

    def get_user_farms(self, user_id):

     return (

        self.db.query(Farm)

        .options(

            joinedload(Farm.crops)

        )

        .filter(

            Farm.user_id == user_id

        )

        .all()

    )

    def delete(self, farm: Farm):

        self.db.delete(farm)
        self.db.commit()
    def update(self, farm):

        self.db.commit()

        self.db.refresh(farm)

        return farm

    def belongs_to_user(
        self,
        farm_id: int,
        user_id: int
    ):

        return (

            self.db.query(Farm)

            .filter(

                Farm.id == farm_id,

                Farm.user_id == user_id

            )

            .first()

        )    