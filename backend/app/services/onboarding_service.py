"""
Onboarding service layer: creates a user account and its farm profile
in a single operation.
File: backend/app/services/onboarding_service.py

NOTE: Milestone-1 in-memory stand-in, same pattern as jwt_service.py.
Replace `_FAKE_FARM_DB` with SQLAlchemy-backed `farms`/`farm_crops`
repositories once Alembic migrations are wired in Milestone-2.
"""

from datetime import timedelta
from uuid import uuid4

from app.core.security import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token
from app.schemas.auth import RegisterRequest
from app.schemas.onboarding import OnboardingRequest, OnboardingResponse
from app.services.jwt_service import register_user

_FAKE_FARM_DB: dict[str, dict] = {}


def submit_onboarding(payload: OnboardingRequest) -> OnboardingResponse:
    """Register the user and persist their farm profile in one step, then issue a JWT."""
    register_payload = RegisterRequest(
        full_name=payload.full_name,
        email=payload.email,
        password=payload.password,
        role=payload.role,
    )
    user_record = register_user(register_payload)  # raises 409 if email already exists

    farm_id = str(uuid4())
    _FAKE_FARM_DB[farm_id] = {
        "farm_id": farm_id,
        "user_id": user_record["user_id"],
        "state": payload.state,
        "district": payload.district,
        "crops": payload.crops,
        "organization_name": payload.organization_name,
        "business_type": payload.business_type,
        "jurisdiction_level": payload.jurisdiction_level,
    }

    token = create_access_token(
        data={"sub": user_record["user_id"], "role": user_record["role"]},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )

    return OnboardingResponse(
        access_token=token,
        role=user_record["role"],
        farm_id=farm_id,
        expires_in_minutes=ACCESS_TOKEN_EXPIRE_MINUTES,
    )