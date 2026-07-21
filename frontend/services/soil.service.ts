import api from "@/lib/axios";
import { SoilSuitability } from "@/types/soil";

export const getSoilSuitability = async (
    farmId: number
): Promise<SoilSuitability> => {
    const response = await api.get(`/soil/${farmId}`);

    return response.data;
};
