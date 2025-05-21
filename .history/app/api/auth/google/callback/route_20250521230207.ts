import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

// This will handle the callback from Google OAuth
// For now, it will just log the request and return a simple response.

export async function GET(request: NextRequest) {
  console.log('Google OAuth Callback - GET request received');
  const supabase = createRouteHandlerClient({ cookies });

  const { data: { session }, error: sessionError } = await supabase.auth.getSession();

  if (sessionError || !session) {
    console.error('Google OAuth Callback: No active session found.', sessionError);
    return NextResponse.redirect(new URL('/login?error=session_expired&next=/finances', request.url));
  }
  const userId = session.user.id;

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const state = searchParams.get('state'); // Optional: if you implement CSRF protection with state param

  if (error) {
    console.error('Google OAuth Error from callback:', error);
    return NextResponse.redirect(new URL(`/finances?error=google_auth_failed&message=${encodeURIComponent(error)}`, request.url));
  }

  if (!code) {
    console.error('Google OAuth Callback - No code found in query params.');
    return NextResponse.redirect(new URL('/finances?error=google_auth_incomplete&message=Authorization_code_missing', request.url));
  }

  try {
    console.log('GOOGLE_CLIENT_ID in callback route:', process.env.GOOGLE_CLIENT_ID);
    console.log('GOOGLE_CLIENT_SECRET in callback route:', process.env.GOOGLE_CLIENT_SECRET ? 'SET' : 'NOT SET'); // Don't log the secret itself
    console.log('NODE_ENV in callback route:', process.env.NODE_ENV);

    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.NODE_ENV === 'production' 
        ? 'https://b0ase.com/api/auth/google/callback' 
        : 'http://localhost:3000/api/auth/google/callback'
    );

    console.log('Exchanging code for tokens...');
    const { tokens } = await oauth2Client.getToken(code);
    console.log('Tokens received from Google:', 
      {
        access_token: tokens.access_token ? '[REDACTED_ACCESS]' : null,
        refresh_token: tokens.refresh_token ? '[REDACTED_REFRESH]' : null,
        expiry_date: tokens.expiry_date,
        scope: tokens.scope
      }
    );

    if (!tokens.refresh_token) {
      // This can happen if the user has previously authorized and a refresh token was already issued and not revoked.
      // Or if the consent screen was not configured to request offline access (though 'access_type=offline' should handle this).
      // For simplicity now, we'll proceed if we get an access token, but ideally, we want a refresh token for long-term access.
      console.warn('Google OAuth: No refresh_token received. This may limit long-term access if not already stored.');
      if (!tokens.access_token) {
        throw new Error('No access_token or refresh_token received from Google.');
      }
    }

    // Store tokens in Supabase
    // We use upsert to either insert a new record or update an existing one for the user.
    // Only store the refresh_token if we receive one.
    const tokenDataToStore: any = {
      user_id: userId,
      access_token: tokens.access_token,
      expires_at: tokens.expiry_date ? new Date(tokens.expiry_date).toISOString() : null,
      scopes: tokens.scope ? tokens.scope.split(' ') : null,
    };
    if (tokens.refresh_token) {
      tokenDataToStore.refresh_token = tokens.refresh_token;
    }

    const { error: storeError } = await supabase
      .from('user_google_tokens')
      .upsert(tokenDataToStore, { onConflict: 'user_id' });

    if (storeError) {
      console.error('Error storing Google tokens in Supabase:', storeError);
      throw new Error(`Failed to store Google tokens: ${storeError.message}`);
    }

    console.log('Google tokens stored successfully for user:', userId);
    // Redirect back to the finances page, perhaps with a success message
    return NextResponse.redirect(new URL('/finances?google_auth_status=success', request.url));

  } catch (e: any) {
    console.error('Error during Google OAuth token exchange or storage:', e.message);
    let errorMessage = 'An error occurred during Google authentication.';
    if (e.response?.data?.error_description) {
      errorMessage = e.response.data.error_description;
    }
    return NextResponse.redirect(new URL(`/finances?error=google_token_exchange_failed&message=${encodeURIComponent(errorMessage)}`, request.url));
  }
}

// POST handler might not be directly used by Google's redirect, 
// but good to have a basic structure.
export async function POST(request: NextRequest) {
  console.log('Google OAuth Callback - POST request received (not typical for redirect)');
  return NextResponse.json({ message: 'POST request to Google OAuth callback not implemented for token exchange' }, { status: 405 });
} 