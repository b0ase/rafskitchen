import React from 'react';

export default function AppNavbar() {
  return (
    <nav className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-semibold">
          App Name / Current Page
        </div>
        <div>
          {/* Navbar items can go here, e.g., User Profile, Notifications, Settings */}
          <span className="mr-4">User Profile</span>
          <span>Settings</span>
        </div>
      </div>
    </nav>
  );
} 