'use client';

import { useState, useCallback } from 'react';
// import { useRouter, usePathname } from 'next/navigation';
// import getSupabaseBrowserClient from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

interface Profile {
  id?: string;
  username: string | null;
  display_name: string | null;
}

export default function useProfileData() {
  // const supabase = getSupabaseBrowserClient();
  // const router = useRouter();
  // const pathname = usePathname() ?? '';
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Extremely simplified loadProfileAndSkills - does nothing
  const loadProfileAndSkills = useCallback(async (currentUserParam: User | null, currentPathname: string) => {
    console.log('[useProfileData] Ultra-simplified loadProfileAndSkills called');
    if (currentUserParam) {
        // Simulating a minimal profile set
        setProfile({ id: currentUserParam.id, username: 'test', display_name: 'Test User' });
    }
    setLoading(false);
  }, [setProfile, setLoading]); // Only include actual setters used

  // All useEffects and other logic commented out for now
  /*
  useEffect(() => {
    // ... original first useEffect content ...
  }, [supabase, pathname, profile]);

  useEffect(() => {
    // ... original second useEffect content ...
  }, [user, profile, pathname, loadProfileAndSkills]);
  */

  console.log('[useProfileData] Hook initialized (ultra-simplified)');

  return {
    user,
    profile,
    loading,
    // Return the simplified function so it can be called by components if needed for testing
    loadProfileAndSkills,
    // Other returned values commented out
    /*
    newUsername: '',
    newDisplayName: '',
    // ... all other state values and handlers ...
    */
    // Dummy setters to prevent breaking components that might expect them, though they do nothing
    setNewUsername: () => {},
    setNewDisplayName: () => {},
    // ... add other dummy setters if needed by consuming components during this test
  };
} 