import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, logo_url, project_brief, requested_budget } = body;
  if (!name || !email || !project_brief) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
  }
  const { error } = await supabase.from("client_requests").insert([{ ...body }]);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
} 