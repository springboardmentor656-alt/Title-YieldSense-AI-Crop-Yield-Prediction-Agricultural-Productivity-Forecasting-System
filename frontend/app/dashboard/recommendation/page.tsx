"use client";

import { useEffect, useState } from "react";

export default function RecommendationPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/dashboard")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  if (!data) return <h2>Loading...</h2>;

  const p = data.latest_prediction;

  return (
    <div className="page">

      <h1>💡 AI Recommendations</h1>

      <div className="dash-grid">

        <div className="dash-card">
          <h2>🌾 Crop Planning</h2>
          <p><b>Recommended Crop</b></p>
          <p>{p?.crop}</p>

          <br />

          <p><b>Suitable Season</b></p>
          <p>Rabi</p>

          <br />

          <p><b>Expected Yield</b></p>
          <p>{p?.estimated_yield} kg/ha</p>
        </div>

        <div className="dash-card">
          <h2>🚜 Farming Recommendations</h2>

          <p><b>Fertilizer</b></p>
          <p>{p?.fertilizer}</p>

          <br />

          <p><b>Irrigation</b></p>
          <p>{p?.irrigation}</p>

          <br />

          <p><b>Crop Suitability</b></p>
          <p>{p?.crop_suitability}</p>
        </div>

        <div className="dash-card">
          <h2>💧 Resource Optimization</h2>

          <p><b>Weather</b></p>
          <p>{p?.weather_status}</p>

          <br />

          <p><b>Yield Potential</b></p>
          <p>{p?.yield_potential}</p>

          <br />

          <p><b>Resource Usage</b></p>
          <p>Use water and fertilizer efficiently.</p>
        </div>

        <div className="dash-card">
          <h2>⚠ Risk Mitigation</h2>

          <p><b>Risk Level</b></p>
          <p>{p?.risk_level}</p>

          <br />

          <p><b>Suggested Action</b></p>

          <p>
            {p?.risk_level === "High"
              ? "Immediate monitoring required."
              : p?.risk_level === "Medium"
              ? "Regular monitoring recommended."
              : "Current farming conditions are stable."}
          </p>

          <br />

          <p><b>Prediction Time</b></p>
          <p>{new Date(p?.prediction_time).toLocaleString()}</p>

        </div>

      </div>

    </div>
  );
}