from fastapi import APIRouter
from pydantic import BaseModel
from database import get_conn

router = APIRouter()


class Farm(BaseModel):

    farm_name:str
    location:str

    latitude:float
    longitude:float

    area:float
    crop_type:str
    season:str

    soil_type:str
    soil_ph:float

    nitrogen:float
    phosphorus:float
    potassium:float


@router.post("/farm")
def save_farm(data:Farm):

    conn=get_conn()
    cur=conn.cursor()

   
    cur.execute(
    """
    INSERT INTO farms(

    farm_name,
    location,
    latitude,
    longitude,
    area,
    crop_type,
    season,
    soil_type,
    soil_ph,
    nitrogen,
    phosphorus,
    potassium

    )

    VALUES(
    %s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s
    )

    """,

    (
    data.farm_name,
    data.location,
    data.latitude,
    data.longitude,
    data.area,
    data.crop_type,
    data.season,
    data.soil_type,
    data.soil_ph,
    data.nitrogen,
    data.phosphorus,
    data.potassium
    )

    )

    conn.commit()

    return {"message":"Farm saved"}