"use client";

import { useState } from "react";

import { Droplets, FlaskConical, Gauge, Leaf } from "lucide-react";

import FarmPicker from "@/components/farm/FarmPicker";
import { useFarm } from "@/hooks/useFarm";
import { useSoil } from "@/hooks/useSoil";

export default function SoilPage() {
    const { farms, loading: farmsLoading } = useFarm();
    const [farmId, setFarmId] = useState<number | null>(null);

    const { soil, loading, notFound } = useSoil(farmId ?? undefined);

    return (
        <div className="space-y-8">
            <h1 className="text-4xl font-bold">Soil Suitability</h1>

            <div className="bg-white rounded-xl shadow p-6">
                {farmsLoading ? (
                    <p className="text-gray-500">Loading farms...</p>
                ) : farms.length === 0 ? (
                    <p className="text-gray-500">
                        Add a farm first to view soil analysis.
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
                <p className="text-gray-500">Loading soil report...</p>
            )}

            {farmId && !loading && notFound && (
                <div className="bg-white rounded-xl shadow p-8">
                    <p className="text-gray-500">
                        No soil report on file for this farm yet.
                    </p>
                </div>
            )}

            {soil && (
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <FlaskConical className="text-green-700" />
                            <h2 className="text-2xl font-bold">Soil pH</h2>
                        </div>

                        <p className="text-3xl font-bold">{soil.ph.ph}</p>
                        <p className="text-gray-500 capitalize">
                            {soil.ph.ph_category}
                        </p>

                        <p className="mt-2 text-sm">
                            Yield Multiplier:{" "}
                            <span className="font-semibold">
                                {soil.ph.yield_multiplier}
                            </span>
                        </p>
                        <p className="text-sm">
                            Valid Range:{" "}
                            <span className="font-semibold">
                                {soil.ph.is_valid ? "Yes" : "No"}
                            </span>
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <Gauge className="text-green-700" />
                            <h2 className="text-2xl font-bold">
                                Fertility
                            </h2>
                        </div>

                        <p className="text-3xl font-bold">
                            {soil.nutrient_score}
                        </p>
                        <p className="text-gray-500 capitalize">
                            {soil.fertility_category}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-lg p-6 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Leaf className="text-green-700" />
                            <h2 className="text-2xl font-bold">
                                Nutrient Readings
                            </h2>
                        </div>

                        <div className="grid md:grid-cols-4 gap-5">
                            <div>
                                <p className="text-sm text-gray-500">
                                    Nitrogen (N)
                                </p>
                                <p className="text-2xl font-bold">
                                    {soil.nitrogen ?? "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Phosphorus (P)
                                </p>
                                <p className="text-2xl font-bold">
                                    {soil.phosphorus ?? "N/A"}
                                </p>
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Potassium (K)
                                </p>
                                <p className="text-2xl font-bold">
                                    {soil.potassium ?? "N/A"}
                                </p>
                            </div>

                            <div className="flex items-center gap-2">
                                <Droplets className="text-blue-600" />
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Moisture
                                    </p>
                                    <p className="text-2xl font-bold">
                                        {soil.moisture ?? "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
