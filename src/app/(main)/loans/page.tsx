"use client";
import AuthGuard from "../../../components/AuthGuard";

export default function LoansPage() {
  return (
    <AuthGuard>
      <main>
        <h1>My Loans</h1>
        {/* TODO: List current loans */}
      </main>
    </AuthGuard>
  );
}
