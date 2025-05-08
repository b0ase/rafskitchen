'use client';

import React from 'react';
import Link from 'next/link';
import { FaPalette, FaPen, FaObjectGroup, FaRulerCombined, FaSwatchbook, FaGlobe } from 'react-icons/fa';
import ProjectImage from '@/app/components/ProjectImage';

export default function LogoBrandingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-400">//</span> Logo Design & Branding</h1>
        <p className="text-xl text-gray-300 max-w-4xl">
          Crafting unique logos and visual identities that effectively represent your brand.
        </p>
      </header>

      {/* Pricing Information */}
      <section className="px-4 md:px-8 py-6 mb-8">
        <p className="text-gray-300 text-base">
          Est. Rate: £90/hr | Project-based. UK VAT added where applicable. Fixed-price projects negotiable.
        </p>
      </section>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Our Branding Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaPen className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Logo Design</h3>
            </div>
            <p className="text-gray-400 flex-grow">Custom, memorable logo designs that capture your brand's essence and communicate your values at a glance.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaPalette className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Brand Identity</h3>
            </div>
            <p className="text-gray-400 flex-grow">Comprehensive visual identity systems including color palettes, typography, and graphic elements that build brand recognition.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaRulerCombined className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Brand Guidelines</h3>
            </div>
            <p className="text-gray-400 flex-grow">Detailed brand style guides that ensure consistent application of your brand assets across all touchpoints.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaSwatchbook className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Brand Collateral</h3>
            </div>
            <p className="text-gray-400 flex-grow">Design of business cards, letterheads, presentation templates, and other marketing materials that align with your brand identity.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaObjectGroup className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Brand Refresh</h3>
            </div>
            <p className="text-gray-400 flex-grow">Modernization of existing brand identities while preserving brand equity and recognition in the marketplace.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaGlobe className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Digital Brand Assets</h3>
            </div>
            <p className="text-gray-400 flex-grow">Creation of social media graphics, web elements, and digital marketing assets that maintain brand consistency online.</p>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Featured Brand Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project 1: Tech Startup Rebrand */}
          <div className="bg-black border border-gray-800 shadow-xl overflow-hidden">
            <div className="h-48 bg-gray-800 relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <span className="text-gray-600 text-lg">[Brand Sample 1]</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Tech Startup Rebrand</h3>
              <p className="text-gray-400 mb-3">
                Complete rebrand for a growing tech company, including logo redesign, visual identity system, and application across digital platforms.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Logo', 'Identity System', 'Digital', 'Tech'].map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-800 text-cyan-400 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Project 2: Luxury Product Branding */}
          <div className="bg-black border border-gray-800 shadow-xl overflow-hidden">
            <div className="h-48 bg-gray-800 relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <span className="text-gray-600 text-lg">[Brand Sample 2]</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Luxury Product Branding</h3>
              <p className="text-gray-400 mb-3">
                Sophisticated branding for a high-end consumer product, featuring elegant logo design and premium packaging concepts.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Luxury', 'Packaging', 'Product', 'Retail'].map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-800 text-cyan-400 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Project 3: Nonprofit Visual Identity */}
          <div className="bg-black border border-gray-800 shadow-xl overflow-hidden">
            <div className="h-48 bg-gray-800 relative">
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <span className="text-gray-600 text-lg">[Brand Sample 3]</span>
              </div>
            </div>
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Nonprofit Visual Identity</h3>
              <p className="text-gray-400 mb-3">
                Accessible and impactful branding for a community-focused nonprofit, including logo, color system, and marketing materials.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Nonprofit', 'Community', 'Print', 'Accessible'].map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-800 text-cyan-400 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-black border border-gray-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Our Branding Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">1. Discovery</h3>
            <p className="text-gray-400">In-depth research into your industry, target audience, competitors, and brand aspirations to develop a strategic foundation.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">2. Strategy</h3>
            <p className="text-gray-400">Development of a comprehensive brand strategy that defines your positioning, personality, and key messaging to guide design decisions.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">3. Concept Development</h3>
            <p className="text-gray-400">Creation of initial logo concepts and visual identity explorations that align with your brand strategy and resonate with your audience.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">4. Refinement</h3>
            <p className="text-gray-400">Collaborative refinement of selected concepts, perfecting every detail to ensure the final brand identity achieves your objectives.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">5. System Development</h3>
            <p className="text-gray-400">Expansion of core brand elements into a complete visual system with typography, color palette, patterns, and applications.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">6. Implementation</h3>
            <p className="text-gray-400">Creation of comprehensive brand guidelines and assets to ensure successful and consistent implementation across all touchpoints.</p>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Client Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-black p-6 border border-gray-800 shadow-xl relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-300 mb-4 italic">"The logo and brand identity B0ASE created for our company perfectly captures our vision and values. Their strategic approach to design has given us a brand that truly stands out in our industry."</p>
              <div>
                <p className="font-semibold text-white">Victoria Reynolds</p>
                <p className="text-gray-400 text-sm">CEO, Elevate Solutions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-300 mb-4 italic">"Our brand refresh by B0ASE has completely transformed how our customers perceive us. They respected our history while bringing our visual identity into the future. The results have exceeded our expectations."</p>
              <div>
                <p className="font-semibold text-white">Thomas Jordan</p>
                <p className="text-gray-400 text-sm">Marketing Director, Heritage Brands</p>
              </div>
            </div>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-300 mb-4 italic">"The comprehensive brand guidelines B0ASE developed have been invaluable as we've scaled our business. Their attention to detail and thoughtful design system has made maintaining brand consistency effortless."</p>
              <div>
                <p className="font-semibold text-white">Natalie Chen</p>
                <p className="text-gray-400 text-sm">Founder, Bloom Beauty</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools & Methods */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Design Tools & Methods</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Adobe Illustrator', 'Adobe Photoshop', 'Figma', 'Sketch', 'Brand Workshops', 'User Testing',
            'Market Research', 'Color Theory', 'Typography', 'Grid Systems', 'Visual Semiotics', 'Design Thinking'].map((tool, index) => (
            <div key={index} className="bg-black p-4 border border-gray-800 shadow-xl text-center">
              <span className="font-medium text-gray-300">{tool}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 md:px-8 py-12 text-center mb-8">
        <Link 
          href="/contact"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 transition duration-200"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  );
} 