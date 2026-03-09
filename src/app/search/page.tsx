"use client";
import { useEffect, useState } from "react";

interface Book {
  id: number;
  title: string;
  author: string;
  isAvailable: boolean;
}

export default function SearchPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/books`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch books");
        return res.json();
      })
      .then((data) => setBooks(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main>
      <h1>Search Books</h1>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {books.map((book) => (
          <li key={book.id}>
            <strong>{book.title}</strong> by {book.author}{" "}
            {book.isAvailable ? (
              <span style={{ color: "green" }}>(Available)</span>
            ) : (
              <span style={{ color: "red" }}>(Not available)</span>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}