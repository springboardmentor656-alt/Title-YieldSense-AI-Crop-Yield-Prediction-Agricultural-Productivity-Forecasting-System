from pydantic import BaseModel, EmailStr, Field


class RegisterRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    role: str = Field(default="Farmer", pattern="^(Farmer|Admin|Agriculture Expert)$")


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


class FarmerProfileRequest(BaseModel):
    full_name: str | None = Field(default=None, max_length=100)
    phone: str | None = Field(default=None, max_length=20)
    address: str | None = None
    experience_years: int | None = Field(default=None, ge=0, le=100)


class FarmCreateRequest(BaseModel):
    farm_name: str = Field(min_length=2, max_length=100)
    latitude: float = Field(ge=-90, le=90)
    longitude: float = Field(ge=-180, le=180)
    farm_size: float = Field(gt=0)
    soil_type: str | None = Field(default=None, max_length=100)
    irrigation_type: str | None = Field(default=None, max_length=100)
    crops_grown: str | None = None


class CropRecordCreateRequest(BaseModel):
    farm_id: int
    crop_name: str = Field(min_length=2, max_length=100)
    season: str | None = Field(default=None, max_length=50)
    area_cultivated: float = Field(gt=0)
    production_amount: float | None = Field(default=None, ge=0)
    rainfall: float | None = Field(default=None, ge=0)
    temperature: float | None = Field(default=None, ge=-50, le=60)
    fertilizer_usage: float | None = Field(default=None, ge=0)
    previous_yield: float | None = Field(default=None, ge=0)


class SoilRecordCreateRequest(BaseModel):
    farm_id: int
    ph_value: float = Field(ge=0, le=14)
    nitrogen: float | None = Field(default=None, ge=0)
    phosphorus: float | None = Field(default=None, ge=0)
    potassium: float | None = Field(default=None, ge=0)
    organic_matter: float | None = Field(default=None, ge=0, le=100)
    fertility_level: str | None = Field(default=None, max_length=50)


class WeatherRecordCreateRequest(BaseModel):
    farm_id: int
    rainfall: float | None = Field(default=None, ge=0)
    average_temperature: float | None = Field(default=None, ge=-50, le=60)
    humidity: float | None = Field(default=None, ge=0, le=100)
    climate_condition: str | None = Field(default=None, max_length=100)


class HistoricalRecordCreateRequest(BaseModel):
    farm_id: int
    year: int = Field(ge=1900, le=2100)
    crop_name: str = Field(min_length=2, max_length=100)
    yield_amount: float = Field(ge=0)
    rainfall: float | None = Field(default=None, ge=0)
    temperature: float | None = Field(default=None, ge=-50, le=60)
    notes: str | None = None

