// Single Axios instance shared by every service. `withCredentials: true` is
// the critical line — without it, the browser won't send the HTTP-only
// session cookie on requests to the API's origin, and every call would look
// "logged out" even right after a successful Google login.

import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export const googleLoginUrl = `${API_BASE_URL}/auth/google`;

export default api;
