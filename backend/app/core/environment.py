import os
from dotenv import load_dotenv

load_dotenv()  # Load the .env file

REQUIRED_ENV = [
    "DB_HOST",
    "DB_NAME",
    "DB_USER",
    "DB_PASSWORD",
    "SECRET_KEY"
]


def validate_environment():

    missing = []

    for env in REQUIRED_ENV:
        if os.getenv(env) is None:
            missing.append(env)

    if missing:
        raise RuntimeError(
            f"Missing Environment Variables: {missing}"
        )