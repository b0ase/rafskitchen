'use client';

import React from 'react';
import Link from 'next/link';

const sections = [
  { name: 'Website Design', href: '/services/web-development' },
  { name: 'Software Development', href: '/services/software-development' },
  { name: 'Content', href: '/services/content-copywriting' },
  { name: 'Video', href: '/services/video-production' },
  { name: 'Branding', href: '/services/logo-branding' },
  { name: 'SEO', href: '/services/seo-marketing' },
  { name: 'Social', href: '/services/social-media-management' },
  { name: 'Consulting', href: '/services/technical-consulting' },
  { name: 'Support', href: '/services/support-maintenance' },
];

export default function SubNavigation() {
  return (
    // Hidden on mobile (e.g., hidden md:flex), shown on desktop
    // Adjust sticky top value based on Header height
    <nav className="hidden md:flex sticky top-[60px] z-30 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 shadow-sm px-4">
      <div className="container flex justify-start items-center h-12 space-x-6">
        {sections.map((section) => (
          <Link 
            key={section.name}
            href={section.href}
            className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          >
            {section.name}
          </Link>
        ))}
      </div>
    </nav>
  );
} 