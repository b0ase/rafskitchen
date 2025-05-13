'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import {
  FaSignOutAlt,
  FaUserCircle,
  FaTachometerAlt, // Dashboard/Studio
  FaBook, // Diary, Learning Path
  FaTasks, // Work In Progress, Action Plan
  FaCalendarAlt, // Calendar
  FaDollarSign, // Finances
  FaBriefcase, // Gig Management, Work Path
  FaSearch, // Research, Fiverr Explorer
  FaLightbulb, // Strategy
  FaNetworkWired, // Platforms
  FaUserEdit, // Profile
} from 'react-icons/fa';

interface Profile {
  display_name: string | null;
  username: string | null;
}

const sidebarNavLinks = [
  { href: '/studio', title: 'Studio Home', icon: FaTachometerAlt }, // Added a link back to studio home
  { href: '/profile', title: 'My Profile', icon: FaUserEdit },
  { href: '/diary', title: 'Diary', icon: FaBook },
  { href: '/workinprogress', title: 'Work In Progress', icon: FaTasks },
  { href: '/gigs/calendar', title: 'Calendar', icon: FaCalendarAlt },
  { href: '/finances', title: 'Financial Overview', icon: FaDollarSign },
  { href: '/gigs', title: 'Gig Management', icon: FaBriefcase },
  { href: '/gigs/research', title: 'Research', icon: FaSearch },
  { href: '/gigs/strategy', title: 'Strategy', icon: FaLightbulb },
  { href: '/gigs/action', title: 'Action Plan', icon: FaTasks }, 
  { href: '/gigs/learning-path', title: 'Learning Path', icon: FaBook },
  { href: '/gigs/platforms', title: 'Platforms', icon: FaNetworkWired },
  { href: '/gigs/work-path', title: 'Work Path', icon: FaBriefcase },
  { href: '/gigs/fiverr-explorer', title: 'Fiverr Explorer', icon: FaSearch },
];

export default function UserSidebar() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user || null;
      setUser(currentUser);

      if (currentUser) {
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, username')
          .eq('id', currentUser.id)
          .single();
        if (error) {
          console.error('Error fetching profile for Sidebar:', error);
          setProfile(null);
        } else {
          setProfile(data);
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    };

    fetchUserAndProfile();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (!currentUser) {
        setProfile(null);
        // Optionally redirect if user signs out from another tab, though middleware should handle this primarily
        // router.push('/'); 
      } else if (currentUser && !profile) { // Fetch profile if user logs in and profile isn't set
        fetchUserAndProfile(); // Re-fetch, could be more targeted
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]); // Added router to dependencies

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  const displayName = profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'User';

  // This sidebar should only render if the user is logged in.
  // The decision to render it based on route will be handled by GlobalAuthUI or the layout.
  if (isLoading) {
    return (
      <div className="fixed top-0 left-0 h-full w-64 bg-gray-800 text-white p-4 z-50 flex items-center justify-center">
        <p>Loading User...</p>
      </div>
    );
  }
  
  if (!user) {
    return null; // Don't render anything if not logged in
  }

  return (
    <div className="fixed top-28 left-0 h-[calc(100vh-7rem)] w-64 bg-gray-800 text-white p-4 z-40 flex flex-col shadow-lg">
      {/* User Info Section */}
      <div className="mb-6 p-2 border-b border-gray-700">
        <FaUserCircle className="text-3xl text-sky-400 mx-auto mb-2" />
        <p className="text-center text-sm font-semibold truncate" title={displayName}>{displayName}</p>
        {user.email && <p className="text-center text-xs text-gray-400 truncate" title={user.email}>{user.email}</p>}
      </div>

      {/* Navigation Links */}
      <nav className="flex-grow overflow-y-auto space-y-1 pr-2">
        {sidebarNavLinks.map((link) => {
          const isActive = pathname === link.href || (link.href !== '/studio' && pathname.startsWith(link.href));
          const Icon = link.icon;
          return (
            <Link key={link.href} href={link.href} legacyBehavior>
              <a
                className={`flex items-center px-3 py-2.5 text-sm rounded-md transition-colors 
                            ${isActive 
                              ? 'bg-sky-600 text-white' 
                              : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <Icon className={`mr-3 flex-shrink-0 h-5 w-5 ${isActive ? 'text-white' : 'text-sky-400'}`} />
                <span className="truncate">{link.title}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center px-3 py-2.5 text-sm rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors"
        >
          <FaSignOutAlt className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
} 