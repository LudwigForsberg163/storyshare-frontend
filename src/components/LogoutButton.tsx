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
        background: 'transparent',
        color: '#e05a5a',
        border: 'none',
        borderRadius: 6,
        padding: '4px 0',
        fontWeight: 600,
        fontSize: 15,
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}
    >
      <span style={{ fontSize: 22 }}>🚪</span>
      <span>Logga ut</span>
    </button>
  );
}
