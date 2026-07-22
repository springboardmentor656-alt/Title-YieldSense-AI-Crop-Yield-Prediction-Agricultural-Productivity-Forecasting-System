"use client";

import { useEffect, useState } from "react";
import { getPrediction, PredictionResponse } from "../../services/predictionApi";

const CROPS = ["wheat", "rice", "maize"];

export default function PredictPage() {
  const [cropType, setCropType] = useState("wheat");
  const [region, setRegion] = useState("");

useEffect(() => {
  const raw = localStorage.getItem("ys_profile");

  if (!raw) return;

  try {
    const profile = JSON.parse(raw);

    if (profile?.district && profile?.state) {
      setRegion(`${profile.district}, ${profile.state}`);
    }
  } catch (error) {
    console.error("Failed to load profile:", error);
    // Leave region empty so the user can enter it manually.
  }
}, []);
  const [soilPh, setSoilPh] = useState("6.5");
  const [nitrogen, setNitrogen] = useState("120");
  const [phosphorus, setPhosphorus] = useState("60");
  const [potassium, setPotassium] = useState("40");

  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await getPrediction({
        crop_type: cropType,
        region,
        soil_ph: parseFloat(soilPh),
        nitrogen_kg_ha: parseFloat(nitrogen),
        phosphorus_kg_ha: parseFloat(phosphorus),
        potassium_kg_ha: parseFloat(potassium),
      });
      setResult(response);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <h1>Predict Crop Yield</h1>
      <p className="subtitle">Enter your field conditions to get a live prediction.</p>

      <form onSubmit={handleSubmit} className="card">
        <label>
          Crop Type
          <select value={cropType} onChange={(e) => setCropType(e.target.value)}>
            {CROPS.map((c) => (
              <option key={c} value={c}>{c[0].toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
        </label>

        <label>
          Region
          <input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g. Central Delhi, Delhi" />
        </label>

        <div className="grid">
          <label>
            Soil pH
            <input type="number" step="0.1" value={soilPh} onChange={(e) => setSoilPh(e.target.value)} />
          </label>
          <label>
            Nitrogen (kg/ha)
            <input type="number" value={nitrogen} onChange={(e) => setNitrogen(e.target.value)} />
          </label>
          <label>
            Phosphorus (kg/ha)
            <input type="number" value={phosphorus} onChange={(e) => setPhosphorus(e.target.value)} />
          </label>
          <label>
            Potassium (kg/ha)
            <input type="number" value={potassium} onChange={(e) => setPotassium(e.target.value)} />
          </label>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Predicting..." : "Predict Yield"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>

      {loading && (
        <div className="result-card skeleton">
          <div className="skel-line skel-label" />
          <div className="skel-line skel-value" />
          <div className="skel-line skel-sub" />
          <div className="skel-line skel-sub short" />
        </div>
      )}

      {!loading && result && (
        <div className="result-card">
          <p className="label">Predicted Yield — {cropType[0].toUpperCase() + cropType.slice(1)}</p>
          <p className="value">{result.predicted_yield_kg_ha.toLocaleString()} kg/ha</p>
          <p className="sub">Soil suitability: {(result.soil_suitability_score * 100).toFixed(0)}%</p>
          <p className="sub">Model: {result.model_version}</p>
        </div>
      )}

      <style jsx>{`
        .page { max-width: 640px; margin: 0 auto; padding: 40px 24px; }
        h1 { font-size: 28px; font-weight: 800; color: #14532d; margin-bottom: 4px; }
        .subtitle { color: #6b7280; margin-bottom: 24px; }
        .card { background: white; border-radius: 16px; padding: 28px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); display: flex; flex-direction: column; gap: 16px; }
        label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; font-weight: 600; color: #374151; }
        input, select { padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; font-size: 14px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        button { margin-top: 8px; background: #15803d; color: white; border: none; padding: 12px; border-radius: 10px; font-weight: 700; cursor: pointer; }
        button:disabled { opacity: 0.6; cursor: not-allowed; }
        .error { color: #dc2626; font-size: 14px; }
        .result-card { margin-top: 20px; background: #f0fdf4; border-radius: 16px; padding: 24px; }
        .label { font-size: 14px; color: #4b5563; font-weight: 600; }
        .value { font-size: 32px; font-weight: 800; color: #15803d; margin: 4px 0; }
        .sub { font-size: 13px; color: #6b7280; }
        .skeleton {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .skel-line {
          border-radius: 6px;
          background: linear-gradient(90deg, #e5e7eb 25%, #f3f4f6 50%, #e5e7eb 75%);
          background-size: 200% 100%;
          animation: shimmer 1.4s ease-in-out infinite;
        }
        .skel-label { width: 45%; height: 14px; }
        .skel-value { width: 65%; height: 32px; margin: 4px 0; }
        .skel-sub { width: 55%; height: 13px; }
        .skel-sub.short { width: 35%; }

        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}