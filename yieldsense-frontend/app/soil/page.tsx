"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import SoilCard from "../components/SoilCard";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

interface Soil {
  soil_health: string;
  ph: number;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  moisture: string;
}

export default function SoilPage() {
  const [soil, setSoil] = useState<Soil | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSoil();
  }, []);

  async function loadSoil() {
    try {
      setLoading(true);

      const res = await fetch("http://127.0.0.1:8000/soil");

      if (!res.ok) {
        throw new Error("Unable to fetch soil data");
      }

      const data = await res.json();

      setSoil(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load soil information.");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <Loading />;

  return (
    <>
      <Sidebar />

      <div
        style={{
          marginLeft: "260px",
          padding: "30px",
          background: "#f5f7fa",
          minHeight: "100vh",
        }}
      >
        <h1
          style={{
            color: "#4CAF50",
            marginBottom: "10px",
          }}
        >
          🌱 Soil Health
        </h1>

        <p
          style={{
            color: "#666",
            marginBottom: "25px",
          }}
        >
          Monitor soil quality for better crop productivity.
        </p>

        {error && <ErrorMessage message={error} />}

        {soil && (
          <>
            <SoilCard soil={soil} />

            <div
              style={{
                marginTop: "30px",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
                gap: "20px",
              }}
            >
              <InfoCard
                title="🧪 pH"
                value={soil.ph}
                color="#4CAF50"
              />

              <InfoCard
                title="🌿 Nitrogen"
                value={soil.nitrogen}
                color="#2196F3"
              />

              <InfoCard
                title="🌾 Phosphorus"
                value={soil.phosphorus}
                color="#FF9800"
              />

              <InfoCard
                title="🍃 Potassium"
                value={soil.potassium}
                color="#9C27B0"
              />

              <InfoCard
                title="💧 Moisture"
                value={soil.moisture}
                color="#00BCD4"
              />
            </div>
          </>
        )}

        <button
          onClick={loadSoil}
          style={{
            marginTop: "30px",
            padding: "12px 30px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          🔄 Refresh Soil Data
        </button>
      </div>
    </>
  );
}

function InfoCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <div
      style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 5px 15px rgba(0,0,0,.1)",
      }}
    >
      <h3 style={{ color }}>{title}</h3>

      <h2 style={{ color: "#333" }}>{value}</h2>
    </div>
  );
}