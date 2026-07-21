from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.auth.oauth2 import verify_token
from app.database.session import get_db
from app.schemas.crop import CropCreate, CropResponse, CropUpdate
from app.services.crop_service import CropService

router = APIRouter(
    prefix="/crops",
    tags=["Crops"]
)


@router.post(
    "/",
    response_model=CropResponse
)
def create_crop(
    request: CropCreate,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = CropService(db)

    return service.create_crop(token, request)


@router.get(
    "/farm/{farm_id}",
    response_model=list[CropResponse]
)
def get_farm_crops(
    farm_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = CropService(db)

    return service.list_for_farm(farm_id, token)


@router.put(
    "/{crop_id}",
    response_model=CropResponse
)
def update_crop(
    crop_id: int,
    request: CropUpdate,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = CropService(db)

    return service.update_crop(crop_id, token, request)


@router.delete("/{crop_id}")
def delete_crop(
    crop_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = CropService(db)

    service.delete_crop(crop_id, token)

    return {"message": "Crop deleted"}
