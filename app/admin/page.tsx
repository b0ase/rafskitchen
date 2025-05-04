'use client';

import Link from 'next/link';
import { FaUsersCog } from 'react-icons/fa';
import { useState, useEffect } from 'react';

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PROJECT_PASSWORD || process.env.ADMIN_PROJECT_PASSWORD;

export default function AdminDashboard() {
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ok = localStorage.getItem('admin_authed');
      if (ok === 'true') setAuthed(true);
    }
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // For security, check password on the server in production. Here, check env var in browser for demo/dev.
    if (input === ADMIN_PASSWORD) {
      setAuthed(true);
      if (typeof window !== 'undefined') localStorage.setItem('admin_authed', 'true');
      setError('');
    } else {
      setError('Incorrect password');
    }
  }

  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white py-12">
        <h1 className="text-3xl font-bold mb-6">Admin Login</h1>
        <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-xl shadow-lg flex flex-col items-center w-full max-w-xs">
          <input
            type="password"
            className="w-full px-4 py-2 mb-4 rounded bg-gray-800 border border-gray-700 text-white"
            placeholder="Admin Password"
            value={input}
            onChange={e => setInput(e.target.value)}
            autoFocus
          />
          <button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-2">Login</button>
          {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
      <div className="w-full max-w-md bg-gradient-to-br from-blue-900/80 to-gray-900/80 rounded-xl shadow-lg p-8 flex flex-col items-center">
        <FaUsersCog size={48} className="mb-4 text-blue-400" />
        <h2 className="text-2xl font-semibold mb-2">Client Approvals</h2>
        <p className="text-gray-300 mb-6 text-center">Review, approve, or reject new client sign-up requests.</p>
        <Link href="/admin/clients">
          <button className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg text-lg shadow transition-all">
            Go to Client Approvals
          </button>
        </Link>
      </div>
    </div>
  );
} 