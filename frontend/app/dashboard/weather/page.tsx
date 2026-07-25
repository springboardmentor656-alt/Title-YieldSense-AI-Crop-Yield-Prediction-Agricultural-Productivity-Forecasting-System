"use client";

import { useEffect, useState } from "react";

export default function WeatherPage() {

  const [weather, setWeather] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeather();
  }, []);

  async function loadWeather() {
    try {

      const res = await fetch("http://127.0.0.1:8000/dashboard");

      if (!res.ok) {
        throw new Error("Failed to fetch weather");
      }

      const data = await res.json();

      const prediction = data.latest_prediction;

      if (prediction) {
        setWeather({
          temperature: prediction.temperature,
          humidity: prediction.humidity,
          rainfall: prediction.rainfall,
          condition: prediction.weather_status,
          wind_speed: 9,
          pressure: 1012,
        });
      }

    } catch (err) {

      console.error("Weather Error:", err);

    } finally {

      setLoading(false);

    }
  }

  if (loading) {
    return (
      <div className="page">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!weather) {
    return (
      <div className="page">
        <h2>No Weather Data Available.</h2>
      </div>
    );
  }

  return (
    <div className="page">

      <h1>☁ Weather Analysis</h1>

      <div className="dash-grid">

        <div className="dash-card">
          <h2>🌡 Temperature</h2>
          <h3>{weather.temperature ?? "--"} °C</h3>
        </div>

        <div className="dash-card">
          <h2>💧 Humidity</h2>
          <h3>{weather.humidity ?? "--"}%</h3>
        </div>

        <div className="dash-card">
          <h2>🌧 Rainfall</h2>
          <h3>{weather.rainfall ?? "--"} mm</h3>
        </div>

        <div className="dash-card">
          <h2>🌬 Wind Speed</h2>
          <h3>{weather.wind_speed ?? "--"} km/h</h3>
        </div>

        <div className="dash-card">
          <h2>📈 Pressure</h2>
          <h3>{weather.pressure ?? "--"} hPa</h3>
        </div>

        <div className="dash-card">
          <h2>🌤 Condition</h2>
          <h3>{weather.condition ?? "--"}</h3>
        </div>

      </div>

      <div
        className="card"
        style={{
          marginTop: "30px",
          padding: "20px",
        }}
      >

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