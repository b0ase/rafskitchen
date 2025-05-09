'use client';

import React, { useState, useEffect } from 'react';

export default function FinancesPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  // Check local storage on mount for persisted authentication
  useEffect(() => {
    const storedAuth = localStorage.getItem('financesAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    try {
      const response = await fetch('/api/finances-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        // Handle non-2xx responses (e.g., 500 server error)
        const errorData = await response.json().catch(() => ({})); // Try to parse error, or default to empty object
        setError(errorData.message || 'Authentication request failed. Please try again.');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('financesAuthenticated', 'true');
        setError('');
      } else {
        setError('Incorrect password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('An error occurred during login. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('financesAuthenticated');
    setPassword('');
    setError('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-sm bg-gray-900 p-8 shadow-lg border border-gray-800">
            <h1 className="text-xl font-bold text-white mb-4 text-center">Finances Access</h1>
            <p className="text-sm text-gray-400 mb-6 text-center">Enter the password to view financial information.</p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1 sr-only">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                />
              </div>
              {error && <p className="text-red-500 text-xs mb-4 text-center">{error}</p>}
              <button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 transition duration-300 shadow-md">
                View Finances
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // If authenticated, show finances content
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Financial Overview</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-1 bg-red-700 hover:bg-red-600 text-white text-sm font-medium transition-colors shadow-md"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-lg">
          <h2 className="text-2xl text-white mb-4">Income & Expenses</h2>
          <p className="text-gray-300 mb-6">
            Placeholder for detailed financial statements, charts, and reports.
          </p>
          {/* Add actual finances content here later */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800 p-4 border border-gray-700">
              <h3 className="text-xl text-green-400 mb-2">Total Revenue</h3>
              <p className="text-3xl text-white font-bold">£XX,XXX.XX</p>
            </div>
            <div className="bg-gray-800 p-4 border border-gray-700">
              <h3 className="text-xl text-red-400 mb-2">Total Expenses</h3>
              <p className="text-3xl text-white font-bold">£YY,YYY.YY</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 