import { io } from "socket.io-client";

export let baseUrl = "";
if (process.env.NODE_ENV === "production") {
  baseUrl = "https://chat-api-ckbb.onrender.com";
} else if (process.env.NODE_ENV === "development") {
  baseUrl = "http://localhost:3000";
}

export const socket = io(baseUrl, {
  autoConnect: false,
});
