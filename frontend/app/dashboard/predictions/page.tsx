"use client";

import { FormEvent, useState } from "react";

import {
    Gauge,
    History,
    ShieldAlert,
    Sprout,
    TrendingDown,
    TrendingUp,
} from "lucide-react";

import FarmPicker from "@/components/farm/FarmPicker";
import { useFarm } from "@/hooks/useFarm";
import { usePrediction } from "@/hooks/usePrediction";

export default function PredictionPage() {
    const { farms, loading: farmsLoading } = useFarm();
    const [farmId, setFarmId] = useState<number | null>(null);

    const {
        result,
        history,
        predicting,
        historyLoading,
        predict,
    } = usePrediction(farmId ?? undefined);

    const [temperature, setTemperature] = useState("");
    const [rainfall, setRainfall] = useState("");
    const [soilPh, setSoilPh] = useState("");

    function handleSubmit(e: FormEvent) {
        e.preventDefault();

        predict({
            temperature: temperature ? Number(temperature) : undefined,
            rainfall: rainfall ? Number(rainfall) : undefined,
            soil_ph: soilPh ? Number(soilPh) : undefined,
        });
    }

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Yield Prediction</h1>

            <div className="bg-white rounded-xl shadow p-6">
                {farmsLoading ? (
                    <p className="text-gray-500">Loading farms...</p>
                ) : farms.length === 0 ? (
                    <p className="text-gray-500">
                        Add a farm first to generate predictions.
                    </p>
                ) : (
                    <FarmPicker
                        farms={farms}
                        value={farmId}
                        onChange={setFarmId}
                    />
                )}
            </div>

            {farmId && (
                <>
                    <form
                        onSubmit={handleSubmit}
                        className="bg-white rounded-xl shadow p-6 space-y-4"
                    >
                        <h2 className="text-2xl font-semibold">
                            Predict Yield
                        </h2>

                        <p className="text-gray-500 text-sm">
                            Leave fields blank to use the farm&apos;s latest
                            stored weather and soil data.
                        </p>

                        <div className="grid md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Temperature (°C)
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    className="border rounded-lg px-4 py-2 w-full"
                                    value={temperature}
                                    onChange={(e) =>
                                        setTemperature(e.target.value)
                                    }
                                    placeholder="Optional"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Rainfall (mm)
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    className="border rounded-lg px-4 py-2 w-full"
                                    value={rainfall}
                                    onChange={(e) =>
                                        setRainfall(e.target.value)
                                    }
                                    placeholder="Optional"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Soil pH
                                </label>
                                <input
                                    type="number"
                                    step="any"
                                    className="border rounded-lg px-4 py-2 w-full"
                                    value={soilPh}
                                    onChange={(e) =>
                                        setSoilPh(e.target.value)
                                    }
                                    placeholder="Optional"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={predicting}
                            className="bg-green-900 text-white px-6 py-3 rounded-lg hover:bg-green-800 transition disabled:opacity-50"
                        >
                            {predicting ? "Predicting..." : "Predict"}
                        </button>
                    </form>

                    {result && (
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <h2 className="text-2xl font-bold mb-4">
                                Prediction Result
                            </h2>

                            <div className="grid md:grid-cols-2 gap-5">
                                <div>
                                    <Sprout className="text-green-700" />
                                    <p className="text-sm text-gray-500">
                                        Predicted Yield
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {result.predicted_yield}
                                    </p>
                                </div>

                                <div>
                                    <Gauge className="text-green-700" />
                                    <p className="text-sm text-gray-500">
                                        Confidence
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {(result.confidence * 100).toFixed(1)}%
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500">
                                        Model Used
                                    </p>
                                    <p className="font-semibold">
                                        {result.model_used}
                                    </p>
                                </div>

                                <div>
                                    <ShieldAlert className="text-amber-600" />
                                    <p className="text-sm text-gray-500">
                                        Risk Level
                                    </p>
                                    <p className="font-semibold capitalize">
                                        {result.risk_level}
                                    </p>
                                </div>

                                {result.trend_forecast && (
                                    <div className="md:col-span-2">
                                        <p className="text-sm text-gray-500">
                                            Trend Forecast
                                        </p>
                                        <p className="font-semibold">
                                            {result.trend_forecast}
                                        </p>
                                    </div>
                                )}

                                {result.season_comparison && (
                                    <div className="md:col-span-2 bg-green-50 rounded-lg p-4 flex items-center gap-3">
                                        {(result.season_comparison
                                            .delta_pct ?? 0) >= 0 ? (
                                            <TrendingUp className="text-green-700" />
                                        ) : (
                                            <TrendingDown className="text-red-600" />
                                        )}

                                        <div>
                                            <p className="text-sm text-gray-500">
                                                Season Comparison
                                            </p>
                                            <p className="font-semibold">
                                                Avg past yield:{" "}
                                                {result.season_comparison
                                                    .average_past_yield ??
                                                    "N/A"}
                                                {typeof result
                                                    .season_comparison
                                                    .delta_pct === "number" &&
                                                    ` (${
                                                        result
                                                            .season_comparison
                                                            .delta_pct > 0
                                                            ? "+"
                                                            : ""
                                                    }${
                                                        result
                                                            .season_comparison
                                                            .delta_pct
                                                    }%)`}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="bg-white rounded-xl shadow p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <History className="text-green-700" />
                            <h2 className="text-2xl font-bold">
                                Prediction History
                            </h2>
                        </div>

                        {historyLoading ? (
                            <p className="text-gray-500">
                                Loading history...
                            </p>
                        ) : history.length === 0 ? (
                            <p className="text-gray-500">
                                No predictions recorded yet for this farm.
                            </p>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="py-2 pr-4">
                                                Date
                                            </th>
                                            <th className="py-2 pr-4">
                                                Predicted Yield
                                            </th>
                                            <th className="py-2 pr-4">
                                                Crop
                                            </th>
                                            <th className="py-2 pr-4">
                                                Temp (°C)
                                            </th>
                                            <th className="py-2 pr-4">
                                                Rainfall (mm)
                                            </th>
                                            <th className="py-2 pr-4">
                                                Soil pH
                                            </th>
                                            <th className="py-2 pr-4">
                                                Model
                                            </th>
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {history.map((entry) => (
                                            <tr
                                                key={entry.id}
                                                className="border-b last:border-0"
                                            >
                                                <td className="py-2 pr-4">
                                                    {new Date(
                                                        entry.created_at
                                                    ).toLocaleString()}
                                                </td>
                                                <td className="py-2 pr-4 font-semibold">
                                                    {entry.prediction}
                                                </td>
                                                <td className="py-2 pr-4">
                                                    {entry.features.crop}
                                                </td>
                                                <td className="py-2 pr-4">
                                                    {
                                                        entry.features
                                                            .temperature
                                                    }
                                                </td>
                                                <td className="py-2 pr-4">
                                                    {entry.features.rainfall}
                                                </td>
                                                <td className="py-2 pr-4">
                                                    {entry.features.soil_ph}
                                                </td>
                                                <td className="py-2 pr-4">
                                                    {entry.model_version}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
