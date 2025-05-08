'use client';

import React from 'react';
import Link from 'next/link';

export default function WebDevelopmentPage() {
  const pageTitle = "Web Development";
  const description = "Our web development process focuses on creating high-performance, scalable, and visually appealing digital experiences. We leverage modern frameworks like Next.js and React, combined with best practices in SEO, accessibility, and user experience. From simple landing pages to complex web applications and e-commerce platforms, we tailor solutions to meet specific business goals.";
  const pricingInfo = "Est. Rate: £120/hr | £480/day. UK VAT added where applicable. Fixed-price projects negotiable.";

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 py-12 md:p-8 md:py-16 lg:p-12 lg:py-20 flex flex-col items-center">
      {/* Content container to match the apparent width of other service pages */}
      <div className="w-full max-w-4xl">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 text-left">// {pageTitle}</h1>
        
        <p className="text-gray-300 leading-relaxed mb-8 text-left md:text-lg">
          {description}
        </p>

        <section className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl mb-10 md:mb-12">
          <h2 className="text-xl md:text-2xl font-semibold text-white mb-4">Pricing Information</h2>
          <p className="text-gray-300 leading-relaxed md:text-lg">
            {pricingInfo}
          </p>
        </section>

        <div className="text-center">
          <Link 
            href={`/contact?service=${pageTitle.toLowerCase().replace(/\s+/g, '-')}`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 md:py-3 md:px-8 rounded-lg transition duration-200 text-base md:text-lg shadow-lg hover:shadow-blue-500/30 transform hover:scale-105"
          >
            Contact Us About {pageTitle}
          </Link>
        </div>
      </div>

      {/* Footer can be added here if present on other static service pages, or removed if not */}
      {/* For now, I'm omitting the distinct footer from the previous version to simplify and match the core content structure shown in screenshots */}
    </div>
  );
} 