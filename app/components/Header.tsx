'use client';

import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 bg-black border-b border-gray-800 z-10">
      <div className="container mx-auto px-4 h-24">
        <div className="flex justify-between items-center h-full">
          <div className="text-3xl font-mono text-emerald-500 font-bold tracking-wider">
            b0ase.com
          </div>
          
          {/* Hamburger button - only shows on mobile */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="mobile:block desktop:hidden text-white hover:text-emerald-500"
          >
            <svg 
              className="w-6 h-6" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          {/* Desktop menu - always visible on desktop */}
          <nav className="hidden desktop:flex items-center space-x-8">
            <a href="#" className="text-white hover:text-emerald-500">About</a>
            <a href="#" className="text-white hover:text-emerald-500">Docs</a>
            <a href="#" className="text-white hover:text-emerald-500">GitHub</a>
          </nav>
        </div>

        {/* Mobile menu - only shows when hamburger is clicked */}
        {isMenuOpen && (
          <div className="mobile:block desktop:hidden mt-4 py-4 border-t border-gray-800">
            <nav className="flex flex-col space-y-4">
              <a href="#" className="text-white hover:text-emerald-500">About</a>
              <a href="#" className="text-white hover:text-emerald-500">Docs</a>
              <a href="#" className="text-white hover:text-emerald-500">GitHub</a>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
} 