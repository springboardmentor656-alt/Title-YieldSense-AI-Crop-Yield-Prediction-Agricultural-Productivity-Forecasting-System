class WeatherMapper:

    @staticmethod
    def map_openweather(data):

        return {

            "temperature":
                data["main"]["temp"],

            "humidity":
                data["main"]["humidity"],

            "pressure":
                data["main"]["pressure"],

            "wind_speed":
                data["wind"]["speed"],

            "rainfall":
                data.get("rain", {}).get("1h", 0)
        }