import { NextRequest, NextResponse } from "next/server";

// IMPORTANT: Ensure ADMIN_PASSWORD is set in your .env file
// Do NOT prefix it with NEXT_PUBLIC_
const CORRECT_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(req: NextRequest) {
  if (!CORRECT_PASSWORD) {
    console.error("ADMIN_PASSWORD environment variable is not set.");
    // Return a generic error to avoid revealing server config issues
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json({ error: "Password is required" }, { status: 400 });
    }

    if (password === CORRECT_PASSWORD) {
      // Password matches
      // In a real app, you might issue a session token here
      return NextResponse.json({ success: true });
    } else {
      // Password does not match
      return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "An unexpected error occurred" }, { status: 500 });
  }
} 