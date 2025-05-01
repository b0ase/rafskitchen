'use client';

import Link from 'next/link';
import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="w-full bg-gray-950 shadow-md py-4 z-50 border-b border-gray-800 relative h-14">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-end items-center h-full">
          <Navigation />
        </div>
      </div>
      <Link 
        href="/" 
        className="absolute left-4 top-1/2 -translate-y-1/2 text-xl font-bold font-['var(--font-outfit)'] slashed-zero text-white hover:text-gray-300 transition-colors duration-200"
      >
        b0ase.com
      </Link>
    </header>
  );
} 