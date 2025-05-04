import { createClient } from '@supabase/supabase-js';

// Ensure the necessary environment variables are set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing env var: NEXT_PUBLIC_SUPABASE_URL');
}

if (!serviceRoleKey) {
  throw new Error('Missing env var: SUPABASE_SERVICE_ROLE_KEY');
}

/**
 * Creates a Supabase client configured for admin operations using the service role key.
 * IMPORTANT: This client bypasses all RLS policies and should only be used in secure
 * server-side environments (e.g., API routes, server components) where you've
 * already verified the user's authorization.
 */
export const createAdminClient = () => {
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      // Limiting retries for admin client might be prudent depending on use case
      // retries: 0,
    },
  });
}; 