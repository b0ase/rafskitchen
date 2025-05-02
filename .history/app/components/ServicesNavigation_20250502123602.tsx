'use client';

import React from 'react';
import Link from 'next/link';
import { portfolioData } from '@/lib/data'; // Using alias path

// Mapping from service slug to short display name
const shortServiceTitles: { [key: string]: string } = {
  "web-development": "Web",
  "content-copywriting": "Content",
  "video-production": "Video",
  "logo-branding": "Branding",
  "photography": "Photo",
  "seo-marketing": "SEO",
  "social-media-management": "Social",
  "technical-consulting": "Consulting",
  "support-maintenance": "Support",
};

export default function ServicesNavigation() {
  const services = portfolioData.services;

  // Estimate header height (py-4 is likely around 68px-76px)
  const headerHeight = '72px'; // Adjust if needed after checking layout

  return (
    // Hidden on mobile, shown on desktop
    <nav 
      className="hidden md:flex sticky top-[60px] z-30 w-full bg-gray-100 dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-sm px-6"
    >
      <div className="flex justify-start items-center h-10 space-x-5">
        {services.map((service) => (
          <Link 
            key={service.slug}
            href={`/services/${service.slug}`}
            className="text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors whitespace-nowrap"
          >
            {/* Use short title from map, fallback to original title */}
            {shortServiceTitles[service.slug] || service.title}
          </Link>
        ))}
      </div>
    </nav>
  );
} 