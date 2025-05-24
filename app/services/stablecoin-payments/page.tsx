'use client';

import React from 'react';
import Link from 'next/link';
import { FaDollarSign, FaGlobe, FaShieldAlt, FaBolt, FaChartLine, FaCogs } from 'react-icons/fa';

export default function StablecoinPaymentsPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-600">//</span> Stablecoin Payment Systems</h1>
        <p className="text-xl text-gray-700 max-w-4xl">
          Design and implement stablecoin-based payment infrastructure with multi-currency support, instant settlements, and regulatory compliance.
        </p>
      </header>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Payment Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaDollarSign className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Multi-Currency Support</h3>
            </div>
            <p className="text-gray-600 flex-grow">Support multiple stablecoins (USDC, USDT, DAI) with automatic conversion, exchange rate optimization, and unified payment interface.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaBolt className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Instant Settlements</h3>
            </div>
            <p className="text-gray-600 flex-grow">Near-instant payment processing with Layer 2 solutions, batch transactions, and optimized gas fee management for cost efficiency.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Regulatory Compliance</h3>
            </div>
            <p className="text-gray-600 flex-grow">Built-in AML/KYC compliance, transaction monitoring, reporting tools, and adherence to local and international regulations.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaGlobe className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Cross-Border Payments</h3>
            </div>
            <p className="text-gray-600 flex-grow">Enable seamless international transactions with reduced fees, faster processing, and transparent exchange rates across multiple jurisdictions.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaCogs className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">API Integration</h3>
            </div>
            <p className="text-gray-600 flex-grow">Comprehensive APIs for easy integration with existing systems, webhooks for real-time notifications, and SDK support for multiple platforms.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Analytics & Reporting</h3>
            </div>
            <p className="text-gray-600 flex-grow">Real-time transaction monitoring, detailed analytics dashboard, compliance reporting, and business intelligence tools.</p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Use Cases</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">E-commerce Integration</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Online marketplace payments</li>
              <li>• Subscription billing systems</li>
              <li>• Digital goods transactions</li>
              <li>• Refund and chargeback handling</li>
              <li>• Multi-vendor payouts</li>
              <li>• Inventory management integration</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">B2B Payment Solutions</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Invoice payments</li>
              <li>• Supply chain financing</li>
              <li>• Vendor payment automation</li>
              <li>• Escrow services</li>
              <li>• Smart contract automation</li>
              <li>• Multi-signature approvals</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Remittance Services</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• International money transfers</li>
              <li>• Corridor-specific optimization</li>
              <li>• Mobile wallet integration</li>
              <li>• Cash-out network</li>
              <li>• Exchange rate protection</li>
              <li>• Compliance automation</li>
            </ul>
          </div>
          
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">DeFi Integration</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• Yield-bearing payments</li>
              <li>• Liquidity pool integration</li>
              <li>• Automated savings</li>
              <li>• Flash loan services</li>
              <li>• Governance token rewards</li>
              <li>• Protocol fee optimization</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Features */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-50 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Technical Infrastructure</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Smart Contract Layer</h3>
            <p className="text-gray-600">Audited smart contracts for payment processing, escrow services, multi-signature wallets, and automated compliance checks.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Security Framework</h3>
            <p className="text-gray-600">Multi-layered security with hardware security modules, cold storage integration, and comprehensive key management systems.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Scalability Solutions</h3>
            <p className="text-gray-600">Layer 2 integration (Polygon, Arbitrum), optimistic rollups, and state channels for high-throughput payment processing.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Oracle Integration</h3>
            <p className="text-gray-600">Real-time price feeds, exchange rate data, and external verification systems for accurate payment processing.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Monitoring & Alerts</h3>
            <p className="text-gray-600">24/7 transaction monitoring, anomaly detection, automated alerts, and comprehensive logging for audit trails.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Integration APIs</h3>
            <p className="text-gray-600">RESTful APIs, GraphQL endpoints, webhooks, and SDKs for seamless integration with existing business systems.</p>
          </div>
        </div>
      </section>

      {/* Supported Networks */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Supported Networks</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'BSC', 'Avalanche', 
            'Solana', 'TRON', 'Stellar', 'Algorand', 'NEAR', 'Celo'].map((network, index) => (
            <div key={index} className="bg-white p-4 border border-gray-200 shadow-lg text-center">
              <span className="font-medium text-gray-700">{network}</span>
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
          Build Your Payment System
        </Link>
      </section>
    </div>
  );
} 