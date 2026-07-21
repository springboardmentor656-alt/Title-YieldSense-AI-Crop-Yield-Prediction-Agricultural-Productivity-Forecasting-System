from fastapi import HTTPException

from app.models.farm import Farm
from app.repositories.farm_repository import FarmRepository


class FarmService:

    def __init__(self, db):

        self.repo = FarmRepository(db)

    def create_farm(
        self,
        user_id,
        request
    ):

        farm = Farm(
            farm_name=request.farm_name,
            latitude=request.latitude,
            longitude=request.longitude,
            area=request.area,
            user_id=user_id
        )

        return self.repo.create(farm)

    def get_all(self):

        return self.repo.get_all()

    def get_user_farms(self, user_id):

     farms = self.repo.get_user_farms(user_id)

     response = []

     for farm in farms:

        crop_name = (

            farm.crops[0].crop_name

            if farm.crops

            else None

        )

        prediction = None

        if farm.crops:

            if farm.crops[0].predictions:

                prediction = (

                    farm.crops[0]

                    .predictions[0]

                    .predicted_yield

                )

        response.append({

            "id": farm.id,

            "farm_name": farm.farm_name,

            "latitude": farm.latitude,

            "longitude": farm.longitude,

            "area": farm.area,

            "crop_name": crop_name,

            "prediction": prediction,

        })

     return response

    def get_farm(

     self,

     farm_id,

     user

):

     if user["role"]=="Administrator":

        farm=self.repo.get_by_id(farm_id)

     else:

        farm=self.repo.belongs_to_user(

            farm_id,

            int(user["sub"])

        )

     if farm is None:

        raise HTTPException(

            status_code=404,

            detail="Farm not found"

        )

     return farm

    def delete(

     self,

     farm_id,

     user

    ):

     if user["role"]=="Administrator":

        farm=self.repo.get_by_id(farm_id)

     else:

        farm=self.repo.belongs_to_user(

            farm_id,

            int(user["sub"])

        )

     if farm is None:

        raise HTTPException(

            status_code=404,

            detail="Farm not found"

        )

     self.repo.delete(farm)

     return{

        "message":"Farm deleted"

    }
    def update_farm(

       self,

       farm_id,

       user,
 
       request

     ):

     if user["role"] == "Administrator":

        farm = self.repo.get_by_id(farm_id)

     else:

        farm = self.repo.belongs_to_user(

            farm_id,

            int(user["sub"])

        )

     if farm is None:

        raise HTTPException(

            status_code=404,

            detail="Farm not found"

        )

     if request.farm_name is not None:

        farm.farm_name = request.farm_name

     if request.latitude is not None:

        farm.latitude = request.latitude

     if request.longitude is not None:

        farm.longitude = request.longitude

     if request.area is not None:

        farm.area = request.area

     return self.repo.update(farm)