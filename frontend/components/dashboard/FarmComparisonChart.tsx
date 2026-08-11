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

import type { FarmComparisonEntry } from "@/types/analytics";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface FarmComparisonChartProps {
    farms: FarmComparisonEntry[];
    loading?: boolean;
}

export default function FarmComparisonChart({ farms, loading }: FarmComparisonChartProps) {

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-5">Farm Comparison</h2>
                <div className="h-72 rounded-lg bg-gray-100 animate-pulse" />
            </div>
        );
    }

    if (!farms || farms.length < 2) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-bold text-xl mb-5">Farm Comparison</h2>
                <p className="text-gray-500">Add another farm to compare farm performance.</p>
            </div>
        );
    }

    const data = {
        labels: farms.map((f) => f.farm_name),
        datasets: [
            {
                label: "Predicted Yield",
                data: farms.map((f) => f.latest_yield ?? 0),
                backgroundColor: "#f97316",
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
            <h2 className="font-bold text-xl mb-5">Farm Comparison</h2>
            <div className="h-72">
                <Bar data={data} options={options} />
            </div>
        </div>
    );
}
