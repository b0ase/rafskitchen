import React from 'react';
import BitcoinSvCard from './components/BitcoinSvCard';
import SolanaCard from './components/SolanaCard';
import EthereumCard from './components/EthereumCard';

const BoaseTokenPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
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

        {/* You can add the 'About $BOASE' section here later */}
        {/* <div className="mt-20">
          <h2 className="text-3xl font-bold mb-6">About $BOASE</h2>
          <p className="text-lg text-gray-300">
            A versatile utility and governance token for the BOASE ecosystem...
          </p>
        </div> */}
      </div>
    </div>
  );
};

export default BoaseTokenPage;
