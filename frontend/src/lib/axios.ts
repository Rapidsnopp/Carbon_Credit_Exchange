// src/api.ts
import axios, { AxiosInstance } from "axios";

// Khai báo env types cho Vite
declare global {
  interface ImportMetaEnv {
    readonly VITE_API_BASE_URL?: string;
  }
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

const api: AxiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🧩 Interceptor thêm token vào header
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🧩 Interceptor xử lý lỗi phản hồi
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API error:", err?.response || err.message || err);
    return Promise.reject(err);
  }
);

// Hàm tiện ích cập nhật token
export function setAuthToken(token?: string | null) {
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
}

export default api;
