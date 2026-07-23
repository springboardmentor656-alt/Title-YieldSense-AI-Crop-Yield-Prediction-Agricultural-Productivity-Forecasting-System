import apiClient from "../api/apiClient";
import { config } from "../constants/config";

const weatherApiBaseUrl =
  config.apiBaseUrl.replace(
    /\/api\/auth\/?$/,
    ""
  );

export async function getWeatherAnalysisOptions() {
  const response = await apiClient.get(
    `${weatherApiBaseUrl}/weather-analysis/options`
  );

  return response.data;
}

export async function getWeatherAnalysis({
  state,
  startYear,
  endYear,
}) {
  const response = await apiClient.get(
    `${weatherApiBaseUrl}/weather-analysis`,
    {
      params: {
        state,
        start_year: startYear,
        end_year: endYear,
      },
    }
  );

  return response.data;
}