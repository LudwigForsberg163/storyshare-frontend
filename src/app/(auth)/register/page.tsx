"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

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

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data|| "Kunde inte skapa konto.");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (typeof data.token !== "string") {
        setError("Kunde inte skapa konto.");
        setLoading(false);
        return;
      }
      localStorage.setItem("token", data.token);
      router.push("/");
    } catch (err) {
      setError("Nätverksfel. Försök igen.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: colors.background }}>
      <form
        onSubmit={handleRegister}
        style={{
          width: '100%',
          maxWidth: 340,
          background: colors.card,
          padding: 24,
          borderRadius: 12,
          boxShadow: '0 2px 12px rgba(107,79,43,0.07)',
          border: `1.5px solid ${colors.border}`,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        <img src="/storysharelogo.png" alt="StoryShare logo" style={{ width: 160, height: 'auto', display: 'block', alignSelf: 'center', margin: 0, padding: 0 }} />
        <h1 style={{ textAlign: 'center', fontSize: 32, fontWeight: 700, margin: 0, color: colors.heading, letterSpacing: 1 }}>Skapa nytt konto</h1>
        <div style={{ minHeight: 28, marginBottom: 0, textAlign: 'center', color: 'red', fontWeight: 500 }}>
          {error ? error : null}
        </div>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Nytt användarnamn"
          style={{ padding: 12, fontSize: 16, borderRadius: 6, border: `1.5px solid ${colors.border}`, color: colors.text, background: colors.card }}
          disabled={loading}
        />
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Nytt lösenord"
          style={{ padding: 12, fontSize: 16, borderRadius: 6, border: `1.5px solid ${colors.border}`, color: colors.text, background: colors.card }}
          disabled={loading}
        />
        <div style={{ display: 'flex', gap: 12, width: '100%' }}>
          <button
            type="button"
            onClick={() => router.push("/login")}
            style={{
              flex: 1,
              height: 44,
              padding: 12,
              fontSize: 16,
              borderRadius: 6,
              border: 'none',
              background: colors.highlight,
              color: colors.heading,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: `0 1px 4px ${colors.highlight}33`,
              transition: 'background 0.2s',
              opacity: loading ? 0.7 : 1,
            }}
            disabled={loading}
          >
            Tillbaka
          </button>
          <button
            type="submit"
            style={{
              flex: 1,
              height: 44,
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
            disabled={loading}
          >
            {loading ? "Skapar..." : "Skapa nytt konto"}
          </button>
        </div>
      </form>
      {/* QR code below everything */}
      <img src="/qr.svg" alt="QR code for app link" style={{ marginTop: 32, width: 300, height: 'auto', display: 'block' }} />
    </main>
  );
}
