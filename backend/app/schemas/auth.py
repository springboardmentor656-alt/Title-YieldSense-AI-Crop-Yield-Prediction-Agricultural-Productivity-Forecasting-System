from typing import Optional

from pydantic import BaseModel
from pydantic import EmailStr


class RegisterRequest(BaseModel):

    full_name: str

    email: EmailStr

    password: str

    role: str = "Farmer"


class LoginRequest(BaseModel):

    email: EmailStr

    password: str


class TokenResponse(BaseModel):

    access_token: str

    token_type: str


class UpdateProfileRequest(BaseModel):

    full_name: Optional[str] = None

    email: Optional[EmailStr] = None


class ChangePasswordRequest(BaseModel):

    current_password: str

    new_password: str