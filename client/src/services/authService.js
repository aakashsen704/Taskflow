import api from "./api";

// GET /auth/me — the only way the SPA can know if the HTTP-only cookie is
// still valid, since JS can't read the cookie itself.
export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data.data.user;
}

export async function logout() {
  const { data } = await api.post("/auth/logout");
  return data;
}
