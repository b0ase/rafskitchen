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
    <nav className="w-full bg-gray-900 shadow-sm py-2 border-b border-gray-700 sticky top-0 z-40">
      <div className="px-4">
        {/* Use flex justify-between to separate left (internal) and right (external) links */}
        <div className="flex justify-between items-center">
          {/* Left group: Internal section links */}
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

          {/* Right group: External platform links */}
          <ul className="flex space-x-4 md:space-x-5">
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors duration-200 text-sm py-1 flex items-center">
                Fiverr
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            </li>
             <li>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors duration-200 text-sm py-1 flex items-center">
                Upwork
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            </li>
             <li>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-blue-400 transition-colors duration-200 text-sm py-1 flex items-center">
                Freelancer
                 <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
} 