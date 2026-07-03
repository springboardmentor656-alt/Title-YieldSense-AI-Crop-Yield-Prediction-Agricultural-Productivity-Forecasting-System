"""
Authentication service layer: registration and login business logic.
File: backend/app/services/jwt_service.py

NOTE: This Milestone-1 version uses an in-memory store as a stand-in so the
API is runnable and testable before the SQLAlchemy session/DB wiring
(Alembic migrations) is finalized. Swap `_FAKE_USER_DB` for a real
SQLAlchemy session-backed repository in Milestone-2 without changing the
public function signatures below.
"""

from datetime import timedelta
from typing import Optional
from uuid import uuid4

from fastapi import HTTPException, status

from app.core.security import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
    create_access_token,
    hash_password,
    verify_password,
)
from app.schemas.auth import RegisterRequest, TokenResponse

# --- Temporary in-memory store (replace with DB repository in Milestone-2) ---
# Shared by both auth.py (standalone register/login) and onboarding_service.py
# (combined onboarding), so a user created via either path is visible to both.
_FAKE_USER_DB: dict[str, dict] = {}


def register_user(payload: RegisterRequest) -> dict:
    """Create a new user, hashing the password before storage."""
    if payload.email in _FAKE_USER_DB:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user_record = {
        "user_id": str(uuid4()),
        "full_name": payload.full_name,
        "email": payload.email,
        "hashed_password": hash_password(payload.password),
        "role": payload.role,
    }
    _FAKE_USER_DB[payload.email] = user_record
    return user_record


def authenticate_user(email: str, password: str) -> Optional[dict]:
    """Validate credentials; return the user record if valid, else None."""
    user_record = _FAKE_USER_DB.get(email)
    if not user_record:
        return None
    if not verify_password(password, user_record["hashed_password"]):
        return None
    return user_record


def login_user(email: str, password: str) -> TokenResponse:
    """Authenticate and issue a JWT access token."""
    user_record = authenticate_user(email, password)
    if not user_record:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
        )

    token = create_access_token(
        data={"sub": user_record["user_id"], "role": user_record["role"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return TokenResponse(
        access_token=token,
        role=user_record["role"],
        expires_in_minutes=ACCESS_TOKEN_EXPIRE_MINUTES,
    )