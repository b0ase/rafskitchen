'use client'; // Keep this if using client-side hooks/interactivity, remove if purely static

import React, { useState } from 'react';
import Link from 'next/link';
import { FaCoins, FaChartLine, FaExchangeAlt, FaUsers, FaLock, FaRocket } from 'react-icons/fa';

// Token details (can be moved to a data object if needed)
const tokenDetails = {
  name: '$BOASE',
  description: "The $BOASE token (BSV21 standard) is currently live on the BSV blockchain. Future plans include expansion to other chains like Solana via bridging technology to enhance accessibility and utility across different ecosystems.",
  marketUrl: 'https://1sat.market/market/bsv21/c3bf2d7a4519ddc633bc91bbfd1022db1a77da71e16bb582b0acc0d8f7836161_1',
  platform: 'BSV21',
  cashHandle: '$BOASE' // Specify the cash handle
};

export default function TokenPage() {
  const [showKycModal, setShowKycModal] = useState(false);
  const [showStakingModal, setShowStakingModal] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadMessage, setUploadMessage] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(Array.from(e.target.files));
      setUploadMessage('');
    }
  };

  const handleKycSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would send files to your backend or KYC provider
    setUploadMessage('Documents uploaded! (This is a demo, no real upload performed.)');
    setUploadedFiles([]);
  };

  const tokenStats = {
    symbol: 'RAFS',
    name: 'RAFS',
    totalSupply: '1,000,000',
    currentPrice: '$0.00 (Demo)',
    marketCap: 'TBD',
    holders: '0 (Demo)'
  };

  const features = [
    {
      icon: FaUsers,
      title: 'Community Governance',
      description: 'Token holders participate in platform decisions and development roadmap'
    },
    {
      icon: FaExchangeAlt,
      title: 'Utility Token',
      description: 'Use RAFS tokens for premium services, features, and platform transactions'
    },
    {
      icon: FaLock,
      title: 'Staking Rewards',
      description: 'Stake your tokens to earn rewards and support network security'
    },
    {
      icon: FaRocket,
      title: 'Early Access',
      description: 'Get priority access to new features and beta testing opportunities'
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center mb-6">
            <FaCoins className="text-6xl mr-4" />
            <div>
              <h1 className="text-4xl md:text-6xl font-bold">$RAFS</h1>
              <p className="text-xl text-purple-100">The RafsKitchen Ecosystem Token</p>
            </div>
          </div>
          <p className="text-lg text-purple-200 max-w-3xl mx-auto">
            Power the future of tech innovation with RAFS tokens. Participate in 
            governance, access premium features, and be part of our growing ecosystem.
          </p>
        </div>
      </div>

      {/* Token Stats */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Token Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-gray-600 mb-2">Token Symbol</h3>
            <p className="text-2xl font-bold text-purple-600">{tokenStats.symbol}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-gray-600 mb-2">Token Name</h3>
            <p className="text-2xl font-bold text-purple-600">{tokenStats.name}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-gray-600 mb-2">Total Supply</h3>
            <p className="text-2xl font-bold text-purple-600">{tokenStats.totalSupply}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-gray-600 mb-2">Current Price</h3>
            <p className="text-2xl font-bold text-purple-600">{tokenStats.currentPrice}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-gray-600 mb-2">Market Cap</h3>
            <p className="text-2xl font-bold text-purple-600">{tokenStats.marketCap}</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg border">
            <h3 className="font-semibold text-gray-600 mb-2">Holders</h3>
            <p className="text-2xl font-bold text-purple-600">{tokenStats.holders}</p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Token Utility</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm border">
                <feature.icon className="text-3xl text-purple-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Token Roadmap</h2>
        <div className="space-y-8">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              1
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Token Design & Planning</h3>
              <p className="text-gray-700">Define tokenomics, utility functions, and ecosystem integration</p>
              <span className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mt-2">In Progress</span>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
              2
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Contract Development</h3>
              <p className="text-gray-700">Build and audit secure smart contracts for token functionality</p>
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mt-2">Planned</span>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
              3
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Token Launch</h3>
              <p className="text-gray-700">Deploy token and begin community distribution</p>
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mt-2">Future</span>
            </div>
          </div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-white font-bold text-sm">
              4
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Exchange Listings</h3>
              <p className="text-gray-700">List on decentralized and centralized exchanges</p>
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full mt-2">Future</span>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-purple-600 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Join the RafsKitchen Ecosystem</h2>
          <p className="text-lg text-purple-100 mb-8">
            Be part of the future of tech innovation. Stay updated on token developments 
            and be the first to know when RAFS tokens become available.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link
              href="/signup"
              className="inline-block bg-white text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join Waitlist
            </Link>
            <Link
              href="/profile"
              className="inline-block bg-purple-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-800 transition-colors"
            >
              Access Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-yellow-50 border-t border-yellow-200 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Demo Token Information</h3>
          <p className="text-yellow-700">
            This is a demonstration of the $RAFS token page. All statistics 
            and information shown are for demo purposes only. No actual tokens 
            have been issued at this time.
          </p>
        </div>
      </div>

      {/* KYC Modal */}
      {showKycModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white dark:bg-gray-900 p-8 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setShowKycModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">KYC Verification</h2>
            <form onSubmit={handleKycSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Upload Driving License or Passport:</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  required
                  className="block w-full text-gray-700 dark:text-gray-300"
                  onChange={handleFileChange}
                />
              </div>
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1 font-medium">Upload Bill with Address:</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  required
                  className="block w-full text-gray-700 dark:text-gray-300"
                  onChange={handleFileChange}
                />
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-green-700 text-white font-medium hover:bg-green-600 transition-colors rounded"
              >
                Submit KYC
              </button>
              {uploadMessage && <p className="text-green-600 dark:text-green-400 text-center mt-2">{uploadMessage}</p>}
            </form>
            <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
              All submitted documents will be held offline, securely, and encrypted, in compliance with GDPR.<br/>
              Alternatively, <a href="#" className="underline hover:text-green-700">connect to Joomla</a> to complete KYC.
            </div>
          </div>
        </div>
      )}

      {/* Staking Modal */}
      {showStakingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white dark:bg-gray-900 p-8 rounded shadow-lg max-w-md w-full relative">
            <button
              onClick={() => setShowStakingModal(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 dark:hover:text-white text-xl"
              aria-label="Close"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-black dark:text-white">Staking (Coming Soon)</h2>
            <button
              className="w-full mb-4 px-4 py-2 bg-yellow-400 text-black font-semibold rounded hover:bg-yellow-300 transition-colors shadow"
              onClick={() => alert('HandCash login integration coming soon!')}
            >
              Login with HandCash
            </button>
            <p className="text-gray-700 dark:text-gray-300 mb-4">
              Staking <b>$BOASE</b> tokens entitles stakers to receive dividends of revenue received by the <b>$BOASE</b> wallet handle.<br/>
              Staking functionality will be available soon. Please check back later for updates on how to stake your $BOASE tokens and earn rewards.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 