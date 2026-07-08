"use client";

import { useEffect, useState } from "react";

import {

    getDashboardSummary,

    getFarms,

} from "@/services/dashboard.service";

export function useDashboard() {

    const [summary, setSummary] = useState<any>();

    const [farms, setFarms] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function load() {

            try {

                const dashboard = await getDashboardSummary();

                const farmList = await getFarms();

                setSummary(dashboard);

                setFarms(farmList);

            } finally {

                setLoading(false);

            }

        }

        load();

    }, []);

    return {

        summary,

        farms,

        loading,

    };

}