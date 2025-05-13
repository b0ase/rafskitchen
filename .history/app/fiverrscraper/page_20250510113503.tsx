"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Keep ScrapedItem for the expected structure of individual gig data
interface ScrapedItem {
  id?: string; // Gig ID if available
  title?: string;
  description?: string;
  seller_name?: string;
  seller_url?: string;
  price?: string; // Or a more complex price object
  rating?: number;
  reviews_count?: number;
  url?: string; // The scraped URL
  // Potentially add fields for packages (basic, standard, premium), extras, images, etc.
  [key: string]: any; 
}

export default function FiverrScraperPage() {
  const [fiverrGigUrl, setFiverrGigUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scrapedData, setScrapedData] = useState<ScrapedItem | null>(null);
  const [error, setError] = useState<string | null>(null);

  // No longer loading categories automatically, so useEffect can be removed or repurposed
  // useEffect(() => { /* ... */ }, []);

  const handleScrapeGig = async () => {
    if (!fiverrGigUrl) {
      setError('Please enter a Fiverr Gig URL.');
      return;
    }
    if (!fiverrGigUrl.includes('fiverr.com/')) { // Basic validation
        setError('Please enter a valid Fiverr.com URL.');
        return;
    }

    setIsLoading(true);
    setScrapedData(null);
    setError(null);

    try {
      const response = await fetch('/api/scrape-fiverr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // The Python script now expects '--url' for the specific gig URL
        body: JSON.stringify({ targetUrl: fiverrGigUrl }), 
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.details || 'Failed to scrape data from backend');
      }

      const data = await response.json();
      if (data.error) {
          throw new Error(data.details || data.error);
      }
      // The Python script (scrape_specific_url) should return a single object for the gig details
      // or an array with one item. We'll assume a single object or first item of an array.
      const gigData = Array.isArray(data) ? data[0] : data;
      setScrapedData({ ...gigData, url: fiverrGigUrl }); 

    } catch (err: any) {
      setError(err.message || `An error occurred while fetching data for ${fiverrGigUrl}.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/gigs" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
          <span>←</span> Back to Gigs Hub
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-2">Fiverr Gig Scraper & B0ASE Ad Crafter</h1>
      <p className="text-gray-400 mb-6">
        Enter a specific Fiverr gig URL to scrape its details and use them as inspiration for your B0ASE offerings.
      </p>
      
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-semibold mb-3 text-sky-400">Scrape Gig Details</h2>
        <div className="mb-4">
          <label htmlFor="fiverrGigUrl" className="block text-sm font-medium text-gray-300 mb-1">
            Fiverr Gig URL:
          </label>
          <input
            type="url"
            id="fiverrGigUrl"
            name="fiverrGigUrl"
            value={fiverrGigUrl}
            onChange={(e) => setFiverrGigUrl(e.target.value)}
            placeholder="e.g., https://www.fiverr.com/seller_username/gig-slug"
            className="w-full p-2.5 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          onClick={handleScrapeGig}
          disabled={isLoading}
          className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md disabled:opacity-50 transition-colors duration-150 ease-in-out"
        >
          {isLoading ? 'Scraping Gig...' : 'Scrape Fiverr Gig'}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-800 border border-red-700 text-red-200 rounded-md">
            <p><span className="font-semibold">Error:</span> {error}</p>
          </div>
        )}
      </div>

      {scrapedData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Display Scraped Fiverr Ad Data */} 
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3 text-green-400">Scraped Fiverr Gig Data:</h2>
            <pre className="bg-gray-900 p-4 rounded-md text-sm text-gray-300 overflow-x-auto h-96">
              {JSON.stringify(scrapedData, null, 2)}
            </pre>
          </div>

          {/* B0ASE Ad Crafter Area */} 
          <div className="bg-gray-850 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-3 text-teal-400">Craft Your B0ASE Offering:</h2>
            <p className="text-sm text-gray-400 mb-2">
              Use the scraped data from <a href={scrapedData.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">this Fiverr gig</a> as inspiration.
            </p>
            {/* Placeholder for B0ASE ad crafting form/template */}
            <textarea 
                className="w-full h-80 p-3 bg-gray-700 border border-gray-600 rounded text-sm text-white placeholder-gray-500 focus:ring-teal-500 focus:border-teal-500"
                placeholder={`Inspired by: ${scrapedData.title || 'Selected Gig'}\n\nB0ASE Service Title:\n\nDescription:\n\nKey Features/USPs (aligned with B0ASE strategy):\n- Modern Technology Focus\n- High-Quality Code & Design\n- Full-Stack Capability (if applicable)\n- Etc.\n\nPricing Tiers (B0ASE Model):\nBasic: \nStandard: \nPremium: \n\nExtras:`}
            />
            <button className="mt-4 w-full px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-md">
                Save B0ASE Offering (Not Implemented)
            </button>
          </div>
        </div>
      )}

      {/* Instructions or further actions can be added here */}
    </div>
  );
} 