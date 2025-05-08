import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;
  
  // Get the correct password from the environment variables
  // First try STUDIO_PASSWORD, then fall back to NEXT_PUBLIC_STUDIO_PASSWORD
  const correctPassword = process.env.STUDIO_PASSWORD || 
                         process.env.NEXT_PUBLIC_STUDIO_PASSWORD || 
                         'defaultpassword';
  
  if (password === correctPassword) {
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ success: false });
} 