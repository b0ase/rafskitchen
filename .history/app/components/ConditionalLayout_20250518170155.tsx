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

  // Check if the current path is a public-facing page or auth flow page first
  const isPublicPage = pathname === '/' || publicPathPrefixes.some(prefix => pathname.startsWith(prefix));
  const isAuthFlowPage = pathname === '/login' || pathname === '/auth/callback' || pathname === '/signup';

  // App-specific pages that require auth and should have the sidebar
  const appPathPrefixes = [
    '/profile',
    '/myprojects',
    '/projects/new',
    '/teammanagement',
    '/team',
    '/teams', // Covers /teams and /teams/* - Make sure this doesn't conflict with more specific /teammanagement
    '/messages',
    '/diary',
    '/workinprogress',
    '/gigs',
    '/finances',
    '/settings'
  ];
  const isAppPage = appPathPrefixes.some(prefix => pathname.startsWith(prefix));

  if (isAuthFlowPage) {
    // Auth flow pages get a minimal layout
    return <main className="flex-grow">{children}</main>;
  }

  if (isPublicPage) {
    // Render public layout immediately for public pages
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

  // For non-public and non-auth-flow pages (i.e., app pages or pages needing auth)
  // Now check for authentication loading state
  if (isLoadingAuth) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-black">
        <FaRocket className="text-6xl text-sky-500 mb-4 animate-pulse" />
        <p className="text-xl text-gray-400">Initializing session...</p>
      </div>
    );
  }

  // If it's an app page and user is authenticated, show the app layout with sidebar
  // (This also covers cases where isAppPage might be true but we determined it was public earlier and returned,
  //  but here we are certain it's not public and not an auth flow page)
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
  
  // Default fallback: This will now primarily catch unauthenticated users trying to access app pages
  // or any other unhandled routes. Consider a more explicit redirect to login for unauthenticated app page access.
  // For now, it shows the public layout.
  // If !isAuthenticated and isAppPage, a redirect to login might be better.
  // Let's refine this: if it's an app page but user is not authenticated, redirect to login.
  if (isAppPage && !isAuthenticated) {
    // Ideally, redirect to login. For now, showing public layout as a fallback,
    // but individual app pages should also protect themselves.
    // Let's try a client-side redirect here.
    if (typeof window !== 'undefined') {
      window.location.href = '/login'; // Simple redirect
    }
    return ( // Fallback content during redirect
      <div className="flex flex-col min-h-screen items-center justify-center bg-black">
        <FaRocket className="text-6xl text-sky-500 mb-4 animate-pulse" />
        <p className="text-xl text-gray-400">Redirecting to login...</p>
      </div>
    );
  }

  // Default to public layout for any other unhandled case.
  // This path should ideally be hit less often with the above conditions.
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