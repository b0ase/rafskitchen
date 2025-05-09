'use client';

import { useState, useEffect } from 'react';

export default function TrustPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Attempt to retrieve auth status from session storage
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('trustPageAuthenticated');
    if (sessionAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('/api/trust-auth/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('trustPageAuthenticated', 'true'); // Store auth status
      } else {
        setError('Incorrect password. Please try again.');
        sessionStorage.removeItem('trustPageAuthenticated');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
      sessionStorage.removeItem('trustPageAuthenticated');
    }
    setIsLoading(false);
  };

  if (!isAuthenticated) {
    return (
      <main className="p-4 md:p-8 flex flex-col items-center justify-center min-h-screen">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
          <h1 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Access Restricted</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4 text-center">
            Please enter the password to view The Boase Trust details.
          </p>
          <form onSubmit={handlePasswordSubmit}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white dark:border-gray-600"
              required
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-md transition duration-150 ease-in-out disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Unlock Access'}
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Original page content (now protected)
  return (
    <main className="p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6">The Boase Trust</h1>
      <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
        This page provides an overview of The Boase Trust, including its portfolio of physical and digital assets.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Documents</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Key legal documents, trust deeds, and official records pertaining to The Boase Trust.
        </p>
        {/* Placeholder for document links or embedded viewers */}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Balance Sheet</h2>
        <p className="text-gray-600 dark:text-gray-400">
          A summary of The Boase Trust's financial position, detailing assets, liabilities, and equity at a specific point in time.
        </p>
        {/* Placeholder for balance sheet data or a summary table */}
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Ledger of Assets</h2>
        <p className="text-gray-600 dark:text-gray-400">
          A detailed record of all assets held by The Boase Trust, including acquisition dates, current valuations, and relevant notes.
        </p>
        {/* Placeholder for a detailed list or table of assets */}
      </section>

      {/* Sections for Physical Assets, Digital Assets, and Trust Administration can be added or refined later. */}
    </main>
  );
} 