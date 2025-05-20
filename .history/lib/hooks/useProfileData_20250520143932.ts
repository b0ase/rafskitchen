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

// Uncomment Skill and UserSkill interfaces
/*
interface ProfileForUpdate { ... }
*/
interface Skill {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
}

interface UserSkill {
  id: string;
  user_id: string;
  skill_id: string;
  skills?: Pick<Skill, 'id' | 'name' | 'category'>; // UserSkill might reference Skill
}
/*
interface ColorScheme { ... }
interface Team { ... }
*/

export default function useProfileData() {
  const supabase = getSupabaseBrowserClient(); // Uncomment Supabase client
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Uncomment skill-related states
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [userSkillIds, setUserSkillIds] = useState<Set<string>>(new Set());
  const [loadingSkills, setLoadingSkills] = useState<boolean>(true);
  const [savingSkills, setSavingSkills] = useState<boolean>(false);

  // Comment out all other useState hooks (userTeams, customSkillInput, etc. remain commented for now)
  // const [userTeams, setUserTeams] = useState<Team[]>([]);
  // const [loadingUserTeams, setLoadingUserTeams] = useState<boolean>(true);
  // const [errorUserTeams, setErrorUserTeams] = useState<string | null>(null);
  // const [customSkillInput, setCustomSkillInput] = useState<string>('');
  // const [skillChoiceInAdder, setSkillChoiceInAdder] = useState<string>('');
  // const [newUsername, setNewUsername] = useState<string>('');

  const loadProfileAndSkills = useCallback(async (currentUserParam: User | null, currentPathname: string) => {
    console.log('[useProfileData] Ultra-simplified loadProfileAndSkills called with user:', currentUserParam?.id, 'pathname:', currentPathname);
    setLoading(true); // Keep setLoading
    setError(null); // Clear error before loading

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
      setError("Failed to load profile data (ultra-simplified test).");
      setProfile(null);
    } finally {
      // setLoadingSkills(false); // Comment out other loaders
      // setLoadingUserTeams(false);
      setLoading(false);
      console.log('[useProfileData] Ultra-simplified loadProfileAndSkills finished.');
    }
  }, [setProfile, setLoading, setError]); // Add setError to dependencies

  // REINTRODUCE THE FIRST useEffect
  useEffect(() => {
    let didMount = true;
    // setLoading(true); // setLoading is already true by default, and also set in loadProfileAndSkills
    // Initial setLoading(true) should be at the hook's top level default state.
    // Subsequent true settings should be at the start of async ops like performFetchInitialUser or loadProfileAndSkills.
    console.log("[useProfileData] First useEffect (reintroduced) triggered. Pathname:", pathname);

    const performFetchInitialUser = async () => {
      console.log("[useProfileData] performFetchInitialUser called");
      setLoading(true); // Set loading true at the start of this async op
      try {
        const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser();
        console.log("[useProfileData] supabase.auth.getUser() returned", { fetchedUser: !!fetchedUser, userError: !!userError });

        if (!didMount) {
          console.log("[useProfileData] Component unmounted before user fetch completed.");
          return;
        }

        if (userError) {
          console.error("[useProfileData] Error fetching initial user:", userError.message);
          if (didMount) {
            setUser(null);
            setProfile(null);
            // setUserTeams([]); // Keep commented
            // setAllSkills([]); // Keep commented
            // setSelectedSkills([]); // Keep commented
            // setUserSkillIds(new Set()); // Keep commented
            setError("Failed to authenticate. Please try again.");
            setLoading(false); // Error, stop loading.
          }
          return;
        }

        console.log("[useProfileData] Setting user state with fetchedUser:", fetchedUser?.id);
        if (didMount) setUser(fetchedUser); // Set user state (might be null)

        if (fetchedUser) {
          const onAppPageNeedingProfile = (
            (pathname.startsWith('/profile') || pathname.startsWith('/account') || pathname.startsWith('/skills'))
          );
          console.log("[useProfileData] Fetched user. ID:", fetchedUser.id, "On app page needing profile?", onAppPageNeedingProfile);

          if (!(profile && profile.id === fetchedUser.id) && onAppPageNeedingProfile) {
            console.log("[useProfileData] User exists, profile not loaded/mismatched for this page. Loading remains true (Effect 2 will handle).");
            // setLoading(true) is already set, Effect 2 should pick this up
          } else {
            console.log("[useProfileData] User exists. Profile loaded or not on a page needing immediate profile. Setting loading to false.");
            if (didMount) setLoading(false);
          }
        } else {
          console.log("[useProfileData] No user fetched. Clearing profile, setting loading to false.");
          if (didMount) {
            setProfile(null);
            // setUserTeams([]); // Keep commented
            // setAllSkills([]); // Keep commented
            // setSelectedSkills([]); // Keep commented
            // setUserSkillIds(new Set()); // Keep commented
            setError(null);
            setLoading(false);
          }
        }
      } catch (err: any) {
        if (didMount) {
          console.error("[useProfileData] Exception in performFetchInitialUser:", err.message);
          setUser(null);
          setProfile(null);
          // setUserTeams([]); // Keep commented
          // setAllSkills([]); // Keep commented
          // setSelectedSkills([]); // Keep commented
          // setUserSkillIds(new Set()); // Keep commented
          setError("An unexpected error occurred during initial user fetch.");
          setLoading(false);
        }
      }
    };

    performFetchInitialUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[useProfileData] Auth state changed. Event: ${event}, Session user: ${session?.user?.id}`);
      if (!didMount) {
        console.log("[useProfileData] Auth state change on unmounted component.");
        return;
      }
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (event === 'SIGNED_OUT') {
        console.log('[useProfileData] User signed out by auth event. Clearing states.');
        setProfile(null);
        // Clear other states if they were active
        setAllSkills([]);
        setSelectedSkills([]);
        setUserSkillIds(new Set());
        setLoadingSkills(false);
        setError(null);
        // setShowWelcomeCard(true); // Keep commented
        // Conditional redirect might be handled by ConditionalLayout or page itself
        // if (pathname !== '/login') router.push('/login'); // Let ConditionalLayout handle this
      } else if (event === 'SIGNED_IN' && currentUser) {
        console.log('[useProfileData] User signed in by auth event:', currentUser.id);
        // It might be appropriate to trigger profile loading here if not already handled
        // loadProfileAndSkills(currentUser, pathname); // Or let the second useEffect handle it based on user state change
      } else if (event === 'USER_UPDATED' && currentUser) {
        console.log('[useProfileData] User updated by auth event:', currentUser.id);
        // Potentially re-fetch profile if user metadata changed, e.g. email verification
        // loadProfileAndSkills(currentUser, pathname);
      }
      if (!currentUser && event !== 'SIGNED_OUT') {
        console.log('[useProfileData] Session/user became null without explicit SIGNED_OUT. Clearing profile.');
        setProfile(null);
      }
    });

    return () => {
      console.log("[useProfileData] Cleaning up first useEffect (auth listener etc).");
      didMount = false;
      authListener.subscription?.unsubscribe();
    };
  }, [supabase, pathname, profile, router]); // Added supabase, router. profile is there to re-evaluate if profile itself changes from outside?
                                          // Consider if `profile` is truly needed here or if it causes too many re-runs of this effect.
                                          // For now, keeping it as per original structure before massive commenting.

  // Second useEffect REMAINS UNCOMMENTED
  useEffect(() => {
    console.log('[useProfileData] Second useEffect (reintroduced) triggered.', { userLoaded: !!user, userId: user?.id, profileLoaded: !!profile, pathname });

    // Basic conditions to call the simplified loadProfileAndSkills
    // For example, if user exists and we are on a profile page, and profile is not yet loaded for this user.
    if (user?.id && (pathname === '/profile' || pathname === '/account' || pathname === '/skills') && (!profile || profile.id !== user.id)) {
      console.log(`[useProfileData] User ID ${user.id} present on ${pathname}, profile not loaded or mismatched. Triggering ultra-simplified loadProfileAndSkills.`);
      // setLoadingSkills(true); // Keep these commented as their setters are commented
      // setLoadingUserTeams(true);
      loadProfileAndSkills(user, pathname);
    } else if (!user?.id && (pathname === '/profile' || pathname === '/account' || pathname === '/skills')) {
      console.log('[useProfileData] No user ID on an app page. Clearing profile states.');
      setProfile(null);
      // setSelectedSkills([]); // Keep these commented
      // setUserTeams([]);
      setLoading(false); // Ensure loading is false if no user and on these pages
      // setLoadingSkills(false);
      // setLoadingUserTeams(false);
    } else if (user?.id && profile && profile.id === user.id && (pathname === '/profile' || pathname === '/account' || pathname === '/skills')) {
      console.log('[useProfileData] Profile already loaded for current user on app page.');
      setLoading(false); // Ensure loading is false if profile is already correct
      // setLoadingSkills(false);
      // setLoadingUserTeams(false);
    } else if (user?.id && !(pathname === '/profile' || pathname === '/account' || pathname === '/skills')) {
       console.log('[useProfileData] User is present, but not on a profile/account/skills page. Ensuring loading states are false if profile matches or not required.');
       // If profile is loaded and matches, or if profile isn't strictly required here by this hook's logic for non-profile pages
       if ( (profile && profile.id === user.id) || !profile ) {
         setLoading(false);
       }
       // setLoadingSkills(false);
       // setLoadingUserTeams(false);
    } else if (!user?.id && !(pathname === '/profile' || pathname === '/account' || pathname === '/skills')){
      // No user, and not on a page that this useEffect primarily cares about loading profiles for.
      // This might be a public page. Ensure loading is false.
      console.log('[useProfileData] No user, and not on profile/account/skills page. Setting loading to false.');
      setLoading(false);
    }
  }, [user, profile, pathname, loadProfileAndSkills]); // Dependencies: user, profile, pathname, and our simplified loadProfileAndSkills

  // ALL OTHER FUNCTIONS (handlers, etc.) REMAIN COMMENTED OUT
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
    error,
    loadProfileAndSkills, // Return the ultra-simplified version

    // Return skill states and setters
    allSkills,
    selectedSkills,
    userSkillIds,
    loadingSkills,
    savingSkills,
    setAllSkills,
    setSelectedSkills,
    setUserSkillIds,
    setLoadingSkills,
    setSavingSkills,

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