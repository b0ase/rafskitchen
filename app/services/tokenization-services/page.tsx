'use client';

import React from 'react';
import Link from 'next/link';
import { FaCoins, FaGem, FaDollarSign, FaShieldAlt, FaChartLine, FaFileContract } from 'react-icons/fa';

export default function TokenizationServicesPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-600">//</span> Tokenization & Digital Assets</h1>
        <p className="text-xl text-gray-700 max-w-4xl">
          Asset tokenization services, stablecoin development, digital payment systems, and blockchain-based record keeping solutions.
        </p>
      </header>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Tokenization Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaGem className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Asset Tokenization</h3>
            </div>
            <p className="text-gray-600 flex-grow">Convert physical and digital assets into blockchain tokens, enabling fractional ownership and improved liquidity.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaDollarSign className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Stablecoin Development</h3>
            </div>
            <p className="text-gray-600 flex-grow">Create price-stable cryptocurrencies backed by fiat, commodities, or algorithmic mechanisms.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaCoins className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Utility Tokens</h3>
            </div>
            <p className="text-gray-600 flex-grow">Design and implement tokens for ecosystem governance, platform access, and user incentivization.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaFileContract className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Security Tokens</h3>
            </div>
            <p className="text-gray-600 flex-grow">Compliant tokenization of traditional securities with automated compliance and investor management.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">NFT Platforms</h3>
            </div>
            <p className="text-gray-600 flex-grow">Non-fungible token marketplaces and minting platforms for digital art, collectibles, and unique assets.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Tokenomics Design</h3>
            </div>
            <p className="text-gray-600 flex-grow">Economic model design for sustainable token ecosystems with inflation control and value accrual.</p>
          </div>
        </div>
      </section>

      {/* Asset Categories */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Asset Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Real Estate Tokenization</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Commercial property fractionalization</li>
              <li>• Residential investment tokens</li>
              <li>• REIT blockchain integration</li>
              <li>• Property management automation</li>
              <li>• Rental income distribution</li>
              <li>• Liquidity marketplace</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Commodity Tokenization</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Precious metals backing</li>
              <li>• Agricultural product tokens</li>
              <li>• Energy asset tokenization</li>
              <li>• Carbon credit tokens</li>
              <li>• Supply chain integration</li>
              <li>• Physical delivery mechanisms</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Equity & Debt Tokens</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Company share tokenization</li>
              <li>• Bond and debt instruments</li>
              <li>• Dividend distribution automation</li>
              <li>• Voting rights management</li>
              <li>• Regulatory compliance</li>
              <li>• Investor accreditation</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Intellectual Property</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Patent tokenization</li>
              <li>• Trademark licensing</li>
              <li>• Royalty distribution</li>
              <li>• Creative work ownership</li>
              <li>• IP marketplace</li>
              <li>• Revenue sharing automation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Implementation */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-50 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Technical Implementation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Smart Contract Development</h3>
            <p className="text-gray-600">ERC-20, ERC-721, ERC-1155 token standards with custom functionality and security audits.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Compliance Integration</h3>
            <p className="text-gray-600">KYC/AML integration, accredited investor verification, and regulatory reporting automation.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Multi-Chain Support</h3>
            <p className="text-gray-600">Deploy tokens across Ethereum, Polygon, BSC, and other blockchain networks for optimal reach.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Oracle Integration</h3>
            <p className="text-gray-600">Real-world data feeds for asset valuations, price discovery, and automated rebalancing.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Wallet & Exchange</h3>
            <p className="text-gray-600">Custom wallet solutions and exchange integrations for seamless token trading and management.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Analytics Dashboard</h3>
            <p className="text-gray-600">Real-time asset performance tracking, portfolio management, and investor reporting tools.</p>
          </div>
        </div>
      </section>

      {/* Compliance & Regulation */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Compliance & Regulation</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-4 text-cyan-600">SEC Compliance</h3>
            <p className="text-gray-600">Security token offerings compliant with US securities regulations and exemptions.</p>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-4 text-cyan-600">EU MiCA Framework</h3>
            <p className="text-gray-600">European crypto asset regulation compliance for EU market access and operations.</p>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <h3 className="font-bold text-lg mb-4 text-cyan-600">Global Standards</h3>
            <p className="text-gray-600">International compliance frameworks and cross-border regulatory coordination.</p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 md:px-8 py-12 text-center mb-8">
        <Link 
          href="/contact"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 transition duration-200"
        >
          Start Your Tokenization Project
        </Link>
      </section>
    </div>
  );
} 