"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import colors from "../constants/colors";

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

  // Layout: left (search), center (loans), right (logout)
  // Center icon is absolutely centered
  return (
    <div className="navbar-outer" style={{ width: '100%', background: colors.card, boxShadow: '0 2px 12px rgba(107,79,43,0.07)', position: 'relative', zIndex: 100, borderBottom: `1.5px solid ${colors.border}` }}>
      <div className="navbar-inner" style={{ width: '100%', maxWidth: 700, margin: '0 auto' }}>
        <nav
          className="responsive-nav"
          style={{
            background: 'transparent',
            height: 60,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            width: '100%',
            position: 'relative',
            boxSizing: 'border-box',
          }}
        >
      <style>{`
        @media (max-width: 600px) {
          .navbar-outer {
            position: fixed !important;
            left: 0;
            right: 0;
            bottom: 0;
            top: auto;
            width: 100vw;
            max-width: 100vw;
            border-bottom: none !important;
            border-top: 1.5px solid ${colors.border} !important;
          }
          .navbar-inner {
            max-width: 100vw !important;
          }
          .responsive-nav {
            padding: 0 16px !important;
          }
        }
      `}</style>

      {/* Left icon */}
      <div style={{ maxWidth: 120 }}>
        <Link
          href={navItems[0].href}
          className={"nav-link" + (pathname === navItems[0].href ? " active" : "")}
          style={{
            color: pathname === navItems[0].href ? colors.accent : colors.heading,
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
          <span className="nav-icon" aria-hidden="true" style={{ fontSize: 22, marginBottom: 2 }}>{navItems[0].icon}</span>
          <span className="nav-label">{navItems[0].label}</span>
        </Link>
      </div>

      {/* Center icon (absolutely centered) */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        pointerEvents: 'none',
      }}>
        <Link
          href={navItems[1].href}
          className={"nav-link" + (pathname.startsWith(navItems[1].href) ? " active" : "")}
          style={{
            color: pathname.startsWith(navItems[1].href) ? colors.accent : colors.heading,
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
            pointerEvents: 'auto',
          }}
        >
          <span className="nav-icon" aria-hidden="true" style={{ fontSize: 22, marginBottom: 2 }}>{navItems[1].icon}</span>
          <span className="nav-label">{navItems[1].label}</span>
        </Link>
      </div>

      {/* Right icon (logout) */}
      <div style={{ maxWidth: 120, display: 'flex', justifyContent: 'flex-end' }}>
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
      </div>
      </nav>
      </div>
    </div>
  );
}
