from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class PhAssessment(BaseModel):
    ph: float
    ph_category: str
    is_valid: bool
    yield_multiplier: float


class SoilSuitabilityResponse(BaseModel):
    farm_id: int
    ph: PhAssessment
    nutrient_score: float
    fertility_category: str
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    moisture: Optional[float] = None


class SoilReportCreate(BaseModel):
    farm_id: int
    ph: float = Field(ge=0, le=14)
    nitrogen: Optional[float] = Field(default=None, ge=0)
    phosphorus: Optional[float] = Field(default=None, ge=0)
    potassium: Optional[float] = Field(default=None, ge=0)
    moisture: Optional[float] = Field(default=None, ge=0)
    organic_carbon: Optional[float] = Field(default=None, ge=0)


class SoilReportUpdate(BaseModel):
    ph: Optional[float] = Field(default=None, ge=0, le=14)
    nitrogen: Optional[float] = Field(default=None, ge=0)
    phosphorus: Optional[float] = Field(default=None, ge=0)
    potassium: Optional[float] = Field(default=None, ge=0)
    moisture: Optional[float] = Field(default=None, ge=0)
    organic_carbon: Optional[float] = Field(default=None, ge=0)


class SoilReportResponse(BaseModel):
    """A single soil report plus every derived metric, computed fresh
    on read by SoilService — never persisted, so the formula can change
    without a backfill.
    """

    id: int
    farm_id: int
    farm_name: Optional[str] = None
    ph: float
    nitrogen: Optional[float] = None
    phosphorus: Optional[float] = None
    potassium: Optional[float] = None
    moisture: Optional[float] = None
    organic_carbon: Optional[float] = None
    ph_category: str
    nutrient_score: float
    fertility_category: str
    soil_health_index: float
    health_category: str
    created_at: datetime


class SoilReportListResponse(BaseModel):
    items: List[SoilReportResponse]
    total: int
    page: int
    page_size: int


class SoilDashboardStats(BaseModel):
    average_soil_health: Optional[float] = None
    healthy_farms: int
    poor_soil_farms: int
    total_farms_with_reports: int
    recent_reports: int
    total_reports: int
