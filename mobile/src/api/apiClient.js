import axios from "axios";

import { config } from "../constants/config";
import { tokenStorage } from "../storage/tokenStorage";

const apiRootUrl = config.apiBaseUrl.replace(/\/auth\/?$/, "");

const apiClient = axios.create({
  baseURL: apiRootUrl,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (requestConfig) => {
    const token = await tokenStorage.get();

    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }

    return requestConfig;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await tokenStorage.remove();
    }

    return Promise.reject(error);
  }
);

export default apiClient;