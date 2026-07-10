import axios from "axios";

import { getToken } from "../utils/token";

const datasetApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/datasets",
  timeout: 30000,
});

datasetApi.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

datasetApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default datasetApi;