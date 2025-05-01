'use client'; // Keep this if using client-side hooks/interactivity, remove if purely static

import React from 'react';
import Header from '../components/Header'; // Adjust path
import Footer from '../components/Footer'; // Adjust path

// Token details (can be moved to a data object if needed)
const tokenDetails = {
  name: '$BOASE',
  description: "The $BOASE token (BSV21 standard) is currently live on the BSV blockchain. Future plans include expansion to other chains like Solana via bridging technology to enhance accessibility and utility across different ecosystems.",
  marketUrl: 'https://1sat.market/market/bsv21/c3bf2d7a4519ddc633bc91bbfd1022db1a77da71e16bb582b0acc0d8f7836161_1',
  platform: 'BSV21',
  cashHandle: '$BOASE' // Specify the cash handle
};

export default function TokenPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col dark:bg-gradient-to-b dark:from-gray-950 dark:via-black dark:to-gray-950 dark:text-gray-300">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16 flex flex-col items-center">
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-4">{tokenDetails.name} Token</h1>
            <p className="text-lg text-gray-300 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                {tokenDetails.description}
            </p>
            {tokenDetails.marketUrl && tokenDetails.marketUrl !== '#' && (
                <a 
                    href={tokenDetails.marketUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-block px-6 py-2 bg-blue-700 text-white font-medium hover:bg-blue-600 transition-colors shadow-md"
                >
                    View on 1Sat Market
                </a>
            )}
        </div>

        {/* Iframe for Market Page */}
        {/* ... iframe code ... */}
      </main>
      <Footer />
    </div>
  );
} 