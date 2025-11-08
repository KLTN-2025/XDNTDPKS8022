import { useUserStore } from "@/hook/useUserStore";
import axios from "axios";
import { URL_API } from "./fetcher";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API,
  timeout: 30000,
  withCredentials: true,
});

export const refreshAccessToken = async () => {
  try {
    const response = await axios.post(
      `${URL_API}/api/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    const newAccessToken = response.data.accessToken;
    localStorage.setItem("token", newAccessToken);
    return newAccessToken;
  } catch (error) {
    console.error("Không thể refresh token:", error);
    throw error;
  }
};

// Interceptor request
axiosInstance.interceptors.request.use(
  (config) => {
    const user = useUserStore.getState().user;
    if (user?.token && config.headers) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    console.log("[Request]", config);

    return config;
  },
  (error) => {
    console.error("[Request Error]", error);
    return error;
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const message =
      error.response?.data?.message ||
      error.message ||
      "Có lỗi xảy ra từ server!";
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token thất bại:", refreshError);

        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject({ ...error, message });
  }
);

export default axiosInstance;
