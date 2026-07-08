"use client";

import { useEffect, useState } from "react";

import {

    getWeather,

    refreshWeather

} from "@/services/weather.service";

export function useWeather(

    farmId: number

) {

    const [weather, setWeather] =

        useState<any>();

    const [loading, setLoading] =

        useState(true);

    async function load() {

        try {

            const data =

                await getWeather(farmId);

            setWeather(data);

        }

        finally {

            setLoading(false);

        }

    }

    async function refresh() {

        setLoading(true);

        const data =

            await refreshWeather(farmId);

        setWeather(data);

        setLoading(false);

    }

    useEffect(() => {

        if (farmId) {

            load();

        }

    }, [farmId]);

    return {

        weather,

        loading,

        refresh

    };

}