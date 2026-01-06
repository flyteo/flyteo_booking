import axios from "axios";

const API_BASE_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:5000"
    : "http://10.12.76.87:5000"; // 👈 YOUR PC IP

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true
});

export default api;
