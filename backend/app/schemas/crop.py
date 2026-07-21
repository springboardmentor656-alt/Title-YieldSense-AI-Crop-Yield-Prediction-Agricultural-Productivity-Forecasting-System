from typing import Optional

from pydantic import BaseModel, Field


class CropCreate(BaseModel):
    farm_id: int
    crop_name: str = Field(..., min_length=1, max_length=100)
    hectares_planted: Optional[float] = Field(default=None, gt=0)


class CropUpdate(BaseModel):
    crop_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    hectares_planted: Optional[float] = Field(default=None, gt=0)


class CropResponse(BaseModel):
    id: int
    farm_id: int
    crop_name: str
    hectares_planted: Optional[float] = None

    class Config:
        from_attributes = True
