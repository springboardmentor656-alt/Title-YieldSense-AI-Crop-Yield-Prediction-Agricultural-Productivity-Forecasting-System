from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from motor.motor_asyncio import AsyncIOMotorClient
import os

# Robust database URL setup with local SQLite fallback for dev
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./yieldsense.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# MongoDB setup
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
MONGODB_DB_NAME = os.getenv("MONGODB_DB_NAME", "yieldsense_ml")
try:
    mongodb_client = AsyncIOMotorClient(MONGODB_URL, serverSelectionTimeoutMS=2000)
    mongodb = mongodb_client[MONGODB_DB_NAME]
except Exception:
    mongodb = None
