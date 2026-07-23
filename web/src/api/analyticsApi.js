import axios from "axios";

import { getToken } from "../utils/token";

const analyticsApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/analytics",
  timeout: 30000,
});

analyticsApi.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

analyticsApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default analyticsApi;