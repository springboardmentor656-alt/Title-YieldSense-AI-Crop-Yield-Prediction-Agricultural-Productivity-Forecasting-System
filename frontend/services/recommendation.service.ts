import api from "@/lib/axios";
import { Recommendation } from "@/types/recommendation";

export const getRecommendations = async (
    farmId: number
): Promise<Recommendation> => {
    const response = await api.get(`/recommendations/${farmId}`);

    return response.data;
};
