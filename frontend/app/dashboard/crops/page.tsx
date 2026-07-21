"use client";

import { useState } from "react";

import { Plus, Sprout, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import FarmPicker from "@/components/farm/FarmPicker";
import { useFarm } from "@/hooks/useFarm";
import { useCrop } from "@/hooks/useCrop";

export default function CropsPage() {
    const { farms, loading: farmsLoading } = useFarm();
    const [farmId, setFarmId] = useState<number | null>(null);

    const { crops, loading, addCrop, removeCrop } = useCrop(
        farmId ?? undefined
    );

    const [cropName, setCropName] = useState("");
    const [hectares, setHectares] = useState("");
    const [submitting, setSubmitting] = useState(false);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();

        if (!cropName.trim()) {
            return;
        }

        setSubmitting(true);

        try {
            await addCrop(
                cropName.trim(),
                hectares ? Number(hectares) : undefined
            );
            setCropName("");
            setHectares("");
        } finally {
            setSubmitting(false);
        }
    }

    const totalHectares = crops.reduce(
        (sum, crop) => sum + (crop.hectares_planted ?? 0),
        0
    );

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-4xl font-bold">Crop Management</h1>
                <p className="text-gray-500 mt-2">
                    Assign and track crops planted on each farm.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                {farmsLoading ? (
                    <p className="text-gray-500">Loading farms...</p>
                ) : farms.length === 0 ? (
                    <p className="text-gray-500">
                        Add a farm first to manage crops.
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <p className="text-gray-500">Crops on This Farm</p>
                            <h2 className="text-3xl font-bold mt-2">
                                {crops.length}
                            </h2>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <p className="text-gray-500">Total Hectares Planted</p>
                            <h2 className="text-3xl font-bold mt-2">
                                {totalHectares.toFixed(2)} ha
                            </h2>
                        </div>
                    </div>

                    <form
                        onSubmit={handleAdd}
                        className="bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row gap-4 items-end"
                    >
                        <div className="flex-1 w-full">
                            <label className="text-sm text-gray-500">
                                Crop Name
                            </label>
                            <input
                                type="text"
                                value={cropName}
                                onChange={(e) => setCropName(e.target.value)}
                                placeholder="e.g. Rice"
                                className="border rounded-lg px-4 py-2 w-full mt-1"
                                required
                            />
                        </div>

                        <div className="w-full md:w-48">
                            <label className="text-sm text-gray-500">
                                Hectares Planted
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                value={hectares}
                                onChange={(e) => setHectares(e.target.value)}
                                placeholder="Optional"
                                className="border rounded-lg px-4 py-2 w-full mt-1"
                            />
                        </div>

                        <Button type="submit" disabled={submitting}>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Crop
                        </Button>
                    </form>

                    <div className="bg-white rounded-xl shadow-md">
                        <div className="border-b p-5">
                            <h2 className="text-2xl font-semibold">
                                Crop List
                            </h2>
                        </div>

                        <div className="overflow-x-auto">
                            {loading ? (
                                <p className="text-gray-500 p-5">
                                    Loading crops...
                                </p>
                            ) : crops.length === 0 ? (
                                <p className="text-gray-500 p-5">
                                    No crops added for this farm yet.
                                </p>
                            ) : (
                                <table className="w-full">
                                    <thead className="bg-gray-100">
                                        <tr>
                                            <th className="text-left p-4">
                                                Crop
                                            </th>
                                            <th className="text-left p-4">
                                                Hectares Planted
                                            </th>
                                            <th className="text-left p-4" />
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {crops.map((crop) => (
                                            <tr
                                                key={crop.id}
                                                className="border-t"
                                            >
                                                <td className="p-4 flex items-center gap-2">
                                                    <Sprout className="text-green-700 h-4 w-4" />
                                                    {crop.crop_name}
                                                </td>
                                                <td className="p-4">
                                                    {crop.hectares_planted ??
                                                        "N/A"}
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() =>
                                                            removeCrop(
                                                                crop.id
                                                            )
                                                        }
                                                        className="text-red-600 hover:text-red-800"
                                                        aria-label="Delete crop"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
