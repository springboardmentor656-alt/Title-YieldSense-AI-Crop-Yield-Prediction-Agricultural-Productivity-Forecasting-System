"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import FieldInput from "@/components/FieldInput";
import SoilHorizonBar from "@/components/SoilHorizonBar";
import { api, storeSession } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const token = await api.login(email, password);
      storeSession(token);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not log in");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <SoilHorizonBar />
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6 sm:py-20">
        <p className="font-mono text-xs uppercase tracking-widest text-canopy">Log in</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Welcome back to the field.</h1>

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
            placeholder="••••••••"
            autoComplete="current-password"
          />

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
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>

        <p className="mt-6 text-sm text-ink/60">
          No account yet?{" "}
          <Link href="/signup" className="text-canopy underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
