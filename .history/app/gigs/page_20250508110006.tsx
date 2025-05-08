"use client";
import React from 'react';
import Link from 'next/link';

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
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">B0ASE Gigs - Planning Hub</h1>

      <p className="text-lg text-gray-400 mb-8">Navigate to the different planning sections for offering services on Fiverr.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link href="/gigs/research" className="block p-6 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-blue-400">Research</h2>
          <p className="text-gray-400">Explore Fiverr trends, popular gigs, pricing, and keywords.</p>
        </Link>
        
        <Link href="/gigs/strategy" className="block p-6 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-purple-400">Strategy</h2>
          <p className="text-gray-400">Define specific gig offerings, unique selling points, and target audiences.</p>
        </Link>

        <Link href="/gigs/action" className="block p-6 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-green-400">Action Plan</h2>
          <p className="text-gray-400">Outline detailed steps to create and launch gigs for each platform/service.</p>
        </Link>

        <Link href="/gigs/platforms" className="block p-6 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors">
          <h2 className="text-xl font-semibold mb-2 text-orange-400">Platforms</h2>
          <p className="text-gray-400">Review key platforms, required expertise, and potential gig ideas.</p>
        </Link>

        <Link href="/gigs/learning-path" className="block p-6 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors border-teal-500/30">
          <h2 className="text-xl font-semibold mb-2 text-teal-400">Learning Path</h2>
          <p className="text-gray-400">Follow a structured 3-month schedule to master each platform in sequence.</p>
        </Link>

        <Link href="/gigs/work-path" className="block p-6 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors border-red-500/30">
          <h2 className="text-xl font-semibold mb-2 text-red-400">Work Path</h2>
          <p className="text-gray-400">Manage your daily workflow and balance client work with skill development.</p>
        </Link>
      </div>
    </div>
  );
} 