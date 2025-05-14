'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import {
  FaUserCircle, FaBookOpen, FaTasks, FaCalendarAlt, FaSignOutAlt, FaDollarSign, FaChartLine, FaLightbulb, FaListAlt, FaBullseye, FaChalkboardTeacher, FaRoute, FaSearchDollar, FaProjectDiagram, FaClipboardList, FaUsers
} from 'react-icons/fa';

interface NavLink {
  href: string;
  title: string;
  icon: React.ElementType;
  current?: boolean;
}

export default function UserSidebar() {
  const supabase = createClientComponentClient();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [userInitial, setUserInitial] = useState<string>('');
  const [userDisplayName, setUserDisplayName] = useState<string>('');
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);

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
    setUserDisplayName('Loading...');
    setUserInitial('');

    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('display_name, username')
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
      } else if (profile) {
        const displayName = profile.display_name || profile.username || user?.email || 'User';
        console.log(`[UserSidebar] Profile fetched for ${userId}:`, displayName);
        setUserDisplayName(displayName);
        setUserInitial(displayName.charAt(0).toUpperCase());
      } else {
        console.log(`[UserSidebar] No profile found for ${userId}, using email as fallback.`);
        if (user?.email) {
            setUserDisplayName(user.email);
            setUserInitial(user.email.charAt(0).toUpperCase());
        } else {
            setUserDisplayName('User (No Profile)');
            setUserInitial('U');
        }
      }
    } catch (e: any) {
      console.error(`[UserSidebar] Exception fetching profile for ${userId}:`, e.message);
      setUserDisplayName('User (Exception)');
      setUserInitial('!');
    } finally {
      setIsLoadingProfile(false);
    }
  }, [supabase, user?.email]);

  useEffect(() => {
    if (user?.id) {
      fetchUserProfile(user.id);
    }
  }, [user?.id, fetchUserProfile]);

  const handleLogout = async () => {
    console.log('[UserSidebar] handleLogout called.');
    const supabaseAuthTokenKey = `sb-${process.env.NEXT_PUBLIC_SUPABASE_URL?.split('//')[1]?.split('.')[0]}-auth-token`; // Dynamically constructs like sb-klaputzxeqgypphzdxpr-auth-token
    // A more specific key pattern if the above is not general enough for all Supabase instances:
    // const specificSupabaseAuthTokenKey = 'sb-klaputzxeqgypphzdxpr.supabase.co-auth-token';

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
      console.log(`[UserSidebar] Attempting to remove localStorage item: ${supabaseAuthTokenKey}`);
      localStorage.removeItem(supabaseAuthTokenKey);
      // As an extra measure for different patterns Supabase might use or if URL has port etc.
      // localStorage.removeItem(specificSupabaseAuthTokenKey); 
      // Consider also clearing session storage if Supabase might use it, though less common for the main token.
      // sessionStorage.clear(); // This is very broad, use with caution.

      console.log('[UserSidebar] Forcing redirect to / via window.location.assign to clear state.');
      window.location.assign('/');
    }
  };

  const navLinks: NavLink[] = [
    { title: 'My Profile', href: '/profile', icon: FaUserCircle },
    { title: 'My Projects', href: '/myprojects', icon: FaProjectDiagram },
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
    { title: 'My Team', href: '/team', icon: FaUsers },
  ];

  return (
    <aside className="fixed inset-y-0 left-0 z-40 w-64 bg-gray-900 p-4 border-r border-gray-800 flex flex-col h-screen overflow-y-auto shadow-lg">
      <div className="flex items-center mb-6">
        {userInitial ? (
          <div className="w-10 h-10 rounded-full bg-sky-500 flex items-center justify-center text-white font-bold text-xl mr-3">
            {userInitial}
          </div>
        ) : (
          <FaUserCircle className="w-10 h-10 text-gray-500 mr-3" />
        )}
        <div>
          <p className="text-sm font-medium text-white truncate" title={userDisplayName}>
            {userDisplayName || 'Loading...'}
          </p>
          <p className="text-xs text-gray-400">Online</p>
        </div>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-1.5">
          {navLinks.map((link) => (
            <li key={link.title}>
              <Link
                href={link.href}
                className={`flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors
                  ${pathname === link.href
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
              >
                <link.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                {link.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
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