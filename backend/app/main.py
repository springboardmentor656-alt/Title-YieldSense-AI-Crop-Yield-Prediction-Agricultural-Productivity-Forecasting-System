from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.router import api_router
from app.config.settings import settings
from app.middleware.request_logger import RequestLoggerMiddleware
from contextlib import asynccontextmanager

from app.core.events import startup, shutdown
from app.core.error_handler import global_exception_handler
from app.database.base import Base
from app.database.connection import engine

@asynccontextmanager
async def lifespan(app):

    startup()

    yield

    shutdown()
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI Powered Crop Yield Prediction Platform",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)
Base.metadata.create_all(bind=engine)
# ----------------------------
# CORS Configuration
# ----------------------------

app.add_middleware(
    CORSMiddleware,
   allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RequestLoggerMiddleware)
# ----------------------------
# Include API Routes
# ----------------------------

app.include_router(api_router)

# ----------------------------
# Root Endpoint
# ----------------------------

@app.get("/", tags=["Root"])
async def root():
    return {
        "application": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "Running"
    }
app.add_exception_handler(
    Exception,
    global_exception_handler
)



