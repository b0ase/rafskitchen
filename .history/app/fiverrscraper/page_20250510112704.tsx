"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  url?: string; // URL to fetch sub-categories or gigs
  hasSubcategories?: boolean;
}

interface ScrapedItem {
  id: string;
  title: string;
  type: 'category' | 'gig' | 'profile';
  url?: string;
  [key: string]: any; // For other properties
}

const BASE_FIVERR_URL = "https://www.fiverr.com"; // Define base URL for clarity

// Manually defined top-level categories with their actual Fiverr URLs
const staticTopLevelCategories: ScrapedItem[] = [
  { id: 'graphics-design', title: 'Graphics & Design', type: 'category', hasSubcategories: true, url: `${BASE_FIVERR_URL}/categories/graphics-design` },
  { id: 'digital-marketing', title: 'Digital Marketing', type: 'category', hasSubcategories: true, url: `${BASE_FIVERR_URL}/categories/digital-marketing` },
  { id: 'writing-translation', title: 'Writing & Translation', type: 'category', hasSubcategories: true, url: `${BASE_FIVERR_URL}/categories/writing-translation` },
  { id: 'video-animation', title: 'Video & Animation', type: 'category', hasSubcategories: true, url: `${BASE_FIVERR_URL}/categories/video-animation` },
  { id: 'music-audio', title: 'Music & Audio', type: 'category', hasSubcategories: true, url: `${BASE_FIVERR_URL}/categories/music-audio` },
  { id: 'programming-tech', title: 'Programming & Tech', type: 'category', hasSubcategories: true, url: `${BASE_FIVERR_URL}/categories/programming-tech` },
  { id: 'business', title: 'Business', type: 'category', hasSubcategories: true, url: `${BASE_FIVERR_URL}/categories/business` },
  { id: 'lifestyle', title: 'Lifestyle', type: 'category', hasSubcategories: true, url: `${BASE_FIVERR_URL}/categories/lifestyle` },
  { id: 'data', title: 'Data', type: 'category', hasSubcategories: true, url: `${BASE_FIVERR_URL}/categories/data` },
  { id: 'photography', title: 'Photography', type: 'category', hasSubcategories: true, url: `${BASE_FIVERR_URL}/categories/photography` },
  { id: 'ai-services', title: 'AI Services', type: 'category', hasSubcategories: true, url: `${BASE_FIVERR_URL}/categories/ai-services` }, // Assuming this category exists or has a direct page
];

