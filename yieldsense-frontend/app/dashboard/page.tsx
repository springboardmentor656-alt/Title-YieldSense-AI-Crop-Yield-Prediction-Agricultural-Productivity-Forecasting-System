"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { api, type FarmResponse } from "@/lib/api";

function PlaceholderPanel({ title, note }: { title: string; note: string }) {
  return (
    <div className="border border-line p-6">
      <h3 className="font-display text-lg font-semibold">{title}</h3>
      <div className="mt-4 flex h-40 items-center justify-center border border-dashed border-line bg-ink/[0.02]">
        <p className="max-w-[220px] text-center text-xs text-ink/40">{note}</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [farms, setFarms] = useState<FarmResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .listFarms()
      .then(setFarms)
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load farms"));
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar role="Farmer" />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-canopy">Dashboard</p>
            <h1 className="mt-2 font-display text-3xl font-bold">Your farms, at a glance.</h1>
          </div>
          <Link
            href="/onboarding"
            className="inline-block border border-ink px-4 py-2 text-center text-sm font-medium transition hover:border-canopy hover:text-canopy"
          >
            + Add farm
          </Link>
        </div>

        {error && (
          <p role="alert" className="mt-6 border border-clay bg-clay/10 px-3 py-2 text-sm text-clay">
            {error}
          </p>
        )}

        <section className="mt-8 overflow-x-auto border border-line">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink/40">
                <th className="px-4 py-3 font-normal">Farm</th>
                <th className="px-4 py-3 font-normal">Coordinates</th>
                <th className="px-4 py-3 font-normal">Soil pH</th>
              </tr>
            </thead>
            <tbody>
              {farms === null && !error && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-ink/40">
                    Loading farms…
                  </td>
                </tr>
              )}
              {farms?.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-4 py-6 text-center text-ink/40">
                    No farms logged yet. Add your first acreage to unlock forecasts.
                  </td>
                </tr>
              )}
              {farms?.map((farm) => (
                <tr key={farm.id} className="border-b border-line last:border-0">
                  <td className="px-4 py-3 font-medium">{farm.farm_name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink/60">
                    {farm.latitude.toFixed(4)}, {farm.longitude.toFixed(4)}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-ink/60">
                    {farm.soil_ph?.toFixed(2) ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Milestone 2 will wire these to the trained model's outputs. */}
        <section className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
          <PlaceholderPanel
            title="Yield estimation"
            note="Forecast chart (kg/ha) renders here once the model is trained in Milestone 2."
          />
          <PlaceholderPanel
            title="Climate risk map"
            note="Regional risk overlay pulls from the weather API integration."
          />
          <PlaceholderPanel
            title="Feature coefficients"
            note="Shows which inputs (rainfall, N-P-K, temperature) most affect the forecast."
          />
        </section>
      </div>
    </main>
  );
}
