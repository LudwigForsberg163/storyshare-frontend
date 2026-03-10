"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthGuard from "../../components/AuthGuard";

interface Book {
	id: number;
	title: string;
	author: string;
	isbn: string;
	publicationDate: string;
	description: string;
	imageUrl: string;
	language: string;
	pageCount: number;
	rating: number;
	totalCopies: number;
	borrowDays: number;
	availableCopies: number;
}

const colors = {
	background: "#F5EFE6",
	card: "#FFFFFF",
	accent: "#7BAE7F",
	accentText: "#fff",
	border: "#6B4F2B",
	heading: "#6B4F2B",
	text: "#2D2D2D",
	highlight: "#F2C572",
};

function SearchPage() {
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const [searched, setSearched] = useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	async function handleSearch(e?: React.FormEvent) {
		if (e) e.preventDefault();
		// Update the URL with the search query
		if (query) {
			router.push(`?q=${encodeURIComponent(query)}`);
		} else {
			router.push("/");
		}
		setLoading(true);
		setError(null);
		setSearched(true);
		try {
			const token = localStorage.getItem("token");
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/search?search=${encodeURIComponent(query)}`,
				{
					headers: {
						"Authorization": token ? `Bearer ${token}` : "",
						"Accept": "application/json"
					}
				}
			);
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.message || "Kunde inte hämta böcker.");
			}
			const data = await res.json();
			setBooks(data);
		} catch (err: any) {
			setError(err.message || "Nätverksfel. Försök igen.");
			setBooks([]);
		} finally {
			setLoading(false);
		}
	}

	// On mount, initialize query from URL and auto-search if present
	useEffect(() => {
		const q = searchParams.get("q") || "";
		setQuery(q);
		if (q) {
			// Only auto-search if q is present
			(async () => {
				setLoading(true);
				setError(null);
				setSearched(true);
				try {
					const token = localStorage.getItem("token");
					const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/search?search=${encodeURIComponent(q)}`,
						{
							headers: {
								"Authorization": token ? `Bearer ${token}` : "",
								"Accept": "application/json"
							}
						}
					);
					if (!res.ok) {
						const data = await res.json().catch(() => ({}));
						throw new Error(data.message || "Kunde inte hämta böcker.");
					}
					const data = await res.json();
					setBooks(data);
				} catch (err: any) {
					setError(err.message || "Nätverksfel. Försök igen.");
					setBooks([]);
				} finally {
					setLoading(false);
				}
			})();
		} else {
			// If no query, clear results and state
			setBooks([]);
			setError(null);
			setSearched(false);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<AuthGuard>
			<main style={{ maxWidth: 600, margin: "0 auto", padding: 16, minHeight: '100vh' }}>
				<div style={{
					width: '100%',
					maxWidth: 420,
					background: colors.card,
					padding: 24,
					borderRadius: 12,
					boxShadow: '0 2px 12px rgba(107,79,43,0.07)',
					margin: '0 auto 24px auto',
					border: `1.5px solid ${colors.border}`,
				}}>
					<h1 style={{
						textAlign: 'center',
						fontSize: 28,
						fontWeight: 700,
						marginTop: 0,
						color: colors.heading,
						letterSpacing: 1,
					}}>Sök böcker</h1>
					<form onSubmit={handleSearch} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
						<input
							type="text"
							value={query}
							onChange={e => setQuery(e.target.value)}
							placeholder="Sök titel..."
							style={{ flex: 1, padding: 12, fontSize: 16, borderRadius: 6, border: `1.5px solid ${colors.border}`, color: colors.text, background: colors.card }}
							disabled={loading}
						/>
						<button
							type="submit"
							style={{
								padding: "12px 18px",
								borderRadius: 6,
								background: colors.accent,
								color: colors.accentText,
								border: "none",
								fontWeight: 600,
								fontSize: 16,
								cursor: loading ? "not-allowed" : "pointer",
								width: 100,
								transition: 'background 0.2s',
							}}
							disabled={loading}
						>
							{loading ? "Söker..." : "Sök"}
						</button>
					</form>
					{error && <p style={{ color: "red", textAlign: 'center', margin: 0 }}>{error}</p>}
					{!loading && searched && books.length === 0 && !error && (
						<p style={{ textAlign: 'center', margin: 0 }}>Inga böcker hittades.</p>
					)}
				</div>
				<div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 18 }}>
					{books.map((book) => (
						<Link
							key={book.id}
							href={`/books/${book.id}`}
							style={{
								background: colors.card,
								borderRadius: 10,
								boxShadow: "0 2px 8px #6B4F2B11",
								padding: 14,
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
								border: `1.5px solid ${colors.border}`,
								textDecoration: 'none',
								cursor: 'pointer',
								transition: 'box-shadow 0.2s, border 0.2s',
								color: 'inherit',
							}}
						>
							<img src={book.imageUrl} alt={book.title} style={{ width: 110, height: 160, objectFit: "cover", borderRadius: 6, marginBottom: 8 }} />
							<div style={{ fontWeight: 700, fontSize: 18, marginBottom: 2, color: colors.heading }}>{book.title}</div>
							<div style={{ color: colors.text, fontSize: 15, marginBottom: 4 }}>{book.author}</div>
							<div style={{ fontSize: 13, color: "#888", marginBottom: 4 }}>{book.publicationDate?.slice(0, 10)}</div>
							<div style={{ fontSize: 13, color: "#555", marginBottom: 6 }}>{book.description}</div>
							<div style={{ fontSize: 13, color: book.availableCopies > 0 ? colors.accent : "#e05a5a", fontWeight: 600 }}>
								{book.availableCopies > 0 ? `Tillgängliga (${book.availableCopies})` : "Ej tillgänglig"}
							</div>
						</Link>
					))}
				</div>
			</main>
		</AuthGuard>

	);
}

import { Suspense } from "react";

export default function SearchPageWrapper() {
	return (
		<Suspense fallback={<div>Laddar...</div>}>
			<SearchPage />
		</Suspense>
	);
}