export default function FiverrScraperPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState<Category[]>([]); // Breadcrumbs
  const [displayedItems, setDisplayedItems] = useState<ScrapedItem[]>(staticTopLevelCategories); // Initialize with static categories
  const [error, setError] = useState<string | null>(null);

  const loadInitialCategories = () => {
    setIsLoading(false); // Not really loading from API anymore
    setDisplayedItems(staticTopLevelCategories);
    setError(null);
    setCurrentPath([]); 
  };

  // useEffect will call loadInitialCategories on mount to set the static list
  useEffect(() => {
    loadInitialCategories();
  }, []);

  const handleItemClick = async (item: ScrapedItem) => {
    if (!item.url || item.type !== 'category' || !item.hasSubcategories) {
      console.log("Displaying details for (or end of line):", item.title, item.url);
      alert(`Selected: ${item.title}\nURL: ${item.url || 'N/A'}\n(Further drill-down or detail view TBD)`);
      return;
    }

    setIsLoading(true);
    setDisplayedItems([]); // Clear previous items before loading new ones
    setError(null);
    
    const newPath = [...currentPath, {id: item.id, name: item.title, hasSubcategories: true, url: item.url}];
    setCurrentPath(newPath);

    try {
      // ACTUAL API CALL to the backend to scrape item.url
      const response = await fetch('/api/scrape-fiverr', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ targetUrl: item.url }), // Pass the actual Fiverr category URL
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorData.details || 'Failed to scrape data from backend');
      }

      const data = await response.json();
      if (data.error) { // Handle errors returned successfully from the API route (e.g. Python script error)
          throw new Error(data.details || data.error);
      }
      setDisplayedItems(data); // data should be ScrapedItem[] from our Python script

    } catch (err: any) {
      setError(err.message || `An error occurred while fetching details for ${item.title}.`);
      // displayedItems will be empty, might want to show a message or revert path
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
        {currentPath.length > 0 && (
            <button 
                onClick={loadInitialCategories} // Resets to top-level categories
                className="text-sm text-blue-400 hover:text-blue-300"
            >
                Back to Main Categories
            </button>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-2">Fiverr Category Explorer</h1>
      <p className="text-gray-400 mb-6">
        Browse Fiverr categories to research trends, popular services, and gig structures.
      </p>
      
      {/* Breadcrumbs */}
      {currentPath.length > 0 && (
        <div className="mb-4 text-sm text-gray-400">
          <span onClick={loadInitialCategories} className="cursor-pointer hover:text-blue-400">Fiverr</span>
          {currentPath.map((p, index) => (
            <span key={p.id}>
              {' > '}
              {/* Basic breadcrumb, needs more advanced handling if deep linking/navigation is required */}
              {p.name} 
            </span>
          ))}
        </div>
      )}

      <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
        {isLoading && <p className="text-center py-4">Loading items...</p>}
        
        {!isLoading && error && (
          <div className="my-4 p-3 bg-red-800 border border-red-700 text-red-200 rounded-md">
            <p><span className="font-semibold\">Error:</span> {error}</p>
          </div>
        )}

        {!isLoading && !error && displayedItems.length === 0 && (
          <p className="text-center py-4">No items to display. Try fetching categories.</p>
        )}

        {!isLoading && !error && displayedItems.length > 0 && (
          <ul className="space-y-3">
            {displayedItems.map((item) => (
              <li 
                key={item.id}
                className="p-4 bg-gray-700 rounded-md flex justify-between items-center hover:bg-gray-600 transition-colors duration-150 ease-in-out"
              >
                <div>
                  <span className={`font-semibold ${item.type === 'category' ? 'text-blue-400' : 'text-green-400'}`}>
                    {item.title}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">({item.type})</span>
                </div>
                <div>
                  {(item.type === 'category' && item.hasSubcategories) && (
                    <button 
                      onClick={() => handleItemClick(item)}
                      className="text-sm text-blue-300 hover:text-blue-200 font-medium py-1 px-3 rounded-md bg-blue-600 hover:bg-blue-500 transition-colors"
                    >
                      Explore →
                    </button>
                  )}
                  {(item.type !== 'category' || !item.hasSubcategories) && (
                    <button 
                      onClick={() => handleItemClick(item)}
                      className="text-sm text-green-300 hover:text-green-200 font-medium py-1 px-3 rounded-md bg-green-600 hover:bg-green-500 transition-colors"
                    >
                      View Details
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
         {!isLoading && currentPath.length === 0 && (
             <button
                onClick={loadInitialCategories}
                disabled={isLoading}
                className="mt-6 w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md disabled:opacity-50 transition-colors duration-150 ease-in-out"
            >
                {isLoading ? 'Loading...' : 'Load/Refresh Categories'}
            </button>
         )}
      </div>

      <div className="mt-8 p-4 bg-gray-850 border border-gray-700 rounded-lg">
        <h3 className="text-lg font-semibold mb-2 text-teal-400">How to Use This Data:</h3>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-400">
          <li>**Explore Categories:** Click on categories to (eventually) drill down into sub-categories or see example gigs.</li>
          <li>**Research:** Identify popular niches, understand how Fiverr structures its marketplace.</li>
          <li>**Strategy:** Find areas of opportunity or high competition to inform your gig offerings.</li>
          <li>**Action Plan:** Observe how successful gigs are titled and structured within these categories.</li>
          <li>Copy relevant findings into your notes on the <Link href="/gigs/research" className="text-blue-400 hover:underline">Research Page</Link>.</li>
        </ul>
      </div>
    </div>
  );
} 