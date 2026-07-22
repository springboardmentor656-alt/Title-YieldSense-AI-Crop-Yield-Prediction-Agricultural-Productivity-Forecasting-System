from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine

# Import Models
from models.user import User
from models.prediction import Prediction
from models.farm import Farm

# Import Routes
from routes import auth
from routes import prediction
from routes import weather
from routes import soil
from routes import history
from routes import farm

# Create Database Tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="YieldSense AI Backend",
    version="2.0.0"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Home Route
@app.get("/")
def home():
    return {
        "message": "Welcome to YieldSense AI Backend!",
        "status": "Running",
        "version": "2.0.0"
    }

# Include Routers
app.include_router(auth.router)
app.include_router(prediction.router)
app.include_router(weather.router)
app.include_router(soil.router)
app.include_router(history.router)
app.include_router(farm.router)