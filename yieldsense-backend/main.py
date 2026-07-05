from fastapi import FastAPI
from routes.auth import router as auth_router

app = FastAPI(title="YieldSense AI Core")

app.include_router(auth_router)


@app.get("/")
def home():
    return {
        "message": "Welcome to YieldSense AI Backend!"
    }


@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "YieldSense Engine Core"
    }