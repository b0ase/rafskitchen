"use client";
import { useState } from 'react';

export default function GigsPage() {
  const [activeTab, setActiveTab] = useState<'research' | 'strategy' | 'action'>('research');

  const renderContent = () => {
    switch (activeTab) {
      case 'research':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Fiverr & Market Research</h3>
            <p className="text-gray-400 mb-2">Notes on popular gigs, competitor analysis, keywords, and market trends.</p>
            {/* Placeholder for research content */}
            <textarea 
              className="w-full h-60 p-3 bg-gray-800 border border-gray-700 rounded text-sm" 
              placeholder="Paste research findings here..."
            />
          </div>
        );
      case 'strategy':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Gig Strategy & USPs</h3>
            <p className="text-gray-400 mb-2">Define our specific gig offerings and what makes them unique.</p>
            {/* Placeholder for strategy content */}
            <textarea 
              className="w-full h-60 p-3 bg-gray-800 border border-gray-700 rounded text-sm" 
              placeholder="Outline gig offerings, pricing tiers, and unique selling points..."
            />
          </div>
        );
      case 'action':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Action Plan per Gig</h3>
            <p className="text-gray-400 mb-2">Detailed steps required to launch each gig on Fiverr.</p>
            {/* Placeholder for action plans - designed for multiple gigs */}
            <div className="space-y-6">
              {/* Example Gig 1 */}
              <div>
                <h4 className="text-lg font-medium mb-2">Gig Idea 1: [e.g., Basic Website Setup]</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Step 1: Write title & description</li>
                  <li>Step 2: Create gig image/video</li>
                  <li>Step 3: Define pricing packages</li>
                  <li>Step 4: Set up requirements</li>
                  <li>Step 5: Publish on Fiverr</li>
                </ul>
              </div>
              {/* Example Gig 2 */}
              <div>
                <h4 className="text-lg font-medium mb-2">Gig Idea 2: [e.g., Logo Design]</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-300">
                  <li>Step 1: ...</li>
                  <li>Step 2: ...</li>
                  {/* Add more steps as needed */}
                </ul>
              </div>
              {/* Add more gig sections as needed */}
              <button className="text-sm text-blue-400 hover:text-blue-300">+ Add Another Gig Plan</button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">B0ASE Gigs</h1>

      <div className="border-b border-gray-700 mb-6">
        <nav className="-mb-px flex space-x-6" aria-label="Tabs">
          <button
            onClick={() => setActiveTab('research')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'research'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
            }`}
          >
            Research
          </button>
          <button
            onClick={() => setActiveTab('strategy')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'strategy'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
            }`}
          >
            Strategy
          </button>
          <button
            onClick={() => setActiveTab('action')}
            className={`whitespace-nowrap py-3 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'action'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-500'
            }`}
          >
            Action Plan
          </button>
        </nav>
      </div>

      <div>
        {renderContent()}
      </div>
    </div>
  );
} 