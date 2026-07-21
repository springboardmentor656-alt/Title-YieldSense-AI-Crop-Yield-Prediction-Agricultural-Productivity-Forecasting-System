import api from "@/lib/axios";

export const getCropsForFarm = async (farmId: number) => {
    const response = await api.get(`/crops/farm/${farmId}`);

    return response.data;
};

export const createCrop = async (data: {
    farm_id: number;
    crop_name: string;
    hectares_planted?: number;
}) => {
    const response = await api.post("/crops/", data);

    return response.data;
};

export const updateCrop = async (
    cropId: number,
    data: { crop_name?: string; hectares_planted?: number }
) => {
    const response = await api.put(`/crops/${cropId}`, data);

    return response.data;
};

export const deleteCrop = async (cropId: number) => {
    const response = await api.delete(`/crops/${cropId}`);

    return response.data;
};
