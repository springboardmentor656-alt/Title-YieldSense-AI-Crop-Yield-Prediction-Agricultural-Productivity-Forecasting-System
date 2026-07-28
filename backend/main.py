from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import joblib
import pandas as pd

from backend.database import SessionLocal, engine, Base
from backend.models import User, Prediction
from backend.schemas import (
    UserCreate,
    UserLogin,
    PredictionInput,
    PredictionCreate
)
from backend.auth import (
    hash_password,
    verify_password,
    create_access_token,
    verify_access_token
)

# Create tables
Base.metadata.create_all(bind=engine)

# FastAPI App
app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:63342",
        "http://127.0.0.1:63342",
        "http://127.0.0.1:8000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML Model
model = joblib.load("models/crop_yield_model.pkl")
area_encoder= joblib.load("models/area_encoder.pkl")
item_encoder = joblib.load("models/item_encoder.pkl")

# Database Session
# Database Session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_current_user(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")

    payload = verify_access_token(token)

    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid Token"
        )

    return payload
# Home Route
@app.get("/")
def home():
    return {
        "message": "YieldSense AI Running Successfully"
    }


# Register
@app.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully"
    }


# Login
@app.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):

    db_user = (
        db.query(User)
        .filter(User.email == user.email)
        .first()
    )

    if not db_user:
        raise HTTPException(
            status_code=400,
            detail="Invalid credentials"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=400,
            detail="Invalid credentials"
        )

    token = create_access_token(
        {
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "name": db_user.name,
            "email": db_user.email,
            "role": db_user.role
        }
    }


# Crop Yield Prediction
@app.post("/api/v1/predict-yield")
def predict_yield(
    data: PredictionInput,
    db: Session = Depends(get_db),

    current_user: dict = Depends(get_current_user)
):
    # Weather Analysis
    weather_status = (
        "Optimal"
        if 20 <= data.avg_temp <= 30
        else "Stress Detected"
    )

    # Soil Analysis
    if 6.0 <= data.ph <= 7.5:
        soil_status = "🌱 Fertile Soil"

    elif 5.0 <= data.ph < 6.0:
        soil_status = "🟡 Moderately Fertile"

    else:
        soil_status = "🔴 Soil Needs Improvement"

    # Crop Advisory
    crop = data.crop_type.lower()

    if crop == "wheat":
        crop_message = (
            "Wheat grows best in fertile soil and moderate temperatures."
        )

    elif crop == "rice":
        crop_message = (
            "Rice requires abundant water and high rainfall."
        )

    elif crop == "maize":
        crop_message = (
            "Maize performs best under warm weather conditions."
        )

    elif crop == "cotton":
        crop_message = (
            "Cotton requires warm temperatures and well-drained soil."
        )

    elif crop == "sugarcane":
        crop_message = (
            "Sugarcane requires high rainfall and nutrient-rich soil."
        )

    elif crop == "barley":
        crop_message = (
            "Barley can tolerate cooler climates and moderate rainfall."
        )

    else:
        crop_message = (
            f"Custom crop selected: {data.crop_type}. "
            f"Monitor local weather and soil conditions carefully."
        )

    # Model Input
    # Encode Area
    area_value = area_encoder.transform([data.area])[0]

    # Encode Crop
    crop_value = item_encoder.transform([data.crop_type])[0]

    # Model Input
    input_data = pd.DataFrame({

        "Area": [
            area_value
        ],

        "Item": [
            crop_value
        ],

        "Year": [
            data.year
        ],

        "average_rain_fall_mm_per_year": [
            data.average_rain_fall_mm_per_year
        ],

        "pesticides_tonnes": [
            data.pesticides_tonnes
        ],

        "avg_temp": [
            data.avg_temp
        ]

    })

    prediction = model.predict(input_data)

    # Recommendation
    if prediction[0] < 20000:

        recommendation = (
            "Low Yield Risk. Increase irrigation and soil nutrients."
        )

        risk_level = "High Risk"

        productivity_report = (
            "Low Productivity Expected"
        )

    elif prediction[0] < 40000:

        recommendation = (
            "Moderate Yield Expected. Monitor weather conditions."
        )

        risk_level = "Medium Risk"

        productivity_report = (
            "Moderate Productivity Expected"
        )

    else:

        recommendation = (
            "High Yield Expected. Continue current farming practices."
        )

        risk_level = "Low Risk"

        productivity_report = (
            "High Productivity Expected"
        )

    prediction_record = Prediction(
        user_email=current_user["sub"], # We'll replace this with the logged-in user's email later
        crop=data.crop_type,
        rainfall=data.average_rain_fall_mm_per_year,
        pesticides=data.pesticides_tonnes,
        temperature=data.avg_temp,
        ph=data.ph,
        estimated_yield=round(float(prediction[0]), 2),
        risk=risk_level,
        recommendation=recommendation
    )

    db.add(prediction_record)
    db.commit()
    db.refresh(prediction_record)

    return {
        "estimated_yield": round(float(prediction[0]), 2),
        "weather_status": weather_status,
        "soil_status": soil_status,
        "crop_message": crop_message,
        "recommendation": recommendation,
        "risk_level": risk_level,
        "productivity_report": productivity_report
    }
@app.get("/api/v1/predictions")
def get_predictions(db: Session = Depends(get_db)):
    predictions = db.query(Prediction).order_by(Prediction.id.desc()).all()

    return [
        {
            "id": p.id,
            "user_email": p.user_email,
            "crop": p.crop,
            "rainfall": p.rainfall,
            "pesticides": p.pesticides,
            "temperature": p.temperature,
            "ph": p.ph,
            "estimated_yield": p.estimated_yield,
            "risk": p.risk,
            "recommendation": p.recommendation,
            "created_at": p.created_at,
        }
        for p in predictions
    ]
@app.get("/api/v1/dashboard-stats")
def dashboard_stats(db: Session = Depends(get_db)):

    predictions = db.query(Prediction).all()

    if len(predictions) == 0:
        return {
            "total_predictions": 0,
            "average_yield": 0,
            "best_crop": "--",
            "current_risk": "--"
        }

    total_predictions = len(predictions)

    average_yield = round(
        sum(p.estimated_yield for p in predictions) / total_predictions,
        2
    )

    crop_count = {}

    for p in predictions:

        crop_count[p.crop] = crop_count.get(p.crop, 0) + 1

    best_crop = max(
        crop_count,
        key=crop_count.get
    )

    current_risk = predictions[-1].risk

    return {
        "total_predictions": total_predictions,
        "average_yield": average_yield,
        "best_crop": best_crop,
        "current_risk": current_risk
    }