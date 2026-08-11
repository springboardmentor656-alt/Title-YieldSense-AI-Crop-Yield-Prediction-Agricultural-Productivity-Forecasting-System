"use client";

import { useEffect, useState } from "react";

import { toast } from "sonner";

import {

    getDashboardSummary,

    getFarms,

} from "@/services/dashboard.service";

import type { DashboardSummary } from "@/types/analytics";

export function useDashboard() {

    const [summary, setSummary] = useState<DashboardSummary>();

    const [farms, setFarms] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState<string | null>(null);

    async function load() {

        try {

            setLoading(true);

            setError(null);

            const [dashboard, farmList] = await Promise.all([

                getDashboardSummary(),

                getFarms(),

            ]);

            setSummary(dashboard);

            setFarms(farmList);

        } catch {

            setError("Unable to load dashboard data. Please try again.");

            toast.error("Unable to load dashboard data");

        } finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        load();

    }, []);

    return {

        summary,

        farms,

        loading,

        error,

        refresh: load,

    };

}
