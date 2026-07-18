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

      <section className="predictCta">
        <h3>Ready to see your yield prediction?</h3>
        <p>Enter your soil and crop details to get a live, personalized forecast.</p>
        <a href="/predict" className="ctaButton">Get a Live Prediction →</a>
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
        .predictCta {
          background: #e8f5e9;
          border-radius: 16px;
          box-shadow: 0 4px 16px rgba(26, 26, 26, 0.06);
          padding: 2.5rem 2rem;
          text-align: center;
        }
        .predictCta h3 {
          margin: 0 0 0.5rem;
          font-size: 1.3rem;
          font-weight: 800;
          color: #1b5e20;
        }
        .predictCta p {
          margin: 0 0 1.25rem;
          font-size: 0.9rem;
          color: #4a5a4b;
        }
        .ctaButton {
          display: inline-block;
          background: #15803d;
          color: white;
          padding: 0.75rem 1.75rem;
          border-radius: 10px;
          font-weight: 700;
          text-decoration: none;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .ctaButton:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(27, 94, 32, 0.25);
        }
      `}</style>
    </main>
  </>
);
}