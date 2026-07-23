import axios from "axios";

import { getToken } from "../utils/token";

const predictionApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/predictions",
  timeout: 30000,
});

predictionApi.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

predictionApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default predictionApi;