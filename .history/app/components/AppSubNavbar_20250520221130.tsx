'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPlusSquare, FaUsers, FaProjectDiagram, FaUserPlus, FaBriefcase, FaChevronDown, FaChevronUp, FaRocket, FaCubes, FaUserSecret } from 'react-icons/fa';

const navLinks = [
  { href: '/projects/new', label: 'Start a New Project', icon: FaPlusSquare },
  { href: '/teams/new', label: 'Start a New Team', icon: FaUsers },
  { href: '/projects/join', label: 'Join a Project', icon: FaProjectDiagram },
  { href: '/teams/join', label: 'Join a Team', icon: FaUserPlus },
  { href: '/careers', label: 'Careers', icon: FaBriefcase },
  { href: '/myagent', label: 'Create Agent', icon: FaUserSecret },
  { href: '/mytoken', label: 'Launch Token', icon: FaCubes },
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

  // Determine which links to display based on the expanded state
  const displayedLinks = isExpanded ? navLinks : navLinks.slice(0, 2);

  return (
    <div className={`bg-gradient-to-r from-black via-gray-900 to-gray-800 text-gray-300 shadow-lg sticky top-[calc(theme(spacing.16)_-_1px)] md:top-[calc(theme(spacing.28)_-_1px)] z-30 transition-all duration-300 ease-in-out border-b border-gray-700`}>
      <div className="container mx-auto px-2 sm:px-4">
        {isExpanded && (
          <div className="py-6 text-center border-b border-gray-700">
            <FaRocket className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-sky-400 opacity-90" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{welcomeTitle}</h2>
            <p className="text-sm sm:text-md text-gray-400 mb-6 max-w-xl sm:max-w-3xl mx-auto px-2">{welcomeSubtitle}</p>
          </div>
        )}
        
        <div className={`flex items-center justify-between py-2.5 sm:py-3 ${isExpanded ? '' : 'md:border-t-0'}`}> 
          <FaRocket className="h-5 w-5 sm:h-6 sm:w-6 text-sky-500 mr-2 sm:mr-3 flex-shrink-0 hidden sm:block" /> {/* Hide rocket on very small screens in collapsed state for space */}
          
          {/* Links Container */}
          <div className={`flex-grow ${isExpanded ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 p-2' : 'flex items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-hide py-1'}`}>
            {displayedLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`px-2.5 py-2 md:px-3 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center transition-colors duration-150 ease-in-out group whitespace-nowrap
                    ${isActive
                      ? 'bg-sky-600 text-white shadow-md' 
                      : 'bg-gray-800 hover:bg-gray-700 hover:text-white text-gray-300'
                    } ${isExpanded ? 'w-full text-center min-h-[40px] sm:min-h-[48px]' : 'flex-shrink-0'}`}
                >
                  <link.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200 transition-colors'} ${isExpanded ? 'mb-1 sm:mr-0 sm:mb-1' : 'mr-1.5'}`} />
                  <span className={`${isExpanded ? 'block text-[10px] sm:text-xs leading-tight mt-0.5' : ''}`}>{link.label}</span>
                </Link>
              );
            })}
          </div>

          <button 
            onClick={handleToggle} 
            className="p-1.5 sm:p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 flex-shrink-0 ml-2 sm:ml-3"
            aria-label={isExpanded ? "Collapse actions" : "Expand actions"}
          >
            {isExpanded ? <FaChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" /> : <FaChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />}
          </button>
        </div>
      </div>
    </div>
  );
} 