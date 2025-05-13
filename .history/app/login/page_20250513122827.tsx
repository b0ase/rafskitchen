'use client';

import React from 'react';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 p-8 md:p-12 border border-gray-700 shadow-2xl rounded-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-6">Login Required</h1>
        <p className="text-gray-400 mb-8">
          You need to be logged in to access this page and other private areas of the studio.
        </p>
        <div className="space-y-4">
          {/* Placeholder for Google Sign-In button */}
          <div className="bg-gray-800 p-4 rounded-md text-gray-500 italic">
            [Google Sign-In will appear here]
          </div>
          <p className="text-sm text-gray-500">
            (Authentication is currently being implemented.)
          </p>
        </div>
        <div className="mt-8">
          <Link href="/"
            className="text-sky-400 hover:text-sky-300 transition-colors duration-150">
            &larr; Go back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 