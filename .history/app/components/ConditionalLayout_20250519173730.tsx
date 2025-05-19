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
import { MyCtxProvider } from '@/app/components/MyCtx'; // Standardized import path
import FullScreenMobileMenu from './FullScreenMobileMenu'; // Import new menu
import getSupabaseBrowserClient from '@/lib/supabase/client'; // For logout
import { useProfileData } from '@/lib/hooks/useProfileData'; // Import useProfileData
import { User } from '@supabase/supabase-js'; // Ensure User type is imported if needed for profileData
import { PageHeaderProvider } from './MyCtx';

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
  const { session: clientSession, isLoading: isLoadingAuth } = useAuth(); // Correctly destructure user from clientSession provided by useAuth
  const supabase = getSupabaseBrowserClient(); // Initialize Supabase client for logout

  // Use useProfileData hook
  const { 
    profile, 
    loading: profileLoading, 
    has_seen_welcome_card, 
    handleDismissWelcomeCard 
  } = useProfileData(clientSession as User | null); // Pass user to hook

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

  const toggleFullScreenMenu = () => {
    setIsFullScreenMenuOpen(!isFullScreenMenuOpen);
  };

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

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[ConditionalLayout] Error during signOut:', error.message);
      } else {
        console.log('[ConditionalLayout] supabase.auth.signOut() apparently completed without client-side error.');
      }
    } catch (e) {
      console.error('[ConditionalLayout] Exception during signOut call:', e);
    } finally {
      console.log('[ConditionalLayout] Forcing redirect to / via window.location.assign to clear state and ensure logout.');
      window.location.assign('/'); 
    }
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
    '/careers', // Added
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

  useEffect(() => {
    if (!isLoadingAuth && !clientSession && isAppPage) {
      console.log('[ConditionalLayout] User not authenticated for app page, redirecting to login.');
      router.push('/login');
    }
  }, [clientSession, isLoadingAuth, isAppPage, router]);

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
      <PageHeaderProvider>
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
              <AppSubNavbar 
                initialIsExpanded={!has_seen_welcome_card} 
                onCollapse={handleDismissWelcomeCard} 
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
      </PageHeaderProvider>
    );
  }
  
  if (isAppPage && !isAuthenticated) {
    if (typeof window !== 'undefined') {
      window.location.href = '/login?from=' + pathname;
    }
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-black">
        <FaRocket className="text-6xl text-sky-500 mb-4 animate-pulse" />
        <p className="text-xl text-gray-400">Redirecting to login...</p>
      </div>
    );
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