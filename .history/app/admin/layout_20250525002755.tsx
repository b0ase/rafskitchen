'use client';

import { useState, useEffect, createContext, useContext } from 'react';

// Create a context to potentially share auth state if needed lower down
// For now, this layout handles the auth gate directly
// const AdminAuthContext = createContext<{ authed: boolean }>({ authed: false });

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true); // Start loading to check auth

  useEffect(() => {
    setIsMounted(true);
    // Check localStorage for existing auth on mount
    // This logic now runs after the initial mount, avoiding hydration mismatch for authed state
    const ok = localStorage.getItem('admin_authed');
    if (ok === 'true') {
      setAuthed(true);
    }
    setLoading(false); // Finished checking auth status
  }, []);

  // Handle the login submission
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password: input }),
      });

      if (res.ok) {
        setAuthed(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_authed', 'true');
        }
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed.');
        setAuthed(false); // Ensure authed is false on failure
        if (typeof window !== 'undefined') {
          localStorage.removeItem('admin_authed'); // Clear local storage on failure
        }
      }
    } catch (err) {
      console.error('Login fetch error:', err);
      setError('An unexpected error occurred. Please try again.');
      setAuthed(false);
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_authed');
      }
    }

    setLoading(false);
  }

  // If not yet mounted, render null or a basic placeholder to avoid hydration errors
  if (!isMounted) {
    return null; // Or a static placeholder that server can also render
  }

  // Show loading indicator while checking auth (after mount)
  if (loading) {
     return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
        <p>Loading Admin...</p>
      </div>
     );
  }

  // If not authenticated, show the login form
  if (!authed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-950 text-white py-12">
        <h1 className="text-3xl font-bold mb-6">Admin Login Required</h1>
        <form onSubmit={handleSubmit} className="bg-gray-900 p-8 rounded-xl shadow-lg flex flex-col items-center w-full max-w-xs">
          <input
            type="password"
            className="w-full px-4 py-2 mb-4 rounded bg-gray-800 border border-gray-700 text-white disabled:opacity-50"
            placeholder="Admin Password"
            value={input}
            onChange={e => setInput(e.target.value)}
            disabled={loading} // Use the loading state from the layout
            autoFocus
          />
          <button 
            type="submit" 
            className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading || !input}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          {error && <div className="text-red-400 text-sm mt-2">{error}</div>}
        </form>
      </div>
    );
  }

  // If authenticated, render the actual page content
  return (
    // <AdminAuthContext.Provider value={{ authed }}> // Context provider if needed
      <>{children}</> 
    // </AdminAuthContext.Provider>
  );
}

// Optional: Export a hook to use the context if needed in child pages
// export const useAdminAuth = () => useContext(AdminAuthContext); 