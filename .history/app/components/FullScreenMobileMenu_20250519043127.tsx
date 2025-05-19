'use client';

import React from 'react';
import Link from 'next/link';
import {
  FaUserCircle, FaBookOpen, FaTasks, FaCalendarAlt, FaSignOutAlt, FaDollarSign, 
  FaProjectDiagram, FaUsers, FaComments, FaSearchDollar, FaBullseye, 
  FaChalkboardTeacher, FaListAlt, FaRoute
} from 'react-icons/fa';

// Replicated NavLink interface and constants for now
// TODO: Consider moving to a shared types file
interface NavLinkItem {
  href: string;
  title: string;
  icon: React.ElementType;
}

const navLinksPrimary: NavLinkItem[] = [
  { title: 'My Profile', href: '/profile', icon: FaUserCircle },
  { title: 'My Projects', href: '/myprojects', icon: FaProjectDiagram },
  { title: 'My Team', href: '/team', icon: FaUsers },
  { title: 'My Messages', href: '/messages', icon: FaComments },
  { title: 'My Diary', href: '/diary', icon: FaBookOpen },
  { title: 'Work In Progress', href: '/workinprogress', icon: FaTasks },
  { title: 'My Calendar', href: '/gigs/calendar', icon: FaCalendarAlt },
  { title: 'My Finances', href: '/finances', icon: FaDollarSign },
  { title: 'My Gigs', href: '/gigs', icon: FaListAlt },
  { title: 'Research', href: '/gigs/research', icon: FaSearchDollar },
  { title: 'Strategy', href: '/gigs/strategy', icon: FaBullseye },
  { title: 'Action Plan', href: '/gigs/action', icon: FaTasks },
  { title: 'Learning Path', href: '/gigs/learning-path', icon: FaChalkboardTeacher },
  { title: 'Platforms', href: '/gigs/platforms', icon: FaListAlt },
  { title: 'Work Path', href: '/gigs/work-path', icon: FaRoute },
  { title: 'Fiverr Explorer', href: '/gigs/fiverr-explorer', icon: FaSearchDollar },
];

interface FullScreenMobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  // navLinks: NavLinkItem[]; // Will use internal constant for now
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
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-gray-950 bg-opacity-95 text-white flex flex-col p-6 md:hidden"
      onClick={onClose} // Click on backdrop closes menu
    >
      <div 
        className="bg-gray-900 p-6 rounded-lg shadow-2xl w-full max-w-md mx-auto flex flex-col space-y-6 overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside menu from closing it
      >
        {/* Optional: User Info Header */}
        {(userDisplayName || userAvatarUrl) && (
          <div className="flex items-center space-x-3 pb-4 border-b border-gray-700">
            {userAvatarUrl ? (
              <img src={userAvatarUrl} alt="Avatar" className="w-12 h-12 rounded-full object-cover border-2 border-sky-500" />
            ) : (
              <FaUserCircle className="w-12 h-12 text-sky-500" />
            )}
            <div>
              <p className="text-lg font-semibold text-white">{userDisplayName}</p>
              {/* <p className="text-sm text-gray-400">View Profile</p> */}
            </div>
          </div>
        )}

        <nav className="flex-grow">
          <ul className="space-y-2">
            {navLinksPrimary.map((link) => (
              <li key={link.title}>
                <Link href={link.href} legacyBehavior>
                  <a 
                    onClick={onClose} // Close menu on link click
                    className="flex items-center p-3 text-base rounded-md transition-all duration-150 ease-in-out group hover:bg-sky-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-200"
                  >
                    <link.icon className="w-6 h-6 mr-4 text-sky-400 group-hover:text-white transition-colors duration-150" />
                    {link.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="pt-4 border-t border-gray-700">
          <button
            onClick={async () => {
              await handleLogout();
              onClose(); // Close menu after logout action initiated
            }}
            className="w-full flex items-center p-3 rounded-md text-base font-medium text-red-400 hover:bg-red-800/50 hover:text-red-300 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <FaSignOutAlt className="w-6 h-6 mr-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 