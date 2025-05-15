'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import {
  FaUserCircle, FaBookOpen, FaTasks, FaCalendarAlt, FaSignOutAlt, FaDollarSign, FaChartLine, FaLightbulb, FaListAlt, FaBullseye, FaChalkboardTeacher, FaRoute, FaSearchDollar, FaProjectDiagram, FaClipboardList, FaUsers,
  FaCamera
} from 'react-icons/fa';

interface NavLink {
  href: string;
  title: string;
  icon: React.ElementType;
  current?: boolean;
}

interface UserSidebarProps {
  onSetPageTitle: (title: string) => void;
}

export default function UserSidebar({ onSetPageTitle }: UserSidebarProps) {
  console.log('[UserSidebar] NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL); // Log the env var
  const supabase = createClientComponentClient();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [userInitial, setUserInitial] = useState<string>('');
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Define navLinks arrays before they are used in useEffect or JSX
  const navLinksPrimary: NavLink[] = [
    { title: 'My Profile', href: '/profile', icon: FaUserCircle },
    { title: 'My Projects', href: '/myprojects', icon: FaProjectDiagram },
    { title: 'My Team', href: '/team', icon: FaUsers },
    { title: 'My Diary', href: '/diary', icon: FaBookOpen },
    { title: 'Work In Progress', href: '/workinprogress', icon: FaTasks },
    { title: 'My Calendar', href: '/gigs/calendar', icon: FaCalendarAlt },
    { title: 'My Finances', href: '/finances', icon: FaDollarSign },
    { title: 'My Gigs', href: '/gigs', icon: FaListAlt },
    { title: 'Research', href: '/gigs/research', icon: FaSearchDollar },
    { title: 'Strategy', href: '/gigs/strategy', icon: FaBullseye },
    { title: 'Action Plan', href: '/gigs/action', icon: FaTasks },
    { title: 'Learning Path', href: '/gigs/learning-path', icon: FaChalkboardTeacher },
    { title: 'Platforms', href: '/gigs/platforms', icon: FaListAlt },
    { title: 'Work Path', href: '/gigs/work-path', icon: FaRoute },
    { title: 'Fiverr Explorer', href: '/gigs/fiverr-explorer', icon: FaSearchDollar },
  ];

  const navLinksSecondary: NavLink[] = [
    { href: '/settings', title: 'Settings', icon: FaLightbulb },
    // Add more secondary links here if any
  ];

  const allNavLinks = React.useMemo(() => [...navLinksPrimary, ...navLinksSecondary], []); // Memoize if navLinksPrimary/Secondary are stable

  useEffect(() => {
    console.log('[UserSidebar] Setting up onAuthStateChange listener.');
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[UserSidebar] Auth Event: ${event}`, session);
      if (event === 'SIGNED_OUT') {
        console.log('[UserSidebar] SIGNED_OUT event. Clearing user state and redirecting.');
        setUser(null);
        setUserDisplayName('');
        setUserInitial('');
        window.location.assign('/');
      } else if (session?.user) {
        console.log('[UserSidebar] SIGNED_IN or other event with user. Setting user state.', session.user.id);
        setUser(session.user);
      } else {
        console.log('[UserSidebar] No session user. Clearing user state.');
        setUser(null);
        setUserDisplayName('');
        setUserInitial('');
      }
    });

    const getCurrentSession = async () => {
      console.log('[UserSidebar] Initial session fetch attempt.');
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) {
        console.error('[UserSidebar] Error fetching initial session:', error.message);
        setUser(null);
      } else if (session?.user) {
        console.log('[UserSidebar] Initial session found. Setting user:', session.user.id);
        setUser(session.user);
      } else {
        console.log('[UserSidebar] No initial session found.');
        setUser(null);
      }
    };
    getCurrentSession();

    return () => {
      console.log('[UserSidebar] Unsubscribing from onAuthStateChange.');
      if (authListener?.subscription) {
        authListener.subscription.unsubscribe();
      }
    };
  }, [supabase]);

  const fetchUserProfile = useCallback(async (userId: string) => {
    if (!userId) return;
    console.log(`[UserSidebar] Fetching profile for user ID: ${userId}`);
    setIsLoadingProfile(true);
    setUserAvatarUrl(null);

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('display_name, username, avatar_url')
        .eq('id', userId)
        .single();

      if (error) {
        console.error(`[UserSidebar] Error fetching profile for ${userId}:`, error.message);
        const currentUser = supabase.auth.getUser();
        if (currentUser && (await currentUser).data.user?.email) {
          setUserDisplayName((await currentUser).data.user!.email!);
          setUserInitial(((await currentUser).data.user!.email!).charAt(0).toUpperCase());
        } else {
          setUserDisplayName('User (Error)');
          setUserInitial('!');
        }
        setUserAvatarUrl(null);
      } else if (profile) {
        const displayName = profile.display_name || profile.username || user?.email || 'User';
        console.log(`[UserSidebar] Profile fetched for ${userId}:`, displayName, `Avatar URL: ${profile.avatar_url}`);
        setUserDisplayName(displayName);
        setUserInitial(displayName.charAt(0).toUpperCase());
        setUserAvatarUrl(profile.avatar_url || null);
      } else {
        console.log(`[UserSidebar] No profile found for ${userId}, using email as fallback.`);
        if (user?.email) {
            setUserDisplayName(user.email);
            setUserInitial(user.email.charAt(0).toUpperCase());
        } else {
            setUserDisplayName('User (No Profile)');
            setUserInitial('U');
        }
        setUserAvatarUrl(null);
      }
    } catch (e: any) {
      console.error(`[UserSidebar] Exception fetching profile for ${userId}:`, e.message);
      setUserDisplayName('User (Exception)');
      setUserInitial('!');
      setUserAvatarUrl(null);
    } finally {
      setIsLoadingProfile(false);
    }
  }, [supabase, user?.email]);

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    }
  }, [user?.id, fetchUserProfile]);

  // --- NEW AVATAR UPLOAD HANDLER FOR SIDEBAR ---
  const handleSidebarAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      setAvatarUploadError('User not authenticated.');
      console.log('[UserSidebar] Avatar Upload: User not authenticated.');
      return;
    }
    const file = event.target.files?.[0];
    if (!file) {
      setAvatarUploadError('No file selected.');
      console.log('[UserSidebar] Avatar Upload: No file selected.');
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarUploadError(null);
    console.log('[UserSidebar] Avatar Upload: Starting...');

    const fileExt = file.name.split('.').pop();
    const filePath = `public/${user.id}/avatar.${fileExt}`;
    const newTimestamp = new Date().getTime(); // For cache busting

    try {
      // Remove existing avatar(s) to avoid orphaned files if extension changes
      const commonExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
      // Create a list of potential old file paths to remove
      const filesToRemove = commonExtensions.map(ext => `public/${user.id}/avatar.${ext}`);
      const { error: removeError } = await supabase.storage.from('avatars').remove(filesToRemove);
      if (removeError && removeError.message !== 'The resource was not found' && !removeError.message.includes("Could not retrieve metadata")) {
         // Log error if it's not a "not found" error or a generic metadata retrieval issue for non-existing files
        console.warn('[UserSidebar] Avatar Upload: Problem removing old avatars, but proceeding:', removeError.message);
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL - using the known filePath structure for avatars bucket
      // The public URL for items in a public bucket doesn't strictly need getPublicUrl if the path is known and consistent.
      // However, using getPublicUrl is safer if bucket policies change or for signed URLs in private buckets.
      // For a simple public bucket like 'avatars', constructing it might be slightly faster but less robust.
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      if (!publicUrlData?.publicUrl) {
        throw new Error('Could not get public URL for the new avatar.');
      }
      
      // Manual correction for potential double 'public/' segment if getPublicUrl behaves unexpectedly
      // for paths that already include 'public/' (as ours does: `public/${user.id}/avatar.${fileExt}`)
      // This is a common gotcha with Supabase storage URLs.
      let correctedPublicUrl = publicUrlData.publicUrl;
      const storageBaseUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/`;
      const expectedFilePathInUrl = `${user.id}/avatar.${fileExt}`;
      
      // Check if the path is duplicated (e.g., .../avatars/public/user_id/avatar.png)
      if (correctedPublicUrl.startsWith(`${storageBaseUrl}public/`)) {
        correctedPublicUrl = `${storageBaseUrl}${expectedFilePathInUrl}`;
        console.log('[UserSidebar] Avatar Upload: Corrected a duplicated public path in URL.');
      }

      const newPublicAvatarUrlWithCacheBust = `${correctedPublicUrl}?t=${newTimestamp}`;
      console.log('[UserSidebar] Avatar Upload: New avatar URL with cache bust:', newPublicAvatarUrlWithCacheBust);

      // Update profile in DB
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newPublicAvatarUrlWithCacheBust, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (profileUpdateError) throw profileUpdateError;

      // Successfully updated in DB, now refresh local profile data to show new avatar
      console.log('[UserSidebar] Avatar Upload: Profile updated in DB. Refreshing local profile data...');
      await fetchUserProfile(user.id); // This will update userAvatarUrl and re-render
      // setAvatarUploadError(null); // Already null unless an error happens later

    } catch (error: any) {
      console.error('[UserSidebar] Avatar Upload: Error during process:', error);
      setAvatarUploadError(`Upload failed: ${error.message}`);
    } finally {
      setIsUploadingAvatar(false);
      // Clear file input value so the same file can be selected again if needed
      if (event.target) {
        event.target.value = '';
      }
      // Optionally clear error message after a delay
      // setTimeout(() => setAvatarUploadError(null), 5000);
    }
  };
  // --- END NEW AVATAR UPLOAD HANDLER ---

  const handleLogout = async () => {
    console.log('[UserSidebar] handleLogout called.');
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl) {
      // Attempt to derive project reference for specific key removal
      try {
        const urlParts = supabaseUrl.split('//');
        if (urlParts.length > 1) {
          const domainParts = urlParts[1].split('.');
          if (domainParts.length > 0) {
            const projectRef = domainParts[0];
            const supabaseAuthTokenKey = `sb-${projectRef}-auth-token`;
            console.log(`[UserSidebar] Attempting to remove specific localStorage item: ${supabaseAuthTokenKey}`);
            localStorage.removeItem(supabaseAuthTokenKey);
          } else {
            console.warn('[UserSidebar] Could not derive projectRef (domain part) from NEXT_PUBLIC_SUPABASE_URL.');
          }
        } else {
          console.warn('[UserSidebar] Could not derive projectRef (protocol part) from NEXT_PUBLIC_SUPABASE_URL.');
        }
      } catch (e) {
        console.error('[UserSidebar] Error parsing NEXT_PUBLIC_SUPABASE_URL for localStorage key:', e);
        // Fallback to generic key removal if parsing failed
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
              console.log(`[UserSidebar] Fallback (parsing error): Removing potential auth token key: ${key}`);
              localStorage.removeItem(key);
          }
        });
      }
    } else {
      console.warn('[UserSidebar] NEXT_PUBLIC_SUPABASE_URL is not defined. Attempting generic localStorage key removal for auth token.');
      // Fallback to generic key removal if URL is not defined
      Object.keys(localStorage).forEach(key => {
          if (key.startsWith('sb-') && key.endsWith('-auth-token')) {
              console.log(`[UserSidebar] Fallback (URL undefined): Removing potential auth token key: ${key}`);
              localStorage.removeItem(key);
          }
      });
    }

    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[UserSidebar] Error during signOut:', error.message);
      } else {
        console.log('[UserSidebar] supabase.auth.signOut() apparently completed without client-side error.');
      }
    } catch (e) {
      console.error('[UserSidebar] Exception during signOut call:', e);
    } finally {
      // The onAuthStateChange listener should handle clearing user state and redirecting.
      // However, as a final failsafe if onAuthStateChange doesn't trigger or is slow,
      // or if the token removal above was missed by a specific key variant:
      console.log('[UserSidebar] Forcing redirect to / via window.location.assign to clear state and ensure logout.');
      window.location.assign('/'); // This will cause a full page reload and state reset.
    }
  };

  useEffect(() => {
    const currentLink = allNavLinks.find(link => pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/') && link.href.length > 1) || (link.href === '/profile' && pathname === '/'));
    
    if (currentLink) {
      onSetPageTitle(currentLink.title);
    } else {
      // More specific fallback for sections
      const bestMatch = allNavLinks
        .filter(link => link.href !== '/' && pathname.startsWith(link.href))
        .sort((a, b) => b.href.length - a.href.length)[0]; // Get the longest, most specific match

      if (bestMatch) {
        onSetPageTitle(bestMatch.title);
      } else if (pathname === '/') {
        onSetPageTitle('My Profile'); // Default for root if /profile is the main page
      } else {
        onSetPageTitle('App'); // Generic fallback
      }
    }
  }, [pathname, onSetPageTitle, allNavLinks]); // allNavLinks is stable if defined outside

  if (!user && pathname !== '/login' && pathname !== '/signup') {
    return null; 
  }
  
  if (!user) { // If still no user after the above, and on login/signup, also don't render sidebar.
      // This case might be redundant if ConditionalLayout handles session properly already,
      // but good for direct navigation to /login or /signup if UserSidebar were somehow rendered.
      return null;
  }

  return (
    <aside className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform sm:translate-x-0 bg-gray-900 border-r border-gray-700 flex flex-col">
      {/* User Info and Avatar Section */}
      <div className="p-4 space-y-2 border-b border-gray-700 relative group">
        <div 
          className="relative w-10 h-10 mr-3 group cursor-pointer" 
          onClick={() => fileInputRef.current?.click()}
          title="Change avatar"
        >
          {isUploadingAvatar ? (
            <div className="w-full h-full rounded-full bg-gray-700 flex items-center justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-sky-500"></div>
            </div>
          ) : userAvatarUrl ? (
            <img 
              src={userAvatarUrl} 
              alt="User Avatar" 
              className="w-full h-full rounded-full object-cover border-2 border-sky-600 group-hover:opacity-75 transition-opacity"
              crossOrigin="anonymous"
            />
          ) : userInitial ? (
            <div className="w-full h-full rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xl group-hover:opacity-75 transition-opacity">
              {userInitial}
            </div>
          ) : (
            <FaUserCircle className="w-full h-full text-gray-500 group-hover:opacity-75 transition-opacity" />
          )}
          {!isUploadingAvatar && (
            <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 flex items-center justify-center transition-all duration-200">
              <FaCamera className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          )}
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleSidebarAvatarUpload}
          accept="image/png, image/jpeg, image/gif, image/webp"
          className="hidden"
          disabled={isUploadingAvatar}
        />
        <div>
          <p className="text-sm font-medium text-white truncate" title={userDisplayName}>
            {isLoadingProfile && !userDisplayName ? 'Loading...' : userDisplayName || (user ? 'User' : 'Not Logged In')}
          </p>
          <p className="text-xs text-gray-400">Online</p>
        </div>
      </div>

      {/* Navigation Links Section */}
      <div className="flex-grow overflow-y-auto">
        <span className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase block">Main Menu</span>
        <ul className="space-y-1 p-2">
          {navLinksPrimary.map((link) => {
            const isActive = pathname === link.href || 
                           (link.href !== '/' && pathname.startsWith(link.href + '/')) || 
                           (link.href === '/profile' && pathname === '/');
            return (
              <li key={link.title}>
                <Link href={link.href} legacyBehavior>
                  <a className={`flex items-center p-2.5 text-sm rounded-md transition-all duration-150 ease-in-out group hover:bg-sky-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${isActive ? 'bg-sky-600 text-white shadow-md scale-105' : 'text-gray-300 hover:text-gray-100'}`}>
                    <link.icon className={`w-5 h-5 mr-3 transition-colors duration-150 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-sky-300'}`} />
                    {link.title}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
        {navLinksSecondary.length > 0 && (
          <>
            <span className="px-4 pt-4 pb-2 text-xs font-semibold text-gray-500 uppercase block">Configuration</span>
            <ul className="space-y-1 p-2">
              {navLinksSecondary.map((link) => {
                 const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'));
                 return (
                  <li key={link.title}>
                    <Link href={link.href} legacyBehavior>
                       <a className={`flex items-center p-2.5 text-sm rounded-md transition-all duration-150 ease-in-out group hover:bg-sky-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-sky-500 ${isActive ? 'bg-sky-600 text-white shadow-md scale-105' : 'text-gray-300 hover:text-gray-100'}`}>
                        <link.icon className={`w-5 h-5 mr-3 transition-colors duration-150 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-sky-300'}`} />
                        {link.title}
                      </a>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>

      {/* Logout Button Section */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-3 py-2.5 rounded-md text-sm font-medium text-red-400 hover:bg-red-800/50 hover:text-red-300 transition-colors"
        >
          <FaSignOutAlt className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </aside>
  );
} 