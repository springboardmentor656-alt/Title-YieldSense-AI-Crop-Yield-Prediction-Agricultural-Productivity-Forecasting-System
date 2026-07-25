from fastapi import APIRouter
from database import get_conn

router = APIRouter()


@router.get("/dashboard")
def dashboard():

    conn = get_conn()
    cur = conn.cursor()

    # Counts
    cur.execute("SELECT COUNT(*) FROM farms")
    total_farms = cur.fetchone()[0]

    cur.execute("SELECT COUNT(crop_type) FROM farms")
    crops_added = cur.fetchone()[0]

    cur.execute("""
        SELECT COUNT(*)
        FROM farms
        WHERE soil_ph IS NOT NULL
    """)
    soil_records = cur.fetchone()[0]

    # Latest prediction
    cur.execute("""
        SELECT
            crop,
            estimated_yield,
            yield_potential,
            risk_level,
            temperature,
            rainfall,
            humidity,
            weather_status,
            fertilizer,
            irrigation,
            crop_suitability,
            recommendation,
            prediction_time
        FROM predictions
        ORDER BY id DESC
        LIMIT 1
    """)

    row = cur.fetchone()

    cur.close()
    conn.close()

    if row:

        latest_prediction = {
            "crop": row[0],
            "estimated_yield": row[1],
            "yield_potential": row[2],
            "risk_level": row[3],
            "temperature": row[4],
            "rainfall": row[5],
            "humidity": row[6],
            "weather_status": row[7],
            "fertilizer": row[8],
            "irrigation": row[9],
            "crop_suitability": row[10],
            "recommendation": row[11],
            "prediction_time": row[12]
        }

    else:

        latest_prediction = None

    return {

        "total_farms": total_farms,

        "crops_added": crops_added,

        "soil_records": soil_records,

        "latest_prediction": latest_prediction

    }