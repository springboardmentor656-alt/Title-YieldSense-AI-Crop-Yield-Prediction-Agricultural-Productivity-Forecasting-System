import axios from "axios";

import { getToken } from "../utils/token";

const soilAnalysisApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/soil-analysis",
  timeout: 30000,
});

soilAnalysisApi.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

soilAnalysisApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default soilAnalysisApi;