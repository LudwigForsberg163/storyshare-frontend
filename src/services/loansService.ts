import { apiFetch } from "./api";

export async function getCurrentLoans() {
  const res = await apiFetch("/loans/current");
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Kunde inte hämta lån.");
  return data;
}
