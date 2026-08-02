from pydantic import BaseModel
from pydantic import EmailStr
from pydantic import field_validator


class UserResponse(BaseModel):

    id: int

    full_name: str

    email: EmailStr

    role: str

    is_active: bool

    @field_validator("role", mode="before")
    @classmethod
    def extract_role_name(cls, value):
        return value.name if hasattr(value, "name") else value

    class Config:
        from_attributes = True

class UpdateRoleRequest(BaseModel):

    role: str


class UpdateStatusRequest(BaseModel):

    is_active: bool        