'use client';

import React from 'react';
import Link from 'next/link';
import {
  FaUserAlt, FaBookOpen, FaTasks, FaCalendarAlt, FaSignOutAlt, FaDollarSign, 
  FaProjectDiagram, FaUsers, FaComments, FaSearchDollar, FaBullseye, 
  FaChalkboardTeacher, FaListAlt, FaRoute, FaRobot, FaCubes, FaBars
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
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black md:hidden"
    >
      {/* Keep the header visible, similar to AppNavbar */}
      <div className="flex items-center p-4 border-b border-gray-800 h-[92px]">
        <button 
          onClick={onClose}
          className="text-gray-400 hover:text-white focus:outline-none mr-3"
          aria-label="Close menu"
        >
          <FaBars className="w-7 h-7" />
        </button>
        
        <div className="flex items-center">
          {userAvatarUrl ? (
            <img src={userAvatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-gray-700 mr-3" />
          ) : (
            <FaUserAlt className="w-6 h-6 text-gray-400 mr-3" />
          )}
          <span className="text-white text-lg">Profile</span>
        </div>
      </div>

      {/* Navigation menu */}
      <div className="overflow-y-auto h-[calc(100vh-92px)]">
        <nav className="p-4">
          <ul className="space-y-2">
            {navLinksPrimary.map((link) => (
              <li key={link.title}>
                <Link href={link.href} legacyBehavior>
                  <a 
                    onClick={onClose}
                    className="flex items-center p-3 text-base rounded transition-colors ease-in-out hover:bg-gray-800 text-gray-300 hover:text-white"
                  >
                    <link.icon className="w-5 h-5 mr-4 text-sky-500" />
                    {link.title}
                  </a>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <button
            onClick={async () => {
              await handleLogout();
              onClose();
            }}
            className="w-full flex items-center p-3 rounded text-base font-medium text-red-400 hover:bg-gray-800 hover:text-red-300 transition-colors"
          >
            <FaSignOutAlt className="w-5 h-5 mr-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
} 