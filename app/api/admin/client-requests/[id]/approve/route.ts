import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

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
  const { review_notes } = await req.json();
  // Fetch the client request
  const { data: client, error: fetchError } = await supabase.from("client_requests").select("*").eq("id", id).single();
  if (fetchError || !client) {
    return NextResponse.json({ error: "Client request not found" }, { status: 404 });
  }
  // Update status and review info
  const { error: updateError } = await supabase.from("client_requests").update({
    status: "approved",
    review_notes,
    reviewed_by: "richardwboase@gmail.com", // TODO: use real admin email
    reviewed_at: new Date().toISOString(),
  }).eq("id", id);
  if (updateError) {
    return NextResponse.json({ error: updateError.message }, { status: 500 });
  }
  // Insert into clients table if not already present (by email)
  const { data: existingClient } = await supabase.from("clients").select("id").eq("email", client.email).single();
  if (!existingClient) {
    await supabase.from("clients").insert([{
      name: client.name,
      email: client.email,
      website: client.website,
      phone: client.phone,
      logo_url: client.logo_url,
      // Add more fields as needed
    }]);
  }
  // Send approval email
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "richardwboase@gmail.com",
        pass: process.env.GMAIL_APP_PASSWORD, // Use an app password for Gmail
      },
    });
    await transporter.sendMail({
      from: 'B0ASE <richardwboase@gmail.com>',
      to: client.email,
      subject: "Your project request has been approved!",
      text: `Hi ${client.name},\n\nCongratulations! Your project request has been approved. You can now access your client dashboard at B0ASE.COM.\n\nWe'll be in touch soon with next steps.\n\nBest,\nThe B0ASE Team`,
    });
  } catch (e) {
    // Log but don't fail the approval if email fails
    console.error("Email error:", e);
  }
  return NextResponse.json({ success: true });
} 