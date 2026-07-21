import api from "@/lib/axios";

export const getYieldTrend = async (farmId: number) => {

    const response = await api.get(
        `/analytics/trend/${farmId}`
    );

    return response.data;

};

export const getFarmComparison = async () => {

    const response = await api.get("/analytics/farm-comparison");

    return response.data;

};

export const getWeatherImpact = async (farmId: number) => {

    const response = await api.get(
        `/analytics/weather-impact/${farmId}`
    );

    return response.data;

};

export const getRiskAnomalies = async (farmId: number) => {

    const response = await api.get(
        `/analytics/risk-anomaly/${farmId}`
    );

    return response.data;

};

export const getAccuracyTracking = async (farmId: number) => {

    const response = await api.get(
        `/analytics/accuracy/${farmId}`
    );

    return response.data;

};

export const exportPredictionsCsv = async (farmId: number) => {

    const response = await api.get(
        `/analytics/predictions/${farmId}/export`,
        { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(
        new Blob([response.data])
    );

    const link = document.createElement("a");

    link.href = url;
    link.setAttribute("download", `predictions_farm_${farmId}.csv`);

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.URL.revokeObjectURL(url);

};

export const setActualYield = async (
    entryId: number,
    actualYield: number
) => {

    const response = await api.patch(
        `/analytics/predictions/${entryId}/actual-yield`,
        { actual_yield: actualYield }
    );

    return response.data;

};
