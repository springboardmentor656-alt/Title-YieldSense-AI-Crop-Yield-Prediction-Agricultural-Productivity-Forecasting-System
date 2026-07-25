import requests

def get_weather(latitude, longitude):

    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={latitude}&longitude={longitude}"
        "&current=temperature_2m,relative_humidity_2m"
        "&daily=rain_sum"
        "&timezone=auto"
    )

    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()

        data = response.json()

        return {
            "temperature": data["current"]["temperature_2m"],
            "humidity": data["current"]["relative_humidity_2m"],
            "rainfall": data["daily"]["rain_sum"][0],
        }

    except requests.exceptions.RequestException as e:
        print("Weather API Error:", e)

        return {
            "temperature": 25,
            "humidity": 70,
            "rainfall": 5,
        }


def weather_status(temp, rainfall):

    if 20 <= temp <= 30 and rainfall >= 100:
        return "Optimal"

    elif temp > 35:
        return "Heat Stress"

    elif rainfall < 50:
        return "Low Rainfall"

    else:
        return "Moderate"