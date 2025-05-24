'use client';

import React from 'react';
import Link from 'next/link';
import { FaLaptopCode, FaNetworkWired, FaCog, FaShieldAlt, FaRocket, FaUsers } from 'react-icons/fa';

export default function BlockchainPlatformPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white"><span className="text-cyan-500">{'//'}</span> Blockchain Platform Development</h1>
        <p className="text-xl text-gray-300 max-w-4xl">
          Custom blockchain platform development with consensus mechanisms, smart contract capabilities, and scalable network architecture.
        </p>
      </header>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-white">Platform Development Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-800 p-6 border border-gray-700 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaLaptopCode className="text-cyan-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-100">Custom Blockchain</h3>
            </div>
            <p className="text-gray-300 flex-grow">Build purpose-built blockchain networks with custom consensus algorithms, token economics, and governance structures.</p>
          </div>
          
          <div className="bg-gray-800 p-6 border border-gray-700 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaNetworkWired className="text-cyan-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-100">Network Architecture</h3>
            </div>
            <p className="text-gray-300 flex-grow">Design scalable network infrastructure with node distribution, peer-to-peer communication, and fault tolerance.</p>
          </div>
          
          <div className="bg-gray-800 p-6 border border-gray-700 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaCog className="text-cyan-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-100">Consensus Mechanisms</h3>
            </div>
            <p className="text-gray-300 flex-grow">Implement Proof-of-Stake, Proof-of-Authority, or custom consensus algorithms for optimal network performance.</p>
          </div>
          
          <div className="bg-gray-800 p-6 border border-gray-700 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-cyan-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-100">Security & Cryptography</h3>
            </div>
            <p className="text-gray-300 flex-grow">Advanced cryptographic protocols, signature schemes, and security measures for enterprise-grade protection.</p>
          </div>
          
          <div className="bg-gray-800 p-6 border border-gray-700 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaRocket className="text-cyan-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-100">Smart Contract Engine</h3>
            </div>
            <p className="text-gray-300 flex-grow">Virtual machine development for smart contract execution with gas optimization and developer tools.</p>
          </div>
          
          <div className="bg-gray-800 p-6 border border-gray-700 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaUsers className="text-cyan-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-100">Governance System</h3>
            </div>
            <p className="text-gray-300 flex-grow">Decentralized governance mechanisms for protocol upgrades, parameter changes, and community decision making.</p>
          </div>
        </div>
      </section>

      {/* Platform Types */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-white">Platform Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-800 border border-gray-700 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-400">Enterprise Blockchain</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Private/Consortium networks</li>
              <li>• Permissioned access control</li>
              <li>• Integration with existing systems</li>
              <li>• Compliance and audit trails</li>
              <li>• High throughput processing</li>
              <li>• Enterprise-grade security</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-400">Public Blockchain</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Decentralized network</li>
              <li>• Open participation</li>
              <li>• Token economics</li>
              <li>• Community governance</li>
              <li>• Cross-chain compatibility</li>
              <li>• DeFi ecosystem support</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-400">Layer 2 Solutions</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• State channels</li>
              <li>• Rollup technology</li>
              <li>• Sidechains</li>
              <li>• Plasma chains</li>
              <li>• Fast finality</li>
              <li>• Low transaction costs</li>
            </ul>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-400">Interoperability Platform</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Cross-chain bridges</li>
              <li>• Multi-chain protocols</li>
              <li>• Asset transfer</li>
              <li>• Unified interfaces</li>
              <li>• Protocol abstraction</li>
              <li>• Chain-agnostic applications</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Development Process */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-800 border border-gray-700 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-white">Development Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2 text-gray-100">1. Requirements Analysis</h3>
            <p className="text-gray-300">Understand business needs, technical requirements, and design optimal blockchain architecture.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2 text-gray-100">2. Protocol Design</h3>
            <p className="text-gray-300">Design consensus mechanism, network topology, and protocol specifications.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2 text-gray-100">3. Implementation</h3>
            <p className="text-gray-300">Core blockchain development, testing, and security auditing.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2 text-gray-100">4. Deployment & Support</h3>
            <p className="text-gray-300">Network launch, ongoing maintenance, and continuous optimization.</p>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-white">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Go', 'Rust', 'C++', 'Node.js', 'Python', 'Solidity', 
            'Tendermint', 'Substrate', 'Cosmos SDK', 'Hyperledger', 'Ethereum', 'Polkadot',
            'Docker', 'Kubernetes', 'AWS', 'IPFS', 'libp2p', 'PostgreSQL'].map((tech, index) => (
            <div key={index} className="bg-gray-800 p-4 border border-gray-700 shadow-lg text-center">
              <span className="font-medium text-gray-300">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 md:px-8 py-12 text-center mb-8">
        <Link 
          href="/contact"
          className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 transition duration-200 rounded-md"
        >
          Build Your Blockchain Platform
        </Link>
      </section>
    </div>
  );
} 