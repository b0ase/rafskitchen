'use client'; // Keep this if using client-side hooks/interactivity, remove if purely static

import React from 'react';
import Header from '../components/Header'; // Adjust path
import Footer from '../components/Footer'; // Adjust path

// Token details (can be moved to a data object if needed)
const tokenDetails = {
  name: '$BOASE',
  marketUrl: 'https://1sat.market/market/bsv21/c3bf2d7a4519ddc633bc91bbfd1022db1a77da71e16bb582b0acc0d8f7836161_1',
  platform: 'BSV21',
  cashHandle: '$BOASE' // Specify the cash handle
};

export default function TokenPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">$B0ASE Token</h1>
        <p className="text-lg text-gray-700 mb-6 max-w-2xl mx-auto">
      <main className="flex-grow container px-4 py-16 mx-auto">
        <h1 className="text-4xl font-bold text-white mb-6 font-mono">{tokenDetails.name} Token</h1>

        <div className="bg-gray-900 p-6 md:p-8 shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-white mb-4">Incubator Funding & Revenue Share</h2>
          <p className="mb-4 leading-relaxed">
            The {tokenDetails.name} token represents a stake in the B0ASE project incubator and its associated developments. 
            Initially launching on {tokenDetails.platform}, with planned expansion to Solana and Ethereum, it serves as the primary mechanism 
            for funding ongoing work and distributing potential revenue across multiple chains.
          </p>
          <p className="mb-4 leading-relaxed">
            The model involves receiving project funding or service payments (in various cryptocurrencies, stablecoins like USDT, etc.) 
            directly to the <span className="font-mono text-green-400">{tokenDetails.cashHandle}</span> cash handle. 
            A portion of these proceeds is intended for automated disbursement to {tokenDetails.name} token holders, proportionate to their holdings, 
            eventually leveraging cross-chain mechanisms.
          </p>
          <a 
            href={tokenDetails.marketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 transition-colors duration-200 text-sm"
          >
            View {tokenDetails.name} on 1Sat.Market ({tokenDetails.platform})
          </a>
        </div>

        <div className="bg-gray-900 p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-white mb-4">Ownership & Investment</h2>
          <p className="mb-4 leading-relaxed">
            Currently, 100% of the {tokenDetails.name} tokens are held by Richard Boase.
          </p>
          <p className="leading-relaxed">
            We are open to discussions with potential investors regarding capital contributions in exchange for equity 
            in specific projects or a share of the {tokenDetails.name} token supply and its associated revenue streams. 
            Please use the contact form or details on the main page to get in touch.
          </p>
        </div>

      </main>
      <Footer />
    </div>
  );
} 