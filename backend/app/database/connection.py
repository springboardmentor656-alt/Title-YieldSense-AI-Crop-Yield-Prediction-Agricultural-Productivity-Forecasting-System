from sqlalchemy import create_engine

from app.config.settings import settings

DATABASE_URL = (
    f"postgresql://{settings.DB_USER}:{settings.DB_PASSWORD}"
    f"@{settings.DB_HOST}:{settings.DB_PORT}/{settings.DB_NAME}"
)

engine = create_engine(
    DATABASE_URL,
    echo=settings.DEBUG,
    future=True,
    pool_pre_ping=True
)