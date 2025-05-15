import React from 'react';

export default function AppNavbar() {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-semibold">
          App Name / Current Page
        </div>
        <div>
          {/* Navbar items can go here, e.g., User Profile, Notifications, Settings */}
        </div>
      </div>
    </nav>
  );
} 