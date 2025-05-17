import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '../database.types'; // Assuming your Database types are here

// Define a global variable to hold the client instance
let supabaseBrowserClient: ReturnType<typeof createClientComponentClient<Database>> | null = null;

function getSupabaseBrowserClient() {
  if (!supabaseBrowserClient) {
    console.log('[SupabaseClient] Creating new Supabase browser client using createClientComponentClient');
    // Note: createClientComponentClient doesn't take URL and Key directly as it reads them from environment variables by default.
    supabaseBrowserClient = createClientComponentClient<Database>();
  }
  return supabaseBrowserClient;
}

export default getSupabaseBrowserClient; 