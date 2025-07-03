import axios from "axios";

export const ApiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://yts.mx/api/v2",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para manejo de respuestas
ApiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  },
);
