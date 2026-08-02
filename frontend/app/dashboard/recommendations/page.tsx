"use client";

import { useState } from "react";

import { AlertTriangle, Bug, CheckCircle2, Droplets, FlaskConical, ShieldAlert, Sprout } from "lucide-react";

import FarmPicker from "@/components/farm/FarmPicker";
import { useFarm } from "@/hooks/useFarm";
import { useRecommendations, useRiskAssessment } from "@/hooks/useRecommendations";

const RISK_BADGE_CLASS: Record<string, string> = {
    High: "bg-red-100 text-red-700 border-red-300",
    Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
    Low: "bg-green-100 text-green-700 border-green-300",
};

export default function RecommendationsPage() {
    const { farms, loading: farmsLoading } = useFarm();
    const [farmId, setFarmId] = useState<number | null>(null);

    const { recommendations, loading, notFound } = useRecommendations(
        farmId ?? undefined
    );

    const { risk, loading: riskLoading } = useRiskAssessment(
        farmId ?? undefined
    );

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Recommendations</h1>

            <div className="bg-white rounded-xl shadow p-6">
                {farmsLoading ? (
                    <p className="text-gray-500">Loading farms...</p>
                ) : farms.length === 0 ? (
                    <p className="text-gray-500">
                        Add a farm first to view recommendations.
                    </p>
                ) : (
                    <FarmPicker
                        farms={farms}
                        value={farmId}
                        onChange={setFarmId}
                    />
                )}
            </div>

            {farmId && riskLoading && (
                <p className="text-gray-500">Loading risk assessment...</p>
            )}

            {farmId && !riskLoading && risk && (
                <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <ShieldAlert className="text-red-600" />
                        <h2 className="text-2xl font-bold">
                            Environmental Risk Assessment
                        </h2>
                        <span
                            className={`ml-auto px-3 py-1 rounded-full text-xs font-bold border ${RISK_BADGE_CLASS[risk.overall_risk_level]}`}
                        >
                            Overall: {risk.overall_risk_level}
                        </span>
                    </div>

                    {risk.risks.length === 0 ? (
                        <p className="text-gray-500">
                            No environmental threats currently flagged.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {risk.risks.map((r, i) => (
                                <div
                                    key={i}
                                    className={`flex items-start gap-3 border rounded-lg p-4 ${RISK_BADGE_CLASS[r.severity]}`}
                                >
                                    <AlertTriangle className="shrink-0 mt-0.5" size={18} />
                                    <div>
                                        <p className="font-semibold">
                                            {r.type} — {r.severity}
                                        </p>
                                        <p className="text-sm opacity-90">{r.advice}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {farmId && loading && (
                <p className="text-gray-500">Loading recommendations...</p>
            )}

            {farmId && !loading && notFound && (
                <div className="bg-white rounded-xl shadow p-8">
                    <p className="text-gray-500">
                        No soil report on file for this farm yet.
                    </p>
                </div>
            )}

            {recommendations && (
                <div className="space-y-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Sprout className="text-green-700" />
                            <h2 className="text-2xl font-bold">
                                Suggested Crops
                            </h2>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            {recommendations.crop_suggestions.map((crop) => (
                                <span
                                    key={crop}
                                    className="bg-green-100 text-green-900 px-4 py-2 rounded-full text-sm font-medium"
                                >
                                    {crop}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <FlaskConical className="text-green-700" />
                                <h2 className="text-2xl font-bold">
                                    Fertilizer Advice
                                </h2>
                            </div>
                            <p className="text-gray-700">
                                {recommendations.fertilizer_advice}
                            </p>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Droplets className="text-blue-600" />
                                <h2 className="text-2xl font-bold">
                                    Irrigation Plan
                                </h2>
                            </div>
                            <p className="text-gray-700">
                                {recommendations.irrigation_plan}
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <Bug className="text-red-600" />
                                <h2 className="text-2xl font-bold">
                                    Pest Management Tips
                                </h2>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {recommendations.pest_management_tips.map(
                                    (tip, i) => (
                                        <li key={i}>{tip}</li>
                                    )
                                )}
                            </ul>
                        </div>

                        <div className="bg-white rounded-xl shadow-lg p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <CheckCircle2 className="text-green-700" />
                                <h2 className="text-2xl font-bold">
                                    Best Practices
                                </h2>
                            </div>
                            <ul className="list-disc list-inside space-y-1 text-gray-700">
                                {recommendations.best_practices.map(
                                    (tip, i) => (
                                        <li key={i}>{tip}</li>
                                    )
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
