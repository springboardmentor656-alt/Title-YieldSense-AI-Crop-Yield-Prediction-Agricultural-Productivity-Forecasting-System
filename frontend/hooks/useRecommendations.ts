"use client";

import { useEffect, useState } from "react";

import { getRecommendations, getRiskAssessment } from "@/services/recommendation.service";
import { Recommendation, RiskAssessment } from "@/types/recommendation";

import { toast } from "sonner";

export function useRecommendations(farmId?: number) {
    const [recommendations, setRecommendations] = useState<Recommendation>();
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    async function load() {
        setLoading(true);
        setNotFound(false);

        try {
            const data = await getRecommendations(farmId as number);
            setRecommendations(data);
        } catch (err: any) {
            if (err?.response?.status === 404) {
                setRecommendations(undefined);
                setNotFound(true);
            } else {
                toast.error("Unable to load recommendations");
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
        recommendations,
        loading,
        notFound,
        refresh: load,
    };
}

export function useRiskAssessment(farmId?: number) {
    const [risk, setRisk] = useState<RiskAssessment>();
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);

    async function load() {
        setLoading(true);
        setNotFound(false);

        try {
            const data = await getRiskAssessment(farmId as number);
            setRisk(data);
        } catch (err: any) {
            if (err?.response?.status === 404) {
                setRisk(undefined);
                setNotFound(true);
            } else {
                toast.error("Unable to load risk assessment");
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
        risk,
        loading,
        notFound,
        refresh: load,
    };
}
