"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AuthGuard from "../../../../components/AuthGuard";
import colors from "../../../../constants/colors";
import { getBook, loanBook, returnBook } from "../../../../services/booksService";

export default function BookDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [borrowLoading, setBorrowLoading] = useState(false);
  const [borrowError, setBorrowError] = useState<string | null>(null);
  const [borrowSuccess, setBorrowSuccess] = useState(false);

  useEffect(() => {
    async function fetchBook() {
      setLoading(true);
      setError(null);
      try {
        const data = await getBook(id as string);
        setBook(data);
      } catch (err: any) {
        setError(err.message || "Nätverksfel. Försök igen.");
      } finally {
        setLoading(false);
      }
    }
    fetchBook();
  }, [id]);

  async function handleAction() {
    setBorrowLoading(true);
    setBorrowError(null);
    setBorrowSuccess(false);
    const isReturning = book?.loanedByCurrentUser;
    try {
      if (isReturning) {
        await returnBook(id as string);
      } else {
        await loanBook(id as string);
      }
      setBorrowSuccess(true);
      setBook((b: any) => ({
        ...b,
        loanedByCurrentUser: !isReturning,
        availableCopies: isReturning ? b.availableCopies + 1 : b.availableCopies - 1,
      }));
    } catch (err: any) {
      setBorrowError(err.message || "Nätverksfel. Försök igen.");
    } finally {
      setBorrowLoading(false);
    }
  }

  return (
    <AuthGuard>
      <main style={{ maxWidth: 500, margin: "0 auto", padding: 24, background: colors.background, minHeight: '100vh' }}>
        <div style={{
          background: colors.card,
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(107,79,43,0.07)',
          border: `1.5px solid ${colors.border}`,
          padding: 24,
        }}>
          {loading ? (
            <p>Laddar...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>{error}</p>
          ) : book ? (
            <>
              <img src={book.imageUrl} alt={book.title} style={{ width: 140, height: 200, objectFit: "cover", borderRadius: 8, marginBottom: 16, display: 'block', marginLeft: 'auto', marginRight: 'auto' }} />
              <h2 style={{ textAlign: 'center', color: colors.heading }}>{book.title}</h2>
              <div style={{ textAlign: 'center', color: colors.text, marginBottom: 8 }}>{book.author}</div>
              <div style={{ fontSize: 14, color: '#888', textAlign: 'center', marginBottom: 8 }}>Publicerad: {book.publicationDate?.slice(0, 10)}</div>
              <div style={{ fontSize: 15, color: colors.text, marginBottom: 12 }}>{book.description}</div>
              <div style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>ISBN: {book.isbn}</div>
              <div style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>Sidor: {book.pageCount}</div>
              <div style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>Språk: {book.language}</div>
              <div style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>Betyg: {book.rating}</div>
              <div style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>Totalt antal exemplar: {book.totalCopies}</div>
              <div style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>Lånetid (dagar): {book.borrowDays}</div>
              <div style={{ fontSize: 14, color: book.availableCopies > 0 ? colors.accent : '#e05a5a', fontWeight: 600, marginBottom: 8 }}>
                {book.availableCopies > 0 ? `Tillgänglig (${book.availableCopies})` : "Ej tillgänglig"}
              </div>
              <div style={{ fontSize: 14, color: colors.text, marginBottom: 16 }}>
                Taggar: {Array.isArray(book.tags) && book.tags.length > 0 ? book.tags.join(', ') : 'Inga'}
              </div>
              <button
                onClick={handleAction}
                disabled={(!book.loanedByCurrentUser && book.availableCopies < 1) || borrowLoading}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  borderRadius: 8,
                  background: book.loanedByCurrentUser ? colors.highlight : (book.availableCopies > 0 ? colors.accent : '#ccc'),
                  color: book.loanedByCurrentUser ? colors.heading : (book.availableCopies > 0 ? colors.accentText : '#888'),
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: (book.loanedByCurrentUser || book.availableCopies > 0) && !borrowLoading ? 'pointer' : 'not-allowed',
                  opacity: borrowLoading ? 0.7 : 1,
                  marginBottom: 8,
                  transition: 'background 0.2s',
                }}
              >
                {borrowLoading
                  ? (book.loanedByCurrentUser ? 'Lämnar in...' : 'Lånar...')
                  : (book.loanedByCurrentUser ? 'Lämna in' : 'Låna')}
              </button>
              {borrowError && <div style={{ color: 'red', textAlign: 'center', marginBottom: 8 }}>{borrowError}</div>}
              {borrowSuccess && <div style={{ color: colors.accent, textAlign: 'center', marginBottom: 8 }}>{!book.loanedByCurrentUser ? 'Boken är nu inlämnad!' : 'Boken är nu utlånad!'}</div>}
            </>
          ) : null}
        </div>
      </main>
    </AuthGuard>
  );
}
