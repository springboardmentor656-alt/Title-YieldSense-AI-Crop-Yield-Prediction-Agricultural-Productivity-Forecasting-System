from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
# ...rest of your existing imports and code stay exactly as they are
"""
YieldSense AI — Backend Entry Point
File: backend/main.py

Boots the FastAPI application, registers routers, and configures
CORS for the Next.js frontend during local development.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import auth, onboarding, predictions

app = FastAPI(
    title="YieldSense AI API",
    description="Crop Yield Prediction & Agricultural Productivity Forecasting System",
    version="0.1.0",
)

# --- CORS ---------------------------------------------------------------
# Frontend runs on localhost:3000 (Next.js dev server) by default.
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers --------------------------------------------------------------
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(onboarding.router, prefix="/api/v1/onboarding", tags=["Onboarding"])
app.include_router(predictions.router, tags=["Predictions"])


@app.get("/health", tags=["System"])
def health_check():
    """Simple liveness probe used for local dev checks and future container healthchecks."""
    return {"status": "ok", "service": "yieldsense-api", "version": "0.1.0"}


@app.get("/", tags=["System"])
def root():
    return {"message": "Welcome to YieldSense AI API. See /docs for interactive API documentation."}