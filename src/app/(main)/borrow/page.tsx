"use client";
import AuthGuard from "../../../components/AuthGuard";

export default function BorrowPage() {
  return (
    <AuthGuard>
      <main>
        <h1>Borrow a Book</h1>
        {/* TODO: Add borrow book form/flow */}
      </main>
    </AuthGuard>
  );
}
