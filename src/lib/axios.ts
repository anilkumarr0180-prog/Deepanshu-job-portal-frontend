import axios from "axios";
import toast from "react-hot-toast";

import { clearAuth } from "./auth";

const API_BASE_URL =
  (import.meta.env.VITE_API_URL ?? "/api").replace(/\/$/, "");

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
});

/*
|--------------------------------------------------------------------------
| Attach token to every request
|--------------------------------------------------------------------------
*/

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/*
|--------------------------------------------------------------------------
| Handle Unauthorized
|--------------------------------------------------------------------------
*/

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuth();
      toast.error("Session expired. Please login again.");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);