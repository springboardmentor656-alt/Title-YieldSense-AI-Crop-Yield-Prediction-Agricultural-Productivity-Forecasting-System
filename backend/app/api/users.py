from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session

from app.auth.permissions import require_roles
from app.database.session import get_db
from app.schemas.user import (
    UserResponse,
    UpdateRoleRequest,
    UpdateStatusRequest,
)
from app.services.user_service import UserService

router = APIRouter(
    prefix="/users",
    tags=["Users"],
)


@router.get(
    "/",
    response_model=list[UserResponse],
)
def get_users(
    db: Session = Depends(get_db),
    user=Depends(require_roles("Administrator")),
):

    return UserService(db).get_all_users()


@router.put(
    "/{user_id}/role",
    response_model=UserResponse,
)
def update_role(
    user_id: int,
    request: UpdateRoleRequest,
    db: Session = Depends(get_db),
    user=Depends(require_roles("Administrator")),
):

    return UserService(db).update_role(
        user_id,
        request.role,
    )


@router.patch(
    "/{user_id}/status",
    response_model=UserResponse,
)
def update_status(
    user_id: int,
    request: UpdateStatusRequest,
    db: Session = Depends(get_db),
    user=Depends(require_roles("Administrator")),
):

    return UserService(db).change_status(
        user_id,
        request.is_active,
    )


@router.delete("/{user_id}")
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles("Administrator")),
):

    return UserService(db).delete_user(user_id)