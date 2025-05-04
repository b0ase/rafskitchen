import { NextRequest, NextResponse } from "next/server";
// Use the admin client for server-side operations
import { createClient } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'; // Assuming you have this helper

// Remove old client initialization if it existed directly here
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const supabase = createClient(supabaseUrl, supabaseAnonKey);


// Placeholder: Replace with real admin auth check
function isAdmin(req: NextRequest) {
  // TODO: Integrate with Supabase Auth RLS or custom logic
  return true;
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Use the admin client now
  const supabaseAdmin = createAdminClient();

  const { data, error } = await supabaseAdmin
    .from("client_requests")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching client requests:", error); // Log error server-side
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// Optional: Add POST/PUT/DELETE methods if needed for admin actions 