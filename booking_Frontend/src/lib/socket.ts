import { io } from "socket.io-client";
import { URL_API } from "./fetcher";

const socket = io(URL_API || "http://localhost:5000", {
  autoConnect: false,
  withCredentials: true,
  transports: ["websocket"],
});

export default socket;
