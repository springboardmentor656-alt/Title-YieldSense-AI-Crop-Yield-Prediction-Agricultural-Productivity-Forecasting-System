import apiClient from "../api/apiClient";

export const predictionService = {
  async createPrediction(payload) {
    const response = await apiClient.post(
      "/predictions",
      payload
    );

    return response.data;
  },

  async getPredictions(params = {}) {
    const response = await apiClient.get(
      "/predictions",
      {
        params,
      }
    );

    return response.data;
  },

  async getPrediction(id) {
    const response = await apiClient.get(
      `/predictions/${id}`
    );

    return response.data;
  },

  async getPredictionSummary(params = {}) {
    const response = await apiClient.get(
      "/predictions/summary",
      {
        params,
      }
    );

    return response.data;
  },

  async getModelInformation() {
    const response = await apiClient.get(
      "/predictions/model/info"
    );

    return response.data;
  },
};