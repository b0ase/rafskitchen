'use client';

import React from 'react';
import Link from 'next/link';
import { FaHandshake, FaChartLine, FaGlobe, FaRocket, FaUsers, FaCog } from 'react-icons/fa';

export default function BusinessDevelopmentPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-600">//</span> Business Development & Strategy</h1>
        <p className="text-xl text-gray-700 max-w-4xl">
          Go-to-market strategy, partnership development, market analysis, and business model optimization for tech companies.
        </p>
      </header>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Strategic Business Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaRocket className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Go-to-Market Strategy</h3>
            </div>
            <p className="text-gray-600 flex-grow">Develop comprehensive market entry strategies with customer acquisition, positioning, and competitive analysis.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaHandshake className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Partnership Development</h3>
            </div>
            <p className="text-gray-600 flex-grow">Identify and negotiate strategic partnerships, joint ventures, and collaboration agreements for growth acceleration.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Market Analysis</h3>
            </div>
            <p className="text-gray-600 flex-grow">Comprehensive market research, competitor analysis, and opportunity assessment for informed decision making.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaGlobe className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Market Expansion</h3>
            </div>
            <p className="text-gray-600 flex-grow">International market entry strategies, localization planning, and global expansion roadmaps.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaUsers className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Stakeholder Management</h3>
            </div>
            <p className="text-gray-600 flex-grow">Build and maintain relationships with key stakeholders, investors, customers, and industry partners.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaCog className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Process Optimization</h3>
            </div>
            <p className="text-gray-600 flex-grow">Streamline business operations, improve efficiency, and implement scalable processes for sustainable growth.</p>
          </div>
        </div>
      </section>

      {/* Strategic Areas */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Strategic Focus Areas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Web3 & Blockchain Strategy</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Blockchain adoption roadmaps</li>
              <li>• DeFi integration strategies</li>
              <li>• Token ecosystem development</li>
              <li>• Web3 community building</li>
              <li>• DAO governance design</li>
              <li>• Crypto regulatory compliance</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">SaaS Growth Strategy</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Product-market fit validation</li>
              <li>• Customer acquisition optimization</li>
              <li>• Subscription model design</li>
              <li>• Churn reduction strategies</li>
              <li>• Enterprise sales development</li>
              <li>• Pricing strategy optimization</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">FinTech & Payments</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Payment processor integration</li>
              <li>• Digital banking partnerships</li>
              <li>• Compliance framework development</li>
              <li>• Risk management systems</li>
              <li>• Open banking strategies</li>
              <li>• Cross-border payment solutions</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">AI & Machine Learning</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• AI product strategy</li>
              <li>• ML model commercialization</li>
              <li>• Data partnership agreements</li>
              <li>• Ethics & governance frameworks</li>
              <li>• Enterprise AI adoption</li>
              <li>• Competitive AI positioning</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-50 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Strategic Development Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">1. Assessment</h3>
            <p className="text-gray-600">Current state analysis, SWOT assessment, and strategic gap identification.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">2. Strategy Design</h3>
            <p className="text-gray-600">Strategic roadmap development, goal setting, and resource allocation planning.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">3. Implementation</h3>
            <p className="text-gray-600">Execution planning, team alignment, and milestone-based delivery.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">4. Optimization</h3>
            <p className="text-gray-600">Performance monitoring, iterative improvement, and strategic adjustments.</p>
          </div>
        </div>
      </section>

      {/* Partnership Types */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Partnership Opportunities</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Technology Partners</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Integration partnerships</li>
              <li>• API collaboration</li>
              <li>• Joint development</li>
              <li>• Technology licensing</li>
              <li>• Platform partnerships</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Channel Partners</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Reseller networks</li>
              <li>• Distribution channels</li>
              <li>• Affiliate programs</li>
              <li>• Marketplace presence</li>
              <li>• Sales partnerships</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Strategic Alliances</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Joint ventures</li>
              <li>• Co-marketing agreements</li>
              <li>• Industry consortiums</li>
              <li>• Cross-promotion</li>
              <li>• Ecosystem building</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Success Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <h3 className="text-3xl font-bold text-cyan-600 mb-2">200%</h3>
            <p className="text-gray-600">Average Revenue Growth</p>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <h3 className="text-3xl font-bold text-cyan-600 mb-2">50+</h3>
            <p className="text-gray-600">Strategic Partnerships</p>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <h3 className="text-3xl font-bold text-cyan-600 mb-2">15</h3>
            <p className="text-gray-600">Markets Entered</p>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <h3 className="text-3xl font-bold text-cyan-600 mb-2">95%</h3>
            <p className="text-gray-600">Client Satisfaction</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 md:px-8 py-12 text-center mb-8">
        <Link 
          href="/contact"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 transition duration-200"
        >
          Accelerate Your Business Growth
        </Link>
      </section>
    </div>
  );
} 