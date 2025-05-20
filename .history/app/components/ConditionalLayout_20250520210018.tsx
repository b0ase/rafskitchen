'use client';

import React, { useEffect, useState, useMemo } from 'react';
// import { Session } from '@supabase/supabase-js'; // No longer need Session from here if useAuth provides it
import { usePathname, useRouter } from 'next/navigation';
import Header from './Header';
import SubNavigation from './SubNavigation';
import Footer from './Footer';
import UserSidebar from './UserSidebar'; // PageContextType might be removed if MyCtx takes over fully
import AppNavbar from './AppNavbar';
import AppSubNavbar from './AppSubNavbar'; // Added import
import { useAuth } from './Providers'; // Import useAuth
import { FaRocket } from 'react-icons/fa'; // For loading indicator
import { MyCtxProvider } from './MyCtx'; // Corrected to MyCtxProvider
import FullScreenMobileMenu from './FullScreenMobileMenu'; // UNCOMMENTED
import getSupabaseBrowserClient from '@/lib/supabase/client'; // For logout
import useProfileData from '@/lib/hooks/useProfileData'; // Corrected import for default export
// User type might not be needed here if useProfileData handles user context internally
// import { User } from '@supabase/supabase-js'; 

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
  '/test',
  '/login',
  '/signup',
  '/auth',
  '/set-new-password',
  '/reset-password-email-sent',
  '/update-password',
  '/error',
  '/404',
  '/confirm-email',
  '/terms-and-conditions',
  '/welcome-back',
  '/account-recovery',
  '/privacy-policy'
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
  const router = useRouter();
  const { session: clientSession, isLoading: isLoadingAuth } = useAuth();
  const supabase = getSupabaseBrowserClient();

  const { 
    profile, 
    loading: profileLoading, 
    showWelcomeCard, 
    handleDismissWelcomeCard,
    // handleSaveProfile // This was here but not used in ConditionalLayout, confirm if needed elsewhere or remove
  } = useProfileData();

  const [isFullScreenMenuOpen, setIsFullScreenMenuOpen] = React.useState(false); // UNCOMMENTED
  const [isClientSideLogoutActive, setIsClientSideLogoutActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // New state for mounted check

  // App-specific pages that require auth and should have the sidebar
  const appPathPrefixes = [
    '/profile',
    '/myprojects',
    '/projects/new',
    '/projects/join',
    '/myagent',
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
  const isAppPage = appPathPrefixes.some(prefix => pathname.startsWith(prefix));

  // AuthCheckEffect - MOVED UP
  useEffect(() => {
    console.log('[ConditionalLayout AuthCheckEffect MOVED UP] Path:', pathname, 'isLoadingAuth:', isLoadingAuth, 'clientSession:', !!clientSession, 'isAppPage:', isAppPage);
    if (!isLoadingAuth && !clientSession && isAppPage) {
      console.log('[ConditionalLayout MOVED UP] User not authenticated for app page, redirecting to login.');
      router.push('/login');
    }
  }, [clientSession, isLoadingAuth, isAppPage, router, pathname]);

  // Effect to handle client-side sessionStorage check for logout state
  useEffect(() => {
    setIsMounted(true); // Set mounted to true after initial render
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('isLoggingOut') === 'true') {
        if (pathname === '/') {
          console.log('[ConditionalLayout useEffect] On landing page (/) with isLoggingOut flag. Clearing flag.');
          sessionStorage.removeItem('isLoggingOut');
          setIsClientSideLogoutActive(false); // Ensure it's false if we were on landing
        } else {
          console.log(`[ConditionalLayout useEffect] On path ${pathname} (not landing) with isLoggingOut flag. Setting client-side logout active.`);
          setIsClientSideLogoutActive(true);
        }
      } else {
        setIsClientSideLogoutActive(false); // Ensure it's false if no flag
      }
    }
  }, [pathname]); // Rerun if pathname changes

  // AGGRESSIVE CHECK AT THE VERY TOP - NOW HANDLED BY isClientSideLogoutActive state
  if (!isMounted) {
    // Render a minimal, non-SVG placeholder or null during SSR and initial client render before mount
    // This helps ensure the server and initial client render match.
    // The actual content will be determined after mount.
    return <div style={{ width: "100vw", height: "100vh", backgroundColor: "black" }} data-hydration-placeholder="true"></div>;
  }

  if (isClientSideLogoutActive) { 
    // This UI will now render after initial hydration if conditions met
    console.log(`[ConditionalLayout Render] Client-side logout is active on path ${pathname}. Rendering minimal logout UI.`);
    return (
      <div style={{
        width: "100vw", 
        height: "100vh", 
        display: "flex", 
        flexDirection: "column",
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
  
  console.log('[ConditionalLayout LOGIN TRACE] Path:', pathname, 'isLoadingAuth:', isLoadingAuth, 'clientSession:', !!clientSession, 'profileLoading:', profileLoading, 'profile:', !!profile);

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

  const toggleFullScreenMenu = () => { // UNCOMMENTED
    setIsFullScreenMenuOpen(!isFullScreenMenuOpen);
  };

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
  if (isLoadingAuth || profileLoading) {
    console.log('[ConditionalLayout LOGIN TRACE] Rendering: Initializing session UI');
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
    // Determine initial expansion state for AppSubNavbar based on path
    const subNavbarInitialExpanded = (pathname === '/profile') 
      ? (showWelcomeCard ?? true) 
      : false;

    return (
      <MyCtxProvider>
        <div className="flex h-screen bg-gray-100 dark:bg-black">
          <UserSidebar />
          <FullScreenMobileMenu 
            isOpen={isFullScreenMenuOpen} 
            onClose={toggleFullScreenMenu} 
            handleLogout={handleLogout} 
            userDisplayName={profile?.display_name || profile?.username || 'User'}
            userAvatarUrl={profile?.avatar_url}
          />
          <div className="flex-1 flex flex-col overflow-hidden">
            <AppNavbar 
              toggleFullScreenMenu={toggleFullScreenMenu} 
              isFullScreenMenuActuallyOpen={isFullScreenMenuOpen} 
            />
            <AppSubNavbar 
              initialIsExpanded={!showWelcomeCard} 
              onCollapse={handleDismissWelcomeCard}
            />
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-black p-4 md:p-6">
              {children}
            </main>
          </div>
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

    console.log('[ConditionalLayout LOGIN TRACE] Pre-redirect check. Path:', pathname, 'isAppPage:', isAppPage, '!isAuthenticated:', !isAuthenticated, 'isCurrentlyLoggingOut:', isCurrentlyLoggingOut);

    if (!isCurrentlyLoggingOut) {
      console.log('[ConditionalLayout LOGIN TRACE] Rendering: Redirecting to login UI / executing redirect');
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
    <MyCtxProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <SubNavigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </MyCtxProvider>
  );
}