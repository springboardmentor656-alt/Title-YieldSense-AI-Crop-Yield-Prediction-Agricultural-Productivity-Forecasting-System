from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.auth.hashing import Hash
from app.auth.jwt import create_access_token
from app.models.user import User
from app.repositories.role_repository import RoleRepository
from app.repositories.user_repository import UserRepository


class AuthService:

    def __init__(self, db: Session):

        self.user_repo = UserRepository(db)
        self.role_repo = RoleRepository(db)

    def register(
        self,
        full_name: str,
        email: str,
        password: str,
        role_name: str = "Farmer"
    ):

        if self.user_repo.get_by_email(email):

            raise HTTPException(
                status_code=400,
                detail="Email already exists"
            )

        role = self.role_repo.get_by_name(role_name)

        if role is None:

            raise HTTPException(
                status_code=404,
                detail="Role not found"
            )

        new_user = User(
            full_name=full_name,
            email=email,
            password=Hash.hash_password(password),
            role_id=role.id,
        )

        return self.user_repo.create(new_user)

    def login(
        self,
        email: str,
        password: str
    ):

        user = self.user_repo.get_by_email(email)

        if user is None:

            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        if not Hash.verify_password(
            password,
            user.password
        ):

            raise HTTPException(
                status_code=401,
                detail="Invalid Credentials"
            )

        token = create_access_token(
            {
                "sub": str(user.id),
                "role_id": user.role.id,
                "role": user.role.name,
                "email": user.email,
            }
        )

        return token

    def get_me(self, user_id: int) -> User:

        user = self.user_repo.get_by_id(user_id)

        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        return user

    def update_profile(
        self,
        user_id: int,
        full_name: str = None,
        email: str = None
    ) -> User:

        user = self.user_repo.get_by_id(user_id)

        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        if email is not None and email != user.email:

            existing = self.user_repo.get_by_email(email)
            if existing is not None:
                raise HTTPException(status_code=400, detail="Email already exists")

            user.email = email

        if full_name is not None:
            user.full_name = full_name

        self.user_repo.update()

        return user

    def change_password(
        self,
        user_id: int,
        current_password: str,
        new_password: str
    ) -> None:

        user = self.user_repo.get_by_id(user_id)

        if user is None:
            raise HTTPException(status_code=404, detail="User not found")

        if not Hash.verify_password(current_password, user.password):
            raise HTTPException(status_code=401, detail="Current password is incorrect")

        user.password = Hash.hash_password(new_password)

        self.user_repo.update()
