"use client";

import { useEffect, useState } from "react";

import { getSoilSuitability } from "@/services/soil.service";
import { SoilSuitability } from "@/types/soil";

import { toast } from "sonner";

export function useSoil(farmId?: number) {
    const [soil, setSoil] = useState<SoilSuitability>();
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    async function load() {
        setLoading(true);
        setNotFound(false);

        try {
            const data = await getSoilSuitability(farmId as number);
            setSoil(data);
        } catch (err: any) {
            if (err?.response?.status === 404) {
                setSoil(undefined);
                setNotFound(true);
            } else {
                toast.error("Unable to load soil suitability");
            }
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (farmId) {
            load();
        }
    }, [farmId]);

    return {
        soil,
        loading,
        notFound,
        refresh: load,
    };
}
