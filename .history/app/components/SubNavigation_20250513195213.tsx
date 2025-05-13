'use client';

import React from 'react';
import Link from 'next/link';

const sections = [
  { name: 'Website Design', href: '/#website-design' },
  { name: 'Software Development', href: '/#software-development' },
  { name: 'Content', href: '/#content' },
  { name: 'Video', href: '/#video' },
  { name: 'Branding', href: '/#branding' },
  { name: 'SEO', href: '/#seo' },
  { name: 'Social', href: '/#social' },
  { name: 'Consulting', href: '/#consulting' },
  { name: 'Support', href: '/#support' },
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