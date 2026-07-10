from fastapi import APIRouter
from database import get_conn

router = APIRouter()


@router.get("/dashboard")
def dashboard():

    conn = get_conn()
    cur = conn.cursor()


    cur.execute(
        "SELECT COUNT(*) FROM farms"
    )
    farms = cur.fetchone()[0]


    cur.execute(
        "SELECT COUNT(crop_type) FROM farms"
    )
    crops = cur.fetchone()[0]


    cur.execute(
        """
        SELECT COUNT(*)
        FROM farms
        WHERE soil_ph IS NOT NULL
        """
    )
    soil = cur.fetchone()[0]


    return {

        "total_farms": farms,

        "crops_added": crops,

        "soil_records": soil,

        "prediction": "Model Training Phase"

    }