"use client";
import { useState } from 'react';

const researchQuestions = [
  "What are the most popular web development gig categories on Fiverr in 2024?",
  "What are common pricing tiers for logo design on Fiverr?",
  "What are current trends in AI-related freelance services on Fiverr?",
  "Which design service gigs (UI/UX, Brand Design) have high demand on Fiverr?",
  "What are top-rated Fiverr sellers offering in SaaS platform development?",
  "What keywords are buyers using to find marketing & SEO gigs on Fiverr?",
  "What \"extras\" or upsells are common for website development gigs on Fiverr?",
  "Are there gaps in the market for blockchain/Web3 services on Fiverr?",
  "What is the typical delivery time for mobile app development gigs on Fiverr?",
  "How do successful Fiverr sellers structure their gig descriptions and images?"
];

export default function GigsPage() {
  const [activeTab, setActiveTab] = useState<'research' | 'strategy' | 'action'>('research');
  const [researchNotes, setResearchNotes] = useState('');
  const [currentResearchQuery, setCurrentResearchQuery] = useState<string | null>(null);
  const [researchResult, setResearchResult] = useState<string | null>(null); // To hold search results later

  const handleResearchClick = (question: string) => {
    setCurrentResearchQuery(question);
    setResearchResult(`Simulating search for: "${question}"`); // Placeholder action
    // TODO: Integrate actual web search tool call here
    console.log(`Research button clicked: ${question}`);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'research':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-4">Fiverr & Market Research</h3>
            <p className="text-gray-400 mb-2">Use the buttons below to research common questions or paste findings into the text area.</p>
            
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-3">Quick Research Questions:</h4>
              <div className="flex flex-wrap gap-2">
                {researchQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleResearchClick(q)}
                    className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md text-sm transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {currentResearchQuery && (
              <div className="mb-6 p-4 bg-gray-850 border border-gray-700 rounded">
                <p className="text-sm text-gray-400 mb-2">Showing results for:</p>
                <p className="font-medium mb-3">{currentResearchQuery}</p>
                <div className="text-sm text-gray-300">
                  {/* Placeholder for actual search results */} 
                  {researchResult ? <p>{researchResult}</p> : <p>Click a question above to search.</p>}
                </div>
              </div>
            )}

            <h4 className="text-lg font-medium mb-3">Manual Research Notes:</h4>
            <textarea 
              className="w-full h-60 p-3 bg-gray-800 border border-gray-700 rounded text-sm"
              placeholder="Paste research findings, competitor links, keyword ideas, etc. here..."
              value={researchNotes}
              onChange={(e) => setResearchNotes(e.target.value)}
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