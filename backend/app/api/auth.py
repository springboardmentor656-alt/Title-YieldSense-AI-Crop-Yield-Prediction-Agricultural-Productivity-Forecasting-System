from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from app.auth.oauth2 import verify_token
from app.database.session import get_db
from app.schemas.auth import (
    ChangePasswordRequest,
    LoginRequest,
    RegisterRequest,
    TokenResponse,
    UpdateProfileRequest,
)
from app.schemas.user import UserResponse
from app.services.auth_service import AuthService
from fastapi.security import OAuth2PasswordRequestForm


router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post(
    "/register",
    response_model=UserResponse
)
def register(
    request: RegisterRequest,
    db: Session = Depends(get_db)
):

    service = AuthService(db)

    return service.register(
        full_name=request.full_name,
        email=request.email,
        password=request.password,
        role_name=request.role
    )


@router.post(
    "/login",
    response_model=TokenResponse
)
def login(
    request: LoginRequest,
    db: Session = Depends(get_db)
):

    service = AuthService(db)

    token = service.login(
        request.email,
        request.password
    )

    return {
        "access_token": token,
        "token_type": "Bearer"
    }
@router.post(
    "/token",
    response_model=TokenResponse
)
def swagger_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    service = AuthService(db)

    token = service.login(
        form_data.username,
        form_data.password
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }


@router.get(
    "/me",
    response_model=UserResponse
)
def get_me(
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = AuthService(db)

    return service.get_me(int(token["sub"]))


@router.put(
    "/me",
    response_model=UserResponse
)
def update_me(
    request: UpdateProfileRequest,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = AuthService(db)

    return service.update_profile(
        int(token["sub"]),
        full_name=request.full_name,
        email=request.email,
    )


@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    token=Depends(verify_token),
    db: Session = Depends(get_db)
):

    service = AuthService(db)
    service.change_password(
        int(token["sub"]),
        request.current_password,
        request.new_password,
    )

    return {"message": "Password updated successfully"}