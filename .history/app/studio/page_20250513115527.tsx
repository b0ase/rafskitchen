'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

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

  // Try both environment variables with a fallback
  const correctPassword = process.env.NEXT_PUBLIC_STUDIO_PASSWORD || 'defaultpassword'; // Fallback

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Fetch the current password from the server
    fetch('/api/studio-auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        setIsAuthenticated(true);
        localStorage.setItem('studioAuthenticated', 'true'); // Store auth state
        setError('');
      } else {
        // Also try client-side check as fallback
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('studioAuthenticated', 'true'); // Store auth state
      setError('');
    } else {
      setError('Incorrect password.');
    }
      }
    })
    .catch(err => {
      console.error('Auth error:', err);
      // Fall back to client-side check if API fails
      if (password === correctPassword) {
        setIsAuthenticated(true);
        localStorage.setItem('studioAuthenticated', 'true');
        setError('');
      } else {
        setError('Incorrect password.');
      }
    });
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
      localStorage.removeItem('studioAuthenticated');
      setPassword('');
      setError('');
  };

  if (!isAuthenticated) {
    return (
      // Revert to dark theme background
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
        <main className="flex-grow flex items-center justify-center px-4 py-16">
          {/* Revert to dark card styles */}
          <div className="w-full max-w-sm bg-gray-900 p-8 shadow-lg border border-gray-800">
            {/* Dark text colors */}
            <h1 className="text-xl font-bold text-white mb-4 text-center">Studio Access</h1>
            <p className="text-sm text-gray-400 mb-6 text-center">Enter the password to view private content.</p>
            <form onSubmit={handleLogin}>
              <div className="mb-4">
                 {/* Dark label style (sr-only kept) */}
                <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1 sr-only">Password</label>
                 {/* Input dark style */}
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
              {/* Button dark style (e.g., blue) */}
              <button type="submit" className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 transition duration-300 shadow-md">
                Enter Studio
              </button>
            </form>
          </div>
        </main>
      </div>
    );
  }

  // If authenticated, show studio content
  return (
    // Revert to dark theme background
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="flex justify-between items-center mb-8">
           {/* Dark text colors */}
          <h1 className="text-3xl font-bold text-white">Studio</h1>
          {/* Logout button dark style */}
          <button 
            onClick={handleLogout}
            className="px-4 py-1 bg-red-700 hover:bg-red-600 text-white text-sm font-medium transition-colors shadow-md"
          >
              Logout
          </button>
        </div>
        
        {/* Dark content area style */}
        <div className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-lg">
          <p className="text-gray-300 mb-6">
            Welcome to the Studio. Private content, work-in-progress, or client previews will be displayed here.
          </p>
          
          {/* Unified Links Section */}
          <div className="mt-8">
            {/* Optional: Add a generic title here if needed, or remove if main page title is enough */}
            {/* <h2 className="text-2xl font-bold text-white mb-6">Quick Access Tools</h2> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                // Reordered and with unique colors assigned
                { href: '/gigs/calendar', title: 'Calendar', description: 'Visualize deadlines, learning sessions, and financial check-ins.', color: 'red' },
                { href: '/finances', title: 'Financial Overview', description: 'View income, expenses, and financial reports.', color: 'orange' },
                { href: '/gigs', title: 'Gig Management', description: 'Track freelance projects, proposals, and client interactions.', color: 'amber' },
                { href: '/trust', title: 'The Boase Trust', description: 'View trust documents, asset ledger, and balance sheet.', color: 'yellow' },
                { href: '/gigs/research', title: 'Research', description: 'Explore Fiverr trends, popular gigs, pricing, and keywords.', color: 'lime' },
                { href: '/gigs/strategy', title: 'Strategy', description: 'Define specific gig offerings, unique selling points, and target audiences.', color: 'green' },
                { href: '/gigs/action', title: 'Action Plan', description: 'Detailed steps to create and launch gigs for each platform/service.', color: 'emerald' },
                { href: '/gigs/platforms', title: 'Platforms', description: 'Review key platforms, required expertise, and potential gig ideas.', color: 'teal' },
                { href: '/gigs/learning-path', title: 'Learning Path', description: 'Follow a structured 3-month schedule to master each platform.', color: 'cyan' },
                { href: '/gigs/work-path', title: 'Work Path', description: 'Manage your daily workflow and balance client work with skill development.', color: 'sky' },
                { href: '/gigs/fiverr-explorer', title: 'Fiverr Explorer', description: 'Browse Fiverr categories and scrape gig data for research.', color: 'blue' },
                { href: '/diary', title: 'Diary', description: 'Personal journal, daily notes, and reflections.', color: 'indigo' },
                { href: '/workinprogress', title: 'Work In Progress', description: 'Overview of current tasks, projects, and ongoing efforts.', color: 'purple' },
              ].map((item, index) => (
                <Link key={item.href} href={item.href} className={`block bg-gray-800 hover:bg-gray-700 p-6 border border-gray-700 shadow-md transition-colors group`}>
                  <h3 className={`text-xl font-semibold text-${item.color}-400 mb-2 group-hover:text-${item.color}-300`}>
                    {index + 1}. {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* Add actual studio content here later */}
          <p className="text-gray-400 italic">Further studio-specific content can be added below.</p>
        </div>
      </main>
    </div>
  );
} 