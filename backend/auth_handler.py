from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta


# JWT Configuration
SECRET_KEY = "yieldsense_secret_key"
ALGORITHM = "HS256"


# Password hashing
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


# Convert normal password → hashed password
def hash_password(password: str):
    return pwd_context.hash(password)


# Check login password with database password
def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(
        plain_password,
        hashed_password
    )


# Generate JWT token after login
def create_token(data: dict):

    user_data = data.copy()

    expire_time = datetime.utcnow() + timedelta(hours=2)

    user_data.update(
        {
            "exp": expire_time
        }
    )


    token = jwt.encode(
        user_data,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return token