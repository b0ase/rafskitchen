import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = 'richardwboase@gmail.com';
const ADMIN_PROJECT_PASSWORD = 'vcud#WQfRiUW64f'; // For security, move to env in production

export async function POST(req: NextRequest) {
  try {
    const { projectSlug, password, email } = await req.json();
    if (!projectSlug || !password || !email) {
      return NextResponse.json({ error: 'Missing projectSlug, password, or email' }, { status: 400 });
    }
    // Superuser bypass
    if (email === ADMIN_EMAIL && password === ADMIN_PROJECT_PASSWORD) {
      await supabase.from('client_project_access').insert({ project_slug: projectSlug, email });
      return NextResponse.json({ success: true, superuser: true });
    }
    // Fetch the password hash for the project
    const { data, error } = await supabase
      .from('client_project_logins')
      .select('password_hash')
      .eq('project_slug', projectSlug)
      .single();
    if (error || !data) {
      return NextResponse.json({ error: 'Project not found or no password set' }, { status: 404 });
    }
    const isValid = await bcrypt.compare(password, data.password_hash);
    if (!isValid) {
      return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
    }
    // Log the access
    await supabase.from('client_project_access').insert({ project_slug: projectSlug, email });
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 