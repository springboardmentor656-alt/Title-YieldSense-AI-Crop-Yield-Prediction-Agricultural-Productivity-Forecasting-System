import api from "@/lib/axios";
import {
    PredictionHistoryEntry,
    PredictionRequest,
    PredictionResult,
} from "@/types/prediction";

export const predictYield = async (
    payload: PredictionRequest
): Promise<PredictionResult> => {
    const response = await api.post("/predictions/predict", payload);

    return response.data;
};

export const getPredictionHistory = async (
    farmId: number
): Promise<PredictionHistoryEntry[]> => {
    const response = await api.get(`/predictions/history/${farmId}`);

    return response.data;
};
