import api from "@/lib/axios";

export const getDashboardSummary = async () => {

    const response = await api.get("/dashboard/summary");

    return response.data;

};

export const getFarms = async () => {

    const response = await api.get("/farms");

    return response.data;

};