'use client';

import Link from 'next/link';

export default function SubNavigation() {
  // Define links for the secondary navigation (page sections)
  const subNavLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'Development', href: '#development' },
    { name: 'Contact', href: '#contact' },
  ];

  // TODO: Add active link highlighting based on scroll position later if desired

  return (
    // Lighter background than main header
    <nav className="w-full bg-gray-900 shadow-sm py-2 border-b border-gray-700 sticky top-0 z-40"> 
      {/* Container ensures alignment with main content */}
      <div className="container mx-auto px-4">
        {/* Simple flex layout for links */}
        <ul className="flex space-x-4 md:space-x-6 overflow-x-auto whitespace-nowrap">
          {subNavLinks.map((link) => (
            <li key={link.name}>
              <Link 
                href={link.href} 
                className="text-gray-400 hover:text-white transition-colors duration-200 text-sm py-1"
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
} 