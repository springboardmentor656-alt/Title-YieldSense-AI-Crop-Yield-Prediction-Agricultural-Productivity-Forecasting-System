"use client";

import { useState } from "react";

import { Bug, CheckCircle2, Droplets, FlaskConical, Sprout } from "lucide-react";

import FarmPicker from "@/components/farm/FarmPicker";
import { useFarm } from "@/hooks/useFarm";
import { useRecommendations } from "@/hooks/useRecommendations";

export default function RecommendationsPage() {
    const { farms, loading: farmsLoading } = useFarm();
    const [farmId, setFarmId] = useState<number | null>(null);

    const { recommendations, loading, notFound } = useRecommendations(
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
