from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.models.user import User, Role, EmailOTP
from datetime import datetime, timedelta
import random
from fastapi.security import OAuth2PasswordRequestForm
from app.db.database import get_db
from app.schemas.auth import RegisterRequest, UserResponse
from app.core.security import hash_password
from app.schemas.auth import (
    RegisterRequest,
    LoginRequest,
    ForgotPasswordRequest,
    ResetPasswordRequest,
    UpdateProfileRequest,
    SendOTPRequest,
    VerifyOTPRequest,
    TokenResponse,
    UserResponse,
    UserProfileResponse,
)
from app.schemas.auth import ChangePasswordRequest
from app.api.deps import get_current_user, require_role
from app.core.security import hash_password, verify_password, create_access_token
import uuid


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse)
def register_user(
    request: RegisterRequest,
    db: Session = Depends(get_db),
):
    normalized_email = request.email.strip().lower()
    normalized_phone = request.phone.strip() if request.phone else None
    normalized_role = request.role.strip().lower()

    existing_user = (
        db.query(User)
        .filter(User.email == normalized_email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Email already registered",
        )

    if normalized_phone:
        existing_phone = (
            db.query(User)
            .filter(User.phone == normalized_phone)
            .first()
        )

        if existing_phone:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Phone number already registered",
            )

    role = (
        db.query(Role)
        .filter(Role.name == normalized_role)
        .first()
    )

    if not role:
        role = Role(name=normalized_role)
        db.add(role)
        db.commit()
        db.refresh(role)

    new_user = User(
        full_name=request.full_name.strip(),
        email=normalized_email,
        phone=normalized_phone,
        hashed_password=hash_password(request.password),
        role_id=role.id,
        is_active=True,
        is_verified=False,
    )

    try:
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
    except Exception:
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to create account",
        )

    return {
        "id": new_user.id,
        "full_name": new_user.full_name,
        "email": new_user.email,
        "phone": new_user.phone,
        "role": role.name,
        "is_active": new_user.is_active,
        "is_verified": new_user.is_verified,
    }

@router.post("/login", response_model=TokenResponse)
def login_user(
    request: LoginRequest,
    db: Session = Depends(get_db),
):
    normalized_email = request.email.strip().lower()

    user = (
        db.query(User)
        .filter(User.email == normalized_email)
        .first()
    )

    if not user or not verify_password(
        request.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in",
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role.name,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }

@router.post("/token", response_model=TokenResponse)
def swagger_token_login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    normalized_email = form_data.username.strip().lower()

    user = (
        db.query(User)
        .filter(User.email == normalized_email)
        .first()
    )

    if not user or not verify_password(
        form_data.password,
        user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is inactive",
        )

    if not user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Please verify your email before logging in",
        )

    access_token = create_access_token(
        data={
            "sub": user.email,
            "role": user.role.name,
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer",
    }


@router.post("/logout")
def logout_user():
    return {
        "message": "Logout successful. Please remove token from client storage."
    }


@router.post("/forgot-password")
def forgot_password(request: ForgotPasswordRequest, db: Session = Depends(get_db)):

    user = db.query(User).filter(User.email == request.email).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User with this email not found"
        )

    reset_token = str(uuid.uuid4())[:6]

    user.reset_token = reset_token
    db.commit()

    return {
        "message": "Password reset token generated successfully",
        "reset_token": reset_token
    }
@router.post("/reset-password")
def reset_password(request: ResetPasswordRequest,
                   db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.email == request.email
    ).first()

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    if user.reset_token != request.reset_token:
        raise HTTPException(
            status_code=400,
            detail="Invalid reset token"
        )

    user.hashed_password = hash_password(request.new_password)
    user.reset_token = None

    db.commit()

    return {
        "message": "Password updated successfully"
    }

@router.get("/me", response_model=UserProfileResponse)
def get_me(current_user: User = Depends(get_current_user)):

    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role.name,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified
    }

@router.put("/profile", response_model=UserProfileResponse)
def update_profile(
    request: UpdateProfileRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    if request.full_name is not None:
        current_user.full_name = request.full_name

    if request.phone is not None:
        current_user.phone = request.phone

    db.commit()
    db.refresh(current_user)

    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "phone": current_user.phone,
        "role": current_user.role.name,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified
    }
@router.post("/send-otp")
def send_email_otp(
    request: SendOTPRequest,
    db: Session = Depends(get_db),
):
    normalized_email = request.email.strip().lower()

    user = (
        db.query(User)
        .filter(User.email == normalized_email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if user.is_verified:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already verified",
        )

    previous_otps = (
        db.query(EmailOTP)
        .filter(
            EmailOTP.email == normalized_email,
            EmailOTP.is_used.is_(False),
        )
        .all()
    )

    for previous_otp in previous_otps:
        previous_otp.is_used = True

    otp_code = f"{random.randint(0, 999999):06d}"

    new_otp = EmailOTP(
        email=normalized_email,
        otp_code=otp_code,
        is_used=False,
        created_at=datetime.utcnow(),
        expires_at=datetime.utcnow() + timedelta(minutes=10),
    )

    db.add(new_otp)
    db.commit()
    db.refresh(new_otp)

    print("GENERATED OTP:", otp_code)
    print("OTP EMAIL:", normalized_email)

    return {
        "message": "OTP generated successfully",
        "otp_code": otp_code,
    }

@router.post("/verify-otp")
def verify_email_otp(
    request: VerifyOTPRequest,
    db: Session = Depends(get_db),
):
    normalized_email = request.email.strip().lower()
    submitted_otp = str(request.otp_code).strip()

    print("VERIFY EMAIL:", normalized_email)
    print("SUBMITTED OTP:", submitted_otp)

    user = (
        db.query(User)
        .filter(User.email == normalized_email)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    latest_otp = (
        db.query(EmailOTP)
        .filter(
            EmailOTP.email == normalized_email,
            EmailOTP.is_used.is_(False),
        )
        .order_by(EmailOTP.created_at.desc())
        .first()
    )

    if not latest_otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No active OTP found. Please generate a new OTP.",
        )

    print("DATABASE OTP:", latest_otp.otp_code)

    if latest_otp.expires_at < datetime.utcnow():
        latest_otp.is_used = True
        db.commit()

        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="OTP expired. Please generate a new OTP.",
        )

    if str(latest_otp.otp_code).strip() != submitted_otp:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect OTP. Enter the latest generated OTP.",
        )

    latest_otp.is_used = True
    user.is_verified = True

    db.commit()
    db.refresh(user)

    return {
        "message": "Email verified successfully"
    }

@router.post("/change-password")
def change_password(
    request: ChangePasswordRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if not verify_password(
        request.old_password,
        current_user.hashed_password,
    ):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Old password is incorrect",
        )

    current_user.hashed_password = hash_password(
        request.new_password
    )

    db.commit()

    return {
        "message": "Password changed successfully"
    }

@router.get("/admin-only")
def admin_only(
    current_user: User = Depends(require_role("admin"))
):
    return {
        "message": "Welcome Admin. You have access to this protected route."
    }


@router.get("/farmer-only")
def farmer_only(
    current_user: User = Depends(require_role("farmer"))
):
    return {
        "message": "Welcome Farmer. You have access to this protected route."
    }