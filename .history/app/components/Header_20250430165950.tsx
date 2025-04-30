'use client';

import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="w-full bg-gray-800 shadow-md py-4 z-50 border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-white">Richard Boase</div>
          <Navigation />
        </div>
      </div>
    </header>
  );
} 