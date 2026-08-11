"use client";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

import { Line } from "react-chartjs-2";

import type { DashboardYieldTrendPoint } from "@/types/analytics";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

interface YieldTrendChartProps {
    points: DashboardYieldTrendPoint[];
    loading?: boolean;
}

export default function YieldTrendChart({ points, loading }: YieldTrendChartProps) {

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-5">Yield Trend</h2>
                <div className="h-72 rounded-lg bg-gray-100 animate-pulse" />
            </div>
        );
    }

    if (!points || points.length < 2) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-5">Yield Trend</h2>
                <p className="text-gray-500">Not enough data yet</p>
            </div>
        );
    }

    const data = {
        labels: points.map((p) => new Date(p.date).toLocaleDateString()),
        datasets: [
            {
                label: "Predicted Yield",
                data: points.map((p) => p.yield),
                borderColor: "#16a34a",
                backgroundColor: "#16a34a",
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
            x: { grid: { display: false } },
        },
    };

    return (
        <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="font-bold text-xl mb-5">Yield Trend</h2>
            <div className="h-72">
                <Line data={data} options={options} />
            </div>
        </div>
    );
}
