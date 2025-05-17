import { createBrowserClient } from '@supabase/ssr';

// Define a global variable to hold the client instance
let supabaseBrowserClient: ReturnType<typeof createBrowserClient> | null = null;

function getSupabaseBrowserClient() {
  if (!supabaseBrowserClient) {
    console.log('[SupabaseClient] Creating new Supabase browser client');
    supabaseBrowserClient = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return supabaseBrowserClient;
}

export default getSupabaseBrowserClient; 