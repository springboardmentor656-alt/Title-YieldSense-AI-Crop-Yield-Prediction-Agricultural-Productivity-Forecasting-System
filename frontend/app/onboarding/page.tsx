"use client";

import { useRouter } from "next/navigation";
import { useOnboarding } from "../../hooks/useOnboarding";

const ROLES = ["Farmer", "Cooperative Member", "Agribusiness", "Government Officer"] as const;
const CROPS = ["Rice", "Cotton", "Wheat", "Maize"] as const;

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
    <main style={{ maxWidth: 480, margin: "0 auto", padding: "2rem" }}>
      {step === 1 && (
        <section>
          <h2>Who are you?</h2>
          {ROLES.map((role) => (
            <label key={role} style={{ display: "block" }}>
              <input type="radio" name="role" checked={data.role === role} onChange={() => setRole(role)} />
              {role}
            </label>
          ))}
        </section>
      )}

      {step === 2 && (
        <section>
          <h2>Where is your farm?</h2>
          <label>
            State
            <input value={data.state} onChange={(e) => setLocation(e.target.value, data.district)} />
          </label>
          <label>
            District
            <input value={data.district} onChange={(e) => setLocation(data.state, e.target.value)} />
          </label>
        </section>
      )}

      {step === 3 && (
        <section>
          <h2>What crops do you grow?</h2>
          {CROPS.map((crop) => (
            <label key={crop} style={{ display: "block" }}>
              <input type="checkbox" checked={data.crops.includes(crop)} onChange={() => toggleCrop(crop)} />
              {crop}
            </label>
          ))}

          <h2 style={{ marginTop: "1.5rem" }}>Create your account</h2>
          <label>
            Full name
            <input value={data.fullName} onChange={(e) => setAccountField("fullName", e.target.value)} />
          </label>
          <label>
            Email
            <input type="email" value={data.email} onChange={(e) => setAccountField("email", e.target.value)} />
          </label>
          <label>
            Password
            <input type="password" value={data.password} onChange={(e) => setAccountField("password", e.target.value)} />
          </label>
          {submitError && <p style={{ color: "#C62828" }}>{submitError}</p>}
        </section>
      )}

      <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between" }}>
        {step > 1 && <button onClick={prevStep}>← Back</button>}
        <button disabled={!isStepValid() || submitting} onClick={handlePrimaryAction}>
          {submitting ? "Submitting..." : step < 3 ? "Next →" : "Start My Smart Farming Journey 🚜"}
        </button>
      </div>
    </main>
  );
}