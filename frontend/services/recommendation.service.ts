import api from "@/lib/axios";
import { Recommendation, RiskAssessment } from "@/types/recommendation";

export const getRecommendations = async (
    farmId: number
): Promise<Recommendation> => {
    const response = await api.get(`/recommendations/${farmId}`);

    return response.data;
};

export const getRiskAssessment = async (
    farmId: number
): Promise<RiskAssessment> => {
    const response = await api.get(`/recommendations/${farmId}/risk`);

    return response.data;
};
