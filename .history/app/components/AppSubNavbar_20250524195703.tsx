'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaPlusSquare, FaUsers, FaProjectDiagram, FaUserPlus, FaBriefcase, FaChevronDown, FaChevronUp, FaRocket, FaCubes, FaUserSecret, FaUserShield } from 'react-icons/fa';

const navLinks = [
  { href: '/projects/new', label: 'Start a Project', icon: FaPlusSquare },
  { href: '/teams/new', label: 'Create a Team', icon: FaUsers },
  { href: '/projects/join', label: 'Join a Project', icon: FaProjectDiagram },
  { href: '/teams/join', label: 'Join a Team', icon: FaUserPlus },
  { href: '/myagents', label: 'Create an Agent', icon: FaUserSecret },
  { href: '/mytoken', label: 'Launch a Token', icon: FaCubes },
];

const welcomeTitle = "Ready to build something amazing?";
const welcomeSubtitle = "Welcome to Raf's Kitchen! This is your innovation hub where culinary passion meets cutting-edge technology. Start a new project to transform your food-tech ideas into reality, collaborate with our expert team, and cook up something extraordinary. Whether it's a restaurant app, a food delivery platform, an AI-powered kitchen solution, or a completely new culinary innovation, we're here to help you serve it up perfectly.";

interface AppSubNavbarProps {
  initialIsExpanded: boolean;
  onCollapse: () => void;
  user: any;
}

export default function AppSubNavbar({ initialIsExpanded, onCollapse, user }: AppSubNavbarProps) {
  const pathname = usePathname() ?? '';
  const [isExpanded, setIsExpanded] = useState(initialIsExpanded);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

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

  // Add function to handle link click
  const handleLinkClick = () => {
    // Close the menu if it's expanded
    if (isExpanded) {
      setIsExpanded(false);
      onCollapse();
    }
  };

  // Common button style for both Build Something Amazing and Collapse Options buttons
  const actionButtonClasses = "w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg";

  // Determine which links to display based on the expanded state and screen size
  const displayedLinks = isExpanded ? navLinks : navLinks; // Always show all links
  const linkContainerClasses = isExpanded 
    ? 'flex flex-wrap items-center gap-2 p-2 justify-start' // Changed to match collapsed desktop view
    : (isDesktop 
      ? 'flex flex-wrap items-center gap-2 p-2 justify-start' 
      : 'hidden');

  return (
    <div className={`bg-black text-gray-300 sticky top-[92px] z-40 transition-all duration-300 ease-in-out border-t border-gray-700`}>
      <div className="container mx-auto px-2 sm:px-4">
        {/* Welcome section RESTORED */}
        {isExpanded && (
          <div className="py-6 text-center border-b border-gray-700">
            <FaRocket className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-sky-400 opacity-90" />
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{welcomeTitle}</h2>
            <p className="text-sm sm:text-md text-gray-400 mb-6 max-w-xl sm:max-w-3xl mx-auto px-2">{welcomeSubtitle}</p>
          </div>
        )}
        
        {/* Single Build Something Amazing button for mobile collapsed view */}
        {!isExpanded && !isDesktop && (
          <div className="py-3 px-2">
            <button
              onClick={handleToggle}
              className={actionButtonClasses}
              aria-label="Expand actions"
            >
              <FaRocket className="w-4 h-4" />
              <span>Build Something Amazing</span>
            </button>
          </div>
        )}
        
        {/* Toggle expand/collapse button for expanded mobile view */}
        {isExpanded && !isDesktop && (
          <div className="py-3 px-2">
            <button 
              onClick={handleToggle} 
              className={actionButtonClasses}
              aria-label="Collapse actions"
            >
              <FaChevronUp className="w-4 h-4" /> 
              <span>Collapse Options</span>
            </button>
          </div>
        )}
        
        {/* Main container for buttons and toggle icon - Adjusted for left alignment of toggle */}
        <div className={`flex items-center py-2.5 sm:py-3 ${!isExpanded && !isDesktop ? 'hidden' : ''}`}> 
          {/* Toggle button - MOVED to the far left for desktop */}
          {isDesktop && (
            <button 
              onClick={handleToggle} 
              className="p-1.5 sm:p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600 flex-shrink-0 mr-3" // Removed ml-auto, added mr-3
              aria-label={isExpanded ? "Collapse actions" : "Expand actions"}
            >
              {isExpanded ? <FaChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" /> : <FaChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />}
            </button>
          )}
          
          {/* Button container - Takes available space, items start-aligned */}
          <div className={`flex-grow ${linkContainerClasses}`}>
            {displayedLinks.map((link, index) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
              const buttonBaseClasses = `px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out border-2 min-w-fit`;
              const activeClasses = 'bg-blue-600 text-white border-blue-500 shadow-lg hover:bg-blue-700';
              const inactiveClasses = 'bg-gray-800 hover:bg-gray-700 text-gray-100 border-gray-600 hover:border-gray-500 hover:text-white shadow-md';

              // Special styling for "Start a New Project" in expanded mobile view
              const isFirstButton = link.label === 'Start a Project';
              const colSpanClass = isExpanded && isFirstButton && !isDesktop
                ? 'col-span-full mb-3' // Make the first button full width on mobile
                : '';
              
              let layoutClasses = '';
              if (isExpanded) {
                layoutClasses = 'flex-shrink-0 flex items-center justify-center mx-1 mb-2'; // Better spacing
              } else if (isDesktop) {
                layoutClasses = 'flex-shrink-0 flex items-center justify-center mx-1'; 
              } else {
                layoutClasses = 'flex-shrink-0 flex items-center justify-center mx-1'; // Mobile collapsed buttons
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`${buttonBaseClasses} ${isActive ? activeClasses : inactiveClasses} ${layoutClasses} ${colSpanClass}`}
                  onClick={handleLinkClick}
                >
                  <link.icon className={`h-4 w-4 mr-2 ${isActive ? 'text-white' : 'text-gray-300'}`} />
                  <span className="whitespace-nowrap">{link.label}</span>
                </Link>
              );
            })}
            {/* Render Admin button if user is admin and not in collapsed mobile view and is on the team page */}
            {!isExpanded && isDesktop && user?.email === 'richardwboase@gmail.com' && pathname === '/team' && (
                <Link href="/teammanagement" passHref legacyBehavior>
                  <a className="inline-flex items-center bg-black hover:bg-gray-900 text-gray-300 border border-gray-700 hover:border-gray-500 font-semibold py-2.5 px-3 rounded-md transition-colors duration-150 ease-in-out whitespace-nowrap">
                    <FaUserShield className="mr-2 h-4 w-4" />
                    Admin: Manage All Teams
                  </a>
                </Link>
              )}
          </div>
        </div>
      </div>
    </div>
  );
} 