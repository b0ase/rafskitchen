'use client';

import React from 'react';
import Link from 'next/link';

export default function WebDevelopmentPage() {
  const pageTitle = "Web Development";
  const shortDescription = "Our web development process focuses on creating high-performance, scalable, and visually appealing digital experiences.";
  const longDescription = "We leverage modern frameworks like Next.js and React, combined with best practices in SEO, accessibility, and user experience. From simple landing pages to complex web applications and e-commerce platforms, we tailor solutions to meet specific business goals.";

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8 lg:p-12">
      <header className="mb-10 md:mb-12 border-b border-gray-800 pb-8">
        <nav className="mb-6">
          <Link href="/services" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
            &larr; Back to All Services
          </Link>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-3">// {pageTitle}</h1>
        <p className="text-lg md:text-xl text-gray-400 italic">
          {shortDescription}
        </p>
      </header>

      <main className="max-w-3xl mx-auto">
        <article className="prose prose-invert prose-lg lg:prose-xl text-gray-300 leading-relaxed mb-10 md:mb-12">
          <p>{longDescription}</p>
        </article>

        <section className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl mb-10 md:mb-12">
          <h2 className="text-2xl font-semibold text-white mb-4">Pricing Information</h2>
          <p className="text-gray-300 leading-relaxed">
            Est. Rate: £120/hr | £480/day. UK VAT added where applicable. Fixed-price projects negotiable.
          </p>
        </section>

        <div className="mt-12 md:mt-16 pt-8 border-t border-gray-700 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Interested in {pageTitle}?</h2>
          <Link 
            href="/contact?service=web-development"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg shadow-lg hover:shadow-blue-500/30 transform hover:scale-105"
          >
            Contact Us About Web Development
          </Link>
        </div>
      </main>

      <footer className="text-center mt-16 md:mt-20 py-8 border-t border-gray-800">
        <p className="text-gray-500">
          Explore other ways b0ase can help elevate your digital presence.{' '}
          <Link href="/services" className="text-cyan-400 hover:underline font-semibold">
            View All Services
          </Link>.
        </p>
      </footer>
    </div>
  );
} 