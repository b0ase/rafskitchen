import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') || '/profile'; // Default redirect

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    try {
      await supabase.auth.exchangeCodeForSession(code);
      // URL to redirect to after sign in process completes
      return NextResponse.redirect(`${requestUrl.origin}${next}`);
    } catch (error: any) {
      console.error('Error exchanging code for session:', error.message);
      // URL to redirect to in case of error
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_error&error_description=${encodeURIComponent(error.message || 'Could not authenticate user.')}`);
    }
  }

  // URL to redirect to if code is not found
  console.error('No code found in auth callback.');
  return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_error&error_description=Authentication%20failed:%20No%20authorization%20code%20found.`);
} 