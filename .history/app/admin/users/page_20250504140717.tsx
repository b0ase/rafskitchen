'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminUsersPage() {
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    // Basic auth check - Replace with layout or middleware later
    if (typeof window !== 'undefined') {
      const ok = localStorage.getItem('admin_authed');
      if (ok === 'true') {
        setAuthed(true);
      } else {
        // Optional: Redirect to admin login if not authed
        // window.location.href = '/admin'; 
      }
    }
  }, []);

  if (!authed) {
    // Render nothing or a loading/redirect message while checking auth
    // Or redirect immediately (see commented line above)
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white">
            <p>Checking authentication...</p> 
            {/* Or provide a link back to login */}
             <Link href="/admin" className="text-blue-400 underline ml-2">Return to Login</Link>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>
      <p className="text-gray-400 mb-4">This page will allow managing registered users.</p>
      {/* Placeholder for user list, add user, etc. */}
      <div className="bg-gray-800 p-6 rounded-lg text-center">
         Content coming soon...
      </div>
      <Link href="/admin">
        <button className="mt-6 bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded">
          Back to Admin Dashboard
        </button>
      </Link>
    </div>
  );
} 