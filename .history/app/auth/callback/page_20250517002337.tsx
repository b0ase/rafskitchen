'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState('Processing authentication...');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const errorCode = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (errorCode) {
      console.error('Auth Callback Error from server:', errorCode, errorDescription);
      setError(decodeURIComponent(errorDescription || errorCode || 'An unknown authentication error occurred.'));
      setMessage(null);
    } else {
      const sessionStatus = searchParams.get('session_status');
      if (sessionStatus === 'success') {
        setMessage('Authentication successful. Redirecting shortly...');
      } else if (!errorCode) {
        // This case should ideally not be reached if server-side redirect works.
      }
    }
  }, [searchParams, router]);

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
        <div className="mt-4">
          <svg className="animate-spin h-8 w-8 text-sky-600 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p className="mt-4 text-xs text-gray-500">If you are not redirected automatically, please ensure cookies are enabled and try again.</p>
      </div>
    </div>
  );
} 