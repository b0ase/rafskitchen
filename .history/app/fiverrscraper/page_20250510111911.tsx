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

export default function FiverrScraperPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentPath, setCurrentPath] = useState<Category[]>([]); // Breadcrumbs
  const [displayedItems, setDisplayedItems] = useState<ScrapedItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchInitialCategories = async () => {
    setIsLoading(true);
    setDisplayedItems([]);
    setError(null);
    setCurrentPath([]); // Reset path for initial load

    try {
      // SIMULATED API CALL FOR INITIAL CATEGORIES
      await new Promise(resolve => setTimeout(resolve, 1000));
      setDisplayedItems([
        { id: 'graphics-design', title: 'Graphics & Design', type: 'category', hasSubcategories: true, url: '/api/scrape-fiverr?category=graphics-design' },
        { id: 'digital-marketing', title: 'Digital Marketing', type: 'category', hasSubcategories: true, url: '/api/scrape-fiverr?category=digital-marketing' },
        { id: 'writing-translation', title: 'Writing & Translation', type: 'category', hasSubcategories: true, url: '/api/scrape-fiverr?category=writing-translation' },
        { id: 'video-animation', title: 'Video & Animation', type: 'category', hasSubcategories: true, url: '/api/scrape-fiverr?category=video-animation' },
        { id: 'music-audio', title: 'Music & Audio', type: 'category', hasSubcategories: true, url: '/api/scrape-fiverr?category=music-audio' },
        { id: 'programming-tech', title: 'Programming & Tech', type: 'category', hasSubcategories: true, url: '/api/scrape-fiverr?category=programming-tech' },
        { id: 'business', title: 'Business', type: 'category', hasSubcategories: true, url: '/api/scrape-fiverr?category=business' },
        { id: 'lifestyle', title: 'Lifestyle', type: 'category', hasSubcategories: true, url: '/api/scrape-fiverr?category=lifestyle' },
        { id: 'data', title: 'Data', type: 'category', hasSubcategories: true, url: '/api/scrape-fiverr?category=data' },
        { id: 'photography', title: 'Photography', type: 'category', hasSubcategories: true, url: '/api/scrape-fiverr?category=photography' },
        { id: 'ai-services', title: 'AI Services', type: 'category', hasSubcategories: true, url: '/api/scrape-fiverr?category=ai-services' },
      ]);
      // END SIMULATION
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred while fetching categories.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleItemClick = async (item: ScrapedItem) => {
    if (item.type !== 'category' || !item.hasSubcategories) {
      // If it's a gig or profile, or a category with no subs, display its details
      // For now, just log or show a message
      console.log("Displaying details for:", item.title);
      // Potentially set this item to a "selectedItemDetail" state to show in a modal or separate view
      alert(`Selected: ${item.title} (Further drill-down or detail view TBD)`);
      return;
    }

    setIsLoading(true);
    setDisplayedItems([]);
    setError(null);
    
    // Update breadcrumb path
    // This logic needs refinement for proper breadcrumb trail
    const newPath = [...currentPath, {id: item.id, name: item.title, hasSubcategories: true}];
    setCurrentPath(newPath);


    try {
      // SIMULATED API CALL FOR SUB-CATEGORIES OR ITEMS
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Example: If "Programming & Tech" was clicked
      if (item.id === 'programming-tech') {
        setDisplayedItems([
          { id: 'wordpress', title: 'WordPress', type: 'category', hasSubcategories: true, parentId: 'programming-tech' },
          { id: 'website-builders-cms', title: 'Website Builders & CMS', type: 'category', hasSubcategories: true, parentId: 'programming-tech' },
          { id: 'game-development', title: 'Game Development', type: 'category', hasSubcategories: true, parentId: 'programming-tech' },
          { id: 'web-programming', title: 'Web Programming', type: 'category', hasSubcategories: true, parentId: 'programming-tech' },
          { id: 'ecommerce-development', title: 'E-commerce Development', type: 'category', hasSubcategories: true, parentId: 'programming-tech' },
          { id: 'mobile-apps', title: 'Mobile Apps', type: 'category', hasSubcategories: false, parentId: 'programming-tech' }, // Example of no further subs
        ]);
      } else {
        // Generic placeholder for other categories
         setDisplayedItems([
          { id: `${item.id}-sub1`, title: `${item.title} - Sub Category 1`, type: 'category', hasSubcategories: false, parentId: item.id },
          { id: `${item.id}-sub2`, title: `${item.title} - Sub Item (Gig Example)`, type: 'gig', parentId: item.id, mockPrice: "$75" },
        ]);
      }
      // END SIMULATION
    } catch (err: any) {
      setError(err.message || `An error occurred while fetching details for ${item.title}.`);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch initial categories on component mount
  useEffect(() => {
    fetchInitialCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 text-white">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/gigs" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
          <span>←</span> Back to Gigs Hub
        </Link>
        {currentPath.length > 0 && (
            <button 
                onClick={fetchInitialCategories} // Resets to top-level categories
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
          <span onClick={fetchInitialCategories} className="cursor-pointer hover:text-blue-400">Fiverr</span>
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
                onClick={() => handleItemClick(item)}
                className="p-4 bg-gray-700 hover:bg-gray-600 rounded-md cursor-pointer transition-colors duration-150 ease-in-out flex justify-between items-center"
              >
                <div>
                  <span className={`font-semibold ${item.type === 'category' ? 'text-blue-400' : 'text-green-400'}`}>
                    {item.title}
                  </span>
                  <span className="text-xs text-gray-500 ml-2">({item.type})</span>
                </div>
                {item.hasSubcategories && <span className="text-gray-400 text-sm">→</span>}
              </li>
            ))}
          </ul>
        )}
         {!isLoading && currentPath.length === 0 && (
             <button
                onClick={fetchInitialCategories}
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