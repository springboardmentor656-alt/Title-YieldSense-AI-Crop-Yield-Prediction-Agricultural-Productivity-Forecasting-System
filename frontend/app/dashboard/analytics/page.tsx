"use client";

import { useEffect, useState } from "react";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Line, Bar } from "react-chartjs-2";

import { useFarm } from "@/hooks/useFarm";

import {
    useYieldTrend,
    useFarmComparison,
    useWeatherImpact,
    useRiskAnomalies,
} from "@/hooks/useAnalytics";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function severityClass(zScore: number) {

    const absZ = Math.abs(zScore);

    if (absZ >= 2) {

        return "bg-red-100 text-red-700";

    }

    if (absZ >= 1) {

        return "bg-yellow-100 text-yellow-700";

    }

    return "bg-green-100 text-green-700";

}

export default function AnalyticsPage() {

    const { farms } = useFarm();

    const [farmId, setFarmId] = useState<number | null>(null);

    useEffect(() => {

        if (!farmId && farms.length > 0) {

            setFarmId((farms[0] as any).id);

        }

    }, [farms, farmId]);

    const { trend, loading: trendLoading } = useYieldTrend(farmId);

    const { comparison, loading: comparisonLoading } = useFarmComparison();

    const { impact, loading: impactLoading } = useWeatherImpact(farmId);

    const { anomalies, loading: anomaliesLoading } = useRiskAnomalies(farmId);

    const trendData = {
        labels: trend?.points?.map((p: any) => p.date) ?? [],
        datasets: [
            {
                label: "Predicted Yield",
                data: trend?.points?.map((p: any) => p.predicted_yield) ?? [],
                borderColor: "#16a34a",
                backgroundColor: "#16a34a",
            },
        ],
    };

    const rainfallData = {
        labels:
            impact?.rainfall_buckets?.map((b: any) => b.bucket) ?? [],
        datasets: [
            {
                label: "Average Yield",
                data:
                    impact?.rainfall_buckets?.map(
                        (b: any) => b.average_yield ?? 0
                    ) ?? [],
                backgroundColor: "#0ea5e9",
            },
        ],
    };

    const temperatureData = {
        labels:
            impact?.temperature_buckets?.map((b: any) => b.bucket) ?? [],
        datasets: [
            {
                label: "Average Yield",
                data:
                    impact?.temperature_buckets?.map(
                        (b: any) => b.average_yield ?? 0
                    ) ?? [],
                backgroundColor: "#f97316",
            },
        ],
    };

    return (
        <div className="space-y-8">

            <div className="flex justify-between items-center">
                <h1 className="text-4xl font-bold">
                    Analytics
                </h1>

                <select
                    value={farmId ?? ""}
                    onChange={(e) => setFarmId(Number(e.target.value))}
                    className="border rounded-lg px-4 py-2 bg-white"
                >
                    {farms.map((farm: any) => (
                        <option key={farm.id} value={farm.id}>
                            {farm.farm_name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-5">
                    Yield Trend
                </h2>

                {trendLoading && <p>Loading yield trend...</p>}

                {!trendLoading && (!trend?.points || trend.points.length === 0) && (
                    <p className="text-gray-500">
                        No yield trend data available for this farm.
                    </p>
                )}

                {!trendLoading && trend?.points?.length > 0 && (
                    <Line data={trendData} />
                )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-5">
                    Farm Comparison
                </h2>

                {comparisonLoading && <p>Loading farm comparison...</p>}

                {!comparisonLoading && comparison.length === 0 && (
                    <p className="text-gray-500">
                        No farm comparison data available.
                    </p>
                )}

                {!comparisonLoading && comparison.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b">
                                    <th className="py-2">Farm</th>
                                    <th className="py-2">Crop</th>
                                    <th className="py-2">Latest Yield</th>
                                    <th className="py-2">Average Yield</th>
                                    <th className="py-2">Predictions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparison.map((c: any) => (
                                    <tr key={c.farm_id} className="border-b">
                                        <td className="py-2">{c.farm_name}</td>
                                        <td className="py-2">{c.crop_name ?? "-"}</td>
                                        <td className="py-2">{c.latest_yield ?? "-"}</td>
                                        <td className="py-2">{c.average_yield ?? "-"}</td>
                                        <td className="py-2">{c.prediction_count}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="font-bold text-xl mb-5">
                        Rainfall Impact
                    </h2>

                    {impactLoading && <p>Loading weather impact...</p>}

                    {!impactLoading &&
                        (!impact?.rainfall_buckets ||
                            impact.rainfall_buckets.length === 0) && (
                            <p className="text-gray-500">
                                No rainfall impact data available.
                            </p>
                        )}

                    {!impactLoading && impact?.rainfall_buckets?.length > 0 && (
                        <Bar data={rainfallData} />
                    )}
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="font-bold text-xl mb-5">
                        Temperature Impact
                    </h2>

                    {impactLoading && <p>Loading weather impact...</p>}

                    {!impactLoading &&
                        (!impact?.temperature_buckets ||
                            impact.temperature_buckets.length === 0) && (
                            <p className="text-gray-500">
                                No temperature impact data available.
                            </p>
                        )}

                    {!impactLoading && impact?.temperature_buckets?.length > 0 && (
                        <Bar data={temperatureData} />
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-5">
                    Risk &amp; Anomalies
                </h2>

                {anomaliesLoading && <p>Loading risk anomalies...</p>}

                {!anomaliesLoading && anomalies.length === 0 && (
                    <p className="text-gray-500">
                        No anomalies detected for this farm.
                    </p>
                )}

                <div className="divide-y">
                    {anomalies.map((a: any) => (
                        <div
                            key={a.id}
                            className="flex justify-between items-center py-4"
                        >
                            <div>
                                <p className="font-semibold">
                                    {a.crop ?? "Unknown crop"}
                                </p>

                                <p className="text-sm text-gray-500">
                                    {new Date(a.created_at).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="text-right">
                                <p>Predicted: {a.prediction}</p>
                                <p className="text-sm text-gray-500">
                                    Farm avg: {a.farm_mean}
                                </p>
                            </div>

                            <span
                                className={`px-3 py-1 rounded-full text-xs font-bold ${severityClass(
                                    a.z_score
                                )}`}
                            >
                                z = {Number(a.z_score).toFixed(2)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );

}
