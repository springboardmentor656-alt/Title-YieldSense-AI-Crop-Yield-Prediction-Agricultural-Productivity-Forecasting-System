"use client";

import {
    CloudSun,
    Droplets,
    Wind,
} from "lucide-react";

import { useDashboard } from "@/hooks/useDashboard";

export default function WeatherWidget() {

    const { summary, loading } = useDashboard();

    const weather = summary?.weather;

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold mb-5">
                    Today's Weather
                </h2>

                <p className="text-gray-500">
                    Loading weather...
                </p>
            </div>
        );
    }

    return (

        <div className="bg-white rounded-xl shadow-md p-6">

            <h2 className="text-xl font-bold mb-5">
                Today's Weather
            </h2>

            <div className="space-y-4">

                <div className="flex justify-between">

                    <span>
                        <CloudSun className="inline mr-2" />
                        Temperature
                    </span>

                    <span>
                        {weather?.temperature ?? "--"}°C
                    </span>

                </div>

                <div className="flex justify-between">

                    <span>
                        <Droplets className="inline mr-2" />
                        Humidity
                    </span>

                    <span>
                        {weather?.humidity ?? "--"}%
                    </span>

                </div>

                <div className="flex justify-between">

                    <span>
                        <Wind className="inline mr-2" />
                        Rainfall
                    </span>

                    <span>
                        {weather?.rainfall ?? "--"} mm
                    </span>

                </div>

            </div>

        </div>

    );
}