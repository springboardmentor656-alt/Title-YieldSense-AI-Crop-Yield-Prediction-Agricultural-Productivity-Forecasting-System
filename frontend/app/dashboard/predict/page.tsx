"use client";

import { useState } from "react";

export default function PredictPage() {

  const [crop, setCrop] = useState("Rice, paddy");
  const [temp, setTemp] = useState("");
  const [rainfall, setRainfall] = useState("");
  const [pesticides, setPesticides] = useState("");

  const [result, setResult] = useState<any>(null);

  const predict = async () => {

    const res = await fetch("http://127.0.0.1:8000/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
  body: JSON.stringify({
    crop,
    avg_temp: Number(temp),
    rainfall: Number(rainfall),
    pesticides: Number(pesticides),
  }),
});

if (!res.ok) {
  const error = await res.text();
  console.log(error);
  alert(error);
  return;
}

    const data = await res.json();

    setResult(data);
  };

  return (
    <div className="container">

      <h1>Yield Prediction</h1>

      <select
        value={crop}
        onChange={(e) => setCrop(e.target.value)}
      >
        <option>Rice, paddy</option>
        <option>Wheat</option>
        <option>Maize</option>
        <option>Potatoes</option>
        <option>Sorghum</option>
        <option>Soybeans</option>
        <option>Cassava</option>
        <option>Sweet potatoes</option>
      </select>

      <input
        type="number"
        placeholder="Average Temperature"
        value={temp}
        onChange={(e) => setTemp(e.target.value)}
      />

      <input
        type="number"
        placeholder="Rainfall"
        value={rainfall}
        onChange={(e) => setRainfall(e.target.value)}
      />

      <input
        type="number"
        placeholder="Pesticides"
        value={pesticides}
        onChange={(e) => setPesticides(e.target.value)}
      />

      <button onClick={predict}>
        Predict Yield
      </button>

      {result && (

        <div className="dash-grid">

          <div className="dash-card">
            <h2>Yield Prediction</h2>

            <p><b>Crop</b><br />{result.crop}</p>

            <p><b>Estimated Yield</b><br />
              {result.estimated_yield} kg/ha
            </p>

            <p><b>Yield Potential</b><br />
              {result.yield_potential}
            </p>

            <p><b>Confidence</b><br />
              {result.confidence}%
            </p>

          </div>

          <div className="dash-card">

            <h2>Weather</h2>

            <p><b>Status</b><br />
              {result.weather_status}
            </p>

            <p><b>Risk Level</b><br />
              {result.risk_level}
            </p>

            <p><b>Prediction Time</b><br />
              {result.prediction_time}
            </p>

          </div>

          <div className="dash-card">

            <h2>Soil Analysis</h2>

            <p><b>Health</b><br />
              {result.soil_health}
            </p>

            <p><b>pH</b><br />
              {result.ph_status}
            </p>

            <p><b>Nitrogen</b><br />
              {result.nitrogen_status}
            </p>

            <p><b>Phosphorus</b><br />
              {result.phosphorus_status}
            </p>

            <p><b>Potassium</b><br />
              {result.potassium_status}
            </p>

          </div>

          <div className="dash-card">

            <h2>Recommendation</h2>

            <p><b>Fertilizer</b><br />
              {result.fertilizer}
            </p>

            <p><b>Irrigation</b><br />
              {result.irrigation}
            </p>

            <p><b>Crop Suitability</b><br />
              {result.crop_suitability}
            </p>

          </div>

        </div>

      )}

    </div>
  );
}