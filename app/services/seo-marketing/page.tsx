'use client';

import React from 'react';
import Link from 'next/link';
import { FaSearch, FaChartLine, FaHashtag, FaBullhorn, FaUsers, FaRocket } from 'react-icons/fa';
import ProjectImage from '@/app/components/ProjectImage';

export default function SeoMarketingPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-600">//</span> SEO & Digital Marketing</h1>
        <p className="text-xl text-gray-700 max-w-4xl">
          Optimizing online presence and content strategy to drive organic growth.
        </p>
      </header>

      {/* Pricing Information */}
      <section className="px-4 md:px-8 py-6 mb-8">
        <p className="text-gray-700 text-base">
          Est. Rate: £110/hr | £450/day. UK VAT added where applicable. Fixed-price projects negotiable.
        </p>
      </section>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Our Marketing Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaSearch className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">SEO Strategy</h3>
            </div>
            <p className="text-gray-600 flex-grow">Comprehensive search engine optimization strategies to improve rankings, increase organic traffic, and enhance visibility.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Performance Analytics</h3>
            </div>
            <p className="text-gray-600 flex-grow">In-depth analysis of website performance, user behavior, and conversion metrics with actionable recommendations for improvement.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaHashtag className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Social Media Marketing</h3>
            </div>
            <p className="text-gray-600 flex-grow">Strategic social media campaigns that build brand awareness, engage your audience, and drive traffic to your website.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaBullhorn className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Content Marketing</h3>
            </div>
            <p className="text-gray-600 flex-grow">Development and distribution of valuable, relevant content that attracts and retains a clearly defined audience.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaUsers className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Audience Research</h3>
            </div>
            <p className="text-gray-600 flex-grow">Detailed analysis of your target audience's demographics, behavior, preferences, and pain points to inform marketing strategies.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaRocket className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Conversion Optimization</h3>
            </div>
            <p className="text-gray-600 flex-grow">Enhancement of user journeys and website elements to increase conversion rates and maximize return on investment.</p>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Case 1: E-commerce Traffic Growth */}
          <div className="bg-gray-50 border border-gray-200 shadow-lg overflow-hidden">
            <ProjectImage 
              service="seo-marketing"
              projectId="ecommerce-traffic-growth"
              title="E-commerce Traffic Growth"
            />
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">E-commerce Traffic Growth</h3>
              <p className="text-gray-600 mb-3">
                Increased organic traffic by 215% and conversion rates by 40% for an e-commerce retailer through strategic SEO and content optimization.
              </p>
              <div className="flex flex-wrap gap-2">
                {['E-commerce', 'SEO', 'Content', '+215% Traffic'].map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-50 text-cyan-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Case 2: SaaS Lead Generation */}
          <div className="bg-gray-50 border border-gray-200 shadow-lg overflow-hidden">
            <ProjectImage 
              service="seo-marketing"
              projectId="saas-lead-generation"
              title="SaaS Lead Generation"
            />
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">SaaS Lead Generation</h3>
              <p className="text-gray-600 mb-3">
                Developed a comprehensive digital marketing strategy that resulted in a 75% increase in qualified leads for a B2B SaaS provider.
              </p>
              <div className="flex flex-wrap gap-2">
                {['B2B', 'Lead Gen', 'SaaS', '+75% Leads'].map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-50 text-cyan-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Case 3: Local Business SEO */}
          <div className="bg-gray-50 border border-gray-200 shadow-lg overflow-hidden">
            <ProjectImage 
              service="seo-marketing"
              projectId="local-business-seo"
              title="Local Business SEO"
            />
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Local Business SEO</h3>
              <p className="text-gray-600 mb-3">
                Implemented local SEO tactics that boosted a service business into the top 3 Google results for high-value keywords in their area.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Local SEO', 'Google My Business', 'Service Industry', 'Top 3 Rankings'].map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-50 text-cyan-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-50 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Our Digital Marketing Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">1. Audit & Analysis</h3>
            <p className="text-gray-600">Comprehensive audit of your current digital presence, performance metrics, and competitive landscape to establish baselines.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">2. Strategy Development</h3>
            <p className="text-gray-600">Creation of a tailored digital marketing strategy that addresses your specific business goals and target audience needs.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">3. On-Page Optimization</h3>
            <p className="text-gray-600">Enhancement of website structure, metadata, content, and technical elements to improve search visibility and user experience.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">4. Content Creation</h3>
            <p className="text-gray-600">Development of high-quality, SEO-optimized content that engages your audience and addresses their search intent.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">5. Promotion & Outreach</h3>
            <p className="text-gray-600">Strategic promotion of content and outreach to build backlinks, increase social shares, and expand your digital footprint.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">6. Monitoring & Optimization</h3>
            <p className="text-gray-600">Ongoing performance tracking and continuous optimization to adapt to algorithm changes and maximize ROI.</p>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Client Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 border border-gray-200 shadow-lg relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-700 mb-4 italic">"B0ASE's SEO strategies have transformed our digital presence. Our organic traffic has increased by over 200% in just six months, and we're now ranking for keywords we never thought possible."</p>
              <div>
                <p className="font-semibold text-black">Jeremy Clark</p>
                <p className="text-gray-600 text-sm">Director of Digital, Global Retailers</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-700 mb-4 italic">"The content strategy B0ASE developed for our blog has been instrumental in establishing our thought leadership in the industry. We're now seeing consistent lead generation from our content efforts."</p>
              <div>
                <p className="font-semibold text-black">Samantha Wong</p>
                <p className="text-gray-600 text-sm">CEO, TechInnovate Solutions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-700 mb-4 italic">"As a local business, we were struggling to compete online until B0ASE implemented their local SEO strategy. Now we're dominating local search results and seeing a significant increase in walk-in customers."</p>
              <div>
                <p className="font-semibold text-black">Robert Martinez</p>
                <p className="text-gray-600 text-sm">Owner, Urban Fitness Center</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tools & Platforms */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Tools & Platforms We Use</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Google Analytics', 'SEMrush', 'Ahrefs', 'Screaming Frog', 'Google Search Console', 'Moz',
            'HubSpot', 'Mailchimp', 'Hootsuite', 'Buffer', 'Google Tag Manager', 'Hotjar'].map((tool, index) => (
            <div key={index} className="bg-white p-4 border border-gray-200 shadow-lg text-center">
              <span className="font-medium text-gray-700">{tool}</span>
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