from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class FarmBase(BaseModel):
    farm_name: str = Field(
        min_length=2,
        max_length=120,
    )

    state: str = Field(
        min_length=2,
        max_length=120,
    )

    district: str = Field(
        min_length=2,
        max_length=120,
    )

    village: Optional[str] = Field(
        default=None,
        max_length=120,
    )

    area_hectares: float = Field(gt=0)

    soil_type: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    primary_crop: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    irrigation_type: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    latitude: Optional[float] = Field(
        default=None,
        ge=-90,
        le=90,
    )

    longitude: Optional[float] = Field(
        default=None,
        ge=-180,
        le=180,
    )


class FarmCreateRequest(FarmBase):
    pass


class FarmUpdateRequest(BaseModel):
    farm_name: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=120,
    )

    state: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=120,
    )

    district: Optional[str] = Field(
        default=None,
        min_length=2,
        max_length=120,
    )

    village: Optional[str] = Field(
        default=None,
        max_length=120,
    )

    area_hectares: Optional[float] = Field(
        default=None,
        gt=0,
    )

    soil_type: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    primary_crop: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    irrigation_type: Optional[str] = Field(
        default=None,
        max_length=100,
    )

    latitude: Optional[float] = Field(
        default=None,
        ge=-90,
        le=90,
    )

    longitude: Optional[float] = Field(
        default=None,
        ge=-180,
        le=180,
    )


class FarmResponse(FarmBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    owner_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime


class FarmWithOwnerResponse(FarmResponse):
    owner_name: str
    owner_email: str


class FarmSummaryResponse(BaseModel):
    total_farms: int
    active_farms: int
    inactive_farms: int
    total_area_hectares: float
    total_states: int
    total_districts: int