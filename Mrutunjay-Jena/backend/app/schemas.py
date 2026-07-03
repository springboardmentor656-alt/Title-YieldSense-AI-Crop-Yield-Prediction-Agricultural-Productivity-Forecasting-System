from datetime import datetime
from typing import Optional
from pydantic import BaseModel, EmailStr, Field

# ── Auth ──────────────────────────────────────────
class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: Optional[str] = "Farmer"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    role: str
    created_at: datetime
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut

# ── Farms ─────────────────────────────────────────
class FarmCreate(BaseModel):
    farm_name: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    soil_ph: Optional[float] = None
    area_hectares: Optional[float] = None
    soil_type: Optional[str] = None
    location: Optional[str] = None

class FarmOut(BaseModel):
    id: int
    farm_name: str
    latitude: Optional[float]
    longitude: Optional[float]
    soil_ph: Optional[float]
    area_hectares: Optional[float]
    soil_type: Optional[str]
    location: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

# ── Crops ─────────────────────────────────────────
class CropCreate(BaseModel):
    crop_name: str
    hectares_planted: Optional[float] = None
    season: Optional[str] = None
    year: Optional[int] = None

class CropOut(BaseModel):
    id: int
    crop_name: str
    hectares_planted: Optional[float]
    season: Optional[str]
    year: Optional[int]
    created_at: datetime
    class Config:
        from_attributes = True

# ── Predictions ────────────────────────────────────
class PredictionRequest(BaseModel):
    farm_id: int
    crop_type: str
    rainfall_mm: float
    temperature_c: float
    humidity_percent: float
    soil_ph: float
    nitrogen: float
    phosphorus: float
    potassium: float

class PredictionOut(BaseModel):
    id: int
    crop_type: str
    predicted_yield_tons_per_ha: float
    confidence_score: float
    risk_level: str
    created_at: datetime
    class Config:
        from_attributes = True

# ── Notifications ──────────────────────────────────
class NotificationOut(BaseModel):
    id: int
    title: str
    message: str
    is_read: bool
    created_at: datetime
    class Config:
        from_attributes = True