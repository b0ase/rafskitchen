import React from 'react';

const BitcoinSvCard = () => {
  return (
    <div className="bg-gray-800 rounded-lg shadow-xl p-6 flex flex-col items-center">
      {/* You can replace this with an actual Bitcoin SV icon later */}
      <div className="text-5xl mb-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-12 h-12 text-blue-400" viewBox="0 0 32 32">
            <path d="M22.682 10.08h-4.046V7.033c0-1.04-.26-1.56-1.398-1.56h-2.42c-1.137 0-1.397.52-1.397 1.56v3.047H9.33c-.885 0-1.355.466-1.323 1.253l.616 4.51c.06.49.465.96 1.018.96h3.337v9.07c0 1.014.234 1.533 1.346 1.533h2.42c1.112 0 1.347-.52 1.347-1.534v-9.07h3.994c.885 0 1.354-.473 1.322-1.26l-.615-4.51c-.06-.49-.465-.96-1.017-.96zM16 2.667C8.64 2.667 2.667 8.64 2.667 16S8.64 29.333 16 29.333 29.333 23.36 29.333 16 23.36 2.667 16 2.667zm0 24.05c-7.367 0-13.358-5.99-13.358-13.357S8.633 3.982 16 3.982c7.367 0 13.358 5.99 13.358 13.358s-5.99 13.377-13.358 13.377z"/>
        </svg>
      </div>
      <h3 className="text-xl font-semibold mb-2">Bitcoin SV (BSV21)</h3>
      <span className="bg-green-500 text-green-900 text-xs font-semibold px-3 py-1 rounded-full mb-3">Live</span>
      <p className="text-gray-400 text-sm text-center mb-4">
        Currently active and tradable as a BSV21 standard token.
      </p>
      <a 
        href="#" // Replace with actual 1Sat Market link
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-auto w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Trade on 1Sat Market
      </a>
    </div>
  );
};

export default BitcoinSvCard; 