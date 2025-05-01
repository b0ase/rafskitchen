'use client';

import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function StudioPage() {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState('');

  // Check local storage on mount
  useEffect(() => {
    const storedAuth = localStorage.getItem('studioAuthenticated');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const correctPassword = process.env.NEXT_PUBLIC_STUDIO_PASSWORD || 'defaultpassword'; // Fallback

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('studioAuthenticated', 'true'); // Store auth state
      setError('');
    } else {
      setError('Incorrect password.');
    }
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      localStorage.removeItem('studioAuthenticated');
      setPassword('');
      setError('');
  };

  if (!isAuthenticated) {
    return (
      // Apply light theme background
      <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
        <Header />
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          {/* Light card styles */}
          <div className="w-full max-w-sm bg-white p-8 shadow-md border border-gray-200">
            {/* Light text colors */}
            <h1 className="text-xl font-bold text-black mb-4 text-center">Studio Access</h1>
            <p className="text-sm text-gray-600 mb-6 text-center">Enter the password to view private content.</p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                 {/* Label light style */}
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1 sr-only">Password</label>
                 {/* Input light style */}
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                  className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
                />
              </div>
              {error && <p className="text-red-600 text-xs mb-4 text-center">{error}</p>}
              {/* Button light style */}
              <button type="submit" className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 transition duration-300 shadow-sm">
                Enter Studio
              </button>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If authenticated, show studio content
  return (
    // Apply light theme background
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Header />
      {/* Use container, light text */}
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="flex justify-between items-center mb-8">
           {/* Light text colors */}
          <h1 className="text-3xl font-bold text-black">Studio</h1>
          {/* Logout button light style */}
          <button 
            onClick={handleLogout}
            className="px-4 py-1 bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors shadow-sm"
          >
              Logout
          </button>
        </div>
        
        {/* Light content area style */}
        <div className="bg-white p-6 md:p-8 border border-gray-200 shadow-sm">
          <p className="text-gray-700">
            Welcome to the Studio. Private content, work-in-progress, or client previews will be displayed here.
          </p>
          {/* Add actual studio content here later */}
        </div>
      </main>
      <Footer />
    </div>
  );
} 