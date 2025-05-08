'use client';

import React from 'react';
import Link from 'next/link';
import { FaSearch, FaChartLine, FaHashtag, FaBullhorn, FaUsers, FaRocket } from 'react-icons/fa';

export default function SeoMarketingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">// SEO & Digital Marketing</h1>
        <p className="text-xl text-gray-300 max-w-4xl">
          Optimizing online presence and content strategy to drive organic growth.
        </p>
      </header>

      {/* Pricing Information */}
      <section className="px-4 md:px-8 py-6 mb-8">
        <p className="text-gray-300 text-base">
          Est. Rate: £110/hr | £450/day. UK VAT added where applicable. Fixed-price projects negotiable.
        </p>
      </section>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">Our Marketing Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaSearch className="text-yellow-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">SEO Strategy</h3>
            </div>
            <p className="text-gray-400 flex-grow">Comprehensive search engine optimization strategies to improve rankings, increase organic traffic, and enhance visibility.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-yellow-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Performance Analytics</h3>
            </div>
            <p className="text-gray-400 flex-grow">In-depth analysis of website performance, user behavior, and conversion metrics with actionable recommendations for improvement.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaHashtag className="text-yellow-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Social Media Marketing</h3>
            </div>
            <p className="text-gray-400 flex-grow">Strategic social media campaigns that build brand awareness, engage your audience, and drive traffic to your website.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaBullhorn className="text-yellow-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Content Marketing</h3>
            </div>
            <p className="text-gray-400 flex-grow">Development and distribution of valuable, relevant content that attracts and retains a clearly defined audience.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaUsers className="text-yellow-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Audience Research</h3>
            </div>
            <p className="text-gray-400 flex-grow">Detailed analysis of your target audience's demographics, behavior, preferences, and pain points to inform marketing strategies.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaRocket className="text-yellow-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Conversion Optimization</h3>
            </div>
            <p className="text-gray-400 flex-grow">Enhancement of user journeys and website elements to increase conversion rates and maximize return on investment.</p>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-800 relative">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <span className="text-gray-600 text-lg">[Case Study {item}]</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">
                  {item === 1 && "E-commerce Traffic Growth"}
                  {item === 2 && "SaaS Lead Generation"}
                  {item === 3 && "Local Business SEO"}
                </h3>
                <p className="text-gray-400 mb-3">
                  {item === 1 && "Increased organic traffic by 215% and conversion rates by 40% for an e-commerce retailer through strategic SEO and content optimization."}
                  {item === 2 && "Developed a comprehensive digital marketing strategy that resulted in a 75% increase in qualified leads for a B2B SaaS provider."}
                  {item === 3 && "Implemented local SEO tactics that boosted a service business into the top 3 Google results for high-value keywords in their area."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    item === 1 ? ['E-commerce', 'SEO', 'Content', '+215% Traffic'] : 
                    item === 2 ? ['B2B', 'Lead Gen', 'SaaS', '+75% Leads'] :
                    ['Local SEO', 'Google My Business', 'Service Industry', 'Top 3 Rankings']
                  ].map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-800 text-yellow-400 text-xs rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-900">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">Our Digital Marketing Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-yellow-500">
            <h3 className="font-bold text-xl mb-2">1. Audit & Analysis</h3>
            <p className="text-gray-400">Comprehensive audit of your current digital presence, performance metrics, and competitive landscape to establish baselines.</p>
          </div>
          
          <div className="p-6 border-l-2 border-yellow-500">
            <h3 className="font-bold text-xl mb-2">2. Strategy Development</h3>
            <p className="text-gray-400">Creation of a tailored digital marketing strategy that addresses your specific business goals and target audience needs.</p>
          </div>
          
          <div className="p-6 border-l-2 border-yellow-500">
            <h3 className="font-bold text-xl mb-2">3. On-Page Optimization</h3>
            <p className="text-gray-400">Enhancement of website structure, metadata, content, and technical elements to improve search visibility and user experience.</p>
          </div>
          
          <div className="p-6 border-l-2 border-yellow-500">
            <h3 className="font-bold text-xl mb-2">4. Content Creation</h3>
            <p className="text-gray-400">Development of high-quality, SEO-optimized content that engages your audience and addresses their search intent.</p>
          </div>
          
          <div className="p-6 border-l-2 border-yellow-500">
            <h3 className="font-bold text-xl mb-2">5. Promotion & Outreach</h3>
            <p className="text-gray-400">Strategic promotion of content and outreach to build backlinks, increase social shares, and expand your digital footprint.</p>
          </div>
          
          <div className="p-6 border-l-2 border-yellow-500">
            <h3 className="font-bold text-xl mb-2">6. Monitoring & Optimization</h3>
            <p className="text-gray-400">Ongoing performance tracking and continuous optimization to adapt to algorithm changes and maximize ROI.</p>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">Client Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 rounded-lg relative">
            <div className="text-4xl text-yellow-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-300 mb-4 italic">"B0ASE's SEO strategies have transformed our digital presence. Our organic traffic has increased by over 200% in just six months, and we're now ranking for keywords we never thought possible."</p>
              <div>
                <p className="font-semibold text-white">Jeremy Clark</p>
                <p className="text-gray-400 text-sm">Director of Digital, Global Retailers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg relative">
            <div className="text-4xl text-yellow-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-300 mb-4 italic">"The content strategy B0ASE developed for our blog has been instrumental in establishing our thought leadership in the industry. We're now seeing consistent lead generation from our content efforts."</p>
              <div>
                <p className="font-semibold text-white">Samantha Wong</p>
                <p className="text-gray-400 text-sm">CEO, TechInnovate Solutions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg relative">
            <div className="text-4xl text-yellow-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-300 mb-4 italic">"As a local business, we were struggling to compete online until B0ASE implemented their local SEO strategy. Now we're dominating local search results and seeing a significant increase in walk-in customers."</p>
              <div>
                <p className="font-semibold text-white">Robert Martinez</p>
                <p className="text-gray-400 text-sm">Owner, Urban Fitness Center</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools & Platforms */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-yellow-400">Tools & Platforms We Use</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Google Analytics', 'SEMrush', 'Ahrefs', 'Screaming Frog', 'Google Search Console', 'Moz',
            'HubSpot', 'Mailchimp', 'Hootsuite', 'Buffer', 'Google Tag Manager', 'Hotjar'].map((tool, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded-lg text-center">
              <span className="font-medium text-gray-300">{tool}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 md:px-8 py-12 text-center mb-8">
        <Link 
          href="/contact"
          className="inline-block bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-8 transition duration-200"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  );
} 