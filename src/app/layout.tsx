import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Book Loan App',
  description: 'A simple library book loan application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav style={{ marginBottom: 20 }}>
          <Link href="/search" style={{ marginRight: 10 }}>Search</Link>
          <Link href="/borrow" style={{ marginRight: 10 }}>Borrow</Link>
          <Link href="/loans" style={{ marginRight: 10 }}>My Loans</Link>
          <Link href="/return">Return</Link>
        </nav>
        {children}
      </body>
    </html>
  );
}
