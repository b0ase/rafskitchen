'use client';

import React from 'react';
import Link from 'next/link';
import { FaExternalLinkAlt, FaRocket, FaCubes, FaChartLine } from 'react-icons/fa';

const sections = [
  { name: 'Startup Incubation', href: '/services/startup-incubation' },
  { name: 'SaaS on Blockchain', href: '/services/saas-blockchain' },
  { name: 'DeFi Exchange', href: '/services/defi-exchange' },
  { name: 'Blockchain Platform', href: '/services/blockchain-platform' },
  { name: 'Tokenization', href: '/services/tokenization-services' },
  { name: 'Capital Raising', href: '/services/capital-raising' },
  { name: 'Business Development', href: '/services/business-development' },
  { name: 'Stablecoin Payments', href: '/services/stablecoin-payments' },
  { name: 'Technical Consulting', href: '/services/technical-consulting' },
];

export default function SubNavigation() {
  return (
    // Modern white design with floating effect - removed gap by using top-[76px] instead of top-[80px]
    <nav className="hidden md:flex sticky top-[76px] z-30 w-full bg-white border-b border-gray-200 shadow-lg px-6 py-3">
      <div className="w-full flex justify-between items-center space-x-8">
        {/* Left group: Service links with modern styling */}
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-hide">
          {sections.map((section) => (
            <Link
              key={section.name}
              href={section.href}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-black transition-all duration-300 rounded-lg hover:bg-gray-100 border border-transparent hover:border-gray-300 whitespace-nowrap relative group"
            >
              {section.name}
              <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-cyan-600 transition-all duration-300 group-hover:w-3/4"></span>
            </Link>
          ))}
        </div>

        {/* Right group: External platform links with icons */}
        <div className="flex items-center space-x-3">
          <div className="hidden lg:flex items-center space-x-3">
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-all duration-300 rounded-lg hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
            >
              <FaRocket className="w-3 h-3 mr-2" />
              Fiverr
              <FaExternalLinkAlt className="w-3 h-3 ml-2" />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-all duration-300 rounded-lg hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
            >
              <FaCubes className="w-3 h-3 mr-2" />
              Upwork
              <FaExternalLinkAlt className="w-3 h-3 ml-2" />
            </a>
            <a 
              href="#" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-all duration-300 rounded-lg hover:bg-gray-100 border border-gray-300 hover:border-gray-400"
            >
              <FaChartLine className="w-3 h-3 mr-2" />
              Freelancer
              <FaExternalLinkAlt className="w-3 h-3 ml-2" />
            </a>
          </div>
          
          {/* Mobile-friendly dropdown or simplified links */}
          <div className="lg:hidden">
            <div className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-all duration-300 rounded-lg hover:bg-gray-100 border border-gray-300 cursor-pointer">
              Platforms
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 