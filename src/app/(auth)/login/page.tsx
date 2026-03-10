"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

// Bibliotekets färgpalett
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


export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registering, setRegistering] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Fel användarnamn eller lösenord.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      router.push("/search");
    } catch (err) {
      setError("Nätverksfel. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRegister() {
    setError(null);
    setRegistering(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Kunde inte skapa konto.");
        setRegistering(false);
        return;
      }
      // Optionally, log in the user directly after registration
      // Or show a success message and clear fields
      // Here, we log in directly for convenience
      await handleLogin({ preventDefault: () => {} } as React.FormEvent);
    } catch (err) {
      setError("Nätverksfel. Försök igen.");
    } finally {
      setRegistering(false);
    }
  }

  return (
    <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: colors.background }}>
      <form
        style={{
          width: '100%',
          maxWidth: 340,
          background: colors.card,
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(107,79,43,0.07)',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          border: `1.5px solid ${colors.border}`,
        }}
        onSubmit={handleLogin}
      >
        <h1 style={{
          textAlign: 'center',
          fontSize: 32,
          fontWeight: 700,
          marginBottom: 8,
          color: colors.heading,
          letterSpacing: 1,
        }}>StoryShare</h1>
        <div style={{ minHeight: 28, marginBottom: 4, textAlign: 'center', color: 'red', fontWeight: 500 }}>
          {error ? error : null}
        </div>
        <input
          type="text"
          placeholder="Användarnamn"
          value={username}
          onChange={e => setUsername(e.target.value)}
          style={{
            padding: 12,
            fontSize: 16,
            borderRadius: 6,
            border: `1.5px solid ${colors.border}`,
            width: '100%',
            boxSizing: 'border-box',
            color: colors.text,
            background: colors.card,
          }}
          disabled={loading || registering}
        />
        <input
          type="password"
          placeholder="Lösenord"
          value={password}
          onChange={e => setPassword(e.target.value)}
          style={{
            padding: 12,
            fontSize: 16,
            borderRadius: 6,
            border: `1.5px solid ${colors.border}`,
            width: '100%',
            boxSizing: 'border-box',
            color: colors.text,
            background: colors.card,
          }}
          disabled={loading || registering}
        />
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <button
            type="submit"
            style={{
              flex: 1,
              padding: 12,
              fontSize: 16,
              borderRadius: 6,
              border: 'none',
              background: colors.accent,
              color: colors.accentText,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: `0 1px 4px ${colors.accent}33`,
              transition: 'background 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading || registering}
          >
            {loading ? "Loggar in..." : "Logga in"}
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: 12,
              fontSize: 16,
              borderRadius: 6,
              border: `1.5px solid ${colors.accent}`,
              background: colors.card,
              color: colors.accent,
              fontWeight: 600,
              cursor: registering ? 'not-allowed' : 'pointer',
              boxShadow: `0 1px 4px ${colors.accent}22`,
              transition: 'background 0.2s',
              opacity: registering ? 0.7 : 1,
            }}
            onClick={handleRegister}
            disabled={registering || loading}
          >
            {registering ? "Skapar konto..." : "Skapa nytt konto"}
          </button>
        </div>
      </form>
    </main>
  );
}
