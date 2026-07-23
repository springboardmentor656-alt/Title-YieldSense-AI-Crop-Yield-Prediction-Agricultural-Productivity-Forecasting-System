import axios from "axios";

import { getToken } from "../utils/token";

const farmApi = axios.create({
  baseURL: "http://127.0.0.1:8000/api/farms",
  timeout: 20000,
});

farmApi.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default farmApi;