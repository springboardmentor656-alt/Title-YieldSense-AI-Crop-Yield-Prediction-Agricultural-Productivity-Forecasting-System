from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from app.schemas.farm import FarmUpdate
from app.auth.oauth2 import verify_token
from app.database.session import get_db
from app.schemas.farm import FarmCreate
from app.schemas.farm import FarmResponse
from app.services.farm_service import FarmService
from app.schemas.farm import FarmDashboardResponse

router = APIRouter(
    prefix="/farms",
    tags=["Farms"]
)


@router.post(
    "/",
    response_model=FarmResponse
)
def create_farm(
    request: FarmCreate,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = FarmService(db)

    return service.create_farm(
        int(token["sub"]),
        request
    )


@router.get(
    "/",
    response_model=list[FarmDashboardResponse]
)
def get_my_farms(
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = FarmService(db)

    return service.get_user_farms(
        int(token["sub"])
    )


@router.get(
    "/{farm_id}",
    response_model=FarmResponse
)
@router.get(
    "/{farm_id}",
    response_model=FarmResponse
)
def get_farm(
    farm_id: int,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):
    service = FarmService(db)

    return service.get_farm(
        farm_id,
        token
    )



@router.delete("/{farm_id}")
def delete_farm(

    farm_id: int,

    token=Depends(verify_token),

    db: Session = Depends(get_db)

):

    service = FarmService(db)

    return service.delete(

        farm_id,

        token

    )

    service = FarmService(db)

    return service.delete(farm_id)


@router.put(

    "/{farm_id}",

    response_model=FarmResponse

)
def update_farm(

    farm_id: int,

    request: FarmUpdate,

    token=Depends(verify_token),

    db: Session = Depends(get_db)

):

    service = FarmService(db)

    return service.update_farm(

        farm_id,

        token,

        request

    )