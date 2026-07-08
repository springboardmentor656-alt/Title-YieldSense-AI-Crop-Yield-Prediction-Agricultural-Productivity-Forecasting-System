// Dashboard — personalized with the user's onboarding data, styled to match the rest of the app.
// File: frontend/app/dashboard/page.tsx

"use client";


import Navbar from "../../components/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Profile {
  fullName: string;
  state: string;
  district: string;
  crops: string[];
}

// Mock baseline yields per crop (kg/ha) — placeholder until Milestone-2's real model is wired in.
const MOCK_YIELD: Record<string, number> = {
  Rice: 4120,
  Cotton: 1850,
  Wheat: 3260,
  Maize: 5480,
};

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("ys_access_token");
    if (!token) {
      router.push("/login");
      return;
    }
    const raw = localStorage.getItem("ys_profile");
    if (raw) {
      try {
        setProfile(JSON.parse(raw));
      } catch {
        setProfile(null);
      }
    }
    setChecked(true);
  }, [router]);

  if (!checked) return null; // avoid flashing content before the auth check resolves

  const firstName = profile?.fullName?.split(" ")[0] ?? "there";

  return(
  <>
    <Navbar />
    <main className="page">
      <section className="header">
        <div>
          <h1 className="greeting">Welcome back, {firstName} 👋</h1>
          {profile?.state && (
            <p className="location">
              📍 {profile.district}, {profile.state}
            </p>
          )}
        </div>
      </section>

      <section className="statGrid">
        {(profile?.crops?.length ? profile.crops : ["Rice"]).map((crop) => (
          <div key={crop} className="statCard">
            <span className="statLabel">Predicted Yield — {crop}</span>
            <span className="statValue">{(MOCK_YIELD[crop] ?? 4000).toLocaleString()} kg/ha</span>
            <span className="statNote">Based on regional historical averages</span>
          </div>
        ))}
      </section>

      <section className="noticeCard">
        <span className="noticeIcon">🚧</span>
        <div>
          <strong>Live yield trends and recommendations are coming in Milestone-2.</strong>
          <p>These figures are placeholders until the ML prediction service is connected.</p>
        </div>
      </section>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #f7f9f6;
          padding: 3rem 2rem;
          max-width: 960px;
          margin: 0 auto;
        }
        .header { margin-bottom: 2rem; }
        .greeting {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1a1a1a;
          margin: 0 0 0.4rem;
        }
        .location {
          font-size: 0.95rem;
          color: #5f6368;
          margin: 0;
        }
        .statGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }
        .statCard {
          background: #ffffff;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(26, 26, 26, 0.06);
          padding: 1.5rem;
          flex: 1;
          min-width: 220px;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .statCard:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(27, 94, 32, 0.12);
        }
        .statLabel {
          font-size: 0.85rem;
          font-weight: 600;
          color: #5f6368;
        }
        .statValue {
          font-size: 1.6rem;
          font-weight: 800;
          color: #1b5e20;
        }
        .statNote {
          font-size: 0.78rem;
          color: #999;
        }
        .noticeCard {
          display: flex;
          gap: 1rem;
          align-items: flex-start;
          background: #e8f5e9;
          border-radius: 14px;
          padding: 1.25rem 1.5rem;
        }
        .noticeIcon { font-size: 1.5rem; }
        .noticeCard strong {
          display: block;
          color: #1b5e20;
          font-size: 0.95rem;
          margin-bottom: 0.25rem;
        }
        .noticeCard p {
          margin: 0;
          font-size: 0.85rem;
          color: #4a5a4b;
        }
      `}</style>
    </main>
  </>
);
}
