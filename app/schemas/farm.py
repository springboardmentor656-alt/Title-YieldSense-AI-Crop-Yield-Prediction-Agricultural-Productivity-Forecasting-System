from pydantic import BaseModel


class FarmCreate(BaseModel):
    farm_name: str
    location: str
    latitude: float
    longitude: float
    ph: float
    nitrogen: float
    phosphorus: float
    potassium: float
    rainfall: float
    humidity: float
    temperature: float


class FarmResponse(BaseModel):
    id: int
    farm_name: str
    location: str
    latitude: float
    longitude: float
    ph: float
    nitrogen: float
    phosphorus: float
    potassium: float
    rainfall: float
    humidity: float
    temperature: float

    class Config:
        from_attributes = True