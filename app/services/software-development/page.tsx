'use client';

import React from 'react';
import Link from 'next/link';
import { FaCode, FaMobileAlt, FaServer, FaDatabase, FaRobot, FaBitcoin } from 'react-icons/fa';
import ProjectImage from '@/app/components/ProjectImage';
import ProjectCardImage from '@/app/components/ProjectCardImage';

export default function SoftwareDevelopmentPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-600">//</span> Software Development</h1>
        <p className="text-xl text-gray-700 max-w-4xl">
          App development and technical support for start-ups, with a special focus on 
          crypto, blockchain, and AI innovation.
        </p>
      </header>

      {/* Pricing Information */}
      <section className="px-4 md:px-8 py-6 mb-8">
        <p className="text-gray-700 text-base">
          Est. Rate: £120/hr | £480/day. UK VAT added where applicable. Fixed-price projects negotiable.
        </p>
      </section>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Our Software Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaMobileAlt className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Mobile Applications</h3>
            </div>
            <p className="text-gray-600 flex-grow">Native and cross-platform mobile app development for iOS and Android, with a focus on performance and user experience.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaServer className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Backend Systems</h3>
            </div>
            <p className="text-gray-600 flex-grow">Scalable, secure backend services and APIs that power your applications, handle authentication, and process data efficiently.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaDatabase className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Database Architecture</h3>
            </div>
            <p className="text-gray-600 flex-grow">Optimized database design and implementation for SQL, NoSQL, and distributed storage solutions tailored to your application needs.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaBitcoin className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Blockchain Solutions</h3>
            </div>
            <p className="text-gray-600 flex-grow">Custom blockchain development including smart contracts, tokenization platforms, and decentralized applications (dApps).</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaRobot className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">AI & Machine Learning</h3>
            </div>
            <p className="text-gray-600 flex-grow">Integration of artificial intelligence and machine learning capabilities to create smarter, more adaptive software solutions.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaCode className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Custom Software Solutions</h3>
            </div>
            <p className="text-gray-600 flex-grow">Bespoke software development to address unique business challenges and create competitive advantages for your organization.</p>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Featured Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Project 1: Crypto Trading Platform */}
          <Link href="/featured/crypto-trading-platform" className="block bg-gray-50 border border-gray-200 shadow-lg overflow-hidden hover:shadow-cyan-500/30 transition-shadow duration-300 flex flex-col h-full group">
            <ProjectImage
              service="software-development"
              projectId="crypto-trading"
              title="Crypto Trading Platform"
              className="w-full h-48 group-hover:opacity-90 transition-opacity"
            />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-bold text-xl mb-2">Crypto Trading Platform</h3>
              <p className="text-gray-600 mb-3 flex-grow">
                Secure and user-friendly cryptocurrency trading platform with real-time market data and advanced order types.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {['React', 'Node.js', 'WebSockets', 'Blockchain APIs'].map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-50 text-cyan-600 text-xs rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Link>
          
          {/* Project 2: Smart Contract Audit Tool */}
          <Link href="/featured/smart-contract-audit-tool" className="block bg-gray-50 border border-gray-200 shadow-lg overflow-hidden hover:shadow-cyan-500/30 transition-shadow duration-300 flex flex-col h-full group">
            <ProjectImage
              service="software-development"
              projectId="smart-contract-audit"
              title="Smart Contract Audit Tool"
              className="w-full h-48 group-hover:opacity-90 transition-opacity"
            />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-bold text-xl mb-2">Smart Contract Audit Tool</h3>
              <p className="text-gray-600 mb-3 flex-grow">
                Automated tool for analyzing and validating smart contracts across multiple blockchain networks.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {['Solidity', 'Python', 'Web3.js', 'Ethereum'].map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-50 text-cyan-600 text-xs rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Link>
          
          {/* Project 3: AI-Powered Analytics Dashboard */}
          <Link href="/featured/ai-powered-analytics-dashboard" className="block bg-gray-50 border border-gray-200 shadow-lg overflow-hidden hover:shadow-cyan-500/30 transition-shadow duration-300 flex flex-col h-full group">
            <ProjectImage
              service="software-development"
              projectId="ai-analytics"
              title="AI-Powered Analytics Dashboard"
              className="w-full h-48 group-hover:opacity-90 transition-opacity"
            />
            <div className="p-6 flex flex-col flex-grow">
              <h3 className="font-bold text-xl mb-2">AI-Powered Analytics Dashboard</h3>
              <p className="text-gray-600 mb-3 flex-grow">
                Business intelligence dashboard using machine learning to predict trends and provide actionable insights.
              </p>
              <div className="flex flex-wrap gap-2 mt-auto">
                {['TensorFlow', 'Python', 'D3.js', 'Docker'].map((tech, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-50 text-cyan-600 text-xs rounded-full">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-50 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Our Development Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">1. Requirements Analysis</h3>
            <p className="text-gray-600">In-depth analysis of your business requirements, technical constraints, and market conditions to define the project scope.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">2. Architecture Design</h3>
            <p className="text-gray-600">Creation of a robust software architecture that ensures scalability, maintainability, and security from the ground up.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">3. Agile Development</h3>
            <p className="text-gray-600">Iterative development with regular feedback cycles to ensure the solution evolves in alignment with your changing needs.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">4. Quality Assurance</h3>
            <p className="text-gray-600">Comprehensive testing including unit tests, integration tests, and user acceptance testing to ensure reliability.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">5. Deployment</h3>
            <p className="text-gray-600">Smooth deployment with CI/CD pipelines to ensure seamless integration of new features and minimal downtime.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">6. Ongoing Maintenance</h3>
            <p className="text-gray-600">Continuous monitoring, performance optimization, and proactive maintenance to keep your software running optimally.</p>
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
              <p className="text-gray-700 mb-4 italic">"B0ASE's software development team took our idea from concept to a fully-functioning product in record time. Their blockchain expertise was invaluable to our crypto startup."</p>
              <div>
                <p className="font-semibold text-black">Alex Thompson</p>
                <p className="text-gray-600 text-sm">Founder, CryptoTrack</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-700 mb-4 italic">"We needed a complex system built from the ground up, and B0ASE delivered a solution that was both innovative and rock-solid. Their attention to security and performance was exceptional."</p>
              <div>
                <p className="font-semibold text-black">Olivia Martinez</p>
                <p className="text-gray-600 text-sm">CTO, FinSecure Inc.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-700 mb-4 italic">"The AI-powered analytics dashboard B0ASE created has transformed how we make business decisions. The insights generated have directly contributed to a 28% increase in revenue."</p>
              <div>
                <p className="font-semibold text-black">David Chan</p>
                <p className="text-gray-600 text-sm">Director of Operations, DataSense</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Technologies We Work With</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['React Native', 'Swift', 'Kotlin', 'Node.js', 'Python', 'Golang',
            'Solidity', 'Ethereum', 'TensorFlow', 'PostgreSQL', 'MongoDB', 'AWS'].map((tech, index) => (
            <div key={index} className="bg-white p-4 border border-gray-200 shadow-lg text-center">
              <span className="font-medium text-gray-700">{tech}</span>
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