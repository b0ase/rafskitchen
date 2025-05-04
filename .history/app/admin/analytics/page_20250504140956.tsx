'use client';

// Removed useState, useEffect as auth is handled by layout
import Link from 'next/link';

export default function AdminAnalyticsPage() {
  // Removed auth state and useEffect
  
  // The component now assumes it's rendered within the authenticated layout
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <h1 className="text-3xl font-bold mb-6">Analytics Overview</h1>
      <p className="text-gray-400 mb-4">This page will display key website analytics.</p>
      {/* Placeholder for charts, stats, etc. */}
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