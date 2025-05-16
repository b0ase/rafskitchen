'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const searchParams = useSearchParams(); // To read 'next' or error params
  const [message, setMessage] = useState('Processing authentication...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for OAuth errors returned in the URL
    const oauthError = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (oauthError) {
      console.error('OAuth Callback Error:', oauthError, errorDescription);
      setError(errorDescription || oauthError);
      setMessage(null);
      // No automatic redirect here, user sees error and can click to login
      return; // Stop further processing
    }

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      const nextPath = searchParams.get('next');

      if (event === 'SIGNED_IN' && session) {
        setMessage('Signed in successfully. Redirecting...');
        router.push(nextPath || '/profile');
      } else if (event === 'PASSWORD_RECOVERY' && session) {
        // This event means the user is signed in after a password recovery link (code exchanged)
        setMessage('Password recovery successful. Redirecting to update password...');
        router.push(nextPath || '/update-password'); // 'nextPath' should be '/update-password'
      } else if (event === 'SIGNED_OUT') {
        // This might occur if the session becomes invalid while on this page
        setMessage('Session ended. Redirecting to login...');
        router.push('/login');
      }
      // Other events like USER_UPDATED, TOKEN_REFRESHED could be handled if needed
    });

    // Initial check in case the event fired before listener was attached or for direct navigation
    // Supabase client might have already processed the URL by the time this runs.
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession && !oauthError) {
        // If a session exists and no OAuth error was in URL, assume sign-in was successful.
        // This handles cases where onAuthStateChange might have already fired or session was established quickly.
        setMessage('Session active. Redirecting...');
        const nextPath = searchParams.get('next');
        // Determine if this session is part of password recovery that needs to go to update-password
        // This is tricky without knowing the *intent* that led to this session here.
        // The PASSWORD_RECOVERY event is more reliable for that specific flow.
        // For now, general redirect:
        router.push(nextPath || '/profile');
      } else if (!currentSession && !oauthError) {
        setMessage('Waiting for authentication to complete...');
        // If no session and no error, we wait for onAuthStateChange or a timeout.
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl text-center max-w-md w-full">
        {message && !error && <p className="text-lg mb-4">{message}</p>}
        {error && (
          <div className="text-red-400 bg-red-900/50 border border-red-700 p-4 rounded-md mb-4">
            <p className="font-semibold text-xl mb-2">Authentication Error</p>
            <p>{error}</p>
          </div>
        )}
        
        {!error && !message?.toLowerCase().includes('redirecting') && (
          <div className="mt-4">
             <div role="status" className="flex justify-center items-center">
                <svg aria-hidden="true" className="w-10 h-10 text-gray-400 animate-spin fill-sky-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 43.9905 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0492C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                </svg>
                <span className="sr-only">Loading...</span>
            </div>
          </div>
        )}
        {(error || message?.toLowerCase().includes('waiting')) && (
            <Link href="/login" className="block mt-6 text-sm text-sky-400 hover:text-sky-300 underline">
              Return to Login
            </Link>
        )}
      </div>
    </div>
  );
} 