'use client';

import { useState } from 'react';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      {/* Hamburger button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden text-white p-2"
        aria-label="Menu"
      >
        <svg 
          className="w-6 h-6" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M6 18L18 6M6 6l12 12" 
            />
          ) : (
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 6h16M4 12h16M4 18h16" 
            />
          )}
        </svg>
      </button>

      {/* Mobile menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50">
          <div className="flex flex-col items-center justify-center h-full space-y-8">
            <a href="#" className="text-white hover:text-emerald-500 text-xl font-mono">About</a>
            <a href="#" className="text-white hover:text-emerald-500 text-xl font-mono">Docs</a>
            <a href="#" className="text-white hover:text-emerald-500 text-xl font-mono">GitHub</a>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-emerald-500 mt-8"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Desktop menu */}
      <div className="hidden md:flex space-x-6">
        <a href="#" className="text-white hover:text-emerald-500 font-mono">About</a>
        <a href="#" className="text-white hover:text-emerald-500 font-mono">Docs</a>
        <a href="#" className="text-white hover:text-emerald-500 font-mono">GitHub</a>
      </div>
    </div>
  );
} 