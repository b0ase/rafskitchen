'use client';

import React from 'react';
import Link from 'next/link';
import { FaPalette, FaDesktop, FaMobileAlt, FaLightbulb, FaDraftingCompass, FaShoppingCart } from 'react-icons/fa';
import ProjectImage from '@/app/components/ProjectImage';

export default function WebDesignPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-400">//</span> Website Design</h1>
        <p className="text-xl text-gray-300 max-w-4xl">
          Crafting visually stunning, user-friendly websites that drive engagement and achieve your business objectives.
        </p>
      </header>

      {/* Pricing Information */}
      <section className="px-4 md:px-8 py-6 mb-8">
        <p className="text-gray-300 text-base">
          Est. Rate: £100/hr | Project-based. UK VAT added where applicable. Fixed-price projects negotiable.
        </p>
      </section>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Our Web Design Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaPalette className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Custom Web Design</h3>
            </div>
            <p className="text-gray-400 flex-grow">Unique website designs tailored to your brand identity, target audience, and specific business goals.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaDesktop className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">UI/UX Design</h3>
            </div>
            <p className="text-gray-400 flex-grow">Intuitive user interfaces and engaging user experiences designed to maximize usability and conversions.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaMobileAlt className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Responsive Design</h3>
            </div>
            <p className="text-gray-400 flex-grow">Websites that adapt seamlessly to all screen sizes and devices, providing an optimal viewing experience.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaShoppingCart className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">E-commerce Design</h3>
            </div>
            <p className="text-gray-400 flex-grow">Beautiful and functional online store designs that enhance product appeal and streamline the buying process.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaLightbulb className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Landing Page Design</h3>
            </div>
            <p className="text-gray-400 flex-grow">High-converting landing pages designed to capture leads and drive specific marketing campaign goals.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaDraftingCompass className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Website Redesign</h3>
            </div>
            <p className="text-gray-400 flex-grow">Modernizing outdated websites with fresh designs, improved usability, and alignment with current web standards.</p>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Featured Designs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-black border border-gray-800 shadow-xl overflow-hidden">
            <ProjectImage 
              service="web-design"
              projectId="showcase-collage" // Using the new collage image
              title="Our Design Portfolio"
            />
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Diverse Industry Showcase</h3>
              <p className="text-gray-400 mb-3">
                A glimpse into our portfolio, showcasing a variety of design styles and successful projects across different sectors.
              </p>
              <div className="flex flex-wrap gap-2">
                {['UI/UX', 'Responsive', 'E-commerce', 'Branding'].map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-800 text-cyan-400 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Add two more portfolio items here if needed, or adjust grid */}
           <div className="bg-black border border-gray-800 shadow-xl overflow-hidden">
            <div className="h-48 bg-gray-800 relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <span className="text-gray-600 text-lg">[Design Sample 2]</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Coming Soon</h3>
              <p className="text-gray-400 mb-3">
                More examples of our design work will be featured here shortly.
              </p>
            </div>
          </div>
           <div className="bg-black border border-gray-800 shadow-xl overflow-hidden">
            <div className="h-48 bg-gray-800 relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <span className="text-gray-600 text-lg">[Design Sample 3]</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Coming Soon</h3>
              <p className="text-gray-400 mb-3">
                More examples of our design work will be featured here shortly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Design Process */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-black border border-gray-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Our Design Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">1. Research & Discovery</h3>
            <p className="text-gray-400">Understanding your brand, audience, and goals to lay a strategic foundation for the design.</p>
          </div>
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">2. Wireframing & Prototyping</h3>
            <p className="text-gray-400">Creating blueprints and interactive mockups to define structure and user flow before visual design.</p>
          </div>
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">3. Visual Design</h3>
            <p className="text-gray-400">Crafting a stunning visual interface that aligns with your brand and captivates your users.</p>
          </div>
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">4. User Testing</h3>
            <p className="text-gray-400">Gathering feedback on designs from real users to identify areas for improvement and ensure usability.</p>
          </div>
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">5. Handoff & Collaboration</h3>
            <p className="text-gray-400">Providing developers with detailed design specifications and assets for seamless implementation.</p>
          </div>
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">6. Iteration & Refinement</h3>
            <p className="text-gray-400">Continuously refining designs based on feedback and performance data to achieve optimal results.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 md:px-8 py-12 text-center mb-8">
        <Link 
          href="/contact"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 transition duration-200"
        >
          Discuss Your Design Project
        </Link>
      </section>
    </div>
  );
} 