"use client";

import { useState } from "react";

import WeatherCard from "@/components/weather/Weathercard";

import WeatherRefreshButton from "@/components/weather/WeatherRefreshButton";

import { useWeather } from "@/hooks/useWeather";

export default function WeatherPage() {

    // Temporary

    const [farmId] = useState(1);

    const {

        weather,

        loading,

        refresh

    } = useWeather(

        farmId

    );

    if (loading) {

        return <p>

            Loading Weather...

        </p>;

    }

    return (

        <div className="space-y-8">

            <div className="flex justify-between">

                <h1 className="text-4xl font-bold">

                    Weather Dashboard

                </h1>

                <WeatherRefreshButton

                    refresh={refresh}

                    loading={loading}

                />

            </div>

            {

                weather &&

                <WeatherCard

                    weather={weather}

                />

            }

        </div>

    )

}