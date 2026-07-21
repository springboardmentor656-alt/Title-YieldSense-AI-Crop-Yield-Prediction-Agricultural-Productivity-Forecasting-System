from typing import Optional

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

    # --- data.gov.in (Government Open Data - agriculture datasets) ---
    # Free API key: https://www.data.gov.in/user/register then https://www.data.gov.in/user/myaccount (My API Keys)
    DATA_GOV_IN_API_KEY: Optional[str] = None

    # The resource_id identifies a specific dataset on data.gov.in (e.g. a
    # particular "Variety-wise Daily Market Prices of Commodities" dataset).
    # These ids are dataset-specific and change per catalog entry, so a real
    # one is NOT hardcoded here to avoid guessing incorrectly. Look up the
    # desired dataset on https://www.data.gov.in/ (open it and copy the
    # resource_id from its API section) and set it in .env.
    DATA_GOV_IN_RESOURCE_ID: str = "REPLACE_WITH_RESOURCE_ID_FROM_DATA_GOV_IN"

    # --- Email delivery (SMTP) ---
    SMTP_HOST: Optional[str] = None

    SMTP_PORT: int = 587

    SMTP_USER: Optional[str] = None

    SMTP_PASSWORD: Optional[str] = None

    SMTP_FROM_EMAIL: Optional[str] = None

    # --- SMS delivery (Twilio) ---
    TWILIO_ACCOUNT_SID: Optional[str] = None

    TWILIO_AUTH_TOKEN: Optional[str] = None

    TWILIO_FROM_NUMBER: Optional[str] = None

    class Config:
        env_file = ".env"


settings = Settings()