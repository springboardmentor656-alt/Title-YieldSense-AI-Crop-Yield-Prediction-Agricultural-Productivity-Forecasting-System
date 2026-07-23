import apiClient from "../api/apiClient";

export const recommendationService = {
  async createRecommendation(payload) {
    const response = await apiClient.post(
      "/crop-recommendation",
      payload
    );

    return response.data;
  },

  async getRecommendationHistory(params = {}) {
    const response = await apiClient.get(
      "/crop-recommendation/history",
      {
        params,
      }
    );

    return response.data;
  },

  async getRecommendation(recommendationId) {
    const response = await apiClient.get(
      `/crop-recommendation/${recommendationId}`
    );

    return response.data;
  },
};