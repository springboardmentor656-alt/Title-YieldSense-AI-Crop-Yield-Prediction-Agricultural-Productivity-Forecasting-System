/**
 * YieldSense AI — Prediction Page
 *
 * Full crop yield prediction form with results, weather, and soil cards.
 */

"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart3, Wheat, CloudRain, Layers, Send,
  Thermometer, Droplets, Wind, AlertTriangle,
  CheckCircle, TrendingUp, MapPin, Sprout, Info,
} from "lucide-react";
import toast from "react-hot-toast";
import { predictionService } from "@/services/predictionService";
import { farmService } from "@/services/farmService";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Badge from "@/components/ui/Badge";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { CROP_OPTIONS } from "@/utils/constants";
import type { PredictionRequest, PredictionResponse } from "@/types/prediction";
import type { Farm } from "@/types/farm";

const SEASON_OPTIONS = ["Kharif", "Rabi", "Annual"];

const defaultForm: PredictionRequest = {
  crop: "Rice",
  season: "Kharif",
  state: "Unknown",
  area: 1000,
  temperature: 28,
  annual_rainfall: 1000,
  humidity: 65,
  soil_ph: 6.5,
  nitrogen: 80,
  phosphorus: 40,
  potassium: 35,
  fertilizer_usage: 150,
  pesticide_usage: 10,
  production: 0,
  latitude: undefined,
  longitude: undefined,
};

