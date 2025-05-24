'use client';

import React from 'react';
import Link from 'next/link';
import { FaCoins, FaExternalLinkAlt, FaChartLine, FaWallet, FaExchangeAlt } from 'react-icons/fa';

export default function TokensPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-600">//</span> Tokens</h1>
        <p className="text-xl text-gray-700 max-w-4xl">
          Manage your tokens, view portfolio, and access token-related services in the RafsKitchen ecosystem.
        </p>
      </header>

      {/* Token Overview */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Token Portfolio</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/token"
            className="bg-white p-6 border border-gray-200 shadow-lg rounded-lg hover:border-gray-300 transition-all"
          >
            <div className="flex items-center mb-4">
              <FaCoins className="text-cyan-600 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">$RAFS Token</h3>
            </div>
            <p className="text-gray-600 mb-4">The official RafsKitchen ecosystem token. Currently live on BSV blockchain.</p>
            <div className="flex items-center text-cyan-600 text-sm font-medium">
              View Details <FaExternalLinkAlt className="ml-2" />
            </div>
          </Link>

          <div className="bg-white p-6 border border-gray-200 shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
              <FaWallet className="text-gray-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-700">Portfolio Value</h3>
            </div>
            <p className="text-gray-600 mb-4">Track your total token holdings and portfolio performance.</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-gray-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-700">Analytics</h3>
            </div>
            <p className="text-gray-600 mb-4">Detailed analytics and performance metrics for your token holdings.</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </section>

      {/* Token Actions */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-50 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Token Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Trade $RAFS</h3>
            <p className="text-gray-600 mb-4">Access the official $RAFS trading market on 1Sat.Market</p>
            <a
              href="https://1sat.market"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
            >
              <FaExchangeAlt className="mr-2" />
              Trade Now
            </a>
          </div>

          <div className="p-6 border-l-2 border-gray-300">
            <h3 className="font-bold text-xl mb-2 text-gray-700">Staking</h3>
            <p className="text-gray-600 mb-4">Stake your tokens to earn rewards and participate in governance</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>

          <div className="p-6 border-l-2 border-gray-300">
            <h3 className="font-bold text-xl mb-2 text-gray-700">Governance</h3>
            <p className="text-gray-600 mb-4">Participate in DAO governance and vote on platform decisions</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>

          <div className="p-6 border-l-2 border-gray-300">
            <h3 className="font-bold text-xl mb-2 text-gray-700">Rewards</h3>
            <p className="text-gray-600 mb-4">Earn tokens through platform participation and referrals</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Quick Links</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Token Resources</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <Link href="/token" className="hover:text-cyan-600">$RAFS Token Details</Link></li>
              <li>• <a href="https://1sat.market" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-600">Trading Market</a></li>
              <li>• <Link href="/services/tokenization-services" className="hover:text-cyan-600">Tokenization Services</Link></li>
              <li>• <Link href="/profile" className="hover:text-cyan-600">Your Dashboard</Link></li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Learn More</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <Link href="/services/blockchain-platform" className="hover:text-cyan-600">Blockchain Platform</Link></li>
              <li>• <Link href="/services/defi-exchange" className="hover:text-cyan-600">DeFi Development</Link></li>
              <li>• <Link href="/about" className="hover:text-cyan-600">About RafsKitchen</Link></li>
              <li>• <Link href="/contact" className="hover:text-cyan-600">Contact Support</Link></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      <section className="px-4 md:px-8 py-16 text-center mb-12">
        <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Demo Mode</h3>
          <p className="text-yellow-700 mb-4">
            You're viewing a demo version of the tokens dashboard. In the full version, you would have access to:
          </p>
          <ul className="text-yellow-700 text-sm space-y-1 mb-4">
            <li>• Real-time token balances and portfolio tracking</li>
            <li>• Advanced trading and DeFi integration</li>
            <li>• Staking and governance participation</li>
            <li>• Rewards and incentive programs</li>
          </ul>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
} 