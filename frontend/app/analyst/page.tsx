"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";

interface User { id: number; full_name: string; email: string; role: string; }

export default function AnalystDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [dashboard, setDashboard] = useState<any>(null);
  const [yieldTrends, setYieldTrends] = useState<any>(null);
  const [cropPerformance, setCropPerformance] = useState<any>(null);
  const [productivity, setProductivity] = useState<any>(null);
  const [riskDistribution, setRiskDistribution] = useState<any>(null);
  const [soilHealth, setSoilHealth] = useState<any>(null);
  const [weatherImpact, setWeatherImpact] = useState<any>(null);
  const [recentPredictions, setRecentPredictions] = useState<any[]>([]);
  const [modelPerformance, setModelPerformance] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/"); return; }
    const userData = localStorage.getItem("user");
    if (userData) {
      const u = JSON.parse(userData);
      if (u.role !== "Analyst") { router.push("/"); return; }
      setUser(u);
    }
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [
  dashboard,
  yieldTrends,
  cropPerformance,
  productivity,
  riskDistribution,
  soilHealth,
  weatherImpact,
  recentPredictions,
  modelPerformance,
] = await Promise.all([
  api.getDashboardAnalytics(),
  api.getYieldTrends(),
  api.getCropPerformance(),
  api.getProductivity(),
  api.getRiskDistribution(),
  api.getSoilHealth(),
  api.getWeatherImpact(),
  api.getRecentPredictions(),
  api.getModelPerformance(),
]);
    setDashboard(dashboard);
    setYieldTrends(yieldTrends);
    setCropPerformance(cropPerformance);
    setProductivity(productivity);
    setRiskDistribution(riskDistribution);
    setSoilHealth(soilHealth);
    setWeatherImpact(weatherImpact);
    setRecentPredictions(recentPredictions || []);
    setModelPerformance(modelPerformance);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📊</div>
        <div style={{ color: "#f59e0b", letterSpacing: "0.15em", fontSize: "13px" }}>LOADING ANALYTICS...</div>
      </div>
    </div>
  );

  const navItems = ["overview", "yield-trends", "weather", "soil", "predictions", "reports"];

  const cropData = [
    { crop: "Cassava", avgYield: "8.5 t/ha", trend: "+12%", risk: "Low", color: "#22c55e" },
    { crop: "Maize", avgYield: "5.5 t/ha", trend: "+8%", risk: "Low", color: "#22c55e" },
    { crop: "Rice", avgYield: "4.0 t/ha", trend: "+5%", risk: "Medium", color: "#f59e0b" },
    { crop: "Wheat", avgYield: "4.67 t/ha", trend: "+15%", risk: "Low", color: "#22c55e" },
    { crop: "Soybeans", avgYield: "2.8 t/ha", trend: "-3%", risk: "High", color: "#ef4444" },
    { crop: "Sorghum", avgYield: "3.2 t/ha", trend: "+5%", risk: "Medium", color: "#f59e0b" },
    { crop: "Potatoes", avgYield: "6.0 t/ha", trend: "+10%", risk: "Low", color: "#22c55e" },
  ];

  const months = ["Temperature", "Rainfall", "Humidity", "Yield"];

  const rainfallValues = [
  weatherImpact?.average_temperature || 0,
  weatherImpact?.average_rainfall || 0,
  weatherImpact?.average_humidity || 0,
  weatherImpact?.average_yield || 0,
   ];

  const maxRain = Math.max(...rainfallValues, 1);

 

  const riskColor = (risk: string) => {
    if (risk === "Low") return "#22c55e";
    if (risk === "Medium") return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0f", fontFamily: "'Segoe UI', system-ui, sans-serif", color: "#ffffff" }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: "#0d0d14", borderBottom: "1px solid #1a1a2a", padding: "0 32px", height: "60px", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div style={{ width: "32px", height: "32px", background: "linear-gradient(135deg, #f59e0b, #d97706)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>📊</div>
            <span style={{ color: "#f59e0b", fontWeight: 700, fontSize: "15px", letterSpacing: "0.05em" }}>YIELDSENSE ANALYTICS</span>
          </div>
          <div style={{ width: "1px", height: "20px", backgroundColor: "#1a1a2a" }} />
          {navItems.map(item => (
            <button key={item} onClick={() => setActiveTab(item)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase",
              color: activeTab === item ? "#f59e0b" : "#4a4a5a",
              fontWeight: activeTab === item ? 700 : 400,
              borderBottom: activeTab === item ? "2px solid #f59e0b" : "2px solid transparent",
              padding: "4px 0",
            }}>{item}</button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ backgroundColor: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "100px", padding: "4px 12px", fontSize: "12px", color: "#f59e0b" }}>
            📊 ANALYST
          </div>
          <span style={{ color: "#6b6b7e", fontSize: "13px" }}>{user?.full_name}</span>
          <button onClick={() => { localStorage.clear(); router.push("/"); }} style={{ backgroundColor: "transparent", border: "1px solid #1a1a2a", borderRadius: "8px", padding: "6px 14px", color: "#6b6b7e", cursor: "pointer", fontSize: "12px" }}>
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{ padding: "32px", maxWidth: "1400px", margin: "0 auto" }}>

        {/* Banner */}
        <div style={{ background: "linear-gradient(135deg, #1a1400, #120e00)", borderRadius: "16px", padding: "32px 40px", marginBottom: "28px", border: "1px solid #2a2000", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: "40px", top: "50%", transform: "translateY(-50%)", fontSize: "100px", opacity: 0.06 }}>📊</div>
          <div style={{ fontSize: "11px", color: "#f59e0b", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: "8px" }}>Analytics Portal</div>
          <h1 style={{ fontSize: "26px", fontWeight: 800, marginBottom: "6px" }}>Agricultural Intelligence Reports</h1>
          <p style={{ color: "#6b6040", fontSize: "14px" }}>
            {new Date().toLocaleDateString("en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} · Season 2026
          </p>
        </div>

        {/* KPI Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "28px" }}>
          {[
            { icon: "🤖", label: "Model Accuracy", value: modelPerformance ? `${modelPerformance.accuracy_percent}%` : "—", sub: "R2 score", color: "#22c55e" },
            { icon: "📉", label: "MAE Score", value: modelPerformance ? `${modelPerformance.mae}` : "—", sub: "tons/ha error", color: "#f59e0b" },
            { icon: "🌧️", label: "Avg Rainfall", value: weatherImpact ? `${weatherImpact.annual_total_mm}mm` : "—", sub: "annual total", color: "#3b82f6" },
            { icon: "🌡️", label: "Avg Temperature", value: weatherImpact ? `${weatherImpact.temperature_c}°C` : "—", sub: "current", color: "#ef4444" },
          ].map(s => (
            <div key={s.label} style={{ backgroundColor: "#0d0d14", border: "1px solid #1a1a2a", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "24px", marginBottom: "10px" }}>{s.icon}</div>
              <div style={{ fontSize: "24px", fontWeight: 800, color: s.color, marginBottom: "4px" }}>{s.value}</div>
              <div style={{ fontSize: "11px", color: "#4a4a5a", textTransform: "uppercase", letterSpacing: "0.08em" }}>{s.label}</div>
              <div style={{ fontSize: "11px", color: "#2a2a3a", marginTop: "2px" }}>{s.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "20px" }}>

          {/* Rainfall Chart */}
          <div style={{ backgroundColor: "#0d0d14", border: "1px solid #1a1a2a", borderRadius: "16px", padding: "24px" }}>
            <div style={{ fontSize: "11px", color: "#4a4a5a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>Rainfall Analysis</div>
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "24px" }}>Monthly Rainfall Pattern (mm)</div>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "6px", height: "150px" }}>
              {months.map((month, i) => (
                <div key={month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
                  <div style={{ fontSize: "9px", color: "#4a4a5a" }}>{rainfallValues[i]}</div>
                  <div style={{
                    width: "100%",
                    height: `${(rainfallValues[i] / maxRain) * 120}px`,
                    background: rainfallValues[i] === maxRain
                      ? "linear-gradient(180deg, #f59e0b, #d97706)"
                      : "linear-gradient(180deg, #3b82f6, #1d4ed8)",
                    borderRadius: "4px 4px 0 0",
                    minHeight: "4px",
                  }} />
                  <div style={{ fontSize: "9px", color: "#4a4a5a" }}>{month}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: "24px", marginTop: "16px", paddingTop: "16px", borderTop: "1px solid #1a1a2a" }}>
              <div><span style={{ color: "#4a4a5a", fontSize: "12px" }}>Peak: </span><span style={{ color: "#f59e0b", fontWeight: 700 }}>{weatherImpact?.average_temperature + "°C" || "July"}</span></div>
              <div><span style={{ color: "#4a4a5a", fontSize: "12px" }}>Total: </span><span style={{ color: "#3b82f6", fontWeight: 700 }}>{weatherImpact?.average_rainfall || "—"}mm</span></div>
              <div><span style={{ color: "#4a4a5a", fontSize: "12px" }}>Dry months: </span><span style={{ color: "#6b6b7e", fontWeight: 700 }}>{ || "Jan, Feb, Dec"}</span></div>
            </div>
          </div>

          {/* Risk Assessment */}
          <div style={{ backgroundColor: "#0d0d14", border: "1px solid #1a1a2a", borderRadius: "16px", padding: "24px" }}>
            <div style={{ fontSize: "11px", color: "#4a4a5a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>Risk Assessment</div>
            <div style={{ fontSize: "16px", fontWeight: 700, marginBottom: "24px" }}>Season Risk Factors</div>
            {[
              { label: "Drought Risk", value: 35, color: "#ef4444" },
              { label: "Flood Risk", value: 20, color: "#3b82f6" },
              { label: "Pest Risk", value: 45, color: "#f59e0b" },
              { label: "Soil Degradation", value: 25, color: "#a855f7" },
              { label: "Heat Stress", value: 55, color: "#ec4899" },
            ].map(r => (
              <div key={r.label} style={{ marginBottom: "14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "12px", color: "#6b6b7e" }}>{r.label}</span>
                  <span style={{ fontSize: "12px", color: r.color, fontWeight: 700 }}>{r.value}%</span>
                </div>
                <div style={{ height: "6px", backgroundColor: "#0a0a0f", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${r.value}%`, backgroundColor: r.color, borderRadius: "3px" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Model Performance */}
        {modelPerformance && (
          <div style={{ backgroundColor: "#0d0d14", border: "1px solid #1a1a2a", borderRadius: "16px", padding: "24px", marginBottom: "20px" }}>
            <div style={{ fontSize: "11px", color: "#4a4a5a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "16px" }}>ML Model Performance</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
              <div style={{ backgroundColor: "#0a0a0f", borderRadius: "10px", padding: "20px", border: "1px solid rgba(34,197,94,0.2)" }}>
                <div style={{ fontSize: "36px", fontWeight: 900, color: "#22c55e" }}>{modelPerformance.accuracy_percent}%</div>
                <div style={{ fontSize: "12px", color: "#4a4a5a", textTransform: "uppercase", letterSpacing: "0.08em" }}>Model Accuracy (R2)</div>
                <div style={{ marginTop: "12px", height: "6px", backgroundColor: "#1a1a2a", borderRadius: "3px" }}>
                  <div style={{ height: "100%", width: `${modelPerformance.accuracy_percent}%`, background: "linear-gradient(90deg, #22c55e, #4ade80)", borderRadius: "3px" }} />
                </div>
              </div>
              <div style={{ backgroundColor: "#0a0a0f", borderRadius: "10px", padding: "20px", border: "1px solid rgba(245,158,11,0.2)" }}>
                <div style={{ fontSize: "36px", fontWeight: 900, color: "#f59e0b" }}>{modelPerformance.mae}</div>
                <div style={{ fontSize: "12px", color: "#4a4a5a", textTransform: "uppercase", letterSpacing: "0.08em" }}>Mean Absolute Error</div>
                <div style={{ fontSize: "11px", color: "#4a4a5a", marginTop: "8px" }}>tons per hectare deviation</div>
              </div>
              <div style={{ backgroundColor: "#0a0a0f", borderRadius: "10px", padding: "20px", border: "1px solid rgba(99,102,241,0.2)" }}>
                <div style={{ fontSize: "36px", fontWeight: 900, color: "#6366f1" }}>{modelPerformance.training_samples?.toLocaleString()}</div>
                <div style={{ fontSize: "12px", color: "#4a4a5a", textTransform: "uppercase", letterSpacing: "0.08em" }}>Training Samples</div>
                <div style={{ fontSize: "11px", color: "#4a4a5a", marginTop: "8px" }}>{modelPerformance.n_crops} crop types</div>
              </div>
            </div>
          </div>
        )}

        {/* Crop Performance Table */}
        <div style={{ backgroundColor: "#0d0d14", border: "1px solid #1a1a2a", borderRadius: "16px", padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <div>
              <div style={{ fontSize: "11px", color: "#4a4a5a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "4px" }}>Comparative Analysis</div>
              <div style={{ fontSize: "16px", fontWeight: 700 }}>Crop Performance Report</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button style={{ backgroundColor: "transparent", border: "1px solid #1a1a2a", borderRadius: "8px", padding: "8px 16px", color: "#6b6b7e", fontSize: "13px", cursor: "pointer" }}>Filter</button>
              <button style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", border: "none", borderRadius: "8px", padding: "8px 16px", color: "#0a0a0f", fontSize: "13px", fontWeight: 700, cursor: "pointer" }}>Export CSV</button>
            </div>
          </div>

          {/* Table Header */}
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: "16px", padding: "10px 16px", backgroundColor: "#0a0a0f", borderRadius: "8px", marginBottom: "8px" }}>
            {["Crop Type", "Avg Yield", "Trend", "Risk Level", "Action"].map(h => (
              <div key={h} style={{ fontSize: "11px", color: "#4a4a5a", letterSpacing: "0.08em", textTransform: "uppercase" }}>{h}</div>
            ))}
          </div>

          {cropData.map((crop, i) => (
            <div key={i}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = "#0d0d14"}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = "transparent"}
              style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: "16px", padding: "14px 16px", borderBottom: "1px solid #1a1a2a", alignItems: "center", transition: "background-color 0.2s" }}>
              <div style={{ fontWeight: 600, fontSize: "14px" }}>🌾 {crop.crop}</div>
              <div style={{ fontSize: "14px", color: "#f59e0b", fontWeight: 700 }}>{crop.avgYield}</div>
              <div style={{ fontSize: "13px", color: crop.trend.startsWith("+") ? "#22c55e" : "#ef4444", fontWeight: 600 }}>{crop.trend}</div>
              <div>
                <span style={{ fontSize: "11px", color: riskColor(crop.risk), backgroundColor: `${riskColor(crop.risk)}15`, border: `1px solid ${riskColor(crop.risk)}30`, borderRadius: "100px", padding: "3px 10px" }}>
                  {crop.risk}
                </span>
              </div>
              <button style={{ backgroundColor: "transparent", border: "1px solid #1a1a2a", borderRadius: "6px", padding: "6px 12px", color: "#6b6b7e", fontSize: "12px", cursor: "pointer" }}>
                View Report →
              </button>
            </div>
          ))}

          {/* Prediction History */}
          {recentPredictions.length > 0 && (
            <div style={{ marginTop: "24px" }}>
              <div style={{ fontSize: "11px", color: "#4a4a5a", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px" }}>Recent Predictions</div>
              {recentPredictions.slice(0,5).map((pred: any, i: number) => (
                <div key={i} style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", gap: "16px", padding: "12px 16px", borderBottom: "1px solid #1a1a2a", alignItems: "center" }}>
                  <div style={{ fontSize: "13px", fontWeight: 600 }}>🌾 {pred.crop_type}</div>
                  <div style={{ fontSize: "13px", color: "#f59e0b", fontWeight: 700 }}>{pred.predicted_yield_tons_per_ha} t/ha</div>
                  <div style={{ fontSize: "12px", color: "#6b6b7e" }}>{pred.temperature_c}°C / {pred.rainfall_mm}mm</div>
                  <div>
                    <span style={{ fontSize: "11px", color: riskColor(pred.risk_level), backgroundColor: `${riskColor(pred.risk_level)}15`, borderRadius: "100px", padding: "2px 8px" }}>
                      {pred.risk_level}
                    </span>
                  </div>
                  <div style={{ fontSize: "11px", color: "#4a4a5a" }}>{new Date(pred.created_at).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
