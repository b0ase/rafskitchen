import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // Define protected routes
  const protectedRoutes = [
    '/studio',
    '/workinprogress',
    '/b0aseblueprint',
    '/diary',       // Assuming /app/diary -> /diary
    '/calendar',    // Assuming /app/calendar -> /calendar (the studio one)
    '/finances',
    '/gigs/learning-path',
    '/gigs/work-path',
    // Add any sub-routes of finances if they need individual protection, e.g., '/finances/overview'
  ];

  // Check if the current path is one of the protected routes
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));

  // If it's a protected route and there's no session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    // You can optionally add a query param to redirect back after login
    // redirectUrl.searchParams.set('redirectedFrom', pathname);
    return NextResponse.redirect(redirectUrl);
  }

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