"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import AuthGuard from "../../components/AuthGuard";
import colors from "../../constants/colors";
import { searchBooks } from "../../services/booksService";

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

function SearchPage() {
	const [books, setBooks] = useState<Book[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [query, setQuery] = useState("");
	const router = useRouter();
	const searchParams = useSearchParams();

	async function handleSearch(e?: React.FormEvent) {
		if (e) e.preventDefault();
		if (query) {
			router.push(`?q=${encodeURIComponent(query)}`);
		} else {
			router.push("/");
		}
		setLoading(true);
		setError(null);
		try {
			const data = await searchBooks(query);
			setBooks(data);
		} catch (err: any) {
			setError(err.message || "Nätverksfel. Försök igen.");
			setBooks([]);
		} finally {
			setLoading(false);
		}
	}

	// On mount/navigation, initialize query from URL and search (empty query returns all books)
	useEffect(() => {
		const q = searchParams.get("q") || "";
		setQuery(q);
		(async () => {
			setLoading(true);
			setError(null);
			try {
				const data = await searchBooks(q);
				setBooks(data);
			} catch (err: any) {
				setError(err.message || "Nätverksfel. Försök igen.");
				setBooks([]);
			} finally {
				setLoading(false);
			}
		})();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<AuthGuard>
			<main style={{ width: '100vw', margin: 0, padding: 16, minHeight: '100vh', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<div style={{
					width: '100%',
					maxWidth: 320,
					background: colors.card,
					padding: 24,
					borderRadius: 12,
					boxShadow: '0 2px 12px rgba(107,79,43,0.07)',
					margin: '0 0 24px 0',
					border: `1.5px solid ${colors.border}`,
					boxSizing: 'border-box',
				}}>
					<h1 style={{
						textAlign: 'center',
						fontSize: 28,
						fontWeight: 700,
						marginTop: 0,
						color: colors.heading,
						letterSpacing: 1,
					}}>Sök böcker</h1>
					<form
						onSubmit={handleSearch}
						style={{
							display: 'flex',
							flexDirection: 'column',
							gap: 8,
							marginBottom: 12,
						}}
					>
						<input
							type="text"
							value={query}
							onChange={e => setQuery(e.target.value)}
							placeholder="Sök titel..."
							style={{ width: '100%', padding: 12, fontSize: 16, borderRadius: 6, border: `1.5px solid ${colors.border}`, color: colors.text, background: colors.card, boxSizing: 'border-box' }}
							disabled={loading}
						/>
						<button
							type="submit"
							style={{
								width: '100%',
								padding: "12px 18px",
								borderRadius: 6,
								background: colors.accent,
								color: colors.accentText,
								border: "none",
								fontWeight: 600,
								fontSize: 16,
								cursor: loading ? "not-allowed" : "pointer",
								transition: 'background 0.2s',
							}}
							disabled={loading}
						>
							{loading ? "Söker..." : "Sök"}
						</button>
					</form>
					{error && <p style={{ color: "red", textAlign: 'center', margin: 0 }}>{error}</p>}
				{!loading && books.length === 0 && !error && (
						<p style={{ textAlign: 'center', margin: 0 }}>Inga böcker hittades.</p>
					)}
				</div>
				<div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
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
