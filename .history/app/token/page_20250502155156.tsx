'use client'; // Keep this if using client-side hooks/interactivity, remove if purely static

import React, { useState } from 'react';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col dark:bg-gradient-to-b dark:from-gray-950 dark:via-black dark:to-gray-950 dark:text-gray-300">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16 flex flex-col items-center">
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white dark:text-white mb-4">{tokenDetails.name} Token</h1>
            <p className="text-lg text-gray-300 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
                {tokenDetails.description}
            </p>
            <div className="flex flex-row gap-4 justify-center mt-4">
              {tokenDetails.marketUrl && tokenDetails.marketUrl !== '#' && (
                <a 
                    href={tokenDetails.marketUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="px-6 py-2 bg-blue-700 text-white font-medium hover:bg-blue-600 transition-colors shadow-md rounded"
                >
                    View on 1Sat Market
                </a>
              )}
              <button
                onClick={() => setShowKycModal(true)}
                className="px-6 py-2 bg-green-700 text-white font-medium hover:bg-green-600 transition-colors shadow-md rounded"
              >
                KYC Verification
              </button>
              <button
                onClick={() => setShowStakingModal(true)}
                className="px-6 py-2 bg-blue-700 text-white font-medium hover:bg-blue-600 transition-colors shadow-md rounded"
              >
                Staking
              </button>
            </div>
        </div>

        {/* Iframe for Market Page */}
        <iframe
          src="https://1sat.market/market/bsv21/c3bf2d7a4519ddc633bc91bbfd1022db1a77da71e16bb582b0acc0d8f7836161_1"
          width="100%"
          height="600"
          style={{ border: 'none', marginTop: '2rem' }}
          title="1Sat Market - $BOASE Token"
        />

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
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Staking <b>$BOASE</b> tokens entitles stakers to receive dividends of revenue received by the <b>$BOASE</b> wallet handle.<br/>
                Staking functionality will be available soon. Please check back later for updates on how to stake your $BOASE tokens and earn rewards.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 