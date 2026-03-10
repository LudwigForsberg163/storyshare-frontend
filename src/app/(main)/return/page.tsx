"use client";
import AuthGuard from "../../../components/AuthGuard";

export default function ReturnPage() {
  return (
    <AuthGuard>
      <main>
        <h1>Return a Book</h1>
        {/* TODO: Add return book flow */}
      </main>
    </AuthGuard>
  );
}
