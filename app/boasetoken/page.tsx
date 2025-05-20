import React from 'react';
import BitcoinSvCard from './components/BitcoinSvCard';
import SolanaCard from './components/SolanaCard';
import EthereumCard from './components/EthereumCard';

const BoaseTokenPage = () => {
  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center sm:text-5xl md:text-6xl">
          $BOASE Token
        </h1>
        <p className="mt-4 text-xl text-gray-400 text-center">
          Total Supply: 1,000,000,000
        </p>

        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-10">
            Network Availability
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <BitcoinSvCard />
            <SolanaCard />
            <EthereumCard />
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-3xl font-bold mb-6 text-center">About $BOASE Token</h2>
          <p className="text-lg text-gray-300 mb-4 text-center">
            The $BOASE token is a versatile utility and governance token for the BOASE ecosystem. 
            It can be issued, traded, and utilized across multiple blockchain networks, facilitating seamless interaction with BOASE services and platforms.
          </p>
          <p className="text-lg text-gray-300 mb-8 text-center">
            In the future, as $BOASE incorporates support for Bitcoin SV, Solana, and Ethereum, a portion of $BOASE tokens will be convertible into company equity. 
            These equity shares will be dividend-bearing, allowing token holders to participate in the financial success of the BOASE ecosystem.
          </p>
          
          <div className="text-center mt-12">
            <button 
              disabled 
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="KYC Upload Functionality - Coming Soon"
            >
              Upload KYC Details (Coming Soon™)
            </button>
            <p className="text-sm text-gray-500 mt-2">Functionality to upload KYC documents will be available in a future update.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoaseTokenPage;
