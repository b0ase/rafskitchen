'use client';

import React from 'react';
import Link from 'next/link';
import { FaRocket, FaBrain, FaUsers, FaChartLine, FaCog, FaDollarSign, FaArrowRight } from 'react-icons/fa';

export default function StartupIncubationPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-600">//</span> Tech Startup Incubation</h1>
        <p className="text-xl text-gray-700 max-w-4xl">
          End-to-end incubation services for tech startups, from ideation to market launch, including mentorship, technical guidance, and business development support.
        </p>
      </header>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Our Incubation Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaBrain className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Ideation & Validation</h3>
            </div>
            <p className="text-gray-600 flex-grow">Transform innovative ideas into viable business concepts with market validation, competitive analysis, and business model development.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaCog className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Technical Development</h3>
            </div>
            <p className="text-gray-600 flex-grow">Full-stack development services, blockchain integration, AI/ML implementation, and technical architecture design for scalable solutions.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaUsers className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Team Building</h3>
            </div>
            <p className="text-gray-600 flex-grow">Recruit top-tier technical talent, build cross-functional teams, and establish effective organizational structures and processes.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaDollarSign className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Funding & Investment</h3>
            </div>
            <p className="text-gray-600 flex-grow">Strategic fundraising support including investor introductions, pitch deck development, and token-based funding mechanisms.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Market Strategy</h3>
            </div>
            <p className="text-gray-600 flex-grow">Go-to-market planning, customer acquisition strategies, partnership development, and growth optimization frameworks.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaRocket className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Launch & Scale</h3>
            </div>
            <p className="text-gray-600 flex-grow">Product launch execution, performance monitoring, iterative improvement, and scaling strategies for rapid growth.</p>
          </div>
        </div>
      </section>

      {/* Incubation Process */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-50 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Our Incubation Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">1. Application & Assessment</h3>
            <p className="text-gray-600">Comprehensive evaluation of your startup idea, team capabilities, market potential, and technical feasibility.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">2. Strategic Planning</h3>
            <p className="text-gray-600">Develop detailed business plan, technical roadmap, funding strategy, and milestone-based execution framework.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">3. Development Phase</h3>
            <p className="text-gray-600">Intensive development period with dedicated technical teams, regular mentorship sessions, and progress monitoring.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">4. Testing & Iteration</h3>
            <p className="text-gray-600">Beta testing, user feedback integration, performance optimization, and product refinement based on market response.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">5. Launch Preparation</h3>
            <p className="text-gray-600">Marketing campaign development, investor relations, partnership establishment, and launch strategy execution.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">6. Growth & Scale</h3>
            <p className="text-gray-600">Post-launch support, growth acceleration, additional funding rounds, and expansion strategy implementation.</p>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Success Metrics & Outcomes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Performance Indicators</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Time to market acceleration</li>
              <li>• Technical milestone achievement</li>
              <li>• User acquisition and retention rates</li>
              <li>• Revenue growth trajectory</li>
              <li>• Product-market fit validation</li>
              <li>• Investment readiness scoring</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Long-term Value</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Sustainable business model</li>
              <li>• Scalable technical architecture</li>
              <li>• Strong team foundation</li>
              <li>• Market positioning advantage</li>
              <li>• Investor network access</li>
              <li>• Ongoing mentorship support</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 md:px-8 py-16 text-center mb-12">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-black mb-6">Ready to Transform Your Startup Idea?</h3>
          <p className="text-gray-600 text-lg mb-8 leading-relaxed">
            Join our incubation program and turn your innovative concept into a successful, scalable business.
          </p>
          <Link 
            href="/signup"
            className="inline-flex items-center bg-cyan-600 text-white font-bold py-4 px-8 border border-cyan-600 shadow-lg hover:bg-cyan-700 hover:border-cyan-700 transition-all duration-300"
          >
            Apply for Incubation
            <FaArrowRight className="ml-3" />
          </Link>
        </div>
      </section>
    </div>
  );
} 