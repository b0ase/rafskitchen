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
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsExpanded(initialIsExpanded);
  }, [initialIsExpanded]);

  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 768); // md breakpoint
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  const handleToggle = () => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    if (!newState) { // If collapsing
      onCollapse();
    }
  };

  // Determine which links to display based on the expanded state and screen size
  const displayedLinks = isExpanded ? navLinks : (isDesktop ? navLinks : navLinks.slice(0, 2));
  const linkContainerClasses = isExpanded 
    ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-7 gap-2 p-2' 
    : (isDesktop 
      ? 'flex flex-wrap items-center gap-2 p-2 justify-center' // Show all buttons, allow wrapping, centered
      : 'flex items-center space-x-2 overflow-x-auto whitespace-nowrap scrollbar-hide py-1'); // Mobile collapsed: scroll first 2

  return (
    <div className={`bg-gradient-to-r from-black via-gray-900 to-gray-800 text-gray-300 shadow-lg sticky top-20 z-30 transition-all duration-300 ease-in-out border-t border-gray-700`}>
      <div className="container mx-auto px-2 sm:px-4">
        {isExpanded && (
          <div className="py-6 text-center border-b border-gray-700">
            <FaRocket className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-sky-400 opacity-90" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{welcomeTitle}</h2>
            <p className="text-sm sm:text-md text-gray-400 mb-6 max-w-xl sm:max-w-3xl mx-auto px-2">{welcomeSubtitle}</p>
          </div>
        )}
        
        <div className={`flex items-center justify-between py-2.5 sm:py-3`}> 
          {!isExpanded && isDesktop && (
             <FaRocket className="h-5 w-5 sm:h-6 sm:w-6 text-sky-500 mr-2 sm:mr-3 flex-shrink-0 hidden md:block" />
          )}
          {!isExpanded && !isDesktop && (
             <FaRocket className="h-5 w-5 text-sky-500 mr-1 flex-shrink-0 sm:hidden" /> // Smaller rocket for mobile collapsed
          )}
          
          <div className={`flex-grow ${linkContainerClasses}`}>
            {displayedLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
              const buttonBaseClasses = `px-2.5 py-2 md:px-3 rounded-md text-xs sm:text-sm font-medium flex items-center justify-center transition-colors duration-150 ease-in-out group whitespace-nowrap`;
              const activeClasses = 'bg-sky-600 text-white shadow-md';
              const inactiveClasses = 'bg-gray-800 hover:bg-gray-700 hover:text-white text-gray-300';
              
              let layoutClasses = '';
              if (isExpanded) {
                layoutClasses = 'w-full text-center min-h-[40px] sm:min-h-[48px]';
              } else if (isDesktop) {
                layoutClasses = 'flex-shrink-0'; // Desktop collapsed buttons
              } else {
                layoutClasses = 'flex-shrink-0'; // Mobile collapsed buttons
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`${buttonBaseClasses} ${isActive ? activeClasses : inactiveClasses} ${layoutClasses}`}
                >
                  <link.icon className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200 transition-colors'} ${isExpanded ? 'mb-1 sm:mr-0 sm:mb-1' : 'mr-1.5'}`} />
                  <span className={`${isExpanded ? 'block text-[10px] sm:text-xs leading-tight mt-0.5' : (isDesktop && !isExpanded ? 'ml-1.5' : '')}`}>{link.label}</span>
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