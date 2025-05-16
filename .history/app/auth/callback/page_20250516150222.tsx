'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>('Processing authentication...');

  useEffect(() => {
    const code = searchParams.get('code');
    const next = searchParams.get('next'); // For password reset, 'next' should be '/update-password'

    const exchangeCode = async (authCode: string) => {
      setMessage('Exchanging code for session...');
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(authCode);
      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError);
        setError(`Authentication failed: ${exchangeError.message}. Please try again.`);
        setMessage(null);
        // Optionally redirect to login with error
        // router.push('/login?error=auth_exchange_failed'); 
      } else {
        // Session should be set, onAuthStateChange will likely handle the main redirect
        // For password reset, we specifically want to go to 'next' (e.g., /update-password)
        setMessage('Session established. Redirecting...');
        if (next) {
          router.push(next);
        } else {
          router.push('/profile'); // Default redirect if no 'next'
        }
      }
    };

    if (code) {
      exchangeCode(code);
    } else {
      // This handles OAuth flows (like Google) where the session is set client-side
      // after redirect and picked up by onAuthStateChange.
      // It also handles cases where the user lands here without a code.
      // We can check if a session already exists from the redirect hash.
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          setMessage('Session detected. Redirecting...');
          if (next) { // If 'next' is somehow present with a session but no code
            router.push(next);
          } else {
            router.push('/profile');
          }
        } else {
          // If no code and no session, it might be an incomplete OAuth redirect or direct navigation.
          // The onAuthStateChange listener should ideally catch successful OAuth.
          // If still no session after a bit, it could be an error or direct nav.
           setMessage('Waiting for session or further instructions...');
           // Consider a timeout or a more explicit message if nothing happens
        }
      });
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        setMessage('Signed in successfully. Redirecting...');
        // If 'next' was specifically for password update, prioritize that ONLY if coming from code exchange.
        // For general SIGNED_IN, go to profile or where 'next' intended if it's a general purpose 'next'.
        // The code exchange logic above already handles 'next' for password reset.
        // This onAuthStateChange is more for general OAuth success.
        if (next && !code) { // If 'next' is present and it wasn't a code exchange
            router.push(next);
        } else if (!next && !code) { // Typical OAuth (Google) sign in, no specific 'next' from URL
            router.push('/profile');
        }
        // If 'code' was present, the exchangeCode function's redirect takes precedence.
      } else if (event === 'PASSWORD_RECOVERY') {
        // This event fires after exchangeCodeForSession if it was for password recovery.
        // The user is signed in, and we should redirect them to update their password.
        setMessage('Password recovery initiated. Redirecting to update password...');
        router.push(next || '/update-password'); // Ensure 'next' is respected or default
      } else if (event === 'SIGNED_OUT') {
        router.push('/login');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center">
        {message && <p className="text-lg mb-4">{message}</p>}
        {error && (
          <div className="text-red-400 bg-red-900 p-3 rounded-md mb-4">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}
        {!error && !message?.includes('Redirecting') && (
             <div role="status" className="flex justify-center items-center">
                <svg aria-hidden="true" className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-sky-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 43.9905 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
        )}
        <Link href="/login" className="mt-6 text-sm text-sky-400 hover:text-sky-300 underline">
          Return to Login
        </Link>
      </div>
    </div>
  );
} 