import axios from "axios"

import { setupInterceptors } from "./interceptors"

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api"
export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000"

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

setupInterceptors(axiosInstance)

export default axiosInstance