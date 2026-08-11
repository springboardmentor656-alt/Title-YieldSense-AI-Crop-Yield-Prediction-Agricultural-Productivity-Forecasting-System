"use client";

import type { ProductivityScore as ProductivityScoreData } from "@/types/analytics";

function gaugeColor(score: number) {
    if (score >= 110) return "text-green-600 border-green-600";
    if (score >= 95) return "text-blue-600 border-blue-600";
    if (score >= 80) return "text-yellow-600 border-yellow-600";
    return "text-red-600 border-red-600";
}

interface ProductivityScoreProps {
    data?: ProductivityScoreData;
    loading?: boolean;
}

export default function ProductivityScore({ data, loading }: ProductivityScoreProps) {

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center">
                <h2 className="font-bold text-xl mb-3">Productivity Score</h2>
                <div className="w-28 h-28 rounded-full bg-gray-100 animate-pulse" />
            </div>
        );
    }

    if (!data || data.productivity_score === null) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center">
                <h2 className="font-bold text-xl mb-3">Productivity Score</h2>
                <p className="text-gray-500">Not enough prediction data yet.</p>
            </div>
        );
    }

    const { productivity_score, interpretation, sample_size } = data;

    return (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center justify-center text-center">
            <h2 className="font-bold text-xl mb-3">Productivity Score</h2>

            <div
                className={`w-28 h-28 rounded-full border-8 flex items-center justify-center text-2xl font-bold ${gaugeColor(productivity_score)}`}
            >
                {productivity_score.toFixed(1)}
            </div>

            <p className="mt-4 font-semibold">{interpretation}</p>

            {sample_size < 2 && (
                <p className="text-xs text-gray-400 mt-1">
                    Based on {sample_size} prediction
                </p>
            )}
        </div>
    );
}
