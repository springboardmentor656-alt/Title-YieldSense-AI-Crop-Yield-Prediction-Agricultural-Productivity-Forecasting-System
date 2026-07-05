"use client";

export default function DashboardPage() {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem" }}>
      <h1>Welcome back 👋</h1>
      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem", flexWrap: "wrap" }}>
        <div className="stat-card">
          <strong>Predicted Yield (Rice)</strong>
          <p>4,120 kg/ha</p>
        </div>
        <div className="stat-card">
          <strong>Land Size</strong>
          <p>2.4 ha</p>
        </div>
        <div className="stat-card">
          <strong>Active Crops</strong>
          <p>Rice, Cotton</p>
        </div>
      </div>
      <p style={{ marginTop: "2rem", color: "#5F6368" }}>
        Yield trend charts and recommendations arrive in Milestone-2.
      </p>
    </main>
  );
}