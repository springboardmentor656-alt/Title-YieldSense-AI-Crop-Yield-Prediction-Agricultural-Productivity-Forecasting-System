from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {"message": "YieldSense AI Running Successfully"}