'use client';

import React, { useCallback } from 'react';
// import { Session } from '@supabase/supabase-js'; // No longer need Session from here if useAuth provides it
import { usePathname } from 'next/navigation';
import Header from './Header';
import SubNavigation from './SubNavigation';
import Footer from './Footer';
import UserSidebar from './UserSidebar'; // PageContextType might be removed if MyCtx takes over fully
import AppNavbar from './AppNavbar';
import { useAuth } from './Providers'; // Import useAuth
import { FaRocket } from 'react-icons/fa'; // For loading indicator
import { MyCtxProvider } from '@/app/components/MyCtx'; // Standardized import path
import FullScreenMobileMenu from './FullScreenMobileMenu'; // Import new menu
import getSupabaseBrowserClient from '@/lib/supabase/client'; // For logout

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
  '/blog'
  // '/projects' // Assuming /projects (portfolio) is public, /myprojects is the app part - REMOVED for now
];

// --- NEW: Define paths that should use a completely minimal layout --- 
const minimalLayoutPathPrefixes = [
  '/skills' // Add other paths here if they need a completely bare layout
];
// --- END NEW ---

// Note: The session prop passed to ConditionalLayout from RootLayout is the server-side session.
// We will now primarily rely on the client-side session from useAuth for dynamic updates.
export default function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname() ?? '';
  // const { session: clientSession, isLoading: isLoadingAuth } = useAuth(); // Correctly destructure user from clientSession provided by useAuth
  // const supabase = getSupabaseBrowserClient(); // Initialize Supabase client for logout

  // AGGRESSIVE CHECK AT THE VERY TOP
  if (typeof window !== 'undefined' && sessionStorage.getItem('isLoggingOut') === 'true') {
    if (pathname === '/') {
      // On landing page, logout just finished. Clear flag, allow normal render.
      console.log('[ConditionalLayout] TOP LEVEL: On landing page (/) with isLoggingOut flag. Clearing flag, proceeding to normal render.');
      sessionStorage.removeItem('isLoggingOut');
      // Fall through to normal rendering for the landing page
    } else {
      // Not on landing page, but logout is in progress. Show "Logout in progress..." UI.
      console.log(`[ConditionalLayout] TOP LEVEL: On path ${pathname} (not landing page) with isLoggingOut flag. Rendering minimal logout UI.`);
      return (
        <div style={{
          width: "100vw", 
          height: "100vh", 
          display: "flex", 
          flexDirection: "column", // Align icon and text vertically
          alignItems: "center", 
          justifyContent: "center", 
          backgroundColor: "black", 
          color: "white", 
          fontSize: "20px"
        }}>
          <FaRocket style={{ fontSize: "60px", color: "#0ea5e9", marginBottom: "1rem" }} className="animate-pulse" />
          <p>Logout in progress... redirecting to landing page.</p>
        </div>
      );
    }
  }

  const { session: clientSession, isLoading: isLoadingAuth } = useAuth(); // Correctly destructure user from clientSession provided by useAuth
  const supabase = getSupabaseBrowserClient(); // Initialize Supabase client for logout

  // --- NEW: Check for minimal layout paths first --- 
  const isMinimalPage = minimalLayoutPathPrefixes.some(prefix => pathname.startsWith(prefix));
  if (isMinimalPage) {
    // For minimal pages, render only children. UserSidebar and MyCtxProvider are handled by the page itself if needed.
    return <>{children}</>;
  }
  // --- END NEW ---

  const isAuthenticated = !!clientSession;
  // Remove local pageContext state and handler as MyCtxProvider will manage this.
  // const [pageContext, setPageContext] = React.useState<PageContextType | null>(null);
  const [isFullScreenMenuOpen, setIsFullScreenMenuOpen] = React.useState(false);

  // const handleSetPageContext = useCallback((context: PageContextType | null) => {
  //   setPageContext(context);
  // }, []);

  const toggleFullScreenMenu = useCallback(() => {
    setIsFullScreenMenuOpen(prev => !prev);
  }, []);

  // Adapted handleLogout from UserSidebar.tsx
  const handleLogout = async () => {
    console.log('[ConditionalLayout] handleLogout called.');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl) {
      try {
        const urlParts = supabaseUrl.split('//');
        if (urlParts.length > 1) {
          const domainParts = urlParts[1].split('.');
          if (domainParts.length > 0) {
            const projectRef = domainParts[0];
            const supabaseAuthTokenKey = `sb-${projectRef}-auth-token`;
            console.log(`[ConditionalLayout] Attempting to remove specific localStorage item: ${supabaseAuthTokenKey}`);
            localStorage.removeItem(supabaseAuthTokenKey);
          } else {
            console.warn('[ConditionalLayout] Could not derive projectRef (domain part) from NEXT_PUBLIC_SUPABASE_URL.');
          }
        } else {
          console.warn('[ConditionalLayout] Could not derive projectRef (protocol part) from NEXT_PUBLIC_SUPABASE_URL.');
        }
      } catch (e) {
        console.error('[ConditionalLayout] Error parsing NEXT_PUBLIC_SUPABASE_URL for localStorage key:', e);
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
              console.log(`[ConditionalLayout] Fallback (parsing error): Removing potential auth token key: ${key}`);
              localStorage.removeItem(key);
          }
        });
      }
    } else {
      console.warn('[ConditionalLayout] NEXT_PUBLIC_SUPABASE_URL is not defined. Attempting generic localStorage key removal for auth token.');
      Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
              console.log(`[ConditionalLayout] Fallback (URL undefined): Removing potential auth token key: ${key}`);
              localStorage.removeItem(key);
          }
      });
    }

    // Initiate signOut but don't await it here
    supabase.auth.signOut().catch(error => {
      console.error('[ConditionalLayout] Error during background signOut:', error?.message);
    });

    // Set flag and immediately redirect to the landing page.
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('isLoggingOut', 'true');
    }
    console.log('[ConditionalLayout] Redirecting to / immediately after initiating signOut.');
    window.location.assign('/'); 
  };

  // Check if the current path is a public-facing page or auth flow page first
  const isPublicPage = pathname === '/' || publicPathPrefixes.some(prefix => pathname.startsWith(prefix));
  const isAuthFlowPage = pathname === '/login' || pathname === '/auth/callback' || pathname === '/signup';

  // App-specific pages that require auth and should have the sidebar
  const appPathPrefixes = [
    '/profile',
    '/myprojects',
    '/projects/new', // Already here
    '/projects/join', // Added
    '/myagent', // Added
    '/mytoken', // Added
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

  if (isAuthFlowPage || isPublicPage) {
    // Render public layout immediately for public pages and auth flow pages
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
      <MyCtxProvider>
        <div className="flex h-screen bg-black">
          <UserSidebar 
            // Remove props related to old mobile sidebar functionality
            // isSidebarOpen={isSidebarOpen} 
            // toggleSidebar={toggleSidebar} 
          />
          <div className={`flex-1 flex flex-col overflow-hidden md:ml-64`}>
            <AppNavbar 
              toggleFullScreenMenu={toggleFullScreenMenu} 
              isFullScreenMenuOpen={isFullScreenMenuOpen}
            />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
              {children}
            </main>
          </div>
          <FullScreenMobileMenu 
            isOpen={isFullScreenMenuOpen}
            onClose={toggleFullScreenMenu}
            handleLogout={handleLogout}
            userDisplayName={clientSession?.user?.user_metadata?.display_name || clientSession?.user?.email}
            userAvatarUrl={clientSession?.user?.user_metadata?.avatar_url}
          />
        </div>
      </MyCtxProvider>
    );
  }
  
  if (isAppPage && !isAuthenticated) {
    let isCurrentlyLoggingOut = false;
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('isLoggingOut') === 'true') {
        isCurrentlyLoggingOut = true;
      }
    }

    console.log('[ConditionalLayout] Pre-redirect check. Path:', pathname, 'isAppPage:', isAppPage, '!isAuthenticated:', !isAuthenticated, 'isCurrentlyLoggingOut (from sessionStorage direct check):', isCurrentlyLoggingOut);

    if (!isCurrentlyLoggingOut) {
      console.log('[ConditionalLayout] EXECUTING REDIRECT to /login?from=' + pathname);
      if (typeof window !== 'undefined') {
        window.location.href = '/login?from=' + pathname;
      }
      return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-black">
          <FaRocket className="text-6xl text-sky-500 mb-4 animate-pulse" />
          <p className="text-xl text-gray-400">Redirecting to login...</p>
        </div>
      );
    } else {
      console.log('[ConditionalLayout] Redirect to /login SKIPPED due to isCurrentlyLoggingOut flag being true.');
      return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-black">
          <FaRocket className="text-6xl text-sky-500 mb-4 animate-pulse" />
          <p className="text-xl text-gray-400">Finalizing logout...</p>
        </div>
      );
    }
  }

  // Fallback to public layout if no other conditions met (should ideally not be reached for app pages)
  console.warn(`[ConditionalLayout] Path ${pathname} did not match any specific layout conditions and is falling back to public layout.`);
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