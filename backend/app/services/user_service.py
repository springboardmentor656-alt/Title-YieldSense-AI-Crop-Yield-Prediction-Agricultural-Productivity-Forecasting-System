from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.repositories.user_repository import UserRepository
from app.repositories.role_repository import RoleRepository


class UserService:

    def __init__(self, db: Session):

        self.user_repo = UserRepository(db)
        self.role_repo = RoleRepository(db)

    def get_all_users(self):

        return self.user_repo.get_all()

    def update_role(
        self,
        user_id: int,
        role_name: str
    ):

        user = self.user_repo.get_by_id(user_id)

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        role = self.role_repo.get_by_name(role_name)

        if role is None:
            raise HTTPException(
                status_code=404,
                detail="Role not found"
            )

        user.role_id = role.id

        self.user_repo.update()

        return user

    def change_status(
        self,
        user_id: int,
        is_active: bool
    ):

        user = self.user_repo.get_by_id(user_id)

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        user.is_active = is_active

        self.user_repo.update()

        return user

    def delete_user(
        self,
        user_id: int
    ):

        user = self.user_repo.get_by_id(user_id)

        if user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )

        self.user_repo.delete(user)

        return {
            "message": "User deleted successfully"
        }