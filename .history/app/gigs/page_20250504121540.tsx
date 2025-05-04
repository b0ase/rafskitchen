"use client";
import { useState } from 'react';

// Assuming a hypothetical function signature for the web search tool
// In a real scenario, this would be provided by the environment/API
declare function webSearchTool(searchTerm: string): Promise<{ snippets: string[], summary?: string }>;

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
  const [researchResult, setResearchResult] = useState<string | null>(null); 
  const [isSearching, setIsSearching] = useState(false); // Loading state
  const [searchError, setSearchError] = useState<string | null>(null); // Error state

  const handleResearchClick = async (question: string) => {
    setCurrentResearchQuery(question);
    setResearchResult(null); // Clear previous results
    setSearchError(null); // Clear previous errors
    setIsSearching(true);

    try {
      // In a real scenario, this is where the actual tool call happens
      // For now, we simulate the call and insert specific results for handled questions
      console.log(`Attempting to research: "${question}"`);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate short delay

      let formattedResult = `Placeholder results for: "${question}"\n- We need to run the search for this question.`;

      // --- Populate results based on the question --- 
      if (question === "What are common pricing tiers for logo design on Fiverr?") {
        formattedResult = `
**Common Pricing Tiers for Logo Design on Fiverr:**

*   **Wide Range:** Prices vary significantly, from basic $5-$50 gigs up to $500+ for premium packages.
*   **Basic Tier ($5 - $50):** Often 1 simple concept, few/no revisions, basic file types (JPG/PNG). Quality/originality concerns at the very low end ($5-$25) are noted in external articles.
*   **Standard Tier ($50 - $150):** Typically includes multiple concepts, some revisions, vector files (SVG/EPS), and potentially source files (AI/PSD).
*   **Premium Tier ($150 - $500+):** Offers multiple high-quality concepts, more revisions, full file packages (vector, source, transparent), and may include extras like social media kits or basic brand guidelines.
*   **Context:** Prices depend heavily on designer experience, portfolio, number of concepts/revisions, included deliverables, and turnaround time.

*Source: Synthesized from web search results, including neladunato.com.*`;
      } else if (question === "What are the most popular web development gig categories on Fiverr in 2024?") {
        formattedResult = `
**Popular Web Development Gig Categories on Fiverr (2024):**

*   **General Website Development:** Remains a core high-demand category (listed #4 in recent trends).
*   **E-commerce Development:** Very popular, especially Shopify-related services (Shopify Marketing was #1 trend, implying dev need).
*   **AI Integration:** AI services are trending (#9), suggesting demand for incorporating AI into web platforms.
*   **Related Areas:** Strong demand in Search Engine Marketing and Etsy Store setups often involves web skills.

*Source: Synthesized from web search results, including affiliates.fiverr.com.*`;
      }
      // TODO: Add specific result handling for other questions here
      // else if (question === "...") { formattedResult = `...`; }
      // ---

      setResearchResult(formattedResult || "No relevant information found.");

    } catch (error) {
      console.error("Search failed:", error);
      setSearchError(error instanceof Error ? error.message : "An unknown error occurred during the search.");
      setResearchResult(null);
    } finally {
      setIsSearching(false);
    }
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
                    disabled={isSearching} // Disable buttons while searching
                    className={`px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            {(currentResearchQuery || isSearching || searchError) && (
              <div className="mb-6 p-4 bg-gray-850 border border-gray-700 rounded">
                {currentResearchQuery && !isSearching && (
                  <>
                    <p className="text-sm text-gray-400 mb-2">Showing results for:</p>
                    <p className="font-medium mb-3">{currentResearchQuery}</p>
                  </>
                )}
                {isSearching && (
                  <div className="flex items-center justify-center text-gray-400">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Searching for: "{currentResearchQuery}"...
                  </div>
                )}
                {searchError && (
                  <p className="text-red-400">Error: {searchError}</p>
                )}
                {!isSearching && researchResult && (
                  <div className="text-sm text-gray-300 whitespace-pre-wrap">
                    {researchResult}
                  </div>
                )}
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