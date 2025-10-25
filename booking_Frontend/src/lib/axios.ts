import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_URL_API,
  timeout: 30000,
  withCredentials: true,
});

// Interceptor request
axiosInstance.interceptors.request.use(
  (config) => {
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
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Có lỗi xảy ra từ server!";
    return Promise.reject({ ...error, message });
  }
);

export default axiosInstance;
