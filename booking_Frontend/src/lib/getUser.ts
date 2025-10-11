import axios from "axios";
import { URL_API } from "./fetcher";

export async function getUser() {
  try {
    const res = await axios.get(`${URL_API}/api/auth/user`, {
      withCredentials: true,
    });

    return res.data;
  } catch (error: any) {
    return (document.location.href = "/");
  }
}
