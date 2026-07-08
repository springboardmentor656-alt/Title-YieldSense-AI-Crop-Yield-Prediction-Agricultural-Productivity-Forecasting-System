"use client";

import {
    Tractor,
    Wheat,
    CloudRain,
    ChartNoAxesCombined
} from "lucide-react";

import StatsCard from "./StatsCard";
import { useDashboard } from "@/hooks/useDashboard";

export default function StatsGrid() {

    const { summary, loading } = useDashboard();

    if (loading) {
        return (
            <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

                <StatsCard
                    title="Total Farms"
                    value={0}
                    icon={<Tractor className="text-green-700" />}
                    color="bg-green-100"
                />

                <StatsCard
                    title="Active Crops"
                    value={0}
                    icon={<Wheat className="text-yellow-700" />}
                    color="bg-yellow-100"
                />

                <StatsCard
                    title="Prediction Accuracy"
                    value={0}
                    icon={<ChartNoAxesCombined className="text-blue-700" />}
                    color="bg-blue-100"
                />

                <StatsCard
                    title="Weather Alerts"
                    value={0}
                    icon={<CloudRain className="text-red-700" />}
                    color="bg-red-100"
                />

            </div>
        );
    }

    return (

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">

            <StatsCard
                title="Total Farms"
                value={summary?.total_farms ?? 0}
                icon={<Tractor className="text-green-700" />}
                color="bg-green-100"
            />

            <StatsCard
                title="Active Crops"
                value={summary?.total_crops ?? 0}
                icon={<Wheat className="text-yellow-700" />}
                color="bg-yellow-100"
            />
            <StatsCard
                title="Prediction Accuracy"
                value={summary?.prediction_accuracy ?? "--"}
                suffix={summary?.prediction_accuracy ? "%" : ""}
                icon={<ChartNoAxesCombined className="text-blue-700" />}
                color="bg-blue-100"
            />

            <StatsCard
                title="Weather Alerts"
                value={summary?.weather_alerts ?? 0}
                icon={<CloudRain className="text-red-700" />}
                color="bg-red-100"
            />

        </div>

    );

}