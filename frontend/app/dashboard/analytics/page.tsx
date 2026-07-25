"use client";

import { useEffect, useState } from "react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function AnalyticsPage() {

  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) return <h2>Loading...</h2>;

  const p = data.latest_prediction;

  const chartData = {
  labels: ["Temperature (°C)", "Humidity (%)", "Rainfall (mm)"],
  datasets: [
    {
      label: "Weather Analytics",
      data: [
        p?.temperature ?? 0,
        p?.humidity ?? 0,
        p?.rainfall ?? 0,
      ],
      backgroundColor: [
        "#4CAF50",
        "#2196F3",
        "#FFC107",
      ],
      borderRadius: 8,
    },
  ],
};

  return (
    <div className="page">

      <h1>📊 Analytics Dashboard</h1>

      <div className="dash-grid">

        <div className="dash-card">
          <h2>Yield Prediction Report</h2>
          <h3>{p?.estimated_yield} kg/ha</h3>
          <p>{p?.yield_potential} Yield Potential</p>
        </div>

        <div className="dash-card">
          <h2>Productivity Analytics</h2>
          <h3>{data.total_farms}</h3>
          <p>Total Registered Farms</p>
        </div>

        <div className="dash-card">
          <h2>Seasonal Performance</h2>
          <h3>Rabi</h3>
          <p>Current Farming Season</p>
        </div>

        <div className="dash-card">
          <h2>Farm Comparison</h2>
          <h3>{data.crops_added}</h3>
          <p>Registered Crop Records</p>
        </div>

      </div>

      <div
        className="card"
        style={{
          marginTop: "35px",
          padding: "25px",
        }}
      >

        <h2>📈 Farm Performance Chart</h2>

        <Bar data={chartData} />

      </div>

      <div
        className="card"
        style={{
          marginTop: "25px",
        }}
      >

        <h2>📋 Analytics Summary</h2>

        <br />

        <p>🌾 Predicted Yield : {p?.estimated_yield} kg/ha</p>

        <p>📈 Yield Potential : {p?.yield_potential}</p>

        <p>🌡 Temperature : {p?.temperature}°C</p>

        <p>💧 Humidity : {p?.humidity}%</p>

        <p>🌧 Rainfall : {p?.rainfall} mm</p>

        <p>☁ Weather Status : {p?.weather_status}</p>

      </div>

    </div>
  );
}