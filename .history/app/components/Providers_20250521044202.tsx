'use client';

import { ThemeProvider } from 'next-themes';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, SupabaseClient } from '@supabase/supabase-js';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Using the singleton client

type AuthContextType = {
  session: Session | null;
  supabase: SupabaseClient; // Provide client for convenience
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

type Props = {
  children: React.ReactNode;
  // We might not need to pass serverSession here if we primarily rely on client-side real-time updates
  // serverSession: Session | null; 
};

export function Providers({ children }: Props) {
  const supabase = getSupabaseBrowserClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch initial session
    const getInitialSession = async () => {
      console.log('[Providers useEffect TRACE] Attempting to fetch initial session.');
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      console.log('[Providers useEffect TRACE] Initial session fetch complete. Session:', initialSession, ' ');
      setSession(initialSession);
      setIsLoading(false); // Set loading to false only after initial fetch
    };

    getInitialSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('[Providers onAuthStateChange TRACE] Auth state changed. Event:', _event, ', Session user:', session?.user);
        setSession(session);
        // Do NOT set isLoading here; it was handled after the initial fetch.
      }
    );

    return () => {
      console.log('[Providers useEffect TRACE] Cleaning up auth listener.');
      authListener.subscription?.unsubscribe();
    };
  }, [supabase]); // Removed isLoading from dependencies, only supabase needed for setup

  console.log('[Providers Render TRACE] Rendering Providers.', { isLoading, session: !!session });

  return (
    <AuthContext.Provider value={{ session, supabase, isLoading }}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
      </ThemeProvider>
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 