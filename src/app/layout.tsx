import './globals.css';
import NavBar from '../components/NavBar';

export const metadata = {
  title: 'Book Loan App',
  description: 'A simple library book loan application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavBar />
        <div style={{ paddingBottom: 64 }}>
          {children}
        </div>
      </body>
    </html>
  );
}
