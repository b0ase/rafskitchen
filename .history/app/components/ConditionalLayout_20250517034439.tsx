'use client';

import React, { useCallback } from 'react';
// import { Session } from '@supabase/supabase-js'; // No longer need Session from here if useAuth provides it
import { usePathname } from 'next/navigation';
import Header from './Header';
import SubNavigation from './SubNavigation';
import Footer from './Footer';
import UserSidebar, { PageContextType } from './UserSidebar';
import AppNavbar from './AppNavbar';
import { useAuth } from './Providers'; // Import useAuth
import { FaRocket } from 'react-icons/fa'; // For loading indicator

interface ConditionalLayoutProps {
  // session prop from server can be kept for initial hint or removed if useAuth is robust enough
  // session: Session | null; 
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

// Note: The session prop passed to ConditionalLayout from RootLayout is the server-side session.
// We will now primarily rely on the client-side session from useAuth for dynamic updates.
export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname();
  const { session: clientSession, isLoading: isLoadingAuth } = useAuth(); // Get session and loading state from context

  const isAuthenticated = !!clientSession;
  const [pageContext, setPageContext] = React.useState<PageContextType | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const handleSetPageContext = useCallback((context: PageContextType | null) => {
    setPageContext(context);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsSidebarOpen(prev => !prev);
  }, []);

  // Show a global loading spinner if auth state is still loading, especially on initial load.
  if (isLoadingAuth) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-black">
        <FaRocket className="text-6xl text-sky-500 mb-4 animate-pulse" />
        <p className="text-xl text-gray-400">Initializing session...</p>
      </div>
    );
  }

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

  // Logic for login, signup, callback pages (not app, not public content)
  const isAuthFlowPage = pathname === '/login' || pathname === '/auth/callback' || pathname === '/signup';

  if (isAuthFlowPage) {
    // Auth flow pages get a minimal layout (or often manage their own full-page UI)
    return <main className="flex-grow">{children}</main>; // Or a more specific auth layout if you have one
  }

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
  
  // Default to public layout for any other case (public pages, or app pages when not authenticated)
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