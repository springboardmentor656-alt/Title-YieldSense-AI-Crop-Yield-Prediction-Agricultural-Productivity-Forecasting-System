"use client";

import { useEffect, useState } from "react";

import * as SoilService from "@/services/soil.service";
import { SoilDashboardStats, SoilReport } from "@/types/soil";

import { toast } from "sonner";

export function useSoilReports(params: SoilService.SoilReportListParams) {
    const [reports, setReports] = useState<SoilReport[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);

        try {
            const data = await SoilService.listSoilReports(params);
            setReports(data.items);
            setTotal(data.total);
        } catch {
            toast.error("Unable to load soil reports");
        } finally {
            setLoading(false);
        }
    }

    async function removeReport(id: number) {
        await SoilService.deleteSoilReport(id);
        toast.success("Soil report deleted");
        load();
    }

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        params.search,
        params.fertility,
        params.health,
        params.page,
        params.page_size,
    ]);

    return {
        reports,
        total,
        loading,
        removeReport,
        refresh: load,
    };
}

export function useSoilDashboardStats() {
    const [stats, setStats] = useState<SoilDashboardStats>();
    const [loading, setLoading] = useState(true);

    async function load() {
        setLoading(true);

        try {
            const data = await SoilService.getSoilDashboardStats();
            setStats(data);
        } catch {
            toast.error("Unable to load soil health stats");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        load();
    }, []);

    return { stats, loading, refresh: load };
}
