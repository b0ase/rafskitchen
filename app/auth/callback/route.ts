import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const next = requestUrl.searchParams.get('next')

  if (code) {
    const supabase = createServerComponentClient({ cookies })
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // If 'next' is present, redirect there, otherwise to a default (e.g., /profile)
      const redirectTo = next ? decodeURIComponent(next) : '/profile'
      return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
    }
  }

  // If there's no code or an error, redirect to an error page or login with an error
  console.error('Auth callback error or no code provided')
  return NextResponse.redirect(new URL('/login?error=authentication_failed', requestUrl.origin))
} 