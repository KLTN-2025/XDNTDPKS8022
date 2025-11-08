import axiosInstance from "./axios";

export async function getUser() {
  try {
    const res = await axiosInstance.get(`/api/auth/user`, {
      withCredentials: true,
    });

    return res.data;
  } catch {
    return (document.location.href = "/");
  }
}
