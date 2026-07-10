from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models.farm import Farm
from app.schemas.farm import FarmCreate, FarmResponse

router = APIRouter(
    prefix="/farms",
    tags=["Farms"],
)


@router.post("/", response_model=FarmResponse)
def create_farm(
    farm: FarmCreate,
    db: Session = Depends(get_db),
):
    try:

        new_farm = Farm(
            farm_name=farm.farm_name,
            location=farm.location,
            latitude=farm.latitude,
            longitude=farm.longitude,
            ph=farm.ph,
            nitrogen=farm.nitrogen,
            phosphorus=farm.phosphorus,
            potassium=farm.potassium,
            rainfall=farm.rainfall,
            humidity=farm.humidity,
            temperature=farm.temperature,
        )

        db.add(new_farm)
        db.commit()
        db.refresh(new_farm)

        return new_farm

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )