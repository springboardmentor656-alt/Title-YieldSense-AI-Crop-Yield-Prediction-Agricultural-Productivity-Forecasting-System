import {

    Cloud,

    Droplets,

    Wind,

    Gauge,

    Thermometer

} from "lucide-react";

export default function WeatherCard({

    weather

}: any) {

    return (

        <div className="bg-white rounded-xl shadow-lg p-6">

            <div className="flex justify-between">

                <h2 className="text-2xl font-bold">

                    Current Weather

                </h2>

                <img

                    src={`https://openweathermap.org/img/wn/${weather.weather_icon}@2x.png`}

                    alt="weather"

                />

            </div>

            <div className="grid md:grid-cols-2 gap-5 mt-6">

                <div>

                    <Thermometer />

                    Temperature

                    <p>

                        {weather.temperature}°C

                    </p>

                </div>

                <div>

                    <Droplets />

                    Humidity

                    <p>

                        {weather.humidity}%

                    </p>

                </div>

                <div>

                    <Cloud />

                    Rainfall

                    <p>

                        {weather.rainfall} mm

                    </p>

                </div>

                <div>

                    <Wind />

                    Wind

                    <p>

                        {weather.wind_speed} km/h

                    </p>

                </div>

                <div>

                    <Gauge />

                    Pressure

                    <p>

                        {weather.pressure} hPa

                    </p>

                </div>

            </div>

        </div>

    )

}