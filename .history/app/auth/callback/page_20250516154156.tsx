'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const [message, setMessage] = useState('Processing authentication...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const oauthError = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (oauthError) {
      console.error('OAuth Callback Error:', oauthError, errorDescription);
      setError(errorDescription || oauthError);
      setMessage(null);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const nextPathQueryParam = searchParams.get('next');

      let redirectTo = '/profile';
      if (nextPathQueryParam) {
        redirectTo = decodeURIComponent(nextPathQueryParam);
      }

      if (event === 'SIGNED_IN' || (session && (event === 'INITIAL_SESSION' || event === 'USER_UPDATED'))) {
        setMessage(`Authentication successful. Redirecting to ${redirectTo}...`);
        const fullRedirectUrl = new URL(redirectTo, window.location.origin).href;
        window.location.assign(fullRedirectUrl);
      } else if (event === 'PASSWORD_RECOVERY') {
        redirectTo = (nextPathQueryParam && nextPathQueryParam.includes('update-password'))
                      ? decodeURIComponent(nextPathQueryParam)
                      : '/update-password';
        setMessage(`Password recovery initiated. Redirecting to ${redirectTo}...`);
        const fullRedirectUrl = new URL(redirectTo, window.location.origin).href;
        window.location.assign(fullRedirectUrl);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [supabase, searchParams]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-red-600">Authentication Error</h2>
          <p className="mt-2 text-sm text-gray-600">{error}</p>
          <p className="mt-2 text-sm text-gray-600">
            Please try again or contact support if the issue persists.
          </p>
          <div>
            <Link href="/login" className="mt-4 group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500">
              Return to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 text-center">
        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Authenticating...</h2>
        <p className="mt-2 text-sm text-gray-600">{message}</p>
      </div>
    </div>
  );
} 