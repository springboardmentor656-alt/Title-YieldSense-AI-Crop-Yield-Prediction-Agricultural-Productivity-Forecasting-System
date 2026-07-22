from fastapi import APIRouter, HTTPException
import requests

router = APIRouter()

API_KEY = "da7510e8c8bc468afaa172118ac95fda"

CITY = "Hyderabad"

@router.get("/weather")
def get_weather():

    url = (
        f"https://api.openweathermap.org/data/2.5/weather"
        f"?q={CITY}&appid={API_KEY}&units=metric"
    )

    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(
            status_code=500,
            detail=response.json()
        )

    data = response.json()

    return {
        "city": data["name"],
        "temperature": data["main"]["temp"],
        "humidity": data["main"]["humidity"],
        "wind_speed": data["wind"]["speed"],
        "weather": data["weather"][0]["main"],
        "description": data["weather"][0]["description"]
    }