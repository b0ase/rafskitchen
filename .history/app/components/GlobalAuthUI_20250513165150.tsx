'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import UserSidebar from './UserSidebar'; // Import the new sidebar

// Re-define or import protectedRoutes if not available globally
const protectedRoutes = [
  '/studio',
  '/profile',
  '/diary',
  '/workinprogress',
  '/b0aseblueprint', // Make sure this is in your middleware too if it needs protection
  '/calendar', // Path from studio links was /gigs/calendar
  '/finances',
  '/gigs', // Main gigs page
  '/gigs/research',
  '/gigs/strategy',
  '/gigs/action',
  '/gigs/learning-path',
  '/gigs/platforms',
  '/gigs/work-path',
  '/gigs/fiverr-explorer',
  '/private',
];

export default function GlobalAuthUI() {
  const supabase = createClientComponentClient();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Initial check
    const fetchInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };
    fetchInitialSession();

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase]);

  const isOnProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  if (isLoading) {
    // While loading auth state, don't render the sidebar yet to avoid flash of content
    // Or, you could render a placeholder specifically for the sidebar area if needed.
    return null;
  }

  // Render UserSidebar if user is logged in AND on a protected route
  if (user && isOnProtectedRoute) {
    return <UserSidebar />;
  }

  return null; // Otherwise, render nothing (no global UI elements for logged-out users or non-protected pages)
} 