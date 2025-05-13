'use client';

import React from 'react';
import Link from 'next/link';

export default function IframeTestPage() {
  const fiverrUrl = 'https://www.fiverr.com';

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="mb-6">
        <Link href="/fiverrscraper" className="text-blue-400 hover:text-blue-300">
          ← Back to Fiverr Scraper
        </Link>
      </div>
      <h1 className="text-3xl font-bold mb-6">Fiverr Iframe Test</h1>
      <p className="mb-4">
        This page attempts to load {fiverrUrl} into an iframe below.
        Check your browser console (usually F12, then Console tab) for errors 
        related to <code>X-Frame-Options</code> or <code>Content-Security-Policy</code> if the content doesn't load.
      </p>
      <div style={{ border: '2px solid #555', width: '100%', height: '70vh', backgroundColor: '#333' }}>
        <iframe 
          src={fiverrUrl} 
          title="Fiverr.com Iframe Test"
          style={{ width: '100%', height: '100%', border: 'none' }}
          sandbox="allow-scripts allow-same-origin" // Attempting sandbox attributes, though they may not override X-Frame-Options for cross-origin
        >
          Your browser does not support iframes, or the content is being blocked.
        </iframe>
      </div>
      <p className="mt-4 text-sm text-gray-400">
        If you see a blank space above, or an error message from Fiverr (like "fiverr.com refused to connect"), 
        it means Fiverr is preventing itself from being iframed on other domains.
      </p>
    </div>
  );
} 