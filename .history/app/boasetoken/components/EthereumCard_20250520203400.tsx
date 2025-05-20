import React from 'react';

const EthereumCard = () => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col items-center">
      {/* You can replace this with an actual Ethereum icon later */}
      <div className="text-5xl mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-12 h-12 text-gray-400" viewBox="0 0 320 512">
            <path d="M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"/>
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">Ethereum</h3>
      <span className="bg-yellow-500 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full mb-3">Planned</span>
      <p className="text-gray-400 text-sm text-center mb-4">
        Deployment on the Ethereum network is planned to tap into its vast DeFi ecosystem and user base.
      </p>
      {/* You can add a button or link here later if needed */}
    </div>
  );
};

export default EthereumCard; 