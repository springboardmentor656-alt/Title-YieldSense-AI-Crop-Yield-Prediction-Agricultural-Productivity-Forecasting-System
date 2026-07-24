const API_BASE = "http://127.0.0.1:8000/api/v1";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${endpoint}`, { ...options, headers });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Something went wrong");
  return data;
}

export const api = {
  // Auth
  register: (body: object) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body: object) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),

  // User
  getProfile: () => request("/users/me"),

  // Farms
  getFarms: () => request("/farms/"),
  createFarm: (body: object) =>
    request("/farms/", { method: "POST", body: JSON.stringify(body) }),
  deleteFarm: (id: number) =>
    request(`/farms/${id}`, { method: "DELETE" }),

  // Crops
  getCrops: (farmId: number) => request(`/data/farms/${farmId}/crops`),
  addCrop: (farmId: number, body: object) =>
    request(`/data/farms/${farmId}/crops`, { method: "POST", body: JSON.stringify(body) }),

  // Health
  health: () => request("/health"),
};