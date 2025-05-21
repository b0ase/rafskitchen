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
import FullScreenMobileMenu from './FullScreenMobileMenu'; // Ensure this is uncommented
import getSupabaseBrowserClient from '@/lib/supabase/client'; // For logout
import useProfileData, { Profile, User } from '@/lib/hooks/useProfileData'; // Corrected import for default export, and import Profile/User types
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
  '/auth', // Covers /auth/callback too
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
  // const supabase = getSupabaseBrowserClient(); // supabase client will be obtained where needed (logout, AuthenticatedAppLayout)

  // DO NOT call useProfileData here unconditionally.
  // const { 
  //   profile, 
  //   loading: profileLoading, 
  //   showWelcomeCard, 
  //   handleDismissWelcomeCard,
  // } = useProfileData(); // MOVED

  const [isFullScreenMenuOpen, setIsFullScreenMenuOpen] = React.useState(false); // UNCOMMENTED
  const [isClientSideLogoutActive, setIsClientSideLogoutActive] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // New state for mounted check

  // App-specific pages that require auth and should have the sidebar
  const appPathPrefixes = [
    '/profile',
    '/myprojects',
    '/projects/new',
    '/projects/join',
    '/myagents',
    '/mytoken',
    '/careers',
    '/teammanagement',
    '/team', // also covers /teams typically if checking start
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
    console.log('[ConditionalLayout AuthCheckEffect MOVED UP TRACE]', { pathname, isLoadingAuth, clientSession: !!clientSession, isAppPage });
    if (!isLoadingAuth && !clientSession && isAppPage) {
      console.log('[ConditionalLayout AuthCheckEffect MOVED UP TRACE] User not authenticated for app page, redirecting to login.');
      router.push('/login?redirectedFrom=' + encodeURIComponent(pathname)); // Add redirection query
    }
  }, [clientSession, isLoadingAuth, isAppPage, router, pathname]);

  // Effect to handle client-side sessionStorage check for logout state
  useEffect(() => {
    setIsMounted(true); // Set mounted to true after initial render
    console.log('[ConditionalLayout Mounted Effect TRACE] Component mounted, checking sessionStorage for logout flag.');
    if (typeof window !== 'undefined') {
      if (sessionStorage.getItem('isLoggingOut') === 'true') {
        if (pathname === '/') {
          console.log('[ConditionalLayout useEffect] On landing page (/) with isLoggingOut flag. Clearing flag.');
          sessionStorage.removeItem('isLoggingOut');
          setIsClientSideLogoutActive(false); // Ensure it\'s false if we were on landing
        } else {
          console.log(`[ConditionalLayout useEffect] On path ${pathname} (not landing) with isLoggingOut flag. Setting client-side logout active.`);
          setIsClientSideLogoutActive(true);
        }
      } else {
        setIsClientSideLogoutActive(false); // Ensure it\'s false if no flag
      }
    }
  }, [pathname]); // Rerun if pathname changes

  // AGGRESSIVE CHECK AT THE VERY TOP - NOW HANDLED BY isClientSideLogoutActive state
  if (!isMounted) {
    return <div style={{ width: "100vw", height: "100vh", backgroundColor: "black" }} data-hydration-placeholder="true"></div>;
  }

  if (isClientSideLogoutActive) { 
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
  
  // console.log('[ConditionalLayout GENERAL TRACE] Path:', pathname, 'isLoadingAuth:', isLoadingAuth, 'clientSession:', !!clientSession); // Removed profile related logs

  // --- NEW: Check for minimal layout paths first --- 
  const isMinimalPage = minimalLayoutPathPrefixes.some(prefix => pathname.startsWith(prefix));
  if (isMinimalPage) {
    return <>{children}</>;
  }
  // --- END NEW --

  // const isAuthenticated = !!clientSession; // This will be checked within relevant branches

  // toggleFullScreenMenu and handleLogout are now part of AuthenticatedAppLayout or passed to Header for public pages

  // Check if the current path is a public-facing page or auth flow page first
  const isPublicPage = pathname === '/' || publicPathPrefixes.some(prefix => pathname.startsWith(prefix) && !isAppPage); // Ensure app pages are not considered public
  
  // Simplified isAuthFlowPage as publicPathPrefixes now includes most auth routes
  const isAuthFlowPage = publicPathPrefixes.some(prefix => pathname.startsWith(prefix)) && 
                         !isAppPage && // an app page is not an auth flow page
                         (pathname.startsWith('/login') || pathname.startsWith('/signup') || pathname.startsWith('/auth') || pathname.startsWith('/set-new-password') || pathname.startsWith('/reset-password-email-sent') || pathname.startsWith('/update-password') || pathname.startsWith('/confirm-email'));


  if (isPublicPage || isAuthFlowPage) {
    console.log(`[ConditionalLayout Render] Rendering public/auth layout for: ${pathname}`);
    // Public Header might need a simple logout if a session exists (e.g. user on /blog but logged in)
    const supabase = getSupabaseBrowserClient();
    const handlePublicLogout = async () => {
        if (typeof window !== 'undefined') {
            sessionStorage.setItem('isLoggingOut', 'true');
        }
        await supabase.auth.signOut();
        window.location.assign('/'); 
    };
    return (
      <div className="flex flex-col min-h-screen">
        <Header /> {/* Removed clientSession and onLogout props */}
        <SubNavigation />
        <main className="flex-grow">{children}</main>
        <Footer />
      </div>
    );
  }

  // For non-public and non-auth-flow pages (i.e., app pages or pages needing auth)
  // Now check for authentication loading state
  if (isLoadingAuth) {
    console.log('[ConditionalLayout Render] App page, auth loading...');
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-black">
        <FaRocket className="text-6xl text-sky-500 mb-4 animate-pulse" />
        <p className="text-xl text-gray-400">Initializing session...</p>
      </div>
    );
  }

  // If still here, isLoadingAuth is false.
  // The AuthCheckEffect (lines 80-86) should have already redirected if !clientSession && isAppPage.
  // This means if we reach here for an isAppPage, clientSession must be true.
  // For non-isAppPage that are also not public/auth, they might be caught here.
  if (!clientSession) {
    // This is a fallback. Ideally, all pages are categorized.
    // If a page is not public, not auth, not app, but requires auth, it would land here.
    console.warn(`[ConditionalLayout Render] Fallback: User not authenticated for path: ${pathname}. isLoadingAuth: ${isLoadingAuth}. Redirecting to login.`);
    router.push('/login?redirectedFrom=' + encodeURIComponent(pathname));
    return ( 
      <div className="flex flex-col min-h-screen items-center justify-center bg-black">
          <FaRocket className="text-6xl text-sky-500 mb-4 animate-pulse" />
          <p className="text-xl text-gray-400">Redirecting to login...</p>
      </div>
    );
  }

  // If authenticated and on an app page (or a page that passed the public/auth checks and isn't loading auth, and has a session)
  // Now we can safely call useProfileData for the authenticated app layout.
  console.log(`[ConditionalLayout Render] Rendering AuthenticatedAppLayout for: ${pathname}`);
  return <AuthenticatedAppLayout isParentFullScreenMenuOpen={isFullScreenMenuOpen} setIsParentFullScreenMenuOpen={setIsFullScreenMenuOpen}>{children}</AuthenticatedAppLayout>;
}

