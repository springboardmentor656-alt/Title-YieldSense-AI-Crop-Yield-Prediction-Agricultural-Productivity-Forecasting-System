from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .routers import auth

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="YieldSense AI Core", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "YieldSense Engine Core"}

@app.get("/")
def read_root():
    return {"message": "Welcome to YieldSense AI API"}
