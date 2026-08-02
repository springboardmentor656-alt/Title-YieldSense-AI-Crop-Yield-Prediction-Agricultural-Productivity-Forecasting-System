import api from "@/lib/axios";
import {
    SoilDashboardStats,
    SoilReport,
    SoilReportInput,
    SoilReportListResponse,
    SoilSuitability,
} from "@/types/soil";

export const getSoilSuitability = async (
    farmId: number
): Promise<SoilSuitability> => {
    const response = await api.get(`/soil/${farmId}`);

    return response.data;
};

export interface SoilReportListParams {
    search?: string;
    fertility?: string;
    health?: string;
    page?: number;
    page_size?: number;
}

export const listSoilReports = async (
    params: SoilReportListParams
): Promise<SoilReportListResponse> => {
    const response = await api.get("/soil/reports", { params });

    return response.data;
};

export const getSoilDashboardStats = async (): Promise<SoilDashboardStats> => {
    const response = await api.get("/soil/reports/dashboard-stats");

    return response.data;
};

export const getSoilReport = async (id: number): Promise<SoilReport> => {
    const response = await api.get(`/soil/reports/${id}`);

    return response.data;
};

export const createSoilReport = async (
    data: SoilReportInput
): Promise<SoilReport> => {
    const response = await api.post("/soil/reports", data);

    return response.data;
};

export const updateSoilReport = async (
    id: number,
    data: Partial<SoilReportInput>
): Promise<SoilReport> => {
    const response = await api.put(`/soil/reports/${id}`, data);

    return response.data;
};

export const deleteSoilReport = async (id: number) => {
    const response = await api.delete(`/soil/reports/${id}`);

    return response.data;
};
