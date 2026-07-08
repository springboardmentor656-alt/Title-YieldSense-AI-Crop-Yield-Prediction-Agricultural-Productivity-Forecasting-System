from pydantic import BaseModel
from pydantic import EmailStr


class UserResponse(BaseModel):

    id: int

    full_name: str

    email: EmailStr

    role: str

    is_active: bool

    class Config:
        from_attributes = True