from pydantic_settings import BaseSettings
from app.core.environment import validate_environment

validate_environment()

class Settings(BaseSettings):

    APP_NAME: str = "YieldSense AI"

    APP_VERSION: str = "1.0.0"

    DEBUG: bool = True

    HOST: str

    PORT: int

    DB_HOST: str

    DB_PORT: int

    DB_NAME: str

    DB_USER: str

    DB_PASSWORD: str

    SECRET_KEY: str

    ALGORITHM: str

    ACCESS_TOKEN_EXPIRE_MINUTES: int

    WEATHER_API_KEY: str

    NASA_API_KEY: str

    class Config:
        env_file = ".env"


settings = Settings()