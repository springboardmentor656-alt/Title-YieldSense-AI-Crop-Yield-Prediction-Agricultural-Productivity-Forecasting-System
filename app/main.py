from fastapi import FastAPI
from app.routers.health import router as health_router
from app.core.config import settings
from app.database.base import Base
from app.database.session import engine
from app.models import Crop
from app.routers.crop import router as crop_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION
)

Base.metadata.create_all(bind=engine)

app.include_router(health_router)

app.include_router(crop_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to YieldSense AI Backend!"
    }
