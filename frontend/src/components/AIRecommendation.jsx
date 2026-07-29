import { useEffect, useState } from "react";
import "../styles/AIRecommendation.css";

function AIRecommendation() {

  const [recommendedCrop, setRecommendedCrop] = useState("Rice");

  useEffect(() => {
    const crop = localStorage.getItem("recommendedCrop");

    if (crop) {
      setRecommendedCrop(crop);
    }
  }, []);

  return (
    <div className="ai-card">

      <h2>🤖 AI Recommendation</h2>

      <div className="best-crop">
        <h3>🌾 Best Crop</h3>
        <h1>{recommendedCrop}</h1>
      </div>

      <div className="ai-info">

        <div className="info-row">
          <span>🎯 Confidence</span>
          <strong>95%</strong>
        </div>

        <div className="info-row">
          <span>💧 Irrigation</span>
          <strong>High</strong>
        </div>

        <div className="info-row">
          <span>🌱 Fertilizer</span>
          <strong>Urea</strong>
        </div>

        <div className="info-row">
          <span>⚠ Disease Risk</span>
          <strong>Low</strong>
        </div>

        <div className="info-row">
          <span>🌍 Soil Status</span>
          <strong>Healthy</strong>
        </div>

      </div>

    </div>
  );
}

export default AIRecommendation;