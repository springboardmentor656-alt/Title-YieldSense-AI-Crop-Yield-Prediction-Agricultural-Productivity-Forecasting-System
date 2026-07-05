from fastapi import APIRouter
from pydantic import BaseModel
from auth_handler import hash_password


router = APIRouter()


class User(BaseModel):
    email: str
    password: str


@router.post("/register")
def register(user: User):

    hashed_password = hash_password(user.password)

    return {
        "message": "Farmer registered successfully",
        "email": user.email
    }


@router.post("/login")
def login(user: User):

    return {
        "message": "Login successful",
        "token": "sample-jwt-token"
    }