// New component to encapsulate the authenticated app layout and useProfileData
const AuthenticatedAppLayout = ({ children, isParentFullScreenMenuOpen, setIsParentFullScreenMenuOpen }: { children: React.ReactNode, isParentFullScreenMenuOpen: boolean, setIsParentFullScreenMenuOpen: (isOpen: boolean) => void }) => {
  const { 
    profile, 
    loading: profileLoading, 
    user, 
    saving: profileSaving, // Added profileSaving
    showWelcomeCard,
    handleDismissWelcomeCard,
    // Add any other functions/state from useProfileData needed by AppNavbar/AppSubNavbar etc.
  } = useProfileData();

  const pathname = usePathname() ?? ''; 
  const [isFullScreenMenuOpen, setIsFullScreenMenuOpen] = React.useState(false);
  const toggleFullScreenMenu = () => { setIsParentFullScreenMenuOpen(!isParentFullScreenMenuOpen); };
  const supabase = getSupabaseBrowserClient(); 

  const handleLogout = async () => { 
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('isLoggingOut', 'true');
    }
    // await supabase.auth.signOut(); // Let's ensure this doesn't cause issues with the logout flag + redirect
    // window.location.assign('/'); 
    // Use a slightly more robust logout that ensures signOut completes before redirect attempt
    try {
        await supabase.auth.signOut();
    } catch (error) {
        console.error("Error during sign out:", error);
    } finally {
        if (typeof window !== 'undefined') {
            window.location.assign('/');
        }
    }
  };

  // Loading state specific to profile data after auth is confirmed
  if (profileLoading) {
    console.log('[AuthenticatedAppLayout Render] Profile data loading...');
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-black">
        <FaRocket className="text-6xl text-sky-500 mb-4 animate-pulse" />
        <p className="text-xl text-gray-400">Loading profile...</p>
      </div>
    );
  }
  
  const appPathPrefixesForSidebar = [ 
    '/profile', '/myprojects', '/projects/new', '/projects/join', '/myagents', 
    '/mytoken', '/careers', '/teammanagement', '/team', '/teams', 
    '/messages', '/diary', '/workinprogress', '/gigs', '/finances', '/settings'
  ];
  const showUserSidebar = appPathPrefixesForSidebar.some(prefix => pathname.startsWith(prefix));

  return (
    <MyCtxProvider> 
      <div className={`flex h-screen bg-black ${isParentFullScreenMenuOpen ? 'overflow-hidden' : ''}`}>
        {showUserSidebar && <UserSidebar />}
        <div className="flex-1 flex flex-col overflow-hidden">
          <AppNavbar 
            toggleFullScreenMenu={toggleFullScreenMenu} 
            isFullScreenMenuActuallyOpen={isParentFullScreenMenuOpen}
          />
          <AppSubNavbar 
            initialIsExpanded={profile ? !profile.has_seen_welcome_card && showWelcomeCard : true}
            onCollapse={handleDismissWelcomeCard}
            user={user}
          />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-black p-4 md:p-6">
            {/* Welcome Card Logic */}
            {profile && !profile.has_seen_welcome_card && showWelcomeCard && user && ( // ensure user exists too for display_name
              <div className="bg-slate-800 p-4 rounded-md shadow-lg mb-6 text-white border border-slate-700">
                <h3 className="text-lg font-semibold">Welcome to b0a FUSION, {profile.display_name || profile.username || user.email}!</h3>
                <p className="text-sm text-slate-300">Explore your dashboard and manage your projects.</p>
                <button 
                  onClick={handleDismissWelcomeCard} 
                  className="mt-2 text-xs bg-sky-600 hover:bg-sky-700 px-3 py-1 rounded-md"
                >
                  Dismiss
                </button>
              </div>
            )}
            {children}
          </main>
        </div>
        {isParentFullScreenMenuOpen && (
          <FullScreenMobileMenu 
            isOpen={isParentFullScreenMenuOpen} 
            onClose={toggleFullScreenMenu} 
            handleLogout={handleLogout}
            userDisplayName={profile?.display_name || profile?.username}
            userAvatarUrl={profile?.avatar_url}
          />
        )}
      </div>
    </MyCtxProvider>
  );
};