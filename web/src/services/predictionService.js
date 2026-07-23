import predictionApi from "../api/predictionApi";

export const predictionService = {
  async createPrediction(payload) {
    const response = await predictionApi.post("", payload);

    return response.data;
  },

  async getPredictions(params = {}) {
    const response = await predictionApi.get("", {
      params,
    });

    return response.data;
  },

  async getPrediction(id) {
    const response = await predictionApi.get(`/${id}`);

    return response.data;
  },

  async getPredictionSummary(params = {}) {
    const response = await predictionApi.get("/summary", {
      params,
    });

    return response.data;
  },

  async getModelInformation() {
    const response = await predictionApi.get("/model/info");

    return response.data;
  },
};