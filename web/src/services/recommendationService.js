import recommendationApi from "../api/recommendationApi";

function getReportsBaseUrl() {
  const recommendationBaseUrl =
    recommendationApi.defaults.baseURL || "";

  if (!recommendationBaseUrl) {
    return "";
  }

  return recommendationBaseUrl.replace(
    /\/(?:api\/)?crop-recommendation\/?$/,
    "/api/reports/recommendations"
  );
}

function getDownloadFilename(
  contentDisposition,
  fallbackFilename
) {
  if (!contentDisposition) {
    return fallbackFilename;
  }

  const utf8Match = contentDisposition.match(
    /filename\*=UTF-8''([^;]+)/
  );

  if (utf8Match?.[1]) {
    return decodeURIComponent(utf8Match[1]);
  }

  const normalMatch = contentDisposition.match(
    /filename="?([^";]+)"?/
  );

  return normalMatch?.[1] || fallbackFilename;
}

function downloadBlob(blob, filename) {
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = downloadUrl;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(downloadUrl);
}

async function downloadRecommendationReport(
  format,
  params = {}
) {
  const reportsBaseUrl = getReportsBaseUrl();

  if (!reportsBaseUrl) {
    throw new Error(
      "Recommendation API base URL is not configured."
    );
  }

  const response = await recommendationApi.get(
    `${reportsBaseUrl}/${format}`,
    {
      params,
      responseType: "blob",
    }
  );

  const filename = getDownloadFilename(
    response.headers["content-disposition"],
    `crop_recommendations.${format}`
  );

  downloadBlob(response.data, filename);

  return filename;
}

export async function generateRecommendation(data) {
  const response = await recommendationApi.post(
    "",
    data
  );

  return response.data;
}

export async function getRecommendationHistory(
  params = {}
) {
  const response = await recommendationApi.get(
    "/history",
    {
      params,
    }
  );

  return response.data;
}

export async function getRecommendation(id) {
  const response = await recommendationApi.get(
    `/${id}`
  );

  return response.data;
}

export async function exportRecommendationsCsv(
  params = {}
) {
  return downloadRecommendationReport(
    "csv",
    params
  );
}

export async function exportRecommendationsPdf(
  params = {}
) {
  return downloadRecommendationReport(
    "pdf",
    params
  );
}