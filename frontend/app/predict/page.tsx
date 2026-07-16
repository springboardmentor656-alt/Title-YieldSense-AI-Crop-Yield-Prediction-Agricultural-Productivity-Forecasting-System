"use client";
import { useState } from "react";

interface PredictionResult {
  predicted_yield_kg_ha: number;
  soil_suitability_score: number;
  model_version: string;
}

export default function PredictPage() {
  const [form, setForm] = useState({
    crop_type: "wheat",
    region: "",
    rainfall_mm: "",
    avg_temp_c: "",
    humidity_pct: "",
    soil_ph: "",
    nitrogen_kg_ha: "",
    phosphorus_kg_ha: "",
    potassium_kg_ha: "",
  });
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/v1/predictions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          rainfall_mm: parseFloat(form.rainfall_mm),
          avg_temp_c: parseFloat(form.avg_temp_c),
          humidity_pct: parseFloat(form.humidity_pct),
          soil_ph: parseFloat(form.soil_ph),
          nitrogen_kg_ha: parseFloat(form.nitrogen_kg_ha),
          phosphorus_kg_ha: parseFloat(form.phosphorus_kg_ha),
          potassium_kg_ha: parseFloat(form.potassium_kg_ha),
        }),
      });
      if (!res.ok) throw new Error("Prediction failed");
      setResult(await res.json());
    } catch (err) {
      setError("Something went wrong. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Predict Crop Yield</h1>

      <select name="crop_type" value={form.crop_type} onChange={handleChange}>
        <option value="wheat">Wheat</option>
        <option value="rice">Rice</option>
        <option value="maize">Maize</option>
      </select>

      {["region", "rainfall_mm", "avg_temp_c", "humidity_pct", "soil_ph", "nitrogen_kg_ha", "phosphorus_kg_ha", "potassium_kg_ha"].map((field) => (
        <input
          key={field}
          name={field}
          placeholder={field.replace(/_/g, " ")}
          value={(form as any)[field]}
          onChange={handleChange}
        />
      ))}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Predicting..." : "Predict Yield"}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-card">
          <h2>{result.predicted_yield_kg_ha} kg/ha</h2>
          <p>Soil suitability: {(result.soil_suitability_score * 100).toFixed(0)}%</p>
          <p>Model: {result.model_version}</p>
        </div>
      )}

      <style jsx>{`
        .container { max-width: 480px; margin: 40px auto; display: flex; flex-direction: column; gap: 12px; }
        input, select, button { padding: 10px; border-radius: 8px; border: 1px solid #ccc; }
        button { background: #2e7d32; color: white; cursor: pointer; }
        .result-card { border: 1px solid #2e7d32; border-radius: 12px; padding: 16px; margin-top: 16px; }
        .error { color: #c62828; }
      `}</style>
    </div>
  );
}