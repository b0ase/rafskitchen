'use client';

import React from 'react';
import Link from 'next/link';
import { FaExchangeAlt, FaCoins, FaChartLine, FaLock, FaGlobe, FaRocket } from 'react-icons/fa';

export default function DefiExchangePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-400">//</span> DeFi Exchange Development</h1>
        <p className="text-xl text-gray-300 max-w-4xl">
          Create decentralized finance exchanges with automated market makers, liquidity pools, yield farming, and cross-chain interoperability.
        </p>
      </header>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">DeFi Exchange Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaExchangeAlt className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Automated Market Makers</h3>
            </div>
            <p className="text-gray-400 flex-grow">Implement sophisticated AMM algorithms with customizable pricing curves, slippage protection, and optimal trading efficiency.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaCoins className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Liquidity Pools</h3>
            </div>
            <p className="text-gray-400 flex-grow">Create and manage liquidity pools with dynamic fee structures, impermanent loss protection, and incentive mechanisms.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Yield Farming</h3>
            </div>
            <p className="text-gray-400 flex-grow">Design yield farming protocols with staking rewards, governance tokens, and sustainable tokenomics for long-term growth.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaGlobe className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Cross-Chain Trading</h3>
            </div>
            <p className="text-gray-400 flex-grow">Enable seamless trading across multiple blockchains with bridge integration, wrapped assets, and unified liquidity.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaLock className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Security & Auditing</h3>
            </div>
            <p className="text-gray-400 flex-grow">Implement robust security measures with smart contract audits, bug bounty programs, and emergency response protocols.</p>
          </div>
          
          <div className="bg-black p-6 border border-gray-800 shadow-xl flex flex-col">
            <div className="flex items-center mb-4">
              <FaRocket className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Advanced Trading</h3>
            </div>
            <p className="text-gray-400 flex-grow">Support limit orders, stop-loss mechanisms, flash loans, and sophisticated trading strategies for professional users.</p>
          </div>
        </div>
      </section>

      {/* Exchange Types */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Exchange Solutions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-black border border-gray-800 shadow-xl p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-400">Spot Trading Exchange</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Real-time order matching</li>
              <li>• Advanced charting tools</li>
              <li>• Multiple order types</li>
              <li>• Portfolio management</li>
              <li>• Trading analytics</li>
              <li>• Mobile-responsive interface</li>
            </ul>
          </div>
          
          <div className="bg-black border border-gray-800 shadow-xl p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-400">Derivatives Platform</h3>
            <ul className="space-y-2 text-gray-300">
              <li>• Perpetual contracts</li>
              <li>• Options trading</li>
              <li>• Futures markets</li>
              <li>• Leverage trading</li>
              <li>• Risk management tools</li>
              <li>• Liquidation engine</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Technical Architecture */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-black border border-gray-800 shadow-xl">
        <h2 className="text-2xl font-bold mb-6">Technical Architecture</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Smart Contract Layer</h3>
            <p className="text-gray-400">Core exchange logic, AMM algorithms, liquidity pool management, and security mechanisms implemented in audited smart contracts.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Frontend Interface</h3>
            <p className="text-gray-400">Modern, responsive web interface with real-time data updates, advanced charting, and intuitive user experience design.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Backend Services</h3>
            <p className="text-gray-400">High-performance backend handling data aggregation, analytics, notifications, and blockchain interaction optimization.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Oracle Integration</h3>
            <p className="text-gray-400">Price feeds, market data aggregation, and external data sources for accurate pricing and risk management.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Governance System</h3>
            <p className="text-gray-400">Decentralized governance mechanisms for protocol upgrades, parameter adjustments, and community decision making.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Analytics Dashboard</h3>
            <p className="text-gray-400">Comprehensive analytics for liquidity providers, traders, and administrators with real-time metrics and historical data.</p>
          </div>
        </div>
      </section>

      {/* Supported Blockchains */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Supported Blockchains</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Ethereum', 'Polygon', 'BSC', 'Avalanche', 'Arbitrum', 'Optimism', 
            'Solana', 'Cardano', 'Polkadot', 'Cosmos', 'Near', 'Fantom'].map((blockchain, index) => (
            <div key={index} className="bg-black p-4 border border-gray-800 shadow-xl text-center">
              <span className="font-medium text-gray-300">{blockchain}</span>
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
          Launch Your DeFi Exchange
        </Link>
      </section>
    </div>
  );
} 