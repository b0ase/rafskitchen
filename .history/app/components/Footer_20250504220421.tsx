'use client';

import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-950 border-t border-gray-800 mt-16 py-6">
      <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
        <p>&copy; {currentYear} b0ase.com. All rights reserved.</p>
        {/* Add CV Download Link Here */}
        <p className="mt-2">
          <a 
            href="/resources/George_Haworth_CV_23042025.pdf" 
            download 
            className="hover:text-gray-300 hover:underline"
          >
            Download CV
          </a>
        </p>
        {/* Optional: Add links to privacy policy, terms, etc. */}
      </div>
    </footer>
  );
} 