import api from "./api";

export const predictCrop = async (data) => {
  const response = await api.post("/predict", data);
  return response.data;
};