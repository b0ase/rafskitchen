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
const welcomeSubtitle = "Welcome! This is your innovation hub. Start a new project, collaborate with your team, and bring your ideas to life. Whether it's a new application, a platform, or a creative endeavor, we're here to help you succeed.";

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

  const handleLinkClick = () => {
    if (isExpanded) {
      setIsExpanded(false);
      onCollapse();
    }
  };

  // Action button for "Build Something Amazing" / "Collapse Options"
  const primaryActionButtonClasses = "w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 shadow-lg";

  const displayedLinks = navLinks;
  const linkContainerClasses = isExpanded 
    ? 'flex flex-wrap items-center gap-2 p-2 justify-start'
    : (isDesktop 
      ? 'flex flex-wrap items-center gap-2 p-2 justify-start' 
      : 'hidden');

  return (
    <div className={`bg-white text-gray-700 sticky top-[92px] z-30 transition-all duration-300 ease-in-out border-t border-gray-200 shadow-sm`}>
      <div className="container mx-auto px-2 sm:px-4">
        {isExpanded && (
          <div className="py-6 text-center border-b border-gray-200">
            <FaRocket className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-3 sm:mb-4 text-blue-600 opacity-90" />
            <h2 className="text-xl sm:text-2xl font-bold text-black mb-2">{welcomeTitle}</h2>
            <p className="text-sm sm:text-md text-gray-600 mb-6 max-w-xl sm:max-w-3xl mx-auto px-2">{welcomeSubtitle}</p>
          </div>
        )}
        
        {!isExpanded && !isDesktop && (
          <div className="py-3 px-2">
            <button
              onClick={handleToggle}
              className={primaryActionButtonClasses}
              aria-label="Expand actions"
            >
              <FaRocket className="w-4 h-4" />
              <span>Build Something Amazing</span>
            </button>
          </div>
        )}
        
        {isExpanded && !isDesktop && (
          <div className="py-3 px-2">
            <button 
              onClick={handleToggle} 
              className={primaryActionButtonClasses} // Same style for collapse
              aria-label="Collapse actions"
            >
              <FaChevronUp className="w-4 h-4" /> 
              <span>Collapse Options</span>
            </button>
          </div>
        )}
        
        <div className={`flex items-center py-2.5 sm:py-3 ${!isExpanded && !isDesktop ? 'hidden' : ''}`}> 
          {isDesktop && (
            <button 
              onClick={handleToggle} 
              className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-300 flex-shrink-0 mr-3"
              aria-label={isExpanded ? "Collapse actions" : "Expand actions"}
            >
              {isExpanded ? <FaChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" /> : <FaChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />}
            </button>
          )}
          
          <div className={`flex-grow ${linkContainerClasses}`}>
            {displayedLinks.map((link) => {
              const isActive = pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/');
              // Adjusted base classes for white theme
              const buttonBaseClasses = `px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 ease-in-out border min-w-fit`;
              // Active classes remain blue for emphasis, or could be lighter blue
              const activeClasses = 'bg-blue-600 text-white border-blue-500 shadow-md hover:bg-blue-700';
              // Inactive classes for white theme
              const inactiveClasses = 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 hover:border-gray-300 hover:text-black shadow-sm';

              const colSpanClass = isExpanded && link.label === 'Start a Project' && !isDesktop
                ? 'col-span-full mb-3'
                : '';
              
              let layoutClasses = isExpanded 
                ? 'flex-shrink-0 flex items-center justify-center mx-1 mb-2' 
                : (isDesktop ? 'flex-shrink-0 flex items-center justify-center mx-1' : 'flex-shrink-0 flex items-center justify-center mx-1');

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`${buttonBaseClasses} ${isActive ? activeClasses : inactiveClasses} ${layoutClasses} ${colSpanClass}`}
                  onClick={handleLinkClick}
                >
                  <link.icon className={`h-4 w-4 mr-2 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                  <span className="whitespace-nowrap">{link.label}</span>
                </Link>
              );
            })}
            {!isExpanded && isDesktop && user?.email === 'richardwboase@gmail.com' && pathname === '/team' && (
                <Link href="/teammanagement" passHref legacyBehavior>
                  <a className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200 hover:border-gray-300 font-semibold py-2.5 px-3 rounded-md transition-colors duration-150 ease-in-out whitespace-nowrap shadow-sm">
                    <FaUserShield className="mr-2 h-4 w-4 text-gray-600" />
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