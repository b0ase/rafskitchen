import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.json();
  const { password } = body;
  
  // Get the correct password from the environment variables
  // Use FINANCES_PASSWORD, fall back to STUDIO_PASSWORD, then to a default
  const correctPassword = process.env.FINANCES_PASSWORD || 
                         process.env.STUDIO_PASSWORD || 
                         'defaultfinancepassword'; // Changed default
  
  if (password === correctPassword) {
    return NextResponse.json({ success: true });
  }
  
  return NextResponse.json({ success: false });
} 