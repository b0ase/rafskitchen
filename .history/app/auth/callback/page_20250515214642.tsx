import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export default async function CallbackPage({ searchParams }) {
  const { code, next } = searchParams

  if (code) {
    const supabase = createServerComponentClient({ cookies })
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Redirect to the 'next' path or a default page
      const redirectTo = next ? decodeURIComponent(next as string) : '/profile'; // Default to /profile or similar dashboard
      return NextResponse.redirect(new URL(redirectTo, process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
    }
  }

  // If there's no code or an error, redirect to the login page with an error parameter
  return NextResponse.redirect(new URL('/login?error=authentication_failed', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'));
} 