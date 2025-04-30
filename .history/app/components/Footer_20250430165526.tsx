'use client';

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 border-t border-gray-700 mt-16 py-6">
      <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
        <p>&copy; {currentYear} Your Name. All rights reserved.</p>
        {/* Optional: Add links to privacy policy, terms, etc. */}
      </div>
    </footer>
  );
} 