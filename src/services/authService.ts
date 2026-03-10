import { apiFetch } from "./api";

export async function login(username: string, password: string) {
  const res = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Fel användarnamn eller lösenord.");
  return data as { token: string };
}

export async function register(username: string, password: string) {
  const res = await apiFetch("/register", {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data || "Kunde inte skapa konto.");
  return data as { token: string };
}
