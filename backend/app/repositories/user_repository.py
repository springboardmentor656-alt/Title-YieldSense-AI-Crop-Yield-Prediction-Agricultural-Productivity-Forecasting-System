from sqlalchemy.orm import Session
from sqlalchemy.orm import joinedload

from app.models.user import User


class UserRepository:

    def __init__(self, db: Session):
        self.db = db

    def get_by_email(self, email: str):

        return (
            self.db.query(User)
            .options(joinedload(User.role))
            .filter(User.email == email)
            .first()
        )

    def get_by_id(self, user_id: int):

        return (
            self.db.query(User)
            .options(joinedload(User.role))
            .filter(User.id == user_id)
            .first()
        )

    def create(self, user: User):

        self.db.add(user)
        self.db.commit()
        self.db.refresh(user)

        return user
    def get_all(self):

        return (
            self.db.query(User)
            .options(joinedload(User.role))
            .all()
        )

    def update(self):

        self.db.commit()

    def delete(self, user: User):

        self.db.delete(user)
        self.db.commit()