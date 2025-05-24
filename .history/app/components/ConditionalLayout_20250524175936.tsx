'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
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
  FaRoute, FaCog
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

// Simple mock sidebar component for demo
function MockSidebar() {
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
    <div className="hidden md:flex md:flex-col md:w-64 bg-gray-900 text-white border-r border-gray-700">
      {/* User Profile Section */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <img
            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium">Demo User</p>
            <p className="text-sm text-gray-400">demo@rafskitchen.com</p>
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
                  ? 'bg-blue-600 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{link.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">RafsKitchen Demo</p>
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
    id: 'demo-user-id',
    email: 'demo@rafskitchen.com',
    user_metadata: {
      display_name: 'Demo User',
      avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    }
  };

  const mockProfile = {
    id: 'demo-profile-id',
    display_name: 'Demo User',
    username: 'demo-user',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    has_seen_welcome_card: true
  };

  const toggleFullScreenMenu = () => {
    setIsFullScreenMenuOpen(!isFullScreenMenuOpen);
  };

  const handleLogout = async () => {
    // Simple demo logout - just redirect to home
    window.location.href = '/';
  };

  const shouldAppSubNavbarBeExpanded = pathname === '/profile';

  return (
    <MyCtxProvider>
      <div className={`flex h-screen bg-black ${isFullScreenMenuOpen ? 'overflow-hidden' : ''}`}>
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppNavbar 
            toggleFullScreenMenu={toggleFullScreenMenu} 
            isFullScreenMenuActuallyOpen={isFullScreenMenuOpen}
          />
          <AppSubNavbar 
            initialIsExpanded={shouldAppSubNavbarBeExpanded} 
            onCollapse={() => {/* no-op */}}
            user={mockUser as any}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-black p-4 sm:p-6 md:p-8">
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