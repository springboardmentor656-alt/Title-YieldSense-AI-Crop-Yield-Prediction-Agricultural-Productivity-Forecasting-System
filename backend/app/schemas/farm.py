from pydantic import BaseModel, Field
from typing import Optional


class FarmBase(BaseModel):
    farm_name: str = Field(..., min_length=3, max_length=100)
    latitude: float
    longitude: float
    area: float = Field(..., gt=0)


class FarmCreate(FarmBase):
    pass


class FarmUpdate(BaseModel):
    farm_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    area: Optional[float] = None


class FarmResponse(FarmBase):
    id: int
    crop_name: Optional[str] = None
    prediction: Optional[float] = None

    class Config:
        from_attributes = True
class FarmDashboardResponse(BaseModel):
    id: int
    farm_name: str
    latitude: float
    longitude: float
    area: float

    crop_name: Optional[str] = None
    prediction: Optional[float] = None        