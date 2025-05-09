import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;
  
  // Get the correct password from the TRUST_PASSWORD environment variable
  // Fall back to a specific default if not set
  const correctPassword = process.env.TRUST_PASSWORD || 'defaulttrustpassword'; // Use a distinct default
  
  if (password === correctPassword) {
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ success: false });
} 