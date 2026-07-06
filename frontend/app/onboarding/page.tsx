// Onboarding flow — Role -> Location -> Crops + Account -> Submit.
// File: frontend/app/onboarding/page.tsx

"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "../../hooks/useOnboarding";

const ROLES = [
  { label: "Farmer", icon: "🧑‍🌾" },
  { label: "Cooperative Member", icon: "🤝" },
  { label: "Agribusiness", icon: "🏢" },
  { label: "Government Officer", icon: "🏛️" },
] as const;

const CROPS = [
  { label: "Rice", icon: "🌾" },
  { label: "Cotton", icon: "🧵" },
  { label: "Wheat", icon: "🌿" },
  { label: "Maize", icon: "🌽" },
] as const;

export default function OnboardingPage() {
  const router = useRouter();
  const {
    step, data, setRole, setLocation, toggleCrop, setAccountField,
    nextStep, prevStep, isStepValid, submit, submitting, submitError,
  } = useOnboarding();

  async function handlePrimaryAction() {
    if (step < 3) {
      nextStep();
      return;
    }
    try {
      const response = await submit();
      localStorage.setItem("ys_access_token", response.access_token);
      localStorage.setItem("ys_role", response.role);
      router.push("/dashboard");
    } catch {
      // submitError already set inside the hook
    }
  }

  return (
    <main className="page">
      <span className="glyph g1" aria-hidden="true">🌾</span>
      <span className="glyph g2" aria-hidden="true">🌱</span>

      <div className="card">
        <div className="logo">🌾 YieldSense AI</div>

        <div className="progress">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`dot ${step >= n ? "dotActive" : ""}`} />
          ))}
        </div>

        {step === 1 && (
          <section className="stepBody" key="step1">
            <h2 className="stepTitle">Who are you?</h2>
            <p className="stepSubtitle">This shapes your dashboard and recommendations.</p>
            <div className="roleGrid">
              {ROLES.map(({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  className={`roleCard ${data.role === label ? "roleCardActive" : ""}`}
                  onClick={() => setRole(label)}
                >
                  <span className="roleIcon">{icon}</span>
                  <span className="roleLabel">{label}</span>
                </button>
              ))}
            </div>
          </section>
        )}

        {step === 2 && (
          <section className="stepBody" key="step2">
            <h2 className="stepTitle">Where is your farm?</h2>
            <p className="stepSubtitle">We'll localize predictions to your region.</p>
            <div className="field">
              <label className="fieldLabel">State</label>
              <input
                className="input"
                placeholder="e.g. Telangana"
                value={data.state}
                onChange={(e) => setLocation(e.target.value, data.district)}
              />
            </div>
            <div className="field">
              <label className="fieldLabel">District</label>
              <input
                className="input"
                placeholder="e.g. Krishna"
                value={data.district}
                onChange={(e) => setLocation(data.state, e.target.value)}
              />
            </div>
          </section>
        )}

        {step === 3 && (
          <section className="stepBody" key="step3">
            <h2 className="stepTitle">What crops do you grow?</h2>
            <p className="stepSubtitle">Select all that apply.</p>
            <div className="chipRow">
              {CROPS.map(({ label, icon }) => (
                <button
                  key={label}
                  type="button"
                  className={`chip ${data.crops.includes(label) ? "chipActive" : ""}`}
                  onClick={() => toggleCrop(label)}
                >
                  <span>{icon}</span> {label}
                </button>
              ))}
            </div>

            <h2 className="stepTitle" style={{ marginTop: "1.75rem" }}>Create your account</h2>
            <div className="field">
              <label className="fieldLabel">Full name</label>
              <input
                className="input"
                value={data.fullName}
                onChange={(e) => setAccountField("fullName", e.target.value)}
              />
            </div>
            <div className="field">
              <label className="fieldLabel">Email</label>
              <input
                className="input"
                type="email"
                value={data.email}
                onChange={(e) => setAccountField("email", e.target.value)}
              />
            </div>
            <div className="field">
              <label className="fieldLabel">Password</label>
              <input
                className="input"
                type="password"
                value={data.password}
                onChange={(e) => setAccountField("password", e.target.value)}
              />
            </div>

            {submitError && <div className="errorBanner">{submitError}</div>}
          </section>
        )}

        <div className="actions">
          {step > 1 ? (
            <button className="backBtn" onClick={prevStep}>← Back</button>
          ) : <span />}
          <button
            className="primaryBtn"
            disabled={!isStepValid() || submitting}
            onClick={handlePrimaryAction}
          >
            {submitting && <span className="spinner" />}
            {submitting ? "Submitting..." : step < 3 ? "Next →" : "Start My Smart Farming Journey 🚜"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .page {
          position: relative;
          overflow: hidden;
          min-height: 100vh;
          background: #f7f9f6;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem 1rem;
        }
        .glyph {
          position: absolute;
          font-size: 9rem;
          opacity: 0.06;
          pointer-events: none;
        }
        .g1 { top: -2rem; left: -2rem; transform: rotate(-15deg); }
        .g2 { bottom: -3rem; right: -2rem; transform: rotate(20deg); }

        .card {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 560px;
          background: #ffffff;
          border-radius: 20px;
          box-shadow: 0 12px 32px rgba(27, 94, 32, 0.14);
          padding: 2.5rem 2.25rem;
          animation: fadeInUp 0.4s ease both;
        }
        .logo {
          font-size: 1.15rem;
          font-weight: 700;
          color: #1b5e20;
          margin-bottom: 1.25rem;
        }
        .progress {
          display: flex;
          gap: 8px;
          margin-bottom: 2rem;
        }
        .dot {
          height: 6px;
          flex: 1;
          border-radius: 999px;
          background: #e0e0e0;
          transition: background 0.3s ease;
        }
        .dotActive { background: #2e7d32; }

        .stepBody { animation: fadeIn 0.35s ease both; }
        .stepTitle {
          font-size: 1.4rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 0.35rem;
        }
        .stepSubtitle {
          font-size: 0.9rem;
          color: #5f6368;
          margin: 0 0 1.5rem;
        }

        .roleGrid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.75rem;
        }
        .roleCard {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          padding: 1.25rem 0.75rem;
          border: 2px solid #e0e0e0;
          border-radius: 14px;
          background: #f7f9f6;
          cursor: pointer;
          transition: border-color 0.15s ease, transform 0.15s ease, background 0.15s ease;
          font-family: inherit;
        }
        .roleCard:hover { transform: translateY(-2px); }
        .roleCardActive {
          border-color: #2e7d32;
          background: #e8f5e9;
        }
        .roleIcon { font-size: 1.75rem; }
        .roleLabel { font-size: 0.85rem; font-weight: 600; color: #1a1a1a; text-align: center; }

        .field { margin-bottom: 1.25rem; }
        .fieldLabel {
          display: block;
          font-size: 0.85rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.4rem;
        }
        .input {
          width: 100%;
          box-sizing: border-box;
          padding: 0.7rem 0.9rem;
          border-radius: 10px;
          border: 1px solid #e0e0e0;
          font-size: 1rem;
          font-family: inherit;
          background: #f7f9f6;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        .input:focus {
          outline: none;
          border-color: #2e7d32;
          box-shadow: 0 0 0 3px #e8f5e9;
        }

        .chipRow {
          display: flex;
          flex-wrap: wrap;
          gap: 0.6rem;
          margin-bottom: 0.5rem;
        }
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.55rem 1rem;
          border-radius: 999px;
          border: 2px solid #e0e0e0;
          background: #f7f9f6;
          font-size: 0.9rem;
          font-weight: 600;
          color: #1a1a1a;
          cursor: pointer;
          font-family: inherit;
          transition: border-color 0.15s ease, background 0.15s ease, transform 0.15s ease;
        }
        .chip:hover { transform: translateY(-1px); }
        .chipActive {
          border-color: #2e7d32;
          background: #e8f5e9;
          color: #1b5e20;
        }

        .errorBanner {
          background: #fdeceA;
          color: #c62828;
          padding: 0.7rem 1rem;
          border-radius: 10px;
          font-size: 0.9rem;
          margin-top: 1rem;
        }

        .actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
        }
        .backBtn {
          background: none;
          border: none;
          color: #5f6368;
          font-weight: 600;
          font-size: 0.95rem;
          cursor: pointer;
          padding: 0.6rem 0.5rem;
        }
        .backBtn:hover { color: #1b5e20; }

        .primaryBtn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: linear-gradient(135deg, #1b5e20, #2e7d32);
          color: #fff;
          border: none;
          padding: 0.8rem 1.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          box-shadow: 0 6px 16px rgba(27, 94, 32, 0.25);
          transition: transform 0.15s ease;
        }
        .primaryBtn:hover:not(:disabled) { transform: translateY(-2px); }
        .primaryBtn:disabled {
          background: #e0e0e0;
          color: #5f6368;
          cursor: not-allowed;
          box-shadow: none;
        }
        .spinner {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }

        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        @media (max-width: 480px) {
          .card { padding: 2rem 1.5rem; }
          .roleGrid { grid-template-columns: 1fr; }
        }
      `}</style>
    </main>
  );
}