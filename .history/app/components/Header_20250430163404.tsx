'use client';

import Navigation from './Navigation';

export default function Header() {
  return (
    <header className="w-full bg-white shadow-sm py-4 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold">Your Name</div>
          <Navigation />
        </div>
      </div>
    </header>
  );
} 