
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const navItems = [
  { href: "/search", label: "Sök", icon: "🔍" },
  { href: "/borrow", label: "Låna", icon: "📚" },
  { href: "/loans", label: "Mina lån", icon: "📖" },
  { href: "/return", label: "Lämna tillbaka", icon: "↩️" },
];

export default function NavBar() {
  const pathname = usePathname();
  return (
    <nav className="responsive-nav">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={
            "nav-link" + (pathname.startsWith(item.href) ? " active" : "")
          }
        >
          <span className="nav-icon" aria-hidden="true">{item.icon}</span>
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
