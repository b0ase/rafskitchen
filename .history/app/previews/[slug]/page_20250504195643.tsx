'use client';

import Link from 'next/link';
import React from 'react';

// This component receives the slug from the dynamic route
export default function ProjectPreviewPage({ params }: { params: { slug: string } }) {
  const projectSlug = params.slug;

  // --- Mock Data (Replace with actual data or fetch later) ---
  const clientName = projectSlug.replace(/-com$/, '').replace(/-/g, '-');
  const websiteName = projectSlug;

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col" suppressHydrationWarning>
      {/* --- Client-specific Navbar - Renders identically on server/client --- */}
      <nav className="bg-gray-800 p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-xl font-bold text-cyan-400">{websiteName}</span>
          <div className="space-x-4">
             <a href="#capabilities" className="hover:text-cyan-300">Capabilities</a>
             <a href="#mission" className="hover:text-cyan-300">Mission</a>
             <a href="#contact" className="hover:text-cyan-300">Contact</a>
             {/* Project Hub Link - Rendered unconditionally now */}
             <Link href={`/projects/${projectSlug}`}>
                 <a className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded text-sm transition duration-200">
                     Project Hub
                 </a>
             </Link>
          </div>
        </div>
      </nav>

      {/* --- Main Content Area --- */}
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 lg:px-8">

        {/* --- Hero Section Placeholder --- */}
        <section id="hero" className="text-center py-16 md:py-24 bg-gray-800 rounded-lg shadow-xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Hardware Doesn't Have to Be Hard.</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            End-to-end product design for consumer products. We bring your ideas to life through a flexible and affordable engineering approach.
          </p>
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded transition duration-200 text-lg">
            Discover More
          </button>
        </section>

        {/* --- Capabilities Section Placeholder --- */}
        <section id="capabilities" className="py-12">
          <h2 className="text-3xl font-semibold text-center mb-8 text-cyan-400">Our Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Repeat this block for each capability */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-white">Electronic Design</h3>
              <p className="text-gray-400 mb-4">From prototype to production, we build things that work.</p>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 font-semibold">Learn More &rarr;</a>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-white">Mechanical Design</h3>
              <p className="text-gray-400 mb-4">Concept to DFM with a tightly integrated approach.</p>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 font-semibold">Learn More &rarr;</a>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-white">Firmware Engineering</h3>
              <p className="text-gray-400 mb-4">Breathing life into hardware, making your product unique.</p>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 font-semibold">Learn More &rarr;</a>
            </div>
            {/* Additional capability blocks */}
          </div>
        </section>

        {/* Rest of sections... */}
      </main>

      {/* --- Footer Placeholder --- */}
      <footer className="bg-gray-800 text-gray-400 text-sm py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© {new Date().getFullYear()} {websiteName}. All rights reserved.</p>
          <p>Making hardware easy.</p>
        </div>
      </footer>
    </div>
  );
} 