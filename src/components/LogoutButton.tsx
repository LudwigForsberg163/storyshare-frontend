"use client";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('token'));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (!isLoggedIn) return null;

  return (
    <button
      onClick={handleLogout}
      style={{
        position: 'absolute',
        top: 18,
        right: 24,
        background: '#7BAE7F',
        color: '#fff',
        border: 'none',
        borderRadius: 6,
        padding: '8px 18px',
        fontWeight: 600,
        fontSize: 16,
        cursor: 'pointer',
        boxShadow: '0 1px 4px #7BAE7F33',
      }}
    >
      Logga ut
    </button>
  );
}
