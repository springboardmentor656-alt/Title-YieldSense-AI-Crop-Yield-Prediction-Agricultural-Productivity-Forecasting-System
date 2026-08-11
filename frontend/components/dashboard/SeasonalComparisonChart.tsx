"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";

import type { SeasonalComparisonPoint } from "@/types/analytics";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface SeasonalComparisonChartProps {
    points: SeasonalComparisonPoint[];
    loading?: boolean;
}

export default function SeasonalComparisonChart({ points, loading }: SeasonalComparisonChartProps) {

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-5">Seasonal Comparison</h2>
                <div className="h-72 rounded-lg bg-gray-100 animate-pulse" />
            </div>
        );
    }

    if (!points || points.length < 2) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-5">Seasonal Comparison</h2>
                <p className="text-gray-500">Not enough data for seasonal comparison</p>
            </div>
        );
    }

    const data = {
        labels: points.map((p) => p.season),
        datasets: [
            {
                label: "Average Yield",
                data: points.map((p) => p.yield),
                backgroundColor: "#0ea5e9",
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-xl mb-5">Seasonal Comparison</h2>
            <div className="h-72">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
