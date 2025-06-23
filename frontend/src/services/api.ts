import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authApi = {
  login: (email: string, password: string) =>
    api.post("/api/auth/login", { email, password }),
  register: (email: string, password: string, name?: string) =>
    api.post("/api/auth/register", { email, password, name }),
  getProfile: () => api.get("/api/auth/profile"),
};

export const urlApi = {
  createShortUrl: (url: string, customSlug?: string) =>
    api.post("/api/urls", { url, customSlug }),
  getMyUrls: () => api.get("/api/urls/my-urls"),
  updateSlug: (id: string, newSlug: string) =>
    api.put(`/api/urls/${id}/slug`, { newSlug }),
  getStats: () => api.get("/api/urls/stats"),
};
