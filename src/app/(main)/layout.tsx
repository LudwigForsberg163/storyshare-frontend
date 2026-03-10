import Link from 'next/link';
import LogoutButton from '../../components/LogoutButton';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <nav style={{ marginBottom: 20, position: 'relative', minHeight: 40 }}>
        <Link href="/search" style={{ marginRight: 10 }}>Search</Link>
        <Link href="/borrow" style={{ marginRight: 10 }}>Borrow</Link>
        <Link href="/loans" style={{ marginRight: 10 }}>My Loans</Link>
        <Link href="/return">Return</Link>
        <LogoutButton />
      </nav>
      {children}
    </>
  );
}
