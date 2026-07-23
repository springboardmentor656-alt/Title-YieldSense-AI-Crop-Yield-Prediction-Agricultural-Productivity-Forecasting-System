import axios from "axios";

import { getToken } from "../utils/token";

const recommendationApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/crop-recommendation",
  timeout: 30000,
});

recommendationApi.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

recommendationApi.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default recommendationApi;