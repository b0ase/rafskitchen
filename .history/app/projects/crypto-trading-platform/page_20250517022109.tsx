'use client';

import React from 'react';
import Link from 'next/link';

export default function CryptoTradingPlatformPage() {
  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8">
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-4">Crypto Trading Platform</h1>
        <p className="text-xl text-gray-300">
          Detailed information about the Crypto Trading Platform project.
        </p>
      </header>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Project Overview</h2>
        <p className="text-gray-400 leading-relaxed">
          This page will provide an in-depth look at the Crypto Trading Platform, including its features,
          the technologies used, challenges faced, and the solutions implemented.
        </p>
        {/* Placeholder for images, more detailed descriptions, etc. */}
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Key Features</h2>
        <ul className="list-disc list-inside text-gray-400 space-y-2">
          <li>Secure user authentication and wallet integration.</li>
          <li>Real-time market data feeds and charting.</li>
          <li>Advanced order types (limit, market, stop-loss).</li>
          <li>Portfolio tracking and performance analytics.</li>
          <li>Responsive design for desktop and mobile devices.</li>
        </ul>
      </section>
      
      <section className="mb-12">
        <h2 className="text-2xl font-semibold text-white mb-4">Technologies Used</h2>
        <div className="flex flex-wrap gap-2">
          {['React', 'Node.js', 'WebSockets', 'Blockchain APIs', 'PostgreSQL', 'Docker'].map((tech) => (
            <span key={tech} className="px-3 py-1 bg-gray-800 text-cyan-400 text-xs rounded-full">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <div className="mt-12">
        <Link href="/services/software-development"
          className="text-sky-400 hover:text-sky-300 transition-colors duration-150">
          &larr; Back to Software Development Services
        </Link>
      </div>
       <div className="mt-4">
        <Link href="/"
          className="text-gray-400 hover:text-gray-300 transition-colors duration-150 text-sm">
          &larr; Back to Homepage
        </Link>
      </div>
    </div>
  );
} 