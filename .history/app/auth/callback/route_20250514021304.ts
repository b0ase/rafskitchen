import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  // Allow specifying a 'next' URL for redirection after login, defaulting to /profile
  const next = requestUrl.searchParams.get('next') || '/profile'; 

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('Error exchanging code for session:', error);
      // Redirect to an error page or login page with an error message
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_error`);
    }
  } else {
    console.warn('No code found in auth callback request.');
    // Redirect to login if no code is present, possibly with an error
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_auth_code`);
  }

  // Successful authentication, redirect to the 'next' URL or default to /profile
  // Ensure the 'next' path is relative to the origin to prevent open redirect vulnerabilities
  // And ensure it starts with a leading slash if it doesn't have one.
  const safeRedirectPath = next.startsWith('/') ? next : `/${next}`;
  return NextResponse.redirect(new URL(safeRedirectPath, requestUrl.origin).toString());
} 