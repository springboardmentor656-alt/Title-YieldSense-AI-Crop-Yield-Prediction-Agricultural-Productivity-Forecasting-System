"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CropsPage() {
    return (
        <div className="space-y-8">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-bold">
                        Crop Management
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Manage all crops cultivated across your farms.
                    </p>
                </div>

                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Crop
                </Button>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-gray-500">
                        Total Crops
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        12
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-gray-500">
                        Active Farms
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        5
                    </h2>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <p className="text-gray-500">
                        Average Yield
                    </p>

                    <h2 className="text-3xl font-bold mt-2">
                        6.8 t/ha
                    </h2>
                </div>

            </div>

            {/* Crop List */}
            <div className="bg-white rounded-xl shadow-md">

                <div className="border-b p-5">
                    <h2 className="text-2xl font-semibold">
                        Crop List
                    </h2>
                </div>

                <div className="overflow-x-auto">

                    <table className="w-full">

                        <thead className="bg-gray-100">

                            <tr>

                                <th className="text-left p-4">
                                    Crop
                                </th>

                                <th className="text-left p-4">
                                    Farm
                                </th>

                                <th className="text-left p-4">
                                    Area
                                </th>

                                <th className="text-left p-4">
                                    Status
                                </th>

                                <th className="text-left p-4">
                                    Predicted Yield
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            <tr className="border-t">

                                <td className="p-4">
                                    Rice
                                </td>

                                <td className="p-4">
                                    Farm A
                                </td>

                                <td className="p-4">
                                    5 Acres
                                </td>

                                <td className="p-4 text-green-600 font-medium">
                                    Growing
                                </td>

                                <td className="p-4">
                                    6.5 t/ha
                                </td>

                            </tr>

                            <tr className="border-t">

                                <td className="p-4">
                                    Wheat
                                </td>

                                <td className="p-4">
                                    Farm B
                                </td>

                                <td className="p-4">
                                    3 Acres
                                </td>

                                <td className="p-4 text-yellow-600 font-medium">
                                    Harvest Soon
                                </td>

                                <td className="p-4">
                                    4.8 t/ha
                                </td>

                            </tr>

                        </tbody>

                    </table>

                </div>

            </div>

        </div>
    );
}