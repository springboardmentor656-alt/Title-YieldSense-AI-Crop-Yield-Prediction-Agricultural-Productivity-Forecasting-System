from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.session import get_db
from app.models import Crop
from app.schemas import CropCreate, CropResponse

router = APIRouter(
    prefix="/crops",
    tags=["Crops"]
)

@router.post("/", response_model=CropResponse)
def create_crop(crop: CropCreate, db: Session = Depends(get_db)):
    new_crop = Crop(
        name=crop.name,
        season=crop.season
    )

    db.add(new_crop)
    db.commit()
    db.refresh(new_crop)

    return new_crop

@router.get("/", response_model=list[CropResponse])
def get_all_crops(db: Session = Depends(get_db)):
    crops = db.query(Crop).all()
    return crops

@router.get("/{crop_id}", response_model=CropResponse)
def get_crop(crop_id: int, db: Session = Depends(get_db)):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()

    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")

    return crop

@router.put("/{crop_id}", response_model=CropResponse)
def update_crop(
    crop_id: int,
    crop: CropCreate,
    db: Session = Depends(get_db)
):
    existing_crop = db.query(Crop).filter(Crop.id == crop_id).first()

    if not existing_crop:
        raise HTTPException(status_code=404, detail="Crop not found")

    existing_crop.name = crop.name
    existing_crop.season = crop.season

    db.commit()
    db.refresh(existing_crop)

    return existing_crop

@router.delete("/{crop_id}")
def delete_crop(
    crop_id: int,
    db: Session = Depends(get_db)
):
    crop = db.query(Crop).filter(Crop.id == crop_id).first()

    if not crop:
        raise HTTPException(status_code=404, detail="Crop not found")

    db.delete(crop)
    db.commit()

    return {"message": "Crop deleted successfully"}
