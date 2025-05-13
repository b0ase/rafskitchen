'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa';

export default function FiverrExplorerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col p-4 md:p-8">
      <div className="mb-8">
        <Link href="/gigs" className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors">
          <FaArrowLeft className="mr-2" />
          Back to Gigs Hub
        </Link>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">Fiverr Explorer</h1>
      <div className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-xl rounded-lg">
        <p className="text-center text-gray-400">
          Fiverr Explorer functionality will be implemented here.
        </p>
        {
          // TODO: Add Fiverr exploration tools, search, category browsing, etc.
        }
      </div>
    </div>
  );
} 