'use client';

import React from 'react';

export default function ApiReferencePage() {
  return (
    <div className="container mx-auto px-4 py-10 text-gray-200 bg-gray-950 min-h-screen">
      <header className="mb-10">
        <h1 className="text-5xl font-bold text-white text-center mb-3">b0ase.com API &amp; MPC Documentation</h1>
        <p className="text-center text-gray-400 text-lg">
          The design documents for the b0ase.com internal API and the Model Context Protocol (MPC) are available below.
        </p>
        <p className="text-center text-yellow-500 mt-2 font-semibold">
          Important: Functional API endpoints for programmatic access are located under <code className='text-yellow-300 bg-gray-700 px-1 rounded'>/api/v1/...</code> routes and are not browsable here.
        </p>
      </header>

      <div className="space-y-12">
        <section className="p-8 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl">
          <h2 className="!text-sky-400 border-b-2 !border-sky-500 pb-2 mb-6 text-3xl font-semibold">Internal API Design</h2>
          <p className="text-gray-300 mb-4">
            View the detailed design document for the internal b0ase.com API.
          </p>
          <a
            href="/INTERNAL_API_DESIGN.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg shadow-md transition-colors duration-150"
          >
            View Internal API Design.md
          </a>
        </section>

        <section className="p-8 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl">
          <h2 className="!text-purple-400 border-b-2 !border-purple-500 pb-2 mb-6 text-3xl font-semibold">Model Context Protocol (MPC) Design</h2>
          <p className="text-gray-300 mb-4">
            Explore the specifications for the Model Context Protocol (MPC).
          </p>
          <a
            href="/MPC_DESIGN.md"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-semibold rounded-lg shadow-md transition-colors duration-150"
          >
            View MPC_DESIGN.md
          </a>
        </section>
      </div>
    </div>
  );
}