'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { useRouter, usePathname } from 'next/navigation';
import { FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import Link from 'next/link';

interface Profile {
  display_name: string | null;
  username: string | null;
}

const protectedRoutes = [
  '/studio',
  '/workinprogress',
  '/b0aseblueprint',
  '/diary',
  '/calendar',
  '/finances',
  '/gigs/learning-path',
  '/gigs/work-path',
  '/private',
  '/profile', // Assuming /profile is also a protected page
];

export default function GlobalAuthUI() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      
      if (currentUser) {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('display_name, username')
          .eq('id', currentUser.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile for GlobalAuthUI:', error);
          setProfile(null);
        } else {
          setProfile(data);
        }
      } else {
        setProfile(null);
      }
      setIsLoading(false);
    });

    // Initial check
    const fetchInitialUser = async () => {
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
              console.error('Error fetching initial profile for GlobalAuthUI:', error);
              setProfile(null);
            } else {
              setProfile(data);
            }
        } else {
            setProfile(null);
        }
        setIsLoading(false);
    };

    fetchInitialUser();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/'); // Redirect to homepage after logout
    router.refresh(); // Refresh to ensure server components re-evaluate
  };

  const isOnProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const displayName = profile?.display_name || profile?.username || user?.email?.split('@')[0] || 'User';

  if (isLoading) {
    return null; // Or a very subtle global loader if preferred
  }

  return (
    <>
      {user && (
        <button
          onClick={handleLogout}
          title="Logout"
          className="fixed top-4 right-4 z-50 bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full shadow-lg transition-all"
        >
          <FaSignOutAlt size={18} />
        </button>
      )}
      {user && isOnProtectedRoute && (
        <Link href="/profile" legacyBehavior>
          <a 
            title={`Logged in as ${displayName}. Click to view profile.`}
            className="fixed bottom-4 left-4 z-50 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-lg transition-all flex items-center"
          >
            <FaUserCircle className="mr-2" />
            <span>{displayName}</span>
          </a>
        </Link>
      )}
    </>
  );
} 