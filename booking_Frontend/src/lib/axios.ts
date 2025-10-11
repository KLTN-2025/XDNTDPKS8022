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

// Interceptor response
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("[Response]", response);
    return response;
  },
  (error) => {
    console.error("[Response Error]", error);
    return error.response;
  }
);

export default axiosInstance;
