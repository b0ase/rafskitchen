'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPlusSquare, FaUsers, FaProjectDiagram, FaUserPlus, FaBriefcase, FaChevronDown, FaChevronUp, FaRocket } from 'react-icons/fa';

const navLinks = [
  { href: '/projects/new', label: 'Start a New Project', icon: FaPlusSquare },
  { href: '/teams/new', label: 'Start a New Team', icon: FaUsers },
  { href: '/projects/join', label: 'Join a Project', icon: FaProjectDiagram },
  { href: '/teams/join', label: 'Join a Team', icon: FaUserPlus },
  { href: '/careers', label: 'Careers', icon: FaBriefcase },
];

const welcomeTitle = "Ready to build something amazing?";
const welcomeSubtitle = "Welcome to b0ase.com! This is your hub to bring your digital ideas to life. Start a new project to define your vision, outline features, and begin collaborating with our team. Whether it's a website, a mobile app, an AI solution, or something entirely new, we're here to help you build it.";

interface AppSubNavbarProps {
  initialIsExpanded: boolean;
  onCollapse: () => void;
}

export default function AppSubNavbar({ initialIsExpanded, onCollapse }: AppSubNavbarProps) {
  const pathname = usePathname() ?? '';
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);

  useEffect(() => {
    setIsExpanded(initialIsExpanded);
  }, [initialIsExpanded]);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (!newState) { // If collapsing
      onCollapse();
    }
  };

  return (
    <div className={`bg-gray-900 text-gray-300 shadow-md sticky top-28 z-30 transition-all duration-300 ease-in-out`}>
      <div className="container mx-auto px-4">
        {isExpanded && (
          <div className="py-6 text-center border-b border-gray-800">
            <FaRocket className="w-12 h-12 mx-auto mb-4 text-sky-500 opacity-75" />
            <h2 className="text-2xl font-bold text-white mb-2">{welcomeTitle}</h2>
            <p className="text-md text-gray-400 mb-6 max-w-3xl mx-auto">{welcomeSubtitle}</p>
          </div>
        )}
        
        <div className={`flex items-center justify-between py-3 ${isExpanded ? '' : 'border-t border-gray-800'}`}>
          <div className={`flex items-center space-x-2 sm:space-x-3 md:space-x-4 overflow-x-auto whitespace-nowrap flex-grow`}>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-2 py-1.5 md:px-3 md:py-2 rounded-md text-xs sm:text-sm font-medium flex items-center transition-colors duration-150 ease-in-out 
                    ${isActive
                      ? 'bg-sky-600 text-white' 
                      : 'bg-gray-800 hover:bg-gray-700 hover:text-white'
                    }`}
                >
                  <link.icon className={`mr-1 sm:mr-1.5 h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-300'}`} />
                  {link.label}
                </Link>
              );
            })}
          </div>
          <button 
            onClick={handleToggle} 
            className="ml-4 p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 flex-shrink-0"
            aria-label={isExpanded ? "Collapse navbar" : "Expand navbar"}
          >
            {isExpanded ? <FaChevronUp className="h-5 w-5 text-gray-400" /> : <FaChevronDown className="h-5 w-5 text-gray-400" />}
          </button>
        </div>
      </div>
    </div>
  );
} 