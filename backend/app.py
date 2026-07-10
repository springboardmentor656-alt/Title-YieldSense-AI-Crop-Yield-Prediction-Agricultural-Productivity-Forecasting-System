from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from auth import router as auth_router
from routes.farm import router as farm_router

from routes.dashboard import router as dashboard_router


app=FastAPI(
    title="YieldSense AI"
)



app.add_middleware(

    CORSMiddleware,

    allow_origins=["*"],

    allow_methods=["*"],

    allow_headers=["*"]

)



app.include_router(auth_router)

app.include_router(farm_router)
app.include_router(dashboard_router)


@app.get("/")
def home():

    return {
        "message":"YieldSense Backend Running"
    }