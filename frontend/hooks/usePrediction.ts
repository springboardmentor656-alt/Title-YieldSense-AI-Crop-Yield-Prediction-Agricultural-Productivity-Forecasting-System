"use client";

import { useEffect, useState } from "react";

import {
    getPredictionHistory,
    predictYield,
} from "@/services/prediction.service";
import {
    PredictionHistoryEntry,
    PredictionResult,
} from "@/types/prediction";

import { toast } from "sonner";

interface PredictOverrides {
    temperature?: number;
    rainfall?: number;
    soil_ph?: number;
}

export function usePrediction(farmId?: number) {
    const [result, setResult] = useState<PredictionResult>();
    const [history, setHistory] = useState<PredictionHistoryEntry[]>([]);
    const [predicting, setPredicting] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(true);

    async function loadHistory() {
        setHistoryLoading(true);

        try {
            const data = await getPredictionHistory(farmId as number);
            setHistory(data);
        } catch {
            toast.error("Unable to load prediction history");
        } finally {
            setHistoryLoading(false);
        }
    }

    async function predict(overrides: PredictOverrides) {
        if (!farmId) {
            return;
        }

        setPredicting(true);

        try {
            const data = await predictYield({
                farm_id: farmId,
                ...overrides,
            });

            setResult(data);
            toast.success("Prediction generated");
            loadHistory();
        } catch {
            toast.error("Unable to generate prediction");
        } finally {
            setPredicting(false);
        }
    }

    useEffect(() => {
        setResult(undefined);

        if (farmId) {
            loadHistory();
        }
    }, [farmId]);

    return {
        result,
        history,
        predicting,
        historyLoading,
        predict,
    };
}
