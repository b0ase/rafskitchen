'use client';

import React from 'react';
import Link from 'next/link';
import { portfolioData } from '@/lib/data'; // Use alias for consistency

// Assuming fiverr, upwork, freelancer links are in about.socials
const externalLinks = [
  { name: 'Fiverr', href: portfolioData.about.socials.fiverr },
  { name: 'Upwork', href: portfolioData.about.socials.upwork },
  { name: 'Freelancer', href: portfolioData.about.socials.freelancer },
];

export default function ExternalNavigation() {
  // Check if any links actually exist before rendering
  const validLinks = externalLinks.filter(link => link.href && link.href !== '#');
  if (validLinks.length === 0) {
    return null; // Don't render the bar if no valid links
  }

  return (
    // Hidden on mobile, shown on desktop
    // Adjust sticky top value based on Header + SubNavigation height
    <nav className="hidden md:flex sticky top-[108px] z-20 w-full bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-sm px-4">
      <div className="container mx-auto flex justify-center items-center h-10 space-x-6">
        {validLinks.map((link) => (
          <Link 
            key={link.name}
            href={link.href}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-xs font-medium text-gray-500 dark:text-gray-500 hover:text-black dark:hover:text-white transition-colors"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
} 