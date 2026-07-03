"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import FieldInput from "@/components/FieldInput";
import SoilHorizonBar from "@/components/SoilHorizonBar";
import { api, storeSession } from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Farmer" | "Admin">("Farmer");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password needs at least 8 characters.");
      return;
    }

    setLoading(true);
    try {
      const token = await api.register(email, password, role);
      storeSession(token);
      router.push("/onboarding");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <SoilHorizonBar />
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-canopy">Sign up</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Start your first farm profile.</h1>

        <form onSubmit={handleSubmit} className="mt-8 border-t border-line">
          <FieldInput
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@farmdomain.com"
            autoComplete="email"
          />
          <FieldInput
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            autoComplete="new-password"
          />

          <div className="border-b border-line py-3">
            <span className="text-sm text-ink/70">Account type</span>
            <div className="mt-2 flex gap-2">
              {(["Farmer", "Admin"] as const).map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setRole(r)}
                  className={`border px-4 py-2 text-sm transition ${
                    role === r
                      ? "border-canopy bg-canopy text-paper"
                      : "border-line text-ink/60 hover:border-canopy hover:text-canopy"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <p role="alert" className="mt-3 border border-clay bg-clay/10 px-3 py-2 text-sm text-clay">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full border border-ink bg-ink py-3 text-sm font-medium text-paper transition hover:bg-canopyDeep hover:border-canopyDeep disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/60">
          Already have an account?{" "}
          <Link href="/login" className="text-canopy underline underline-offset-2">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
