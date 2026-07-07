from fastapi import FastAPI
from app.routers.health import router as health_router
from app.core.config import settings

app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION
)

app.include_router(health_router)

@app.get("/")
def home():
    return {
        "message": "Welcome to YieldSense AI Backend!"
    }
