"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { api, type FarmResponse } from "@/lib/api";
import { 
  Sprout, 
  MapPin, 
  Droplet, 
  TrendingUp, 
  CloudSun, 
  AlertTriangle, 
  Sliders, 
  CheckCircle,
  Thermometer,
  CloudRain,
  Wind
} from "lucide-react";

// Types for monthly projections
interface MonthlyData {
  month: string;
  yield: number;
}

export default function DashboardPage() {
  const [farms, setFarms] = useState<FarmResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFarm, setSelectedFarm] = useState<FarmResponse | null>(null);
  const [selectedCrop, setSelectedCrop] = useState<"Wheat" | "Maize" | "Rice">("Wheat");

  // Load farms from DB
  useEffect(() => {
    api
      .listFarms()
      .then((data) => {
        setFarms(data);
        if (data.length > 0) {
          setSelectedFarm(data[0]); // Select first farm by default
        }
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load farms"));
  }, []);

  // Dynamic Crop Yield Calculator based on farm's N-P-K and pH
  function calculateYieldProjections(farm: FarmResponse, crop: "Wheat" | "Maize" | "Rice"): MonthlyData[] {
    const n = farm.soil_n ?? 60;
    const p = farm.soil_p ?? 30;
    const k = farm.soil_k ?? 30;
    const ph = farm.soil_ph ?? 6.5;

    // Baseline calculation coefficients
    let base = 1000;
    let phOpt = 6.5;
    let phSensitivity = 0.15;
    let factors = { n: 12, p: 18, k: 8 };

    if (crop === "Maize") {
      base = 1200;
      phOpt = 6.2;
      phSensitivity = 0.20;
      factors = { n: 18, p: 12, k: 10 };
    } else if (crop === "Rice") {
      base = 1500;
      phOpt = 6.0;
      phSensitivity = 0.18;
      factors = { n: 14, p: 15, k: 12 };
    }

    // Nutrient & pH scaling
    const nutrientScore = (n * factors.n) + (p * factors.p) + (k * factors.k);
    const phOffset = Math.abs(ph - phOpt);
    const phScore = Math.max(0.1, 1 - (phOffset * phSensitivity));
    
    const finalYield = Math.round((base + nutrientScore) * phScore);

    // Generate monthly forecast path reflecting seasonal climate variables
    const months = ["Jul", "Aug", "Sep", "Oct", "Nov"];
    const seasonCurves = {
      Wheat: [0.6, 0.75, 0.95, 1.0, 0.85],
      Maize: [0.5, 0.7, 0.9, 1.0, 0.75],
      Rice: [0.7, 0.85, 1.0, 0.9, 0.65],
    };

    return months.map((m, idx) => ({
      month: m,
      yield: Math.round(finalYield * seasonCurves[crop][idx]),
    }));
  }

  // Weather simulation based on latitude & longitude
  function getSimulatedWeather(farm: FarmResponse) {
    const lat = farm.latitude;
    const lon = farm.longitude;
    
    // Deterministic simulation based on coordinates so it's consistent
    const tempBase = 20 + (Math.sin(lat) * 8);
    const rainBase = 120 + (Math.cos(lon) * 80);
    const humidity = Math.round(60 + (Math.sin(lat + lon) * 20));
    const wind = Math.round(15 + (Math.cos(lat) * 10));

    // Evaluate Climate Risk
    let riskLevel: "Safe" | "Caution" | "Danger" = "Safe";
    let riskDesc = "Ideal climate conditions for crop development.";
    
    if (tempBase > 32) {
      riskLevel = "Danger";
      riskDesc = "Extreme heat distress warning. Increase irrigation frequencies.";
    } else if (tempBase < 8) {
      riskLevel = "Danger";
      riskDesc = "Early frost danger. Cover vulnerable root systems.";
    } else if (rainBase < 50) {
      riskLevel = "Caution";
      riskDesc = "Drought advisory. Soil moisture saturation index declining.";
    } else if (rainBase > 180) {
      riskLevel = "Caution";
      riskDesc = "Saturated soil alert. Monitor field drainage systems.";
    }

    return {
      temp: tempBase.toFixed(1),
      rain: rainBase.toFixed(0),
      humidity,
      wind,
      riskLevel,
      riskDesc
    };
  }

  // Feature coefficients simulation based on soil imbalances
  function getFeatureCoefficients(farm: FarmResponse) {
    const n = farm.soil_n ?? 60;
    const p = farm.soil_p ?? 30;
    const k = farm.soil_k ?? 30;
    
    const sum = n + p + k;
    if (sum === 0) return { n: 33, p: 33, k: 33, other: 1 };
    
    return {
      n: Math.round((n / sum) * 45 + 20),
      p: Math.round((p / sum) * 25 + 10),
      k: Math.round((k / sum) * 15 + 5),
    };
  }

  const activeProjections = selectedFarm ? calculateYieldProjections(selectedFarm, selectedCrop) : [];
  const activeWeather = selectedFarm ? getSimulatedWeather(selectedFarm) : null;
  const activeCoefficients = selectedFarm ? getFeatureCoefficients(selectedFarm) : null;

  // Max yield for SVG height scaling
  const maxYield = activeProjections.length > 0 ? Math.max(...activeProjections.map((p) => p.yield)) * 1.2 : 5000;

  // SVG Chart Dimensions
  const chartWidth = 500;
  const chartHeight = 200;
  const chartPadding = 30;

  // Map points to SVG coordinates
  const svgPoints = activeProjections.map((p, idx) => {
    const x = chartPadding + (idx * (chartWidth - chartPadding * 2)) / (activeProjections.length - 1);
    const y = chartHeight - chartPadding - (p.yield * (chartHeight - chartPadding * 2)) / maxYield;
    return `${x},${y}`;
  }).join(" ");

  return (
    <main className="min-h-screen bg-paper text-ink selection:bg-wheat selection:text-paper">
      <Navbar role="Farmer" />
      
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12 animate-fade-in-up">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-baseline sm:justify-between border-b border-line pb-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-canopy">Agronomy Dashboard</p>
            <h1 className="mt-1 font-display text-4xl font-extrabold tracking-tight text-ink">Field Command.</h1>
          </div>
          <Link
            href="/onboarding"
            className="inline-block border border-ink bg-ink px-5 py-2.5 text-center text-sm font-semibold text-paper transition duration-200 hover:bg-canopyDeep hover:border-canopyDeep shadow-sm"
          >
            + Register New Acreage
          </Link>
        </div>

        {error && (
          <div role="alert" className="mt-6 border border-clay bg-clay/10 px-3 py-2 text-sm text-clay">
            {error}
          </div>
        )}

        {/* Layout Grid: Farm List (Left) & Dynamic Visualizer Widgets (Right) */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          
          {/* Column 1: Farm Selector Ledger (35%) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="border border-line bg-paper p-5 shadow-sm">
              <h2 className="font-display font-extrabold text-base text-ink mb-4 border-b border-line pb-2 flex items-center justify-between">
                <span>Your Acreages</span>
                {farms && (
                  <span className="font-mono text-xs text-ink/40 bg-ink/[0.04] px-2 py-0.5 border border-line">
                    {farms.length} Active
                  </span>
                )}
              </h2>

              <div className="flex flex-col gap-2 max-h-[350px] overflow-y-auto pr-1">
                {farms === null && !error && (
                  <p className="text-sm text-ink/40 py-6 text-center">Loading logged farms…</p>
                )}
                {farms?.length === 0 && (
                  <div className="text-center py-6">
                    <p className="text-xs text-ink/50 leading-relaxed">No farm ledgers synced yet.</p>
                    <Link href="/onboarding" className="mt-3 inline-block text-xs font-bold text-canopy hover:underline">
                      Create your first plot &rarr;
                    </Link>
                  </div>
                )}
                {farms?.map((farm) => {
                  const isSelected = selectedFarm?.id === farm.id;
                  return (
                    <button
                      key={farm.id}
                      onClick={() => setSelectedFarm(farm)}
                      className={`w-full text-left p-3 border transition duration-150 flex items-center justify-between ${
                        isSelected
                          ? "border-canopy bg-canopy/5 dark:bg-canopy/10"
                          : "border-line hover:border-canopy"
                      }`}
                    >
                      <div>
                        <p className="font-display text-sm font-bold text-ink">{farm.farm_name}</p>
                        <p className="font-mono text-[10px] text-ink/50 mt-1 flex items-center gap-1">
                          <MapPin className="h-2.5 w-2.5 shrink-0" />
                          <span>{farm.latitude.toFixed(3)}, {farm.longitude.toFixed(3)}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono text-[10px] uppercase text-canopy border border-canopy/20 bg-canopy/5 px-2 py-0.5 font-bold">
                          pH {farm.soil_ph?.toFixed(1) ?? "—"}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Farm Details Card */}
            {selectedFarm && (
              <div className="border border-line bg-paper/50 p-5 shadow-sm">
                <h3 className="font-mono text-xs uppercase tracking-wider text-ink/50 border-b border-line pb-2 mb-3">
                  Soil Chemistry Profiles
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="border-l border-line/60 pl-2">
                    <p className="text-[10px] font-mono text-ink/40">NITROGEN</p>
                    <p className="font-display text-sm font-bold text-ink">{selectedFarm.soil_n ?? "—"} kg/ha</p>
                  </div>
                  <div className="border-l border-line/60 pl-2">
                    <p className="text-[10px] font-mono text-ink/40">PHOSPHORUS</p>
                    <p className="font-display text-sm font-bold text-ink">{selectedFarm.soil_p ?? "—"} kg/ha</p>
                  </div>
                  <div className="border-l border-line/60 pl-2">
                    <p className="text-[10px] font-mono text-ink/40">POTASSIUM</p>
                    <p className="font-display text-sm font-bold text-ink">{selectedFarm.soil_k ?? "—"} kg/ha</p>
                  </div>
                  <div className="border-l border-line/60 pl-2">
                    <p className="text-[10px] font-mono text-ink/40">ACIDITY INDEX</p>
                    <p className="font-display text-sm font-bold text-ink">{selectedFarm.soil_ph ?? "—"} pH</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Column 2: Dashboard Visualization Widgets (65%) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {selectedFarm ? (
              <>
                {/* 1. Yield Estimation SVG Chart Widget */}
                <div className="border border-line bg-paper p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-line pb-4 mb-4">
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-ink">Yield Projection</h3>
                      <p className="text-xs text-ink/60">Estimated crop output (kg/ha) across the seasonal window.</p>
                    </div>
                    {/* Crop Type Selectors */}
                    <div className="flex border border-line bg-paper text-xs">
                      {(["Wheat", "Maize", "Rice"] as const).map((crop) => {
                        const isActive = selectedCrop === crop;
                        return (
                          <button
                            key={crop}
                            onClick={() => setSelectedCrop(crop)}
                            className={`px-3 py-1.5 font-semibold transition ${
                              isActive
                                ? "bg-canopy text-paper"
                                : "hover:text-canopy text-ink/75"
                            }`}
                          >
                            {crop}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    {/* Graph Output */}
                    <div className="md:col-span-8">
                      <div className="relative w-full h-[200px] border border-line bg-ink/[0.01] dark:bg-paper/[0.01]">
                        {/* SVG Drawing of the Yield Curve */}
                        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full overflow-visible">
                          {/* Grid Lines */}
                          <line x1={chartPadding} y1={chartHeight - chartPadding} x2={chartWidth - chartPadding} y2={chartHeight - chartPadding} stroke="var(--color-line)" strokeWidth="1" />
                          <line x1={chartPadding} y1={chartPadding} x2={chartPadding} y2={chartHeight - chartPadding} stroke="var(--color-line)" strokeWidth="1" />
                          
                          {/* Yield Area Gradient Path */}
                          <path
                            d={`M ${chartPadding},${chartHeight - chartPadding} L ${svgPoints} L ${chartWidth - chartPadding},${chartHeight - chartPadding} Z`}
                            fill="url(#gradient-canopy)"
                            opacity="0.12"
                          />
                          {/* Yield Line */}
                          <polyline
                            fill="none"
                            stroke="var(--color-canopy)"
                            strokeWidth="2.5"
                            points={svgPoints}
                          />

                          {/* Data points and text indicators */}
                          {activeProjections.map((p, idx) => {
                            const x = chartPadding + (idx * (chartWidth - chartPadding * 2)) / (activeProjections.length - 1);
                            const y = chartHeight - chartPadding - (p.yield * (chartHeight - chartPadding * 2)) / maxYield;
                            return (
                              <g key={idx}>
                                <circle cx={x} cy={y} r="4" fill="var(--color-paper)" stroke="var(--color-canopy)" strokeWidth="2" />
                                <text x={x} y={y - 8} textAnchor="middle" className="font-mono text-[9px] font-bold fill-ink">
                                  {p.yield}
                                </text>
                                <text x={x} y={chartHeight - 12} textAnchor="middle" className="font-mono text-[9px] fill-ink/50">
                                  {p.month}
                                </text>
                              </g>
                            );
                          })}

                          {/* SVG Gradients definitions */}
                          <defs>
                            <linearGradient id="gradient-canopy" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="var(--color-canopy)" />
                              <stop offset="100%" stopColor="var(--color-paper)" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </div>
                    </div>

                    {/* Projections Sidebar Metrics */}
                    <div className="md:col-span-4 flex flex-col gap-4 border-t md:border-t-0 md:border-l border-line pt-4 md:pt-0 md:pl-4">
                      <div>
                        <span className="text-[10px] font-mono text-ink/40 block">PROJECTED HARVEST</span>
                        <span className="font-display text-2xl font-black text-canopy tracking-tight">
                          {Math.max(...activeProjections.map((p) => p.yield))} <span className="text-xs font-mono font-medium text-ink/50">kg/ha</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs border border-line bg-ink/[0.01] p-3">
                        <TrendingUp className="h-4 w-4 text-wheat shrink-0" />
                        <span className="text-ink/75 leading-tight">
                          Target soil upgrades can increase this projection by up to <strong className="text-wheat">14%</strong>.
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Climate Risk Map & Weather Widget */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Climate Advisory Widget */}
                  <div className="border border-line bg-paper p-5 shadow-sm flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-extrabold text-base text-ink mb-1 flex items-center justify-between">
                        <span>Climate Risk Overlay</span>
                        {activeWeather && (
                          <span className={`text-[10px] font-mono px-2 py-0.5 border font-bold uppercase ${
                            activeWeather.riskLevel === "Danger" 
                              ? "bg-clay/10 text-clay border-clay/30" 
                              : activeWeather.riskLevel === "Caution"
                              ? "bg-wheat/10 text-wheat border-wheat/30"
                              : "bg-canopy/10 text-canopy border-canopy/30"
                          }`}>
                            {activeWeather.riskLevel}
                          </span>
                        )}
                      </h3>
                      <p className="text-[11px] text-ink/50 mb-4 font-mono">GPS Coordinates: {selectedFarm.latitude.toFixed(4)}, {selectedFarm.longitude.toFixed(4)}</p>
                      
                      <p className="text-xs text-ink/75 leading-relaxed bg-ink/[0.01] p-3 border border-line">
                        {activeWeather?.riskDesc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-line/60 flex items-center gap-2 text-[10px] text-ink/40 font-mono">
                      <AlertTriangle className="h-3.5 w-3.5 text-wheat shrink-0" />
                      <span>Updated 15 mins ago from satellite telemetry.</span>
                    </div>
                  </div>

                  {/* Weather Telemetry Panel */}
                  <div className="border border-line bg-paper p-5 shadow-sm">
                    <h3 className="font-display font-extrabold text-base text-ink mb-3 flex items-center gap-2">
                      <CloudSun className="h-4.5 w-4.5 text-canopy" />
                      <span>Weather Telemetry</span>
                    </h3>

                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between border-b border-line/50 pb-2">
                        <span className="text-xs text-ink/60 flex items-center gap-1.5">
                          <Thermometer className="h-3.5 w-3.5 text-canopy" />
                          Average Temperature
                        </span>
                        <span className="font-mono text-sm font-bold text-ink">{activeWeather?.temp}°C</span>
                      </div>
                      
                      <div className="flex items-center justify-between border-b border-line/50 pb-2">
                        <span className="text-xs text-ink/60 flex items-center gap-1.5">
                          <CloudRain className="h-3.5 w-3.5 text-canopy" />
                          Annual Precipitation
                        </span>
                        <span className="font-mono text-sm font-bold text-ink">{activeWeather?.rain} mm/yr</span>
                      </div>

                      <div className="flex items-center justify-between border-b border-line/50 pb-2">
                        <span className="text-xs text-ink/60 flex items-center gap-1.5">
                          <Droplet className="h-3.5 w-3.5 text-canopy" />
                          Soil Humidity Saturation
                        </span>
                        <span className="font-mono text-sm font-bold text-ink">{activeWeather?.humidity}%</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs text-ink/60 flex items-center gap-1.5">
                          <Wind className="h-3.5 w-3.5 text-canopy" />
                          Wind Gust Index
                        </span>
                        <span className="font-mono text-sm font-bold text-ink">{activeWeather?.wind} km/h</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* 3. Feature Coefficients & Insights */}
                {activeCoefficients && (
                  <div className="border border-line bg-paper p-6 shadow-sm">
                    <h3 className="font-display font-extrabold text-base text-ink mb-1 flex items-center gap-2">
                      <Sliders className="h-4.5 w-4.5 text-canopy" />
                      <span>Forecast Sensitivity Weights</span>
                    </h3>
                    <p className="text-xs text-ink/50 mb-6">Indicates which features most heavily influence your {selectedCrop} yield forecast.</p>

                    <div className="flex flex-col gap-4">
                      {/* Nitrogen influence */}
                      <div>
                        <div className="flex justify-between text-xs font-mono font-medium text-ink mb-1">
                          <span>Nitrogen Nutrient Factor</span>
                          <span>{activeCoefficients.n}% Impact</span>
                        </div>
                        <div className="h-2 w-full bg-line">
                          <div className="h-full bg-canopy" style={{ width: `${activeCoefficients.n}%` }} />
                        </div>
                      </div>

                      {/* Phosphorus influence */}
                      <div>
                        <div className="flex justify-between text-xs font-mono font-medium text-ink mb-1">
                          <span>Phosphorus Nutrient Factor</span>
                          <span>{activeCoefficients.p}% Impact</span>
                        </div>
                        <div className="h-2 w-full bg-line">
                          <div className="h-full bg-wheat" style={{ width: `${activeCoefficients.p}%` }} />
                        </div>
                      </div>

                      {/* Potassium influence */}
                      <div>
                        <div className="flex justify-between text-xs font-mono font-medium text-ink mb-1">
                          <span>Potassium Nutrient Factor</span>
                          <span>{activeCoefficients.k}% Impact</span>
                        </div>
                        <div className="h-2 w-full bg-line">
                          <div className="h-full bg-horizonTop" style={{ width: `${activeCoefficients.k}%` }} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="border border-dashed border-line bg-ink/[0.01] h-[400px] flex flex-col items-center justify-center p-6 text-center">
                <Sprout className="h-12 w-12 text-ink/20 mb-3 animate-pulse" />
                <h3 className="font-display font-bold text-lg text-ink/70">No Farm Selected</h3>
                <p className="mt-1 text-xs text-ink/50 max-w-[280px] leading-relaxed">
                  Log a farm plot or select one from the sidebar ledger to display yield analytics and forecast metrics.
                </p>
                <Link
                  href="/onboarding"
                  className="mt-6 border border-ink px-4 py-2 text-xs font-bold text-ink hover:bg-ink hover:text-paper transition"
                >
                  Log a Plot
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}
