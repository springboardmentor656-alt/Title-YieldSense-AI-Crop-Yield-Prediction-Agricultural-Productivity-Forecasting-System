from pydantic import BaseModel

class CropBase(BaseModel):
    name: str
    season: str


class CropCreate(CropBase):
    pass


class CropResponse(CropBase):
    id: int

    class Config:
        from_attributes = True