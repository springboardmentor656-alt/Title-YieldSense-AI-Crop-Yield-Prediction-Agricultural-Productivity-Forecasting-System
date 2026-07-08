"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { api, type FarmResponse } from "@/lib/api";

function DashboardMetric({ title, value, subtitle }: { title: string; value: string | React.ReactNode; subtitle?: string }) {
  return (
    <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between group hover:border-primary/30 transition-all duration-300 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-primary/10 transition-all"></div>
      <h3 className="text-textSecondary text-sm font-medium mb-4 uppercase tracking-wider">{title}</h3>
      <div className="font-display text-4xl font-bold text-white mb-2">{value}</div>
      {subtitle && <p className="text-xs text-textMuted">{subtitle}</p>}
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
    <main className="min-h-screen relative overflow-hidden flex flex-col pb-20">
      <div className="absolute top-0 left-1/4 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none -translate-y-1/2"></div>
      <Navbar role="Farmer" />
      
      <div className="flex-1 max-w-6xl w-full mx-auto px-6 mt-12 animate-fade-in relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-block mb-3 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary font-mono text-xs uppercase tracking-widest">
              Command Center
            </div>
            <h1 className="font-display text-4xl font-bold tracking-tight text-white">Your Dashboard</h1>
          </div>
          <Link href="/onboarding" className="btn-primary inline-flex items-center gap-2 whitespace-nowrap shadow-[0_0_20px_rgba(16,185,129,0.2)]">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            Add New Farm
          </Link>
        </div>

        {error && (
          <div role="alert" className="mb-8 bg-danger/10 border border-danger/30 rounded-lg p-4">
            <p className="text-sm text-danger font-medium flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-danger inline-block"></span>
              {error}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <DashboardMetric 
            title="Total Acreage" 
            value={farms ? farms.length : <span className="animate-pulse bg-white/10 w-24 h-10 rounded block"></span>} 
            subtitle="Active registered farms" 
          />
          <DashboardMetric 
            title="Yield Forecast" 
            value={<span className="text-primary/70 italic text-2xl font-light">Pending Analysis</span>} 
            subtitle="Model training in progress" 
          />
          <DashboardMetric 
            title="Climate Risk" 
            value={<span className="text-primary/70 italic text-2xl font-light">Awaiting Data</span>} 
            subtitle="API sync pending" 
          />
        </div>

        <h2 className="text-xl font-semibold mb-6 flex items-center gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          Registered Locations
        </h2>

        <div className="glass-panel rounded-2xl overflow-hidden border border-white/5">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-textSecondary font-medium">Farm Name</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-textSecondary font-medium">Coordinates</th>
                <th className="px-6 py-4 text-xs uppercase tracking-wider text-textSecondary font-medium text-right">Soil pH</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {farms === null && !error && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      <span className="text-textMuted text-sm">Synchronizing ledger...</span>
                    </div>
                  </td>
                </tr>
              )}
              {farms?.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-16 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-textMuted"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="12" y1="18" x2="12" y2="12"></line><line x1="9" y1="15" x2="15" y2="15"></line></svg>
                      </div>
                      <p className="text-textSecondary mb-2">No farms registered yet</p>
                      <p className="text-sm text-textMuted max-w-sm">Add your first acreage to start generating intelligent yield forecasts.</p>
                    </div>
                  </td>
                </tr>
              )}
              {farms?.map((farm) => (
                <tr key={farm.id} className="hover:bg-white/5 transition-colors group cursor-default">
                  <td className="px-6 py-5 font-medium text-white flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(16,185,129,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    {farm.farm_name}
                  </td>
                  <td className="px-6 py-5 font-mono text-sm text-textSecondary">
                    <span className="bg-black/30 px-2 py-1 rounded text-textMuted">
                      {farm.latitude.toFixed(4)}, {farm.longitude.toFixed(4)}
                    </span>
                  </td>
                  <td className="px-6 py-5 font-mono text-sm text-right">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${farm.soil_ph ? 'bg-emerald-900/40 text-emerald-400 border border-emerald-500/20' : 'bg-white/5 text-textMuted'}`}>
                      {farm.soil_ph?.toFixed(2) ?? "—"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
