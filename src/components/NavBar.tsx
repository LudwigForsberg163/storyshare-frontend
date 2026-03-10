
"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


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

const navItems = [
  { href: "/", label: "Sök", icon: "🔍", exact: true },
  { href: "/loans", label: "Mina lån", icon: "📖", exact: false },
];

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  // Don't show NavBar on auth pages
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) return null;

  function handleLogout() {
    localStorage.removeItem("token");
    router.push("/login");
  }

  return (
    <nav
      className="responsive-nav"
      style={{
        background: colors.card,
        borderTop: `1.5px solid ${colors.border}`,
        borderBottom: undefined,
        boxShadow: '0 2px 12px rgba(107,79,43,0.07)',
      }}
    >
      {navItems.map((item) => {
        const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
        return (
        <Link
          key={item.href}
          href={item.href}
          className={"nav-link" + (isActive ? " active" : "")}
          style={{
            color: isActive ? colors.accent : colors.heading,
            background: 'none',
            borderRadius: 8,
            padding: '4px 8px',
            fontWeight: 600,
            transition: 'color 0.2s, background 0.2s',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textDecoration: 'none',
            fontSize: 15,
          }}
        >
          <span className="nav-icon" aria-hidden="true" style={{ fontSize: 22, marginBottom: 2 }}>{item.icon}</span>
          <span className="nav-label">{item.label}</span>
        </Link>
        );
      })}
      <button
        onClick={handleLogout}
        className="nav-link"
        style={{
          background: 'none',
          border: 'none',
          color: colors.heading,
          fontWeight: 600,
          fontSize: 15,
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '4px 8px',
          borderRadius: 8,
        }}
      >
        <span className="nav-icon" aria-hidden="true" style={{ fontSize: 22, marginBottom: 2 }}>🚪</span>
        <span className="nav-label">Logga ut</span>
      </button>
    </nav>
  );
}
