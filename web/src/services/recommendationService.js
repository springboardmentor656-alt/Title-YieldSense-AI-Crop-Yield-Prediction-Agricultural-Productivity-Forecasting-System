import recommendationApi from "../api/recommendationApi";

export async function generateRecommendation(data) {
  const response = await recommendationApi.post("", data);
  return response.data;
}

export async function getRecommendationHistory() {
  const response = await recommendationApi.get("/history");
  return response.data;
}

export async function getRecommendation(id) {
  const response = await recommendationApi.get(`/${id}`);
  return response.data;
}