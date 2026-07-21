from fastapi import APIRouter
from fastapi import Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.auth import LoginRequest
from app.schemas.auth import RegisterRequest
from app.schemas.auth import TokenResponse
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