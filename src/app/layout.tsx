import './globals.css';

export const metadata = {
  title: 'Book Loan App',
  description: 'A simple library book loan application',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
