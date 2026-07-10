from typing import List, Optional

from pydantic import BaseModel, ConfigDict

from typing import Generic, TypeVar


T = TypeVar("T")


class DatasetImportError(BaseModel):
    row_number: int
    message: str


class DatasetImportResponse(BaseModel):
    dataset: str
    total_rows: int
    inserted_rows: int
    updated_rows: int = 0
    skipped_rows: int
    invalid_rows: int
    errors: List[DatasetImportError]


class HistoricalCropYieldResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    crop: str
    crop_year: int
    season: str
    state: str
    area: float
    production: float
    annual_rainfall: Optional[float]
    fertilizer: Optional[float]
    pesticide: Optional[float]
    yield_value: float


class StateSoilResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    state: str
    nitrogen: float
    phosphorus: float
    potassium: float
    ph: float


class StateWeatherResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    state: str
    year: int
    avg_temp_c: float
    total_rainfall_mm: float
    avg_humidity_percent: float

class PaginatedResponse(BaseModel, Generic[T]):
    total: int
    page: int
    page_size: int
    total_pages: int
    items: List[T]


class HistoricalYieldSummaryResponse(BaseModel):
    total_records: int
    total_crops: int
    total_states: int
    minimum_year: Optional[int]
    maximum_year: Optional[int]
    average_yield: Optional[float]
    total_area: Optional[float]
    total_production: Optional[float]


class SoilSummaryResponse(BaseModel):
    total_states: int
    average_nitrogen: Optional[float]
    average_phosphorus: Optional[float]
    average_potassium: Optional[float]
    average_ph: Optional[float]


class WeatherSummaryResponse(BaseModel):
    total_records: int
    total_states: int
    minimum_year: Optional[int]
    maximum_year: Optional[int]
    average_temperature_c: Optional[float]
    average_rainfall_mm: Optional[float]
    average_humidity_percent: Optional[float]