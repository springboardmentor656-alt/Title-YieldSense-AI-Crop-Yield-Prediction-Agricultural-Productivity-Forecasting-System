from fastapi import Depends
from fastapi import HTTPException

from app.auth.oauth2 import verify_token


def admin_required(
    user=Depends(verify_token)
):
    if user["role"] != "Administrator":
        raise HTTPException(
            status_code=403,
            detail="Administrator Permission Required"
        )

    return user


def farmer_required(
    user=Depends(verify_token)
):
    if user["role"] not in ["Farmer", "Administrator"]:
        raise HTTPException(
            status_code=403,
            detail="Permission Denied"
        )

    return user


def require_roles(*allowed_roles):

    def role_checker(
        user=Depends(verify_token)
    ):

        if user["role"] not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail="Permission Denied"
            )

        return user

    return role_checker