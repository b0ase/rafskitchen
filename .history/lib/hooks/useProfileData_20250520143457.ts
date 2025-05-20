'use client';

import { useEffect, useState, FormEvent, ChangeEvent, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Adjust path if needed
import { User } from '@supabase/supabase-js';

// Define interfaces needed by the hook
interface Profile {
  id?: string; // Added id for profile matching in useEffect
  username: string | null;
  display_name: string | null;
  avatar_url?: string | null;
  full_name?: string | null;
  // ... (keep other profile fields if minimal setProfile needs them, otherwise can simplify)
  has_seen_welcome_card?: boolean | null;
}

// Comment out other interfaces for now if not used by the minimal hook
/*
interface ProfileForUpdate { ... }
interface Skill { ... }
interface UserSkill { ... }
interface ColorScheme { ... }
interface Team { ... }
*/

export default function useProfileData() {
  // const supabase = getSupabaseBrowserClient(); // Comment out Supabase client for now
  // const router = useRouter(); // Comment out router for now
  // const pathname = usePathname() ?? ''; // Comment out pathname for now
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null); // Comment out error state

  // Comment out all other useState hooks
  // const [newUsername, setNewUsername] = useState<string>('');
  // ... many other states ...
  // const [showWelcomeCard, setShowWelcomeCard] = useState<boolean>(true);

  const loadProfileAndSkills = useCallback(async (currentUserParam: User | null, currentPathname: string) => {
    console.log('[useProfileData] Ultra-simplified loadProfileAndSkills called with user:', currentUserParam?.id, 'pathname:', currentPathname);
    setLoading(true); // Keep setLoading
    // setError(null); // Comment out setError if its useState is commented

    try {
      // Simulate an async operation
      await new Promise(resolve => setTimeout(resolve, 50)); // Short delay

      if (currentUserParam) {
        console.log('[useProfileData] Simulating profile fetch for user:', currentUserParam.id);
        setProfile({
          id: currentUserParam.id,
          username: 'mockUser',
          display_name: 'Mock User',
          has_seen_welcome_card: false, // Keep if Profile interface has it
        });
      } else {
        console.warn('[useProfileData] No current user provided to ultra-simplified loadProfileAndSkills.');
        setProfile(null);
      }

    } catch (e: any) {
      console.error("[useProfileData] Error in ultra-simplified loadProfileAndSkills:", e.message);
      // setError("Failed to load profile data (ultra-simplified test)."); // Comment out setError
      setProfile(null);
    } finally {
      // setLoadingSkills(false); // Comment out other loaders
      // setLoadingUserTeams(false);
      setLoading(false);
      console.log('[useProfileData] Ultra-simplified loadProfileAndSkills finished.');
    }
  }, [setProfile, setLoading]); // Adjust dependencies: only setProfile, setLoading

  // ALL useEffects COMMENTED OUT
  /*
  useEffect(() => {
    let didMount = true;
    setLoading(true);
    // ... (content of first useEffect)
    return () => {
      didMount = false;
      authListener.subscription?.unsubscribe();
    };
  }, [supabase, pathname, profile]); // Dependencies would also need adjustment if supabase/pathname were active

  useEffect(() => {
    console.log('[useProfileData] Effect 2 triggered for profile loading.', { userId: user?.id, profileLoaded: !!profile, pathname });
    // ... (content of second useEffect)
  }, [user, profile, pathname, loadProfileAndSkills]);
  */

  // ALL OTHER FUNCTIONS (handlers, etc.) COMMENTED OUT
  /*
  const handleSkillToggle = async (skillId: string, isCurrentlySelected: boolean) => { ... };
  const handleAddCustomSkill = async (skillName: string) => { ... };
  const handleSimpleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => { ... };
  const handleUpdateProfile = async (e: FormEvent) => { ... };
  const onLinkedInUrlChange = (e: ChangeEvent<HTMLInputElement>) => setNewLinkedInUrl(e.target.value);
  // ... many other handlers ...
  const handleDismissWelcomeCard = async () => { ... };
  */

  console.log('[useProfileData] Hook initialized (ULTRA-SIMPLIFIED VERSION LOADED)');

  return {
    user,
    profile,
    loading,
    // error, // Comment out if its useState is commented
    loadProfileAndSkills, // Return the ultra-simplified version

    // To prevent breaking components that might destructure these, provide dummy values or functions
    // Or, you might need to temporarily adjust the consuming components not to expect everything
    newUsername: '',
    setNewUsername: () => console.log('setNewUsername (dummy) called'),
    newDisplayName: '',
    setNewDisplayName: () => console.log('setNewDisplayName (dummy) called'),
    // ... (add other dummy returns for all previously returned states/handlers if needed for components not to crash)
    // For a quick test, you might even return only { user, profile, loading, loadProfileAndSkills }
    // and see if the core error vanishes, then deal with component props.
  };
} 