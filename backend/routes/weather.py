def weather_status(temp, rainfall):

    if 20 <= temp <= 30 and rainfall >= 100:
        return "Optimal"

    elif temp > 35:
        return "Heat Stress"

    elif rainfall < 50:
        return "Low Rainfall"

    else:
        return "Moderate"