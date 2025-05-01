'use client';

import Link from 'next/link';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="w-full bg-gray-950 shadow-md py-4 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <Link 
            href="/" 
            className="text-xl font-bold slashed-zero text-white hover:text-gray-300 transition-colors duration-200"
          >
            B0ASE
          </Link>
          <Navigation />
        </div>
      </div>
    </header>
  );
} 