"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {

  const [farm, setFarm] = useState<any>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/farm")
      .then((res) => res.json())
      .then((data) => setFarm(data));
  }, []);

  if (!farm) {
    return <h2 style={{ padding: "40px" }}>Loading...</h2>;
  }

  return (
    <div className="page dashboard">

      <h1>🌾 YieldSense AI Dashboard</h1>

      <div className="dash-grid">

        <div className="dash-card">
          <h2>🌾 Farm</h2>
          <h3>{farm.crop_type}</h3>
          <p>Current Crop</p>
        </div>

        <div className="dash-card">
          <h2>☁ Weather</h2>
          <h3>28°C</h3>
          <p>Clear Sky</p>
        </div>

        <div className="dash-card">
          <h2>🌱 Soil</h2>
          <h3>✔ Suitable</h3>
          <p>{farm.soil_type}</p>
        </div>

        <div className="dash-card">
          <h2>📈 Latest Yield</h2>
          <h3>32667 kg/ha</h3>
          <p>AI Prediction</p>
        </div>

        <div className="dash-card">
          <h2>💡 Recommendation</h2>
          <h3>Suitable</h3>
          <p>Rice Cultivation</p>
        </div>

        <div className="dash-card">
          <h2>📅 Prediction Date</h2>
          <h3>{new Date().toLocaleDateString()}</h3>
          <p>Latest Prediction</p>
        </div>

      </div>

      <div
  style={{
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "25px",
    marginTop: "35px",
  }}
>
  {/* Crop Health Overview */}

  <div className="card">

    <h2>🌱 Crop Health Overview</h2>

    <br />

    <p>🌾 Crop : {farm.crop_type}</p>

    <p>🟢 Soil Health : Good</p>

    <p>🌦 Weather Status : Favorable</p>

    <p>💧 Irrigation : Recommended</p>

    <p>🌱 Growth Status : Healthy</p>

  </div>

  {/* Farm Summary */}

  <div className="card">

    <h2>📊 Farm Summary</h2>

    <br />

    <p>🚜 Farm : {farm.farm_name}</p>

    <p>📍 Location : {farm.location}</p>

    <p>📏 Area : {farm.area} ha</p>

    <p>🌱 Season : {farm.season}</p>

    <p>🧪 Soil Type : {farm.soil_type}</p>

  </div>

</div>
</div>
  );
}