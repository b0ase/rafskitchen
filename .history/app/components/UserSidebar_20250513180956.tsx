'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import {
  FaUserCircle, FaBookOpen, FaTasks, FaCalendarAlt, FaSignOutAlt, FaDollarSign, FaChartLine, FaLightbulb, FaListAlt, FaBullseye, FaChalkboardTeacher, FaRoute, FaSearchDollar
} from 'react-icons/fa';

interface NavLink {
  href: string;
  title: string;
  icon: React.ElementType;
  current?: boolean;
}

export default function UserSidebar() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [userInitial, setUserInitial] = useState<string>('');
  const [userDisplayName, setUserDisplayName] = useState<string>('');

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        // Fetch profile to get display_name or username
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('display_name, username')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          const displayName = profile.display_name || profile.username || session.user.email || 'User';
          setUserDisplayName(displayName);
          setUserInitial(displayName.charAt(0).toUpperCase());
        } else if (session.user.email) {
          setUserDisplayName(session.user.email);
          setUserInitial(session.user.email.charAt(0).toUpperCase());
        } else {
          setUserDisplayName('User');
          setUserInitial('U');
        }
        if (error) {
          console.error('Error fetching profile for sidebar:', error);
        }
      }
    };
    getUser();
  }, [supabase, supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirect to homepage after logout
    router.refresh(); // Ensure state is cleared
  };

  const navLinks: NavLink[] = [
    { title: 'My Profile', href: '/profile', icon: FaUserCircle },
    { title: 'Diary', href: '/diary', icon: FaBookOpen },
    { title: 'Work In Progress', href: '/workinprogress', icon: FaTasks },
    { title: 'Calendar', href: '/gigs/calendar', icon: FaCalendarAlt },
    { title: 'Financial Overview', href: '/finances', icon: FaDollarSign },
    { title: 'Gig Management', href: '/gigs', icon: FaListAlt },
    { title: 'Research', href: '/gigs/research', icon: FaSearchDollar },
    { title: 'Strategy', href: '/gigs/strategy', icon: FaBullseye },
    { title: 'Action Plan', href: '/gigs/action', icon: FaTasks },
    { title: 'Learning Path', href: '/gigs/learning-path', icon: FaChalkboardTeacher },
    { title: 'Platforms', href: '/gigs/platforms', icon: FaListAlt },
    { title: 'Work Path', href: '/gigs/work-path', icon: FaRoute },
    { title: 'Fiverr Explorer', href: '/gigs/fiverr-explorer', icon: FaSearchDollar },
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