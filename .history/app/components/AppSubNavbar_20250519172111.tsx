'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPlusSquare, FaUsers, FaProjectDiagram, FaUserPlus, FaBriefcase } from 'react-icons/fa';

const navLinks = [
  { href: '/projects/new', label: 'Start a New Project', icon: FaPlusSquare },
  { href: '/teams/new', label: 'Start a New Team', icon: FaUsers },
  { href: '/projects/join', label: 'Join a Project', icon: FaProjectDiagram },
  { href: '/teams/join', label: 'Join a Team', icon: FaUserPlus },
  { href: '/careers', label: 'Careers', icon: FaBriefcase },
];

export default function AppSubNavbar() {
  const pathname = usePathname() ?? '';

  return (
    <nav className="bg-gray-900 border-b border-gray-700 shadow-md sticky top-24 z-30"> {/* Adjusted top to top-24 (96px), reduced z-index */}
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-12 md:h-14">
          <div className="flex items-center space-x-3 md:space-x-5">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-2 py-1 md:px-3 md:py-2 rounded-md text-sm font-medium flex items-center transition-colors duration-150 ease-in-out 
                    ${isActive
                      ? 'bg-sky-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                  <link.icon className={`mr-1.5 md:mr-2 h-4 w-4 md:h-5 md:w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
} 