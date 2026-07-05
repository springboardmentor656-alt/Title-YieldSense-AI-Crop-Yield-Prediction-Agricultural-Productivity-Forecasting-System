from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.auth import router


app = FastAPI(
    title="YieldSense AI",
    description="Crop Yield Prediction System",
    version="1.0"
)


app.add_middleware(
    CORSMiddleware,

    allow_origins=[
        "http://localhost:3000"
    ],

    allow_credentials=True,

    allow_methods=["*"],

    allow_headers=["*"],
)


app.include_router(router)


@app.get("/")
def home():

    return {

        "message":
        "Welcome to YieldSense AI",

        "status":
        "Backend running successfully"

    }



@app.get("/health")
def health():

    return {
        "status":"OK"
    }