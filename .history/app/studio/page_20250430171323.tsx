'use client';

import React, { useState } from 'react';
import Header from '../components/Header'; // Reuse Header
import Footer from '../components/Footer'; // Reuse Footer

export default function StudioPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  const correctPassword = process.env.NEXT_PUBLIC_STUDIO_PASSWORD;

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password.');
      setIsAuthenticated(false);
    }
  };

  // Render password prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black text-gray-300 font-sans flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-16 flex items-center justify-center">
          <div className="w-full max-w-xs">
            <form onSubmit={handlePasswordSubmit} className="bg-gray-900 shadow-md rounded px-8 pt-6 pb-8 mb-4">
              <h2 className="text-center text-white text-xl mb-6">Enter Studio Access Password</h2>
              <div className="mb-4">
                <label className="block text-gray-400 text-sm font-bold mb-2" htmlFor="password">
                  Password
                </label>
                <input
                  className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-800 text-gray-200 border-gray-700 leading-tight focus:outline-none focus:shadow-outline focus:border-gray-500"
                  id="password"
                  type="password"
                  placeholder="******************"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
              <div className="flex items-center justify-between">
                <button
                  className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                  type="submit"
                >
                  Enter Studio
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Render studio content if authenticated
  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-white mb-6">Artist Studio Space</h1>
        <p className="mb-4 text-gray-300">This is your private area to develop ideas for your art career.</p>
        
        {/* Start adding your notes, plans, AI art concepts, etc. here */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Ideas & Notes</h2>
          <textarea 
            className="w-full p-3 rounded bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
            rows={10}
            placeholder="Draft your artist statement, plan AI art projects, list gallery contacts..."
          />
        </div>

      </main>
      <Footer />
    </div>
  );
} 