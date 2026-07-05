from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import engine
from app import models
from app.routers import auth, users, farms, data_collection

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.APP_NAME,
    description="AI-powered Crop Yield Prediction & Agricultural Productivity Forecasting System",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(farms.router)
app.include_router(data_collection.router)

@app.get("/api/v1/health")
def health_check():
    return {
        "status": "healthy",
        "service": "YieldSense Engine Core",
        "version": "1.0.0"
    }