import React from 'react';

interface AppNavbarProps {
  title: string;
}

export default function AppNavbar({ title }: AppNavbarProps) {
  return (
    <nav className="bg-gray-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-xl font-semibold">
          {title}
        </div>
        <div>
          {/* Navbar items can go here, e.g., User Profile, Notifications, Settings */}
        </div>
      </div>
    </nav>
  );
} 