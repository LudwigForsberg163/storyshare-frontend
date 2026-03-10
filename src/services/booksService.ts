import { apiFetch } from "./api";

export async function searchBooks(query: string) {
  const res = await apiFetch(`/books/search?search=${encodeURIComponent(query)}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Kunde inte hämta böcker.");
  return data;
}

export async function getBook(id: string | string[]) {
  const res = await apiFetch(`/books/${id}`);
  if (!res.ok) throw new Error("Kunde inte hämta bok.");
  return res.json();
}

export async function loanBook(id: string | string[]) {
  const res = await apiFetch(`/books/${id}/loan`, { method: "POST" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Kunde inte låna bok.");
  return data;
}

export async function returnBook(id: string | string[] | number) {
  const res = await apiFetch(`/books/${id}/return`, { method: "POST" });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Kunde inte lämna in bok.");
  return data;
}