export default function PredictionPage() {
  const [form, setForm] = useState<PredictionRequest>(defaultForm);
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [selectedFarmId, setSelectedFarmId] = useState("");

  useEffect(() => {
    const loadFarms = async () => {
      try {
        const data = await farmService.listFarms(1, 100);
        setFarms(data.farms);
      } catch {
        /* ignore */
      }
    };
    loadFarms();
  }, []);

  const handleFarmSelect = (farmId: string) => {
    setSelectedFarmId(farmId);
    const farm = farms.find((f) => f.id === farmId);
    if (farm) {
      setForm((prev) => ({
        ...prev,
        crop: farm.crop,
        area: farm.area,
        soil_ph: farm.soil_ph,
        nitrogen: farm.nitrogen,
        phosphorus: farm.phosphorus,
        potassium: farm.potassium,
        latitude: farm.latitude,
        longitude: farm.longitude,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);
    try {
      const prediction = await predictionService.predictYield(form);
      setResult(prediction);
      toast.success("Prediction generated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Prediction failed");
    } finally {
      setLoading(false);
    }
  };

  const updateField = (key: keyof PredictionRequest, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6 animate-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BarChart3 className="h-7 w-7 text-green-600" />
          AI Yield Prediction
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Enter crop and soil data to get an AI-powered yield prediction
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Prediction Form */}
        <div className="xl:col-span-2">
          <Card padding="md">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Farm Selector */}
              {farms.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Auto-fill from Farm
                  </label>
                  <select
                    value={selectedFarmId}
                    onChange={(e) => handleFarmSelect(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select a farm (optional)</option>
                    {farms.map((farm) => (
                      <option key={farm.id} value={farm.id}>
                        {farm.name} — {farm.crop}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Crop Info */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Sprout className="h-4 w-4 text-green-600" /> Crop Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Crop</label>
                    <select value={form.crop} onChange={(e) => updateField("crop", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      {CROP_OPTIONS.filter(c => c !== "Other").map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Season</label>
                    <select value={form.season} onChange={(e) => updateField("season", e.target.value)}
                      className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2.5 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-transparent">
                      {SEASON_OPTIONS.map((s) => (<option key={s} value={s}>{s}</option>))}
                    </select>
                  </div>
                  <Input label="Area (ha)" type="number" value={String(form.area)} onChange={(e) => updateField("area", Number(e.target.value))} />
                </div>
              </div>

              {/* Environment */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <CloudRain className="h-4 w-4 text-blue-500" /> Environmental Conditions
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input label="Temperature (°C)" type="number" value={String(form.temperature)} onChange={(e) => updateField("temperature", Number(e.target.value))} />
                  <Input label="Annual Rainfall (mm)" type="number" value={String(form.annual_rainfall)} onChange={(e) => updateField("annual_rainfall", Number(e.target.value))} />
                  <Input label="Humidity (%)" type="number" value={String(form.humidity || "")} onChange={(e) => updateField("humidity", Number(e.target.value))} />
                </div>
              </div>

              {/* Soil */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Layers className="h-4 w-4 text-amber-600" /> Soil Parameters
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Input label="Soil pH" type="number" value={String(form.soil_ph)} onChange={(e) => updateField("soil_ph", Number(e.target.value))} />
                  <Input label="Nitrogen (kg/ha)" type="number" value={String(form.nitrogen)} onChange={(e) => updateField("nitrogen", Number(e.target.value))} />
                  <Input label="Phosphorus (kg/ha)" type="number" value={String(form.phosphorus)} onChange={(e) => updateField("phosphorus", Number(e.target.value))} />
                  <Input label="Potassium (kg/ha)" type="number" value={String(form.potassium)} onChange={(e) => updateField("potassium", Number(e.target.value))} />
                </div>
              </div>

              {/* Agricultural Inputs */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <Wheat className="h-4 w-4 text-green-700" /> Agricultural Inputs
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Fertilizer (kg/ha)" type="number" value={String(form.fertilizer_usage)} onChange={(e) => updateField("fertilizer_usage", Number(e.target.value))} />
                  <Input label="Pesticide (kg/ha)" type="number" value={String(form.pesticide_usage)} onChange={(e) => updateField("pesticide_usage", Number(e.target.value))} />
                </div>
              </div>

              {/* Location */}
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-red-500" /> Location (optional — enables weather lookup)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input label="Latitude" type="number" value={String(form.latitude || "")} placeholder="e.g. 28.6139" onChange={(e) => updateField("latitude", Number(e.target.value) || undefined as any)} />
                  <Input label="Longitude" type="number" value={String(form.longitude || "")} placeholder="e.g. 77.2090" onChange={(e) => updateField("longitude", Number(e.target.value) || undefined as any)} />
                </div>
              </div>

              <Button type="submit" className="w-full" isLoading={loading}>
                <Send className="h-4 w-4" /> Generate Prediction
              </Button>
            </form>
          </Card>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {loading && <LoadingSpinner text="Generating prediction..." />}

          {result && !loading && (
            <>
              {/* Yield Result */}
              <Card padding="md" className="border-2 border-green-200 dark:border-green-800">
                <div className="text-center space-y-3">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white shadow-lg shadow-green-500/25">
                    <TrendingUp className="h-7 w-7" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Predicted Yield</p>
                    <p className="text-3xl font-bold text-green-600">
                      {result.predicted_yield.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400">{result.prediction_unit}</p>
                  </div>
                  <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-sm text-gray-500">Total Production</p>
                    <p className="text-xl font-bold text-gray-900 dark:text-white">
                      {result.total_production.toFixed(1)} tons
                    </p>
                    <p className="text-xs text-gray-400">for {result.area} ha of {result.crop}</p>
                  </div>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <Badge variant={result.confidence === "High" ? "success" : result.confidence === "Medium" ? "warning" : "danger"}>
                      {result.confidence} Confidence
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-400">Model: {result.model_used} (R² {result.model_accuracy ? (result.model_accuracy * 100).toFixed(1) + "%" : "N/A"})</p>
                </div>
              </Card>

              {/* Weather Summary */}
              {result.weather_summary && (
                <Card padding="md">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <CloudRain className="h-4 w-4 text-blue-500" /> Weather Summary
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500"><Thermometer className="h-3.5 w-3.5" /> Temperature</span>
                      <span className="font-medium text-gray-900 dark:text-white">{result.weather_summary.temperature}°C</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500"><Droplets className="h-3.5 w-3.5" /> Humidity</span>
                      <span className="font-medium text-gray-900 dark:text-white">{result.weather_summary.humidity}%</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500"><CloudRain className="h-3.5 w-3.5" /> Rainfall</span>
                      <span className="font-medium text-gray-900 dark:text-white">{result.weather_summary.rainfall} mm</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2 text-gray-500"><Wind className="h-3.5 w-3.5" /> Wind</span>
                      <span className="font-medium text-gray-900 dark:text-white">{result.weather_summary.wind_speed} km/h</span>
                    </div>
                    <p className="text-xs text-gray-400 pt-1">{result.weather_summary.description}</p>
                  </div>
                </Card>
              )}

              {/* Soil Summary */}
              {result.soil_summary && (
                <Card padding="md">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Layers className="h-4 w-4 text-amber-600" /> Soil Health
                  </h3>
                  <div className="text-center mb-3">
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{result.soil_summary.health_score}</p>
                    <Badge variant={result.soil_summary.health_label === "Excellent" ? "success" : result.soil_summary.health_label === "Good" ? "info" : "warning"}>
                      {result.soil_summary.health_label}
                    </Badge>
                    <p className="text-xs text-gray-400 mt-1">{result.soil_summary.ph_status}</p>
                  </div>
                  {result.soil_summary.warnings.length > 0 && (
                    <div className="space-y-1 mt-3">
                      {result.soil_summary.warnings.map((w, i) => (
                        <p key={i} className="text-xs text-amber-600 flex items-start gap-1.5">
                          <AlertTriangle className="h-3 w-3 mt-0.5 shrink-0" /> {w}
                        </p>
                      ))}
                    </div>
                  )}
                  {result.soil_summary.suggestions.length > 0 && (
                    <div className="space-y-1 mt-2">
                      {result.soil_summary.suggestions.map((s, i) => (
                        <p key={i} className="text-xs text-green-600 flex items-start gap-1.5">
                          <CheckCircle className="h-3 w-3 mt-0.5 shrink-0" /> {s}
                        </p>
                      ))}
                    </div>
                  )}
                </Card>
              )}
            </>
          )}

          {!result && !loading && (
            <Card padding="md" className="text-center">
              <div className="py-8">
                <BarChart3 className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Fill in the form and click &quot;Generate Prediction&quot; to see results</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
