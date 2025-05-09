import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  console.error("Supabase URL is missing. Make sure NEXT_PUBLIC_SUPABASE_URL is set in your .env.local file.");
  throw new Error("Supabase client-side configuration error: URL is missing.");
}

if (!supabaseAnonKey) {
  console.error("Supabase Anon Key is missing. Make sure NEXT_PUBLIC_SUPABASE_ANON_KEY is set in your .env.local file.");
  throw new Error("Supabase client-side configuration error: Anon Key is missing.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 