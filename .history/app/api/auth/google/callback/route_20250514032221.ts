import { NextRequest, NextResponse } from 'next/server';

// This will handle the callback from Google OAuth
// For now, it will just log the request and return a simple response.

export async function GET(request: NextRequest) {
  console.log('Google OAuth Callback - GET request received');
  // In a real scenario, you would exchange the authorization code for tokens here.
  // The authorization code is usually in the searchParams (e.g., request.nextUrl.searchParams.get('code'))

  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    console.error('Google OAuth Error:', error);
    // Redirect to an error page or show an error message
    return NextResponse.redirect(new URL('/finances?error=google_auth_failed', request.url));
  }

  if (code) {
    console.log('Google OAuth Code:', code);
    // TODO: Exchange code for tokens (access_token, refresh_token)
    // TODO: Store tokens securely (e.g., associate refresh_token with user in DB)
    // For now, redirecting to finances page with a success query param
    return NextResponse.redirect(new URL('/finances?google_auth=success', request.url));
  }

  console.log('Google OAuth Callback - No code or error found in query params.');
  // Redirect to an error page or show an error message
  return NextResponse.redirect(new URL('/finances?error=google_auth_incomplete', request.url));
}

// POST handler might not be directly used by Google's redirect, 
// but good to have a basic structure.
export async function POST(request: NextRequest) {
  console.log('Google OAuth Callback - POST request received');
  return NextResponse.json({ message: 'POST request to Google OAuth callback' }, { status: 200 });
} 