import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import nodemailer from "nodemailer";

// Reuse Supabase client setup (consider moving to a shared lib)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Placeholder: Replace with real admin auth check (ideally in middleware/layout)
function isAdmin(req: NextRequest) {
  // TODO: Integrate with Supabase Auth
  return true;
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const id = params.id;

  // Fetch the client request details (name, email)
  const { data: client, error: fetchError } = await supabase
    .from("client_requests")
    .select("name, email, status") // Only fetch necessary fields
    .eq("id", id)
    .single();

  if (fetchError || !client) {
    return NextResponse.json({ error: "Client request not found" }, { status: 404 });
  }

  // Optional: Add check if status is actually 'approved' before resending?
  // if (client.status !== 'approved') {
  //   return NextResponse.json({ error: "Client is not approved, cannot resend email." }, { status: 400 });
  // }

  // Send approval email using configured credentials
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_SENDER_EMAIL || "richardwboase@gmail.com", // Allow override via env var
        pass: process.env.GMAIL_APP_PASSWORD, // Ensure this is set in .env
      },
    });

    if (!process.env.GMAIL_APP_PASSWORD) {
       console.error("GMAIL_APP_PASSWORD is not set. Cannot send email.");
       // Return an error specific to email config issue
       return NextResponse.json({ error: "Email configuration error on server" }, { status: 500 });
    }
    
    const senderEmail = process.env.GMAIL_SENDER_EMAIL || "richardwboase@gmail.com";

    await transporter.sendMail({
      from: `B0ASE <${senderEmail}>`, // Use sender email from config
      to: client.email,
      subject: "Your project request has been approved!",
      // Consider making email content configurable or using templates
      text: `Hi ${client.name},\n\nCongratulations! Your project request has been approved. You can now access your client dashboard at B0ASE.COM.\n\nWe'll be in touch soon with next steps.\n\nBest,\nThe B0ASE Team`,
      // html: `<p>Hi ${client.name},</p><p>Congratulations! ... </p>` // Optional HTML version
    });

    console.log(`Resent approval email successfully to ${client.email}`);
    return NextResponse.json({ success: true, message: `Approval email resent to ${client.email}` });

  } catch (e) {
    console.error("Resend Email error:", e);
    // Provide a more specific error if possible
    const errorMessage = e instanceof Error ? e.message : "Failed to resend email.";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 