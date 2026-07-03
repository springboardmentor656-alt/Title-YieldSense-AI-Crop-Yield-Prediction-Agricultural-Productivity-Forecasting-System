"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import FieldInput from "@/components/FieldInput";
import Navbar from "@/components/Navbar";
import { api } from "@/lib/api";

interface FormState {
  farm_name: string;
  latitude: string;
  longitude: string;
  soil_ph: string;
  soil_n: string;
  soil_p: string;
  soil_k: string;
}

const initialState: FormState = {
  farm_name: "",
  latitude: "",
  longitude: "",
  soil_ph: "",
  soil_n: "",
  soil_p: "",
  soil_k: "",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update<K extends keyof FormState>(key: K, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api.createFarm({
        farm_name: form.farm_name,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        soil_ph: form.soil_ph ? Number(form.soil_ph) : undefined,
        soil_n: form.soil_n ? Number(form.soil_n) : undefined,
        soil_p: form.soil_p ? Number(form.soil_p) : undefined,
        soil_k: form.soil_k ? Number(form.soil_k) : undefined,
      });
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save this farm profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="font-mono text-xs uppercase tracking-widest text-canopy">Farm profile</p>
        <h1 className="mt-2 font-display text-3xl font-bold">Log a new acreage.</h1>
        <p className="mt-2 text-sm text-ink/60">
          Geo-coordinates pull historical weather; soil readings feed the recommendation module.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 border-t border-line">
          <FieldInput
            label="Farm name"
            required
            value={form.farm_name}
            onChange={(e) => update("farm_name", e.target.value)}
            placeholder="North Ridge Plot"
          />

          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            <FieldInput
              label="Latitude"
              type="number"
              step="0.000001"
              required
              value={form.latitude}
              onChange={(e) => update("latitude", e.target.value)}
              placeholder="12.971600"
            />
            <FieldInput
              label="Longitude"
              type="number"
              step="0.000001"
              required
              value={form.longitude}
              onChange={(e) => update("longitude", e.target.value)}
              placeholder="77.594600"
            />
          </div>

          <p className="pt-6 pb-1 text-xs uppercase tracking-widest text-ink/40">Soil reading</p>
          <div className="grid grid-cols-1 gap-x-6 sm:grid-cols-2">
            <FieldInput
              label="Soil pH"
              unit="0–14"
              type="number"
              step="0.01"
              value={form.soil_ph}
              onChange={(e) => update("soil_ph", e.target.value)}
              placeholder="6.50"
            />
            <FieldInput
              label="Nitrogen (N)"
              unit="kg/ha"
              type="number"
              value={form.soil_n}
              onChange={(e) => update("soil_n", e.target.value)}
              placeholder="80"
            />
            <FieldInput
              label="Phosphorus (P)"
              unit="kg/ha"
              type="number"
              value={form.soil_p}
              onChange={(e) => update("soil_p", e.target.value)}
              placeholder="40"
            />
            <FieldInput
              label="Potassium (K)"
              unit="kg/ha"
              type="number"
              value={form.soil_k}
              onChange={(e) => update("soil_k", e.target.value)}
              placeholder="40"
            />
          </div>

          {error && (
            <p role="alert" className="mt-3 border border-clay bg-clay/10 px-3 py-2 text-sm text-clay">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full border border-ink bg-ink py-3 text-sm font-medium text-paper transition hover:bg-canopyDeep hover:border-canopyDeep disabled:opacity-50 sm:w-auto sm:px-8"
          >
            {loading ? "Saving…" : "Save farm profile"}
          </button>
        </form>
      </div>
    </main>
  );
}
