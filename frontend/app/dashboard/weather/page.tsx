"use client";

import { useEffect, useState } from "react";

export default function WeatherPage() {

  const [weather, setWeather] = useState({
    temperature: 28,
    humidity: 65,
    rainfall: 12,
    wind_speed: 9,
    pressure: 1012,
    condition: "Clear Sky"
  });

  return (
    <div className="page">

      <h1>☁ Weather Analysis</h1>

      <div className="dash-grid">

        <div className="dash-card">
          <h2>🌡 Temperature</h2>
          <h3>{weather.temperature} °C</h3>
        </div>

        <div className="dash-card">
          <h2>💧 Humidity</h2>
          <h3>{weather.humidity}%</h3>
        </div>

        <div className="dash-card">
          <h2>🌧 Rainfall</h2>
          <h3>{weather.rainfall} mm</h3>
        </div>

        <div className="dash-card">
          <h2>🌬 Wind Speed</h2>
          <h3>{weather.wind_speed} km/h</h3>
        </div>

        <div className="dash-card">
          <h2>📈 Pressure</h2>
          <h3>{weather.pressure} hPa</h3>
        </div>

        <div className="dash-card">
          <h2>🌤 Condition</h2>
          <h3>{weather.condition}</h3>
        </div>

      </div>

      <div className="card" style={{ marginTop: "30px" }}>

        <h2>Weather Summary</h2>

        <br />

        <p>✅ Weather is suitable for cultivation.</p>

        <p>🌱 Soil moisture is expected to remain stable.</p>

        <p>🌾 Crop growth conditions are favorable.</p>

        <p>💡 Irrigation is recommended only if rainfall decreases.</p>

      </div>

    </div>
  );
}