from fastapi import Depends
from fastapi import HTTPException

from app.auth.oauth2 import verify_token


def admin_required(
    user=Depends(verify_token)
):

    if user["role"] != "Admin":

        raise HTTPException(
            status_code=403,
            detail="Admin Permission Required"
        )

    return user


def farmer_required(
    user=Depends(verify_token)
):

    if user["role"] not in ["Farmer", "Admin"]:

        raise HTTPException(
            status_code=403,
            detail="Permission Denied"
        )

    return user