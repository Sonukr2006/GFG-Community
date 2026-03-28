export type UserRole = "admin" | "leader" | "member";

export function getToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("gfg_token");
}

export function getRole(): UserRole | null {
  if (typeof window === "undefined") return null;
  return (localStorage.getItem("gfg_role") as UserRole | null) ?? null;
}

export function setSession(token: string, role: UserRole) {
  if (typeof window === "undefined") return;
  localStorage.setItem("gfg_token", token);
  localStorage.setItem("gfg_role", role);
  document.cookie = `gfg_role=${role}; path=/`;
  document.cookie = `gfg_token=${token}; path=/`;
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("gfg_token");
  localStorage.removeItem("gfg_role");
  document.cookie = "gfg_role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "gfg_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
}

export function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export function getApiBase() {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
}
