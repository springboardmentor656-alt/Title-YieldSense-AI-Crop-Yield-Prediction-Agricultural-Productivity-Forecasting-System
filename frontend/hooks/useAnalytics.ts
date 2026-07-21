"use client";

import { useEffect, useState } from "react";

import * as AnalyticsService from "@/services/analytics.service";

import { toast } from "sonner";

export function useYieldTrend(farmId: number | null) {

    const [trend, setTrend] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    async function load() {

        try {

            setLoading(true);

            const data = await AnalyticsService.getYieldTrend(
                farmId as number
            );

            setTrend(data);

        }

        catch {

            toast.error("Unable to load yield trend");

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        if (farmId) {

            load();

        }

    }, [farmId]);

    return { trend, loading, refresh: load };

}

export function useFarmComparison() {

    const [comparison, setComparison] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    async function load() {

        try {

            setLoading(true);

            const data = await AnalyticsService.getFarmComparison();

            setComparison(data);

        }

        catch {

            toast.error("Unable to load farm comparison");

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        load();

    }, []);

    return { comparison, loading, refresh: load };

}

export function useWeatherImpact(farmId: number | null) {

    const [impact, setImpact] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    async function load() {

        try {

            setLoading(true);

            const data = await AnalyticsService.getWeatherImpact(
                farmId as number
            );

            setImpact(data);

        }

        catch {

            toast.error("Unable to load weather impact");

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        if (farmId) {

            load();

        }

    }, [farmId]);

    return { impact, loading, refresh: load };

}

export function useRiskAnomalies(farmId: number | null) {

    const [anomalies, setAnomalies] = useState<any[]>([]);

    const [loading, setLoading] = useState(true);

    async function load() {

        try {

            setLoading(true);

            const data = await AnalyticsService.getRiskAnomalies(
                farmId as number
            );

            setAnomalies(data);

        }

        catch {

            toast.error("Unable to load risk anomalies");

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        if (farmId) {

            load();

        }

    }, [farmId]);

    return { anomalies, loading, refresh: load };

}

export function useAccuracyTracking(farmId: number | null) {

    const [accuracy, setAccuracy] = useState<any>(null);

    const [loading, setLoading] = useState(true);

    async function load() {

        try {

            setLoading(true);

            const data = await AnalyticsService.getAccuracyTracking(
                farmId as number
            );

            setAccuracy(data);

        }

        catch {

            toast.error("Unable to load accuracy tracking");

        }

        finally {

            setLoading(false);

        }

    }

    async function recordActualYield(
        entryId: number,
        actualYield: number
    ) {

        await AnalyticsService.setActualYield(entryId, actualYield);

        toast.success("Actual yield recorded");

        load();

    }

    useEffect(() => {

        if (farmId) {

            load();

        }

    }, [farmId]);

    return { accuracy, loading, refresh: load, recordActualYield };

}
