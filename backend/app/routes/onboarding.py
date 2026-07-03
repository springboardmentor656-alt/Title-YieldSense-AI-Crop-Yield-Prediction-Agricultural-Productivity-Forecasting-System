"""
Onboarding route: single-step account + farm profile creation.
File: backend/app/routes/onboarding.py
"""

from fastapi import APIRouter

from app.schemas.onboarding import OnboardingRequest, OnboardingResponse
from app.services.onboarding_service import submit_onboarding

router = APIRouter()


@router.post("/", response_model=OnboardingResponse, status_code=201)
def onboard(payload: OnboardingRequest):
    """Create the user's account and farm profile, and return a JWT — used by the onboarding wizard's final step."""
    return submit_onboarding(payload)