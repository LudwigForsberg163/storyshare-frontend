
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";


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
  { href: "/search", label: "Sök", icon: "🔍" },
  { href: "/borrow", label: "Låna", icon: "📚" },
  { href: "/loans", label: "Mina lån", icon: "📖" },
  { href: "/return", label: "Lämna tillbaka", icon: "↩️" },
];

export default function NavBar() {
  const pathname = usePathname();
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
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={
            "nav-link" + (pathname.startsWith(item.href) ? " active" : "")
          }
          style={{
            color: pathname.startsWith(item.href) ? colors.accent : colors.heading,
            background: 'none',
            borderRadius: 8,
            padding: '4px 8px',
            fontWeight: pathname.startsWith(item.href) ? 700 : 500,
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
      ))}
      <div className="nav-link" style={{padding: 0}}>
        <LogoutButton />
      </div>
    </nav>
  );
}

// CSS styles for responsive nav bar
// Place this in your global CSS or import in your layout
/*
.responsive-nav {
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #fff;
  border-top: 1.5px solid #6B4F2B;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 100;
}
.nav-link {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #6B4F2B;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  padding: 4px 0;
  transition: color 0.2s;
}
.nav-link.active {
  color: #7BAE7F;
}
.nav-icon {
  font-size: 22px;
  margin-bottom: 2px;
}
@media (min-width: 700px) {
  .responsive-nav {
    position: static;
    flex-direction: row;
    height: 56px;
    border-top: none;
    border-bottom: 1.5px solid #6B4F2B;
    background: #fff;
  }
  .nav-link {
    flex-direction: row;
    font-size: 16px;
    padding: 0 18px;
  }
  .nav-icon {
    margin-bottom: 0;
    margin-right: 8px;
  }
}
*/
