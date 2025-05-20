import React from 'react';

const SolanaCard = () => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col items-center">
      {/* You can replace this with an actual Solana icon later */}
      <div className="text-5xl mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-purple-400">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12.998 2.25A10.5 10.5 0 002.499 12.75a10.5 10.5 0 0010.5 10.5 10.5 10.5 0 0010.5-10.5A10.51 10.51 0 0012.998 2.25zm.002 17.25a6.75 6.75 0 110-13.5 6.75 6.75 0 010 13.5zm0-8.25a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
          <path fill="currentColor" d="M4.72 11.533L0 9.245l4.72 2.288zm14.56 0L24 9.245l-4.72 2.288zm-7.28 9.434l4.722-2.288-4.722-2.288zm0-18.868l4.722 2.288-4.722 2.288zm-4.722 2.288L7.28 2.811l-2.56 1.24zm9.444 0L11.998 2.81l2.56 1.24zM7.28 20.967l-2.56-1.242 2.56-1.242zm9.444 0l2.56-1.242-2.56-1.242z"/>
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">Solana</h3>
      <span className="bg-yellow-500 text-yellow-900 text-xs font-semibold px-3 py-1 rounded-full mb-3">Planned</span>
      <p className="text-gray-400 text-sm text-center mb-4">
        Integration with the Solana network is in development to leverage its high throughput and low transaction fees.
      </p>
      {/* You can add a button or link here later if needed */}
    </div>
  );
};

export default SolanaCard; 