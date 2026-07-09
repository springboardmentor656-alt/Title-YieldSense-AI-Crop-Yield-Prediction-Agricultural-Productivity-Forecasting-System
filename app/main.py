from fastapi import FastAPI
from app.routers.health import router as health_router
from app.core.config import settings
from app.database.base import Base
from app.database.session import engine
from app.models import Crop
from app.routers.crop import router as crop_router
from fastapi.middleware.cors import CORSMiddleware
from app.routers.predict import router as predict_router
from app.routers.auth import router as auth_router

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.include_router(health_router)

app.include_router(crop_router)

app.include_router(predict_router)

app.include_router(auth_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to YieldSense AI Backend!"
    }
