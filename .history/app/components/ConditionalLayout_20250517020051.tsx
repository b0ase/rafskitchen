'use client';

import React, { useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { usePathname } from 'next/navigation';
import Header from './Header';
import SubNavigation from './SubNavigation';
import Footer from './Footer';
import UserSidebar, { PageContextType } from './UserSidebar';
import AppNavbar from './AppNavbar';

interface ConditionalLayoutProps {
  session: Session | null;
  children: React.ReactNode;
}

// Define public path prefixes that should always use the public layout
const publicPathPrefixes = [
  '/services',
  '/about', // Add other public prefixes as needed
  '/contact',
  '/blog',
  '/projects' // Assuming /projects (portfolio) is public, /myprojects is the app part
];

export default function ConditionalLayout({ session, children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const isAuthenticated = !!session;
  const [pageContext, setPageContext] = React.useState<PageContextType | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleSetPageContext = useCallback((context: PageContextType | null) => {
    setPageContext(context);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Check if the current path is a public-facing page
  const isPublicPage = pathname === '/' || publicPathPrefixes.some(prefix => pathname.startsWith(prefix));

  // App-specific pages that require auth and should have the sidebar
  // Add more prefixes if needed (e.g., /dashboard, /settings, etc.)
  const appPathPrefixes = [
    '/profile',
    '/myprojects',
    '/team',
    '/diary',
    '/workinprogress',
    '/gigs',
    '/finances',
    '/settings' // Ensure settings is treated as an app page
  ];
  const isAppPage = appPathPrefixes.some(prefix => pathname.startsWith(prefix));

  if (isPublicPage && !(isAppPage && isAuthenticated)) {
    // Render public layout for homepage, /services/*, etc.
    // Also for app pages if not authenticated (though they should redirect via their own logic or a higher-order component)
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <SubNavigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  // If it's an app page and user is authenticated, show the app layout with sidebar
  if (isAppPage && isAuthenticated) {
    return (
      <div className="flex h-screen bg-black">
        <UserSidebar 
          onSetPageContext={handleSetPageContext} 
          isSidebarOpen={isSidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />
        <div 
          className={`flex-1 flex flex-col overflow-hidden md:ml-64`}>
          <AppNavbar pageContext={pageContext} toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            {React.isValidElement(children) ? React.cloneElement(children as React.ReactElement<any>, { onSetPageContext: handleSetPageContext }) : children}
          </main>
        </div>
      </div>
    );
  }
  
  // Fallback for non-authenticated users trying to access app pages (they should be redirected by page-level logic or a router guard)
  // Or for any other unhandled cases, render the public layout.
  // This also covers cases like /login, /signup, /auth/callback which are not strictly "public content pages" but don't get the sidebar.
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <SubNavigation />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
} 