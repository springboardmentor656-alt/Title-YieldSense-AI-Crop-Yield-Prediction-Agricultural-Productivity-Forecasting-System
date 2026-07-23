import axios from "axios";

import { getToken } from "../utils/token";

const weatherAnalysisApi = axios.create({
  baseURL: "http://127.0.0.1:8000/weather-analysis",
  timeout: 30000,
});

weatherAnalysisApi.interceptors.request.use(
  (config) => {
    const token = getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

weatherAnalysisApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default weatherAnalysisApi;