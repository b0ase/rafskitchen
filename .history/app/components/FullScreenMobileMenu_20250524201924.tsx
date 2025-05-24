'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  FaUserAlt, FaBookOpen, FaTasks, FaCalendarAlt, FaSignOutAlt, FaDollarSign, 
  FaProjectDiagram, FaUsers, FaComments, FaSearchDollar, FaBullseye, 
  FaChalkboardTeacher, FaListAlt, FaRoute, FaRobot, FaCubes, FaBars, FaCog
} from 'react-icons/fa';

// Replicated NavLink interface and constants for now
// TODO: Consider moving to a shared types file
interface NavLinkItem {
  href: string;
  title: string;
  icon: React.ElementType;
  activeSubpaths?: string[];
}

const navLinksPrimary: NavLinkItem[] = [
  { title: 'Profile', href: '/profile', icon: FaUserAlt, activeSubpaths: ['/profile/edit'] },
  { title: 'Projects', href: '/myprojects', icon: FaProjectDiagram },
  { title: 'Teams', href: '/team', icon: FaUsers },
  { title: 'Agents', href: '/myagents', icon: FaRobot, activeSubpaths: ['/myagents/new', '/myagents/configure'] },
  { title: 'Tokens', href: '/mytoken', icon: FaCubes },
  { title: 'Messages', href: '/messages', icon: FaComments },
  { title: 'Diary', href: '/diary', icon: FaBookOpen },
  { title: 'Work In Progress', href: '/workinprogress', icon: FaTasks },
  { title: 'Calendar', href: '/gigs/calendar', icon: FaCalendarAlt },
  { title: 'Finances', href: '/finances', icon: FaDollarSign },
  { title: 'Gigs', href: '/gigs', icon: FaListAlt },
  { title: 'Research', href: '/gigs/research', icon: FaSearchDollar },
  { title: 'Strategy', href: '/gigs/strategy', icon: FaBullseye },
  { title: 'Action Plan', href: '/gigs/action', icon: FaTasks },
  { title: 'Learning Path', href: '/gigs/learning-path', icon: FaChalkboardTeacher },
  { title: 'Platforms', href: '/gigs/platforms', icon: FaListAlt },
  { title: 'Work Path', href: '/gigs/work-path', icon: FaRoute },
];

interface FullScreenMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  handleLogout: () => Promise<void>;
  userDisplayName?: string;
  userAvatarUrl?: string | null;
}

export default function FullScreenMobileMenu({ 
  isOpen, 
  onClose, 
  handleLogout, 
  userDisplayName = 'User',
  userAvatarUrl 
}: FullScreenMobileMenuProps) {
  const pathname = usePathname();
  
  // Find the active nav link based on the current path
  const getCurrentPageTitle = () => {
    // Find exact match first
    const exactMatch = navLinksPrimary.find(link => link.href === pathname);
    if (exactMatch) return exactMatch.title;
    
    // Then look for path that starts with the link href
    const partialMatch = navLinksPrimary.find(link => 
      pathname.startsWith(link.href) && link.href !== '/'
    );
    if (partialMatch) return partialMatch.title;
    
    // Check for matches with activeSubpaths
    const subpathMatch = navLinksPrimary.find(link => 
      link.activeSubpaths?.some(subpath => pathname.startsWith(subpath))
    );
    if (subpathMatch) return subpathMatch.title;
    
    // Default to Profile if no match is found
    return 'Profile';
  };
  
  const currentPageTitle = getCurrentPageTitle();

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black md:hidden"
    >
      {/* Keep the header visible, similar to AppNavbar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800 h-[92px]">
        <div className="flex items-center">
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white focus:outline-none mr-3"
            aria-label="Close menu"
          >
            <FaBars className="w-7 h-7" />
          </button>
          
          <div className="flex items-center">
            {userAvatarUrl ? (
              <Image src={userAvatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-700 mr-3" width={32} height={32} />
            ) : (
              <FaUserAlt className="w-6 h-6 text-white mr-3" />
            )}
            <span className="text-white text-lg">{currentPageTitle}</span>
          </div>
        </div>
        
        <div className="flex items-center">
          <Link href="/settings" className="text-white hover:text-gray-300 mr-4">
            <FaCog className="w-6 h-6" />
          </Link>
          <button
            onClick={async () => {
              await handleLogout();
              onClose();
            }}
            className="text-red-400 hover:text-red-300"
            aria-label="Logout"
          >
            <FaSignOutAlt className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="overflow-y-auto h-[calc(100vh-92px)]">
        <nav className="pl-[46px] pr-4 py-4"> {/* Padding left aligns with hamburger */}
          <ul className="space-y-2">
            {navLinksPrimary.map((link) => {
              const isActive = 
                pathname === link.href || 
                (pathname.startsWith(link.href) && link.href !== '/') ||
                link.activeSubpaths?.some(subpath => pathname.startsWith(subpath));
                
              return (
                <li key={link.title}>
                  <Link href={link.href} legacyBehavior>
                    <a 
                      onClick={onClose}
                      className={`flex items-center p-3 text-base rounded transition-colors ease-in-out hover:bg-gray-800 ${isActive ? 'text-white bg-gray-800' : 'text-gray-300'} hover:text-white`}
                    >
                      <link.icon className={`w-5 h-5 mr-4 ${isActive ? 'text-sky-400' : 'text-white'}`} />
                      {link.title}
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
} 