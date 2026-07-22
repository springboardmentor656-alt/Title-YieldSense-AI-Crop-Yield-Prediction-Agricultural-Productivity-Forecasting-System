"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../components/Sidebar";
import Card from "../components/Card";
import YieldChart from "../components/YieldChart";
import Loading from "../components/Loading";
import ErrorMessage from "../components/ErrorMessage";

interface Weather {
  city: string;
  temperature: number;
  humidity: number;
  wind_speed: number;
  weather: string;
  description: string;
}

interface Soil {
  soil_health: string;
  ph: number;
  nitrogen: string;
  phosphorus: string;
  potassium: string;
  moisture: string;
}

interface Prediction {
  area: string;
  item: string;
  predicted_yield: number;
}

export default function Dashboard() {
  const router = useRouter();

  const [weather, setWeather] = useState<Weather | null>(null);
  const [soil, setSoil] = useState<Soil | null>(null);
  const [prediction, setPrediction] = useState<Prediction | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user =
    typeof window !== "undefined"
      ? localStorage.getItem("user")
      : "";

  async function loadDashboard() {
    try {
      setLoading(true);

      const [weatherRes, soilRes, historyRes] = await Promise.all([
        fetch("http://127.0.0.1:8000/weather"),
        fetch("http://127.0.0.1:8000/soil"),
        fetch("http://127.0.0.1:8000/history"),
      ]);

      if (!weatherRes.ok) throw new Error("Weather API Failed");
      if (!soilRes.ok) throw new Error("Soil API Failed");
      if (!historyRes.ok) throw new Error("History API Failed");

      const weatherData = await weatherRes.json();
      const soilData = await soilRes.json();
      const historyData = await historyRes.json();

      setWeather(weatherData);
      setSoil(soilData);

      if (historyData.length > 0) {
        setPrediction(historyData[historyData.length - 1]);
      }

      setError("");
    } catch (err) {
      console.error(err);
      setError("Unable to load dashboard.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const loggedUser = localStorage.getItem("user");

    if (!loggedUser) {
      router.push("/login");
      return;
    }

    loadDashboard();
  }, []);

  if (loading) return <Loading />;

  return (
    <>
      <Sidebar />

      <main
        style={{
          marginLeft: "250px",
          padding: "30px",
          minHeight: "100vh",
          background: "#f4f6f9",
        }}
      >
        {error && <ErrorMessage message={error} />}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
          }}
        >
          <div>
            <h1
              style={{
                color: "#2E7D32",
                fontSize: "38px",
                marginBottom: "10px",
              }}
            >
              🌾 YieldSense AI Dashboard
            </h1>

            <p
              style={{
                color: "#666",
                fontSize: "18px",
              }}
            >
              Welcome, <b>{user}</b> 👋
            </p>
          </div>

          <button
            onClick={loadDashboard}
            style={{
              background: "#2E7D32",
              color: "white",
              border: "none",
              padding: "12px 25px",
              borderRadius: "10px",
              cursor: "pointer",
            }}
          >
            🔄 Refresh
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
            gap: "20px",
          }}
        >
          <Card
            title="🌾 AI Prediction"
            value={
              prediction
                ? `${prediction.predicted_yield} hg/ha`
                : "Loading..."
            }
            color="#4CAF50"
          />

          <Card
            title="🌡 Temperature"
            value={
              weather
                ? `${weather.temperature} °C`
                : "Loading..."
            }
            color="#2196F3"
          />

          <Card
            title="💧 Humidity"
            value={
              weather
                ? `${weather.humidity}%`
                : "Loading..."
            }
            color="#00BCD4"
          />

          <Card
            title="💨 Wind Speed"
            value={
              weather
                ? `${weather.wind_speed} m/s`
                : "Loading..."
            }
            color="#795548"
          />

          <Card
            title="🌱 Soil Health"
            value={
              soil
                ? soil.soil_health
                : "Loading..."
            }
            color="#8BC34A"
          />

          <Card
            title="🧪 Soil pH"
            value={
              soil
                ? soil.ph
                : "Loading..."
            }
            color="#FF9800"
          />

          <Card
            title="☁ Weather"
            value={
              weather
                ? weather.weather
                : "Loading..."
            }
            color="#3F51B5"
          />

          <Card
            title="🤖 AI Model"
            value="XGBoost"
            color="#9C27B0"
          />
        </div>

        <div
          style={{
            marginTop: "40px",
            background: "#fff",
            padding: "25px",
            borderRadius: "15px",
            boxShadow: "0 5px 15px rgba(0,0,0,.1)",
          }}
        >
          <h2
            style={{
              color: "#2E7D32",
              marginBottom: "20px",
            }}
          >
            📈 Crop Yield Analytics
          </h2>

          <YieldChart />
        </div>
      </main>
    </>
  );
}