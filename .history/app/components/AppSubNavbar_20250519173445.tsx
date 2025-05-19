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
    <div className="bg-gray-900 text-gray-300 shadow-md sticky top-28 z-30 h-16 flex items-center">
      <div className="container mx-auto px-4 flex justify-start items-center space-x-6 overflow-x-auto whitespace-nowrap">
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
  );
} 