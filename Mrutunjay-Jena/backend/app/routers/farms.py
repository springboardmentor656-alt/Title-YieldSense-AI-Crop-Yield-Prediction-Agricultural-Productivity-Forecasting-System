from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.database import get_db
from app import models, schemas
from app.core.deps import get_current_user

router = APIRouter(prefix="/api/v1/farms", tags=["Farms"])

@router.post("/", response_model=schemas.FarmOut)
def create_farm(
    farm_data: schemas.FarmCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    farm = models.Farm(**farm_data.model_dump(), user_id=current_user.id)
    db.add(farm)
    db.commit()
    db.refresh(farm)
    return farm

@router.get("/", response_model=List[schemas.FarmOut])
def get_my_farms(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return db.query(models.Farm).filter(models.Farm.user_id == current_user.id).all()

@router.get("/{farm_id}", response_model=schemas.FarmOut)
def get_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    farm = db.query(models.Farm).filter(
        models.Farm.id == farm_id,
        models.Farm.user_id == current_user.id
    ).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    return farm

@router.delete("/{farm_id}")
def delete_farm(
    farm_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    farm = db.query(models.Farm).filter(
        models.Farm.id == farm_id,
        models.Farm.user_id == current_user.id
    ).first()
    if not farm:
        raise HTTPException(status_code=404, detail="Farm not found")
    db.delete(farm)
    db.commit()
    return {"message": "Farm deleted successfully"}