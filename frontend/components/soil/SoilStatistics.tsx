"use client";

import { useSoilDashboardStats } from "@/hooks/useSoilReports";

export default function SoilStatistics() {

    const { stats, loading } = useSoilDashboardStats();

    return (

        <div className="grid md:grid-cols-4 gap-6">

            <div className="bg-white rounded-xl shadow p-6">
                <h3>Average Soil Health</h3>
                <p className="text-3xl font-bold">
                    {loading
                        ? "..."
                        : stats?.average_soil_health ?? "N/A"}
                </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h3>Healthy Farms</h3>
                <p className="text-3xl font-bold text-green-700">
                    {loading ? "..." : stats?.healthy_farms ?? 0}
                </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h3>Poor Soil</h3>
                <p className="text-3xl font-bold text-red-600">
                    {loading ? "..." : stats?.poor_soil_farms ?? 0}
                </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
                <h3>Recent Reports</h3>
                <p className="text-3xl font-bold">
                    {loading ? "..." : stats?.recent_reports ?? 0}
                </p>
                <p className="text-xs text-gray-500">Last 30 days</p>
            </div>

        </div>

    )

}
