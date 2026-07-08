from datetime import datetime, timedelta

from jose import jwt

from passlib.context import CryptContext

from app.config.settings import settings

pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


class SecurityManager:

    @staticmethod
    def hash_password(password: str):

        return pwd_context.hash(password)

    @staticmethod
    def verify_password(password, hashed):

        return pwd_context.verify(password, hashed)

    @staticmethod
    def create_token(data: dict):

        payload = data.copy()

        payload["exp"] = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

        return jwt.encode(
            payload,
            settings.SECRET_KEY,
            algorithm=settings.ALGORITHM
        )