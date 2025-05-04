"use client";
import React from 'react'; // Adding explicit import just in case
import { useState } from 'react'; // Keep useState for potential future use

export default function StrategyPage() {
  // Placeholder for potential future state
  const [strategyNotes, setStrategyNotes] = useState('');

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gigs - Strategy</h1>
      
      <div>
        <h3 className="text-xl font-semibold mb-4">Gig Strategy & USPs</h3>
        <p className="text-gray-400 mb-2">Define our specific gig offerings and what makes them unique.</p>
        {/* Placeholder for strategy content */}
        <textarea 
          className="w-full h-96 p-3 bg-gray-800 border border-gray-700 rounded text-sm" 
          placeholder="Outline gig offerings (e.g., Shopify Setup - Basic/Standard/Premium), pricing tiers, unique selling points (e.g., focus on speed, AI integration, design quality), target audience per gig..."
          value={strategyNotes}
          onChange={(e) => setStrategyNotes(e.target.value)}
        />
      </div>
    </div>
  );
} 