from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import joblib
import pandas as pd


from backend.database import SessionLocal, engine, Base
from backend.models import User
from backend.schemas import UserCreate, UserLogin, PredictionInput
from backend.auth import hash_password, verify_password, create_access_token

Base.metadata.create_all(bind=engine)

app = FastAPI()
model = joblib.load("models/crop_yield_model.pkl")


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
def home():
    return {"message": "YieldSense AI Running Successfully"}


@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(User.email == user.email).first()

    if existing_user:
        raise HTTPException(status_code=400, detail="Email already exists")

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered successfully"}


@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(User).filter(User.email == user.email).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    token = create_access_token(
        {"sub": db_user.email, "role": db_user.role}
    )

    return {
        "access_token": token,
        "token_type": "bearer"
    }
@app.post("/api/v1/predict-yield")
def predict_yield(data: PredictionInput):

    weather_status = (
        "Optimal"
        if 20 <= data.avg_temp <= 30
        else "Stress Detected"
    )



    input_data = pd.DataFrame({
        "average_rain_fall_mm_per_year": [data.average_rain_fall_mm_per_year],
        "pesticides_tonnes": [data.pesticides_tonnes],
        "avg_temp": [data.avg_temp]
    })
    print(input_data.columns)
    prediction = model.predict(input_data)

    return {
        "estimated_yield": float(prediction[0]),
        "weather_status": weather_status,

    }