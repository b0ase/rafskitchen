'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs';
import { FaGoogle, FaEnvelope, FaLock } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const handleEmailPasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsEmailLoading(true);
    setError(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Email Sign-In Error:', signInError);
        setError(`Could not sign in: ${signInError.message}`);
        setIsEmailLoading(false);
      } else {
        // onAuthStateChange will handle redirect if successful
        // No explicit redirect here to avoid race conditions with listener
        // router.push('/profile'); // Typically handled by onAuthStateChange
      }
    } catch (e: any) {
      console.error('Unexpected Email Sign-In Error:', e);
      setError(`An unexpected error occurred: ${e.message}`);
    } finally {
      setIsEmailLoading(false);
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
        <h1 className="text-3xl font-bold text-white mb-6">Login</h1>
        <p className="text-gray-400 mb-8">
          Access your profile and application tools.
        </p>

        <form onSubmit={handleEmailPasswordSignIn} className="space-y-4 mb-6">
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaEnvelope className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-600 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                placeholder="you@example.com"
                disabled={isEmailLoading}
              />
            </div>
          </div>
          <div>
            <label htmlFor="password" className="sr-only">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaLock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2.5 border border-gray-600 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                placeholder="Password"
                disabled={isEmailLoading}
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              disabled={isEmailLoading || !email || !password}
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              {isEmailLoading ? 'Signing in...' : 'Sign in with Email'}
            </button>
          </div>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-gray-900 text-sm text-gray-500">Or continue with</span>
          </div>
        </div>
        
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