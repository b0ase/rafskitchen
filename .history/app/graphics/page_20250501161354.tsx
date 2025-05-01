'use client';

import React, { useState } from 'react';
import Header from '../../components/Header'; // Adjust path if needed
import Footer from '../../components/Footer'; // Adjust path if needed

type TabName = 'photography' | 'graphics' | 'logos';

export default function GraphicsPage() {
  const [activeTab, setActiveTab] = useState<TabName>('graphics');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'photography':
        return (
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Photography Services</h3>
            <p className="text-gray-700">
              High-quality photography solutions for events, products, portraits, and more. We capture the moments that matter. 
              (Placeholder content)
            </p>
            {/* Add more specific content/examples here */}
          </div>
        );
      case 'graphics':
        return (
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">General Graphic Design</h3>
            <p className="text-gray-700">
              Comprehensive graphic design services including branding assets, marketing materials, web graphics, illustrations, and custom visual solutions.
              (Placeholder content)
            </p>
            {/* Add more specific content/examples here */}
          </div>
        );
      case 'logos':
        return (
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Logo Design & Branding</h3>
            <p className="text-gray-700">
              Crafting unique and memorable logos and visual identities that represent your brand effectively. From initial concept to final assets.
              (Placeholder content)
            </p>
            {/* Add more specific content/examples here */}
          </div>
        );
      default:
        return null;
    }
  };

  const getTabClassName = (tabName: TabName) => {
    return `py-2 px-4 rounded-t-md cursor-pointer transition-colors duration-200 ${
      activeTab === tabName 
        ? 'bg-white text-gray-900 shadow-md' 
        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
    }`;
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-4xl font-bold text-white mb-8">Graphics Solutions</h1>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-700 mb-6">
          <button 
            onClick={() => setActiveTab('graphics')}
            className={getTabClassName('graphics')}
          >
            Graphics
          </button>
          <button 
            onClick={() => setActiveTab('logos')}
            className={getTabClassName('logos')}
          >
            Logos
          </button>
          <button 
            onClick={() => setActiveTab('photography')}
            className={getTabClassName('photography')}
          >
            Photography
          </button>
        </div>

        {/* Tab Content Area - Light Background */}
        <div className="bg-white p-6 md:p-8 shadow-lg border border-gray-300">
          {renderTabContent()}
        </div>
        
      </main>
      <Footer />
    </div>
  );
} 