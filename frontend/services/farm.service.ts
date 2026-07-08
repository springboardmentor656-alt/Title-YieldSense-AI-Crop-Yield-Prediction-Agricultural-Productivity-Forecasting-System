import api from "@/lib/axios";

export const getFarms = async () => {

    const response = await api.get("/farms");

    return response.data;

};

export const getFarm = async (id: number) => {

    const response = await api.get(`/farms/${id}`);

    return response.data;

};

export const createFarm = async (data: any) => {

    const response = await api.post("/farms", data);

    return response.data;

};

export const updateFarm = async (id: number, data: any) => {

    const response = await api.put(`/farms/${id}`, data);

    return response.data;

};

export const deleteFarm = async (id: number) => {

    const response = await api.delete(`/farms/${id}`);

    return response.data;

};