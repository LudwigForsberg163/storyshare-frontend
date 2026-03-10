"use client";
import AuthGuard from "../../components/AuthGuard";

export default function HomePage() {
  return (
    <AuthGuard>
      <main>
        <h1>Welcome to the Book Loan App</h1>
        <p>Use the navigation above to search, borrow, view your loans, or return a book.</p>
      </main>
    </AuthGuard>
  );
}
