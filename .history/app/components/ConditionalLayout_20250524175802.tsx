'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import SubNavigation from './SubNavigation';
import Footer from './Footer';
import UserSidebar from './UserSidebar';
import AppNavbar from './AppNavbar';
import AppSubNavbar from './AppSubNavbar';
import { MyCtxProvider } from './MyCtx';
import FullScreenMobileMenu from './FullScreenMobileMenu';

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
        <UserSidebar className="hidden md:block" />
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