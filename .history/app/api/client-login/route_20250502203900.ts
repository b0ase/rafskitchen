import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { projectSlug, password } = await req.json();
    if (!projectSlug || !password) {
      return NextResponse.json({ error: 'Missing projectSlug or password' }, { status: 400 });
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
    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
} 