from pydantic import BaseModel

class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str

class UserLogin(BaseModel):
    email: str
    password: str

class PredictionInput(BaseModel):
    avg_temp: float
    average_rain_fall_mm_per_year: float
    pesticides_tonnes: float