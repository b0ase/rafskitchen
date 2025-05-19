'use client';

import React from 'react';
import Link from 'next/link';
import { FaCubes, FaHourglassHalf, FaArrowLeft } from 'react-icons/fa'; // Using FaCubes as decided for the sidebar

export default function MyTokenPage() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4 md:p-8">
      <div className="w-full max-w-2xl text-center">
        <FaCubes className="text-sky-500 text-6xl mb-6 mx-auto" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">My Token</h1>
        <p className="text-lg md:text-xl text-gray-400 mb-8">
          Manage your token details, view supply, and access token-related functionalities here.
          This page is currently under construction.
        </p>
        <div className="bg-gray-900 p-6 rounded-lg shadow-xl border border-gray-700">
          <FaHourglassHalf className="text-yellow-500 text-4xl mb-4 mx-auto" />
          <h2 className="text-2xl font-semibold mb-3">Feature Coming Soon!</h2>
          <p className="text-gray-500">
            The complete 'My Token' management interface will be available soon. Thank you for your patience!
          </p>
        </div>
        <div className="mt-10">
          <Link href="/profile" legacyBehavior>
            <a className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-sky-500 transition-colors">
              <FaArrowLeft className="mr-2" />
              Back to Profile
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
} 