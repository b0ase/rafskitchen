import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseServer';

// GET: List all clients
export async function GET() {
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST: Create a new client
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { data, error } = await supabase.from('clients').insert([body]).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data, { status: 201 });
}

// PUT: Update a client (expects id in body)
export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { id, ...fields } = body;
  if (!id) return NextResponse.json({ error: 'Missing client id' }, { status: 400 });
  const { data, error } = await supabase.from('clients').update(fields).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

// DELETE: Delete a client (expects id in body)
export async function DELETE(req: NextRequest) {
  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: 'Missing client id' }, { status: 400 });
  const { error } = await supabase.from('clients').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
} 