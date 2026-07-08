from jose import JWTError
from jose import jwt

from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import OAuth2PasswordBearer

from app.config.settings import settings

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/v1/auth/token"
)


def verify_token(
    token: str = Depends(oauth2_scheme)
):

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        return payload

    except JWTError:

        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )