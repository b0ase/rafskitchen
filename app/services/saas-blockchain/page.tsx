'use client';

import React from 'react';
import Link from 'next/link';
import { FaCog, FaRocket, FaCloud, FaLock, FaCoins, FaChartLine } from 'react-icons/fa';

export default function SaasBlockchainPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-600">//</span> SaaS on Blockchain</h1>
        <p className="text-xl text-gray-700 max-w-4xl">
          Build scalable Software-as-a-Service platforms on blockchain infrastructure with integrated tokenization, smart contracts, and decentralized features.
        </p>
      </header>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Blockchain SaaS Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaCog className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Hybrid Architecture</h3>
            </div>
            <p className="text-gray-600 flex-grow">Combine traditional SaaS infrastructure with blockchain components for optimal performance, scalability, and decentralization benefits.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaCoins className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Token Integration</h3>
            </div>
            <p className="text-gray-600 flex-grow">Seamlessly integrate utility tokens, payment systems, and tokenized features into your SaaS platform for enhanced user engagement.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaLock className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Smart Contracts</h3>
            </div>
            <p className="text-gray-600 flex-grow">Automate business logic, payments, and user agreements with audited smart contracts for transparency and efficiency.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaCloud className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Decentralized Storage</h3>
            </div>
            <p className="text-gray-600 flex-grow">Implement IPFS, Arweave, or other decentralized storage solutions for improved data sovereignty and censorship resistance.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">On-Chain Analytics</h3>
            </div>
            <p className="text-gray-600 flex-grow">Leverage blockchain data for advanced analytics, user behavior tracking, and transparent business metrics.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaRocket className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Scalable Infrastructure</h3>
            </div>
            <p className="text-gray-600 flex-grow">Design for growth with Layer 2 solutions, cross-chain compatibility, and elastic cloud infrastructure.</p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">SaaS on Blockchain Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Creator Economy Platforms</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Content monetization with tokens</li>
              <li>• NFT marketplace integration</li>
              <li>• Creator royalty distribution</li>
              <li>• Fan engagement rewards</li>
              <li>• Decentralized governance</li>
              <li>• Cross-platform interoperability</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Supply Chain Management</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Product traceability</li>
              <li>• Immutable audit trails</li>
              <li>• Smart contract automation</li>
              <li>• Multi-party verification</li>
              <li>• Compliance reporting</li>
              <li>• Real-time tracking</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">FinTech Solutions</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• DeFi protocol integration</li>
              <li>• Automated lending/borrowing</li>
              <li>• Yield farming dashboards</li>
              <li>• Multi-signature wallets</li>
              <li>• Compliance automation</li>
              <li>• Cross-border payments</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Identity & Credentials</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Self-sovereign identity</li>
              <li>• Verifiable credentials</li>
              <li>• Zero-knowledge proofs</li>
              <li>• Decentralized authentication</li>
              <li>• Certificate management</li>
              <li>• Privacy-preserving verification</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-50 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Technical Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Frontend Layer</h3>
            <p className="text-gray-600">Modern React/Next.js frontend with Web3 integration, wallet connectivity, and responsive design for optimal user experience.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Backend Services</h3>
            <p className="text-gray-600">Microservices architecture with API gateways, message queues, and event-driven processing for scalable operations.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Blockchain Integration</h3>
            <p className="text-gray-600">Smart contract deployment, blockchain monitoring, transaction management, and multi-chain compatibility.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Data Management</h3>
            <p className="text-gray-600">Hybrid storage combining traditional databases with decentralized storage for optimal performance and sovereignty.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Security & Compliance</h3>
            <p className="text-gray-600">Multi-layered security, encryption, audit trails, and compliance frameworks for enterprise-grade protection.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">DevOps & Monitoring</h3>
            <p className="text-gray-600">CI/CD pipelines, automated testing, performance monitoring, and infrastructure as code for reliable operations.</p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['React', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 
            'Ethereum', 'Polygon', 'IPFS', 'Web3.js', 'Ethers.js', 'Hardhat',
            'AWS', 'Kubernetes', 'GraphQL', 'TypeScript', 'Solidity', 'MongoDB'].map((tech, index) => (
            <div key={index} className="bg-white p-4 border border-gray-200 shadow-lg text-center">
              <span className="font-medium text-gray-700">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Development Process */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Development Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">1. Discovery & Planning</h3>
            <p className="text-gray-600">Requirements analysis, blockchain strategy, architecture design, and technical roadmap development.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">2. Smart Contract Development</h3>
            <p className="text-gray-600">Contract design, development, testing, and security auditing for reliable blockchain functionality.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">3. Platform Development</h3>
            <p className="text-gray-600">Full-stack development, API integration, user interface design, and blockchain connectivity implementation.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">4. Testing & Deployment</h3>
            <p className="text-gray-600">Comprehensive testing, security audits, mainnet deployment, and post-launch monitoring and support.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 md:px-8 py-12 text-center mb-8">
        <Link 
          href="/contact"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 transition duration-200"
        >
          Build Your Blockchain SaaS
        </Link>
      </section>
    </div>
  );
} 