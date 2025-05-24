import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  
  // Disable all authentication checks - allow access to all routes
  return res;
}

// Configure the middleware to run on specific paths or all paths
// For simplicity, let's have it run on all paths and we'll do the checks inside.
// More specific matching can be done here if performance becomes an issue.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (to prevent redirect loop)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login).*)',
  ],
}; 