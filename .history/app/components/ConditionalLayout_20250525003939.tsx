'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from './Header';
import SubNavigation from './SubNavigation';
import Footer from './Footer';
import AppNavbar from './AppNavbar';
import AppSubNavbar from './AppSubNavbar';
import { MyCtxProvider } from './MyCtx';
import FullScreenMobileMenu from './FullScreenMobileMenu';
import { 
  FaUserAlt, FaProjectDiagram, FaUsers, FaRobot, FaCubes, 
  FaComments, FaBookOpen, FaTasks, FaCalendarAlt, FaDollarSign,
  FaListAlt, FaSearchDollar, FaBullseye, FaChalkboardTeacher, 
  FaRoute, FaCog, FaSignOutAlt
} from 'react-icons/fa';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

// Define paths that should use a completely minimal layout (no header/footer)
const minimalLayoutPathPrefixes = [
  '/skills'
];

// Define app pages that should use the authenticated app layout
const appPathPrefixes = [
  '/profile',
  '/myprojects',
  '/projects/new',
  '/projects/join',
  '/myagents',
  '/mytoken',
  '/careers',
  '/teammanagement',
  '/team',
  '/teams',
  '/messages',
  '/diary',
  '/workinprogress',
  '/gigs',
  '/finances',
  '/settings'
];

export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname() ?? '';

  // Check for minimal layout paths first
  const isMinimalPage = minimalLayoutPathPrefixes.some(prefix => pathname.startsWith(prefix));
  if (isMinimalPage) {
    return <>{children}</>;
  }

  // Check if this is an app page that needs the authenticated layout
  const isAppPage = appPathPrefixes.some(prefix => pathname.startsWith(prefix));
  if (isAppPage) {
    return <AppLayout>{children}</AppLayout>;
  }

  // For all other pages, use the simple public layout
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SubNavigation />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

// Define props for MockSidebar to include onLogout
interface MockSidebarProps {
  onLogout: () => Promise<void>;
}

// Simple mock sidebar component for demo
function MockSidebar({ onLogout }: MockSidebarProps) {
  const pathname = usePathname() ?? '';
  
  const navLinks = [
    { href: '/profile', icon: FaUserAlt, title: 'Profile' },
    { href: '/myprojects', icon: FaProjectDiagram, title: 'Projects' },
    { href: '/teams', icon: FaUsers, title: 'Teams' },
    { href: '/myagents', icon: FaRobot, title: 'Agents' },
    { href: '/mytoken', icon: FaCubes, title: 'Tokens' },
    { href: '/messages', icon: FaComments, title: 'Messages' },
    { href: '/diary', icon: FaBookOpen, title: 'Diary' },
    { href: '/workinprogress', icon: FaTasks, title: 'Work In Progress' },
    { href: '/gigs', icon: FaListAlt, title: 'Gigs' },
    { href: '/finances', icon: FaDollarSign, title: 'Finances' },
    { href: '/settings', icon: FaCog, title: 'Settings' }
  ];

  return (
    <div className="hidden md:flex md:flex-col md:w-64 bg-white text-black border-r border-gray-200">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <Image
            src="/images/avatars/raf_profile.jpg"
            alt="Profile"
            className="w-10 h-10 rounded-full"
            width={40} height={40}
          />
          <div>
            <p className="font-medium text-black">Raf</p>
            <p className="text-sm text-gray-600">raf@rafskitchen</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                isActive 
                  ? 'bg-blue-100 text-blue-700 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-blue-600'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-700' : 'text-gray-500 group-hover:text-blue-600'}`} />
              <span>{link.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section - Logout Button */}
      <div className="p-4 border-t border-gray-200">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center px-3 py-2.5 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors group"
        >
          <FaSignOutAlt className="w-5 h-5 mr-2.5 text-red-500 group-hover:text-red-600 transition-colors duration-150" />
          Logout
        </button>
      </div>
    </div>
  );
}

// Simple app layout component for authenticated-style pages
function AppLayout({ children }: { children: React.ReactNode }) {
  const [isFullScreenMenuOpen, setIsFullScreenMenuOpen] = useState(false);
  const pathname = usePathname() ?? '';

  // Mock user data for demo
  const mockUser = {
    id: 'raf-user-id',
    email: 'raf@rafskitchen',
    user_metadata: {
      display_name: 'Raf',
      avatar_url: '/images/avatars/raf_profile.jpg'
    }
  };

  const mockProfile = {
    id: 'raf-profile-id',
    display_name: 'Raf',
    username: 'raf',
    avatar_url: '/images/avatars/raf_profile.jpg',
    has_seen_welcome_card: true
  };

  const toggleFullScreenMenu = () => {
    setIsFullScreenMenuOpen(!isFullScreenMenuOpen);
  };

  const handleLogout = async () => {
    // Simple demo logout - just redirect to home
    console.log("Logout initiated from AppLayout");
    window.location.href = '/';
  };

  return (
    <MyCtxProvider>
      <div className={`flex h-screen bg-white ${isFullScreenMenuOpen ? 'overflow-hidden' : ''}`}>
        <MockSidebar onLogout={handleLogout} />
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppNavbar 
            toggleFullScreenMenu={toggleFullScreenMenu} 
            isFullScreenMenuActuallyOpen={isFullScreenMenuOpen}
          />
          <AppSubNavbar 
            user={mockUser as any}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-white scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-100 p-4 sm:p-6 md:p-8">
            {children}
          </main>
        </div>
        {isFullScreenMenuOpen && (
          <FullScreenMobileMenu 
            isOpen={isFullScreenMenuOpen} 
            onClose={toggleFullScreenMenu} 
            handleLogout={handleLogout}
            userDisplayName={mockProfile.display_name}
            userAvatarUrl={mockProfile.avatar_url}
          />
        )}
      </div>
    </MyCtxProvider>
  );
}