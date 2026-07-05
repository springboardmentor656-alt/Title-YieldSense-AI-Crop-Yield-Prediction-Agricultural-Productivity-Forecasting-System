"use client";

import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main style={{ maxWidth: 480, margin: "10vh auto", textAlign: "center", padding: "2rem" }}>
      <h1>🌾 YieldSense AI</h1>
      <p style={{ color: "#5F6368", marginBottom: "2rem" }}>
        Smart farming decisions start here.
      </p>
      <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
        <button onClick={() => router.push("/onboarding")}>Get Started</button>
        <button onClick={() => router.push("/login")} style={{ background: "#E0E0E0", color: "#1A1A1A" }}>
          Log In
        </button>
      </div>
    </main>
  );
}