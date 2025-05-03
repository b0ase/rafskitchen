import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Placeholder: Replace with real admin auth check
function isAdmin(req: NextRequest) {
  // TODO: Integrate with Supabase Auth
  return true;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = params.id;
  const { review_notes, rejection_reason } = await req.json();
  // Fetch the client request
  const { data: client, error: fetchError } = await supabase.from("client_requests").select("*").eq("id", id).single();
  if (fetchError || !client) {
    return NextResponse.json({ error: "Client request not found" }, { status: 404 });
  }
  // Update status and review info
  const { error: updateError } = await supabase.from("client_requests").update({
    status: "rejected",
    review_notes,
    rejection_reason,
    reviewed_by: "richardwboase@gmail.com", // TODO: use real admin email
    reviewed_at: new Date().toISOString(),
  }).eq("id", id);
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }
  // Prepare mailto link
  const subject = encodeURIComponent("Regarding your project request at B0ASE.COM");
  const body = encodeURIComponent(
    `Hi ${client.name},\n\nThank you for your interest in working with B0ASE. After careful review, we are unable to move forward with your project at this time.\n\nReason: ${rejection_reason || "(please edit this message before sending)"}\n\nWe appreciate your effort and wish you the best of luck with your project.\n\nBest,\nThe B0ASE Team`
  );
  const mailto = `mailto:${client.email}?subject=${subject}&body=${body}`;
  return NextResponse.json({ success: true, mailto });
} 