'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs';
import { FaGoogle } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Determine the base URL for redirection
      // Use NEXT_PUBLIC_SITE_URL if available (for Vercel), otherwise fallback to window.location.origin
      const redirectURLBase = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirect to the auth callback handler
          redirectTo: `${redirectURLBase}/auth/callback`,
        },
      });

      if (signInError) {
        console.error('Google Sign-In Error:', signInError);
        setError(`Could not sign in with Google: ${signInError.message}`);
        setIsLoading(false);
      }
    } catch (e: any) {
      console.error('Unexpected Google Sign-In Error:', e);
      setError(`An unexpected error occurred: ${e.message}`);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        const searchParams = new URLSearchParams(window.location.search);
        const redirectedFrom = searchParams.get('redirectedFrom');
        router.push(redirectedFrom || '/profile');
        router.refresh();
      } else if (event === 'SIGNED_OUT') {
        // Optional: handle explicit sign out if user lands here somehow
        // router.push('/'); 
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const searchParams = new URLSearchParams(window.location.search);
        const redirectedFrom = searchParams.get('redirectedFrom');
        router.push(redirectedFrom || '/profile');
        router.refresh();
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 p-8 md:p-12 border border-gray-700 shadow-2xl rounded-lg text-center max-w-md w-full">
        <h1 className="text-3xl font-bold text-white mb-6">Login Required</h1>
        <p className="text-gray-400 mb-8">
          You need to be logged in to access your profile and application tools.
        </p>
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            <FaGoogle className="mr-3 h-5 w-5" />
            {isLoading ? 'Redirecting to Google...' : 'Sign in with Google'}
          </button>
          {error && (
            <p className="mt-3 text-sm text-red-400">{error}</p>
          )}
        </div>
        <div className="mt-8">
          <Link href="/"
            className="text-sky-400 hover:text-sky-300 transition-colors duration-150">
            &larr; Go back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 