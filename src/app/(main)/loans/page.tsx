"use client";
import AuthGuard from "../../../components/AuthGuard";

import { useEffect, useState } from "react";
import Link from "next/link";

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

export default function LoansPage() {
  const [activeLoans, setActiveLoans] = useState<any[]>([]);
  const [inactiveLoans, setInactiveLoans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [returning, setReturning] = useState<{ [loanId: number]: boolean }>({});
  const [success, setSuccess] = useState<{ [loanId: number]: boolean }>({});

  useEffect(() => {
    async function fetchLoans() {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/loans/current`, {
          headers: {
            "Authorization": token ? `Bearer ${token}` : "",
            "Accept": "application/json"
          }
        });
        if (!res.ok) throw new Error("Kunde inte hämta lån.");
        const data = await res.json();
        setActiveLoans(data.active || []);
        setInactiveLoans(data.inactive || []);
      } catch (err: any) {
        setError(err.message || "Nätverksfel. Försök igen.");
      } finally {
        setLoading(false);
      }
    }
    fetchLoans();
  }, []);

  async function handleReturn(loanId: number, bookId: number) {
    setReturning((r) => ({ ...r, [loanId]: true }));
    setSuccess((s) => ({ ...s, [loanId]: false }));
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}/return`, {
        method: "POST",
        headers: {
          "Authorization": token ? `Bearer ${token}` : "",
          "Accept": "application/json"
        }
      });
      if (!res.ok) throw new Error("Kunde inte lämna in bok.");
      setSuccess((s) => ({ ...s, [loanId]: true }));
      // Move the returned loan from activeLoans to inactiveLoans
      setActiveLoans((prevActive) => prevActive.filter(l => l.id !== loanId));
      setInactiveLoans((prevInactive) => {
        const returnedLoan = activeLoans.find(l => l.id === loanId);
        if (!returnedLoan) return prevInactive;
        return [
          {
            ...returnedLoan,
            returnedAt: new Date().toISOString(),
            daysLeftWhenReturned: returnedLoan.timeRemaining,
          },
          ...prevInactive,
        ];
      });
    } catch (err) {
      // Optionally show error per loan
    } finally {
      setReturning((r) => ({ ...r, [loanId]: false }));
    }
  }

  return (
    <AuthGuard>
      <main style={{ maxWidth: 700, margin: "0 auto", padding: 24, background: colors.background, minHeight: '100vh' }}>
        <h1 style={{ textAlign: 'center', color: colors.heading, marginBottom: 24 }}>Mina lån</h1>
        {loading ? (
          <p>Laddar...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            {activeLoans.length === 0 && inactiveLoans.length === 0 && <p>Inga lån hittades.</p>}

            {activeLoans.length > 0 && <h2 style={{ color: colors.heading, fontSize: 20, margin: '24px 0 8px 0' }}>Aktiva lån</h2>}
            {activeLoans.map((loan) => (
              <div key={loan.id} style={{ background: colors.card, borderRadius: 10, boxShadow: "0 2px 8px #6B4F2B11", padding: 18, border: `1.5px solid ${colors.border}` }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>
                  <Link
                    href={`/books/${loan.bookId}`}
                    style={{ color: colors.heading, textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    {loan.bookTitle || 'Okänd bok'}
                  </Link>
                </div>
                <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>Lånad: {loan.loanedAt ? loan.loanedAt.slice(0, 10) : '-'}</div>
                <div style={{ fontSize: 14, color: loan.availableCopies > 0 ? colors.accent : '#e05a5a', marginBottom: 4, fontWeight: 600 }}>
                  {typeof loan.availableCopies === 'number' && typeof loan.totalCopies === 'number'
                    ? `${loan.availableCopies}/${loan.totalCopies} exemplar tillgängliga`
                    : 'Tillgänglighet okänd'}
                </div>
                <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>Förfaller: {loan.dueDate ? loan.dueDate.slice(0, 10) : '-'}</div>
                <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>Lånetid: {loan.borrowedTime}</div>
                <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>Tid kvar: {loan.timeRemaining}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                  <button
                    onClick={() => handleReturn(loan.id, loan.bookId)}
                    disabled={returning[loan.id]}
                    style={{
                      padding: '10px 18px',
                      borderRadius: 6,
                      background: colors.highlight,
                      color: colors.heading,
                      border: 'none',
                      fontWeight: 600,
                      fontSize: 16,
                      cursor: returning[loan.id] ? 'not-allowed' : 'pointer',
                      opacity: returning[loan.id] ? 0.7 : 1,
                      minWidth: 100,
                    }}
                  >
                    {returning[loan.id] ? 'Lämnar in...' : 'Lämna in'}
                  </button>
                  {success[loan.id] && <span style={{ color: colors.accent }}>Boken är nu inlämnad!</span>}
                </div>
              </div>
            ))}

            {inactiveLoans.length > 0 && <h2 style={{ color: colors.heading, fontSize: 20, margin: '24px 0 8px 0' }}>Historik</h2>}
            {inactiveLoans.map((loan) => (
              <div key={loan.id} style={{ background: colors.card, borderRadius: 10, boxShadow: "0 2px 8px #6B4F2B11", padding: 18, border: `1.5px solid ${colors.border}` }}>
                <div style={{ fontWeight: 700, fontSize: 18 }}>
                  <Link
                    href={`/books/${loan.bookId}`}
                    style={{ color: colors.heading, textDecoration: 'underline', cursor: 'pointer' }}
                  >
                    {loan.bookTitle || 'Okänd bok'}
                  </Link>
                </div>
                <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>Lånad: {loan.loanedAt ? loan.loanedAt.slice(0, 10) : '-'}</div>
                <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>Förfaller: {loan.dueDate ? loan.dueDate.slice(0, 10) : '-'}</div>
                <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>Inlämnad: {loan.returnedAt ? loan.returnedAt.slice(0, 10) : '-'}</div>
                <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>Lånetid: {loan.borrowedTime}</div>
                <div style={{ fontSize: 14, color: '#888', marginBottom: 4 }}>Tid kvar vid inlämning: {loan.daysLeftWhenReturned}</div>
              </div>
            ))}
          </div>
        )}
      </main>
    </AuthGuard>
  );
}
