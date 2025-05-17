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
      const { data: { session: initialSession } } = await supabase.auth.getSession();
      setSession(initialSession);
      setIsLoading(false);
    };

    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        // If initial loading was true, and we get a session or null, loading is done.
        if (isLoading) setIsLoading(false); 
      }
    );

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, [supabase, isLoading]); // Added isLoading to dependencies

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