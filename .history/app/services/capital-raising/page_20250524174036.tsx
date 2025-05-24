'use client';

import React from 'react';
import Link from 'next/link';
import { FaUsers, FaDollarSign, FaHandshake, FaChartLine, FaRocket, FaBuilding } from 'react-icons/fa';

export default function CapitalRaisingPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-600">//</span> Capital Raising & Team Building</h1>
        <p className="text-xl text-gray-700 max-w-4xl">
          Strategic capital raising through ICOs, STOs, private placements, and comprehensive team building for technical and business roles.
        </p>
      </header>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Fundraising & Team Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaDollarSign className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">ICO/STO Launches</h3>
            </div>
            <p className="text-gray-600 flex-grow">Plan and execute token sales with regulatory compliance, marketing strategy, and investor relations management.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaHandshake className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Private Placements</h3>
            </div>
            <p className="text-gray-600 flex-grow">Connect with accredited investors, venture capital firms, and family offices for private funding rounds.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaUsers className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Technical Recruitment</h3>
            </div>
            <p className="text-gray-600 flex-grow">Source and recruit top blockchain developers, smart contract auditors, and technical architects.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaBuilding className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Business Development</h3>
            </div>
            <p className="text-gray-600 flex-grow">Build business development teams with expertise in partnerships, market expansion, and strategic alliances.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Investor Relations</h3>
            </div>
            <p className="text-gray-600 flex-grow">Develop comprehensive investor relations programs with regular reporting, communications, and stakeholder management.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaRocket className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Growth Strategy</h3>
            </div>
            <p className="text-gray-600 flex-grow">Create scalable growth strategies with performance metrics, milestone planning, and execution frameworks.</p>
          </div>
        </div>
      </section>

      {/* Fundraising Methods */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Fundraising Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Token Sales (ICO/STO)</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Regulatory compliance strategy</li>
              <li>• Tokenomics design and modeling</li>
              <li>• Legal documentation and filings</li>
              <li>• Marketing and community building</li>
              <li>• Investor onboarding platforms</li>
              <li>• Post-sale token distribution</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Venture Capital</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• VC firm identification and outreach</li>
              <li>• Pitch deck development</li>
              <li>• Due diligence preparation</li>
              <li>• Term sheet negotiation</li>
              <li>• Investor introductions</li>
              <li>• Follow-on funding rounds</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Strategic Partnerships</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Corporate partnership deals</li>
              <li>• Joint venture structuring</li>
              <li>• Strategic investor alignment</li>
              <li>• Technology licensing agreements</li>
              <li>• Market access partnerships</li>
              <li>• Revenue sharing models</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Alternative Funding</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Crowdfunding campaigns</li>
              <li>• Grant applications and submissions</li>
              <li>• Revenue-based financing</li>
              <li>• Asset-backed securities</li>
              <li>• Peer-to-peer lending</li>
              <li>• Government incentive programs</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Team Building */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-50 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Team Building & Recruitment</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Technical Roles</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Blockchain Developers</li>
              <li>• Smart Contract Engineers</li>
              <li>• DevOps & Infrastructure</li>
              <li>• Security Auditors</li>
              <li>• Full-Stack Developers</li>
              <li>• Data Scientists</li>
            </ul>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Business Roles</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Business Development</li>
              <li>• Marketing & Growth</li>
              <li>• Operations Management</li>
              <li>• Legal & Compliance</li>
              <li>• Financial Planning</li>
              <li>• Project Management</li>
            </ul>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Leadership Roles</h3>
            <ul className="text-gray-600 space-y-1">
              <li>• Chief Technology Officer</li>
              <li>• VP of Engineering</li>
              <li>• Head of Business Development</li>
              <li>• Chief Financial Officer</li>
              <li>• Head of Operations</li>
              <li>• Advisory Board Members</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Process & Timeline */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Fundraising Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">1. Strategy & Planning</h3>
            <p className="text-gray-600">Market analysis, funding requirements assessment, and strategic roadmap development.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">2. Documentation</h3>
            <p className="text-gray-600">Business plan, pitch decks, financial models, and legal documentation preparation.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">3. Execution</h3>
            <p className="text-gray-600">Investor outreach, presentations, negotiations, and due diligence management.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">4. Closing & Growth</h3>
            <p className="text-gray-600">Deal finalization, fund deployment, team scaling, and ongoing investor relations.</p>
          </div>
        </div>
      </section>

      {/* Success Metrics */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Success Metrics</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <h3 className="text-3xl font-bold text-cyan-600 mb-2">$50M+</h3>
            <p className="text-gray-600">Total Capital Raised</p>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <h3 className="text-3xl font-bold text-cyan-600 mb-2">25+</h3>
            <p className="text-gray-600">Successful Placements</p>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <h3 className="text-3xl font-bold text-cyan-600 mb-2">100+</h3>
            <p className="text-gray-600">Team Members Placed</p>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <h3 className="text-3xl font-bold text-cyan-600 mb-2">90%</h3>
            <p className="text-gray-600">Funding Success Rate</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 md:px-8 py-12 text-center mb-8">
        <Link 
          href="/contact"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 transition duration-200"
        >
          Start Your Fundraising Journey
        </Link>
      </section>
    </div>
  );
} 