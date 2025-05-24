'use client';

import { useEffect, useState, FormEvent, ChangeEvent, useRef, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Adjust path if needed
import { User } from '@supabase/supabase-js';

// Define interfaces needed by the hook
export interface Profile {
  id?: string; // Added id for profile matching in useEffect
  username: string | null;
  display_name: string | null;
  avatar_url?: string | null;
  full_name?: string | null;
  bio?: string | null;
  website_url?: string | null;
  twitter_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  instagram_url?: string | null;
  discord_url?: string | null;
  phone_whatsapp?: string | null;
  tiktok_url?: string | null;
  telegram_url?: string | null;
  facebook_url?: string | null;
  dollar_handle?: string | null;
  token_name?: string | null;
  supply?: string | null;
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

// Uncomment Team and ColorScheme interfaces
/*
interface ProfileForUpdate { ... }
*/
interface ColorScheme {
  bgColor: string;
  textColor: string;
  borderColor: string;
}

interface Team {
  id: string;
  name: string;
  slug: string | null;
  icon_name: string | null;
  color_scheme: ColorScheme | null;
}

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

  // Uncomment userTeams related states
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [loadingUserTeams, setLoadingUserTeams] = useState<boolean>(true);
  const [errorUserTeams, setErrorUserTeams] = useState<string | null>(null);

  // Uncomment all previously commented out useState hooks
  const [newUsername, setNewUsername] = useState<string>('');
  const [newDisplayName, setNewDisplayName] = useState<string>('');
  const [newFullName, setNewFullName] = useState<string>('');
  const [newBio, setNewBio] = useState<string>('');
  const [newWebsiteUrl, setNewWebsiteUrl] = useState<string>('');
  const [newTwitterUrl, setNewTwitterUrl] = useState<string>('');
  const [newLinkedInUrl, setNewLinkedInUrl] = useState<string>('');
  const [newGitHubUrl, setNewGitHubUrl] = useState<string>('');
  const [newInstagramUrl, setNewInstagramUrl] = useState<string>('');
  const [newDiscordUrl, setNewDiscordUrl] = useState<string>('');
  const [newPhoneWhatsapp, setNewPhoneWhatsapp] = useState<string>('');
  const [newTikTokUrl, setNewTikTokUrl] = useState<string>('');
  const [newTelegramUrl, setNewTelegramUrl] = useState<string>('');
  const [newFacebookUrl, setNewFacebookUrl] = useState<string>('');
  const [newDollarHandle, setNewDollarHandle] = useState<string>('');
  const [newTokenName, setNewTokenName] = useState<string>('');
  const [newSupply, setNewSupply] = useState<string>('1,000,000,000');
  const [showWelcomeCard, setShowWelcomeCard] = useState<boolean>(true);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  const [skillChoiceInAdder, setSkillChoiceInAdder] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  // Ref for debounce timer
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Make handleSaveProfile callable without an event for auto-save
  const performSaveProfile = useCallback(async () => {
    if (!user?.id || !profile) {
      setError("User or profile not loaded. Cannot save.");
      return;
    }
    console.log('[useProfileData] performSaveProfile called.');
    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    // Define updates without updated_at initially
    const updates: Omit<Partial<Profile>, 'id' | 'has_seen_welcome_card'> = {
      username: newUsername,
      display_name: newDisplayName,
      full_name: newFullName,
      bio: newBio,
      website_url: newWebsiteUrl,
      twitter_url: newTwitterUrl,
      linkedin_url: newLinkedInUrl,
      github_url: newGitHubUrl,
      instagram_url: newInstagramUrl,
      discord_url: newDiscordUrl,
      phone_whatsapp: newPhoneWhatsapp,
      tiktok_url: newTikTokUrl,
      telegram_url: newTelegramUrl,
      facebook_url: newFacebookUrl,
      dollar_handle: newDollarHandle,
      token_name: newTokenName,
      supply: newSupply,
      // Supabase typically handles updated_at automatically
    };

    const changedUpdates: Partial<Profile> = {};
    let hasChanges = false;

    if (profile) {
      for (const key in updates) {
        const typedKey = key as keyof typeof updates;
        if (updates[typedKey] !== profile[typedKey]) {
          // @ts-ignore - We know typedKey is a valid key of Profile here
          changedUpdates[typedKey] = updates[typedKey];
          hasChanges = true;
        }
      }
    } else {
      Object.assign(changedUpdates, updates);
      hasChanges = true;
    }

    if (!hasChanges) {
      console.log('[useProfileData] No changes detected, skipping save.');
      setSaving(false);
      return;
    }
    console.log('[useProfileData] Saving profile with updates:', changedUpdates);

    try {
      const { error: saveError } = await supabase
        .from('profiles')
        // Pass only the changed fields to update
        .update(changedUpdates)
        .eq('id', user.id);

      if (saveError) {
        console.error('[useProfileData] Error saving profile:', saveError);
        setError('Failed to save profile: ' + saveError.message);
        setSuccessMessage(null);
      } else {
        console.log('[useProfileData] Profile saved successfully.');
        setSuccessMessage('Profile saved successfully!');
        // Update local profile state with the saved data to reflect changes immediately
        // and ensure "no changes" logic works correctly on subsequent saves.
        setProfile(prevProfile => ({ ...prevProfile, ...changedUpdates } as Profile));
        setError(null);
        // Clear success message after a few seconds
        setTimeout(() => setSuccessMessage(null), 3000);
      }
    } catch (e: any) {
      console.error('[useProfileData] Exception saving profile:', e);
      setError('An unexpected error occurred while saving: ' + e.message);
      setSuccessMessage(null);
    } finally {
      setSaving(false);
    }
  }, [
    user, profile, supabase, newUsername, newDisplayName, newFullName, newBio,
    newWebsiteUrl, newTwitterUrl, newLinkedInUrl, newGitHubUrl, newInstagramUrl,
    newDiscordUrl, newPhoneWhatsapp, newTikTokUrl, newTelegramUrl, newFacebookUrl,
    newDollarHandle, newTokenName, newSupply
  ]);

  const handleSaveProfile = useCallback(async (event?: FormEvent) => {
    if (event) {
      event.preventDefault();
      console.log('[useProfileData] handleSaveProfile called with form event.');
    }
    await performSaveProfile();
  }, [performSaveProfile]);

  const handleAutoSave = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(async () => {
      console.log('[useProfileData] Debounced auto-save triggered.');
      await performSaveProfile();
    }, 1500); // Adjust debounce time as needed (e.g., 1.5 seconds)
  }, [performSaveProfile]);

  // Full loadProfileAndSkills function
  const loadProfileAndSkills = useCallback(async (currentUserParam: User, currentPathname: string) => {
    if (!currentUserParam?.id) {
      console.warn('[useProfileData] loadProfileAndSkills called without a current user ID. Aborting.');
      setLoading(false);
      setLoadingSkills(false);
      setLoadingUserTeams(false);
      return;
    }
    console.log('[useProfileData] Restored Full loadProfileAndSkills called for user:', currentUserParam.id, 'pathname:', currentPathname);
    setLoading(true);
    setLoadingSkills(true);
    setLoadingUserTeams(true);
    setError(null);
    setErrorUserTeams(null); // Clear specific team errors too

    try {
      // Step 1: Fetch Basic Profile Data
      console.log('[useProfileData] Fetching basic profile data for user:', currentUserParam.id);
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUserParam.id)
        .single<Profile>();

      if (profileError) {
        console.error('[useProfileData] Error fetching profile:', profileError);
        setError('Failed to load profile: ' + profileError.message);
        setProfile(null);
      } else if (profileData) {
        console.log("[useProfileData] Profile data fetched:", profileData);
        setProfile(profileData);
        setNewUsername(profileData.username || '');
        setNewDisplayName(profileData.display_name || '');
        setNewFullName(profileData.full_name || '');
        setNewBio(profileData.bio || '');
        setNewWebsiteUrl(profileData.website_url || '');
        setNewTwitterUrl(profileData.twitter_url || '');
        setNewLinkedInUrl(profileData.linkedin_url || '');
        setNewGitHubUrl(profileData.github_url || '');
        setNewInstagramUrl(profileData.instagram_url || '');
        setNewDiscordUrl(profileData.discord_url || '');
        setNewPhoneWhatsapp(profileData.phone_whatsapp || '');
        setNewTikTokUrl(profileData.tiktok_url || '');
        setNewTelegramUrl(profileData.telegram_url || '');
        setNewFacebookUrl(profileData.facebook_url || '');
        setNewDollarHandle(profileData.dollar_handle || '');
        setNewTokenName(profileData.token_name || '');
        setNewSupply(profileData.supply || '1,000,000,000');
        // Always show welcome card if profile data is loaded for an authenticated user
        setShowWelcomeCard(true);
      } else {
        console.warn('[useProfileData] No profile data returned for user (and no error):', currentUserParam.id);
        setProfile(null);
      }

      // Step 2: Fetch All Available Skills
      console.log('[useProfileData] Fetching all available skills.');
      const { data: allSkillsData, error: allSkillsError } = await supabase
        .from('skills')
        .select('id, name, category, description');

      if (allSkillsError) {
        console.error('[useProfileData] Error fetching all skills:', allSkillsError);
        setError(prev => prev ? prev + "; Failed to load all skills." : "Failed to load all skills.");
        setAllSkills([]);
      } else if (allSkillsData) {
        console.log("[useProfileData] All skills data fetched:", allSkillsData.length);
        setAllSkills(allSkillsData as Skill[]);
      }

      // Step 3: Fetch User's Selected Skills
      console.log('[useProfileData] Fetching selected skills for user:', currentUserParam.id);
      const { data: userSkillsData, error: userSkillsError } = await supabase
        .from('user_skills')
        .select('skill_id, skills (id, name, category, description)')
        .eq('user_id', currentUserParam.id);

      if (userSkillsError) {
        console.error('[useProfileData] Error fetching user skills:', userSkillsError);
        setError(prev => prev ? prev + "; Failed to load user skills." : "Failed to load user skills.");
        setSelectedSkills([]);
        setUserSkillIds(new Set());
      } else if (userSkillsData) {
        console.log("[useProfileData] User skills data fetched:", userSkillsData.length);
        const fetchedSelectedSkills = userSkillsData.map(us => us.skills).filter(Boolean) as Skill[];
        setSelectedSkills(fetchedSelectedSkills);
        setUserSkillIds(new Set(fetchedSelectedSkills.map(s => s.id)));
      }
      
      // Step 4: Fetch User's Teams
      console.log('[useProfileData] Fetching teams for user:', currentUserParam.id);
      const { data: userTeamsData, error: teamsError } = await supabase
          .from('user_team_memberships')
          .select(`
            user_id, 
            teams (
              id, 
              name, 
              slug, 
              icon_name, 
              color_scheme
            )
          `)
          .eq('user_id', currentUserParam.id);

      if (teamsError) {
          console.error('[useProfileData] Error fetching user teams:', teamsError);
          setErrorUserTeams('Failed to load teams: ' + teamsError.message);
          setUserTeams([]);
      } else if (userTeamsData) {
          console.log("[useProfileData] User teams data fetched:", userTeamsData.length);
          const teams = userTeamsData.map(utm => utm.teams).filter(Boolean) as Team[]; 
          setUserTeams(teams);
          setErrorUserTeams(null); // Clear previous team errors
      } else {
          setUserTeams([]); // No teams found
          setErrorUserTeams(null); // Clear previous team errors
      }

    } catch (e: any) {
      console.error("[useProfileData] Critical error in full loadProfileAndSkills:", e.message, e.stack);
      setError("An unexpected critical error occurred while loading profile data.");
      setProfile(null);
      setAllSkills([]);
      setSelectedSkills([]);
      setUserSkillIds(new Set());
      setUserTeams([]);
    } finally {
      setLoading(false);
      setLoadingSkills(false);
      setLoadingUserTeams(false);
      console.log('[useProfileData] Restored Full loadProfileAndSkills finished for user:', currentUserParam.id);
    }
  }, [
    supabase, 
    setProfile, setLoading, setError, 
    setNewUsername, setNewDisplayName, setNewFullName, setNewBio, setNewWebsiteUrl, 
    setNewTwitterUrl, setNewLinkedInUrl, setNewGitHubUrl, setNewInstagramUrl, 
    setNewDiscordUrl, setNewPhoneWhatsapp, setNewTikTokUrl, setNewTelegramUrl, 
    setNewFacebookUrl, setNewDollarHandle, setNewTokenName, setNewSupply, 
    setShowWelcomeCard,
    setAllSkills, setSelectedSkills, setUserSkillIds, setLoadingSkills, 
    setUserTeams, setLoadingUserTeams, setErrorUserTeams
  ]);

  const handleDismissWelcomeCard = useCallback(async () => {
    if (!user?.id) {
      console.warn('[useProfileData] handleDismissWelcomeCard called without user ID.');
      return;
    }
    setShowWelcomeCard(false); // Optimistically update UI
    try {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ has_seen_welcome_card: true } as Partial<Profile>)
        .eq('id', user.id);

      if (updateError) {
        console.error('[useProfileData] Error updating has_seen_welcome_card:', updateError);
        // Optionally, revert setShowWelcomeCard(true) or show an error to the user
      } else {
        console.log('[useProfileData] has_seen_welcome_card updated successfully for user:', user.id);
      }
    } catch (e: any) {
      console.error('[useProfileData] Exception in handleDismissWelcomeCard:', e.message);
    }
  }, [supabase, user?.id]);

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
        setUserTeams([]);
        setLoadingUserTeams(false);
        setErrorUserTeams(null);
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
  }, [supabase, pathname]); // REMOVED profile, router from dependencies

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

  const handleSkillToggle = useCallback(async (skillId: string, isCurrentlySelected: boolean) => {
    if (!user?.id) {
      setError('User not found. Cannot modify skills.');
      return;
    }
    setSavingSkills(true);
    setError(null);

    try {
      if (isCurrentlySelected) {
        const { error: deleteError } = await supabase
          .from('user_skills')
          .delete()
          .eq('user_id', user.id)
          .eq('skill_id', skillId);

        if (deleteError) {
          console.error('[useProfileData] Error removing skill:', deleteError);
          setError('Failed to remove skill: ' + deleteError.message);
        } else {
          console.log('[useProfileData] Skill removed successfully:', skillId);
          setSelectedSkills(prev => prev.filter(skill => skill.id !== skillId));
          setUserSkillIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(skillId);
            return newSet;
          });
        }
      } else {
        const { data: newSkillLink, error: insertError } = await supabase
          .from('user_skills')
          .insert({ user_id: user.id, skill_id: skillId })
          .select('skills(id, name, category, description)')
          .single();

        if (insertError) {
          console.error('[useProfileData] Error adding skill:', insertError);
          setError('Failed to add skill: ' + insertError.message);
        } else if (newSkillLink && newSkillLink.skills) {
          console.log('[useProfileData] Skill added successfully:', newSkillLink.skills);
          const addedSkill = newSkillLink.skills as Skill;
          setSelectedSkills(prev => [...prev, addedSkill]);
          setUserSkillIds(prev => new Set(prev).add(addedSkill.id));
        } else {
          setError('Failed to add skill or retrieve skill details.');
        }
      }
    } catch (err: any) {
      console.error('[useProfileData] Exception in handleSkillToggle:', err);
      setError('An unexpected error occurred while managing skills.');
    } finally {
      setSavingSkills(false);
    }
  }, [supabase, user?.id, setSelectedSkills, setUserSkillIds, setSavingSkills, setError]);

  const handleAddCustomSkill = useCallback(async (skillName: string) => {
    if (!user?.id) {
      setError('User not found. Cannot add custom skill.');
      return;
    }
    if (!skillName.trim()) {
      setError('Skill name cannot be empty.');
      return;
    }
    setSavingSkills(true);
    setError(null);

    try {
      const { data: newSkill, error: createSkillError } = await supabase
        .from('skills')
        .insert({ name: skillName.trim(), category: 'User-Defined' })
        .select()
        .single<Skill>();

      if (createSkillError) {
        console.error('[useProfileData] Error creating new skill:', createSkillError);
        setError('Failed to create new skill: ' + createSkillError.message);
        setSavingSkills(false);
        return;
      }

      if (!newSkill) {
        setError('Failed to create new skill (no data returned).');
        setSavingSkills(false);
        return;
      }

      const { error: linkSkillError } = await supabase
        .from('user_skills')
        .insert({ user_id: user.id, skill_id: newSkill.id });

      if (linkSkillError) {
        console.error('[useProfileData] Error linking new skill to user:', linkSkillError);
        setError('Failed to link new skill: ' + linkSkillError.message);
      } else {
        console.log('[useProfileData] Custom skill added and linked successfully:', newSkill);
        setAllSkills(prev => [...prev, newSkill]);
        setSelectedSkills(prev => [...prev, newSkill]);
        setUserSkillIds(prev => new Set(prev).add(newSkill.id));
        setCustomSkillInput('');
      }
    } catch (err: any) {
      console.error('[useProfileData] Exception in handleAddCustomSkill:', err);
      setError('An unexpected error occurred while adding custom skill.');
    } finally {
      setSavingSkills(false);
    }
  }, [supabase, user?.id, setSavingSkills, setError, setAllSkills, setSelectedSkills, setUserSkillIds, setCustomSkillInput]);

  // Effect to initialize form fields when profile data is loaded or changed
  useEffect(() => {
    console.log('[useProfileData] Profile update effect triggered. Current profile:', profile);
    if (profile) {
      setNewUsername(profile.username || '');
      setNewDisplayName(profile.display_name || '');
      setNewFullName(profile.full_name || '');
      setNewBio(profile.bio || '');
      setNewWebsiteUrl(profile.website_url || '');
      setNewTwitterUrl(profile.twitter_url || '');
      setNewLinkedInUrl(profile.linkedin_url || '');
      setNewGitHubUrl(profile.github_url || '');
      setNewInstagramUrl(profile.instagram_url || '');
      setNewDiscordUrl(profile.discord_url || '');
      setNewPhoneWhatsapp(profile.phone_whatsapp || '');
      setNewTikTokUrl(profile.tiktok_url || '');
      setNewTelegramUrl(profile.telegram_url || '');
      setNewFacebookUrl(profile.facebook_url || '');
      setNewDollarHandle(profile.dollar_handle || '');
      setNewTokenName(profile.token_name || '');
      setNewSupply(profile.supply || '1,000,000,000');
      
      // Welcome card logic
      if (profile.has_seen_welcome_card === undefined || profile.has_seen_welcome_card === null) {
        setShowWelcomeCard(true);
      } else {
        setShowWelcomeCard(!profile.has_seen_welcome_card);
      }
      console.log('[useProfileData] Form fields updated from profile. Show welcome card:', !profile.has_seen_welcome_card);
    } else {
      console.log('[useProfileData] Profile is null, form fields not updated.');
    }
  }, [profile]); // Ensured profile is in the dependency array

  console.log('[useProfileData] Hook initialized.');

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

    // Return team states and setters
    userTeams,
    loadingUserTeams,
    errorUserTeams,
    setUserTeams,
    setLoadingUserTeams,
    setErrorUserTeams,

    // Return all states and setters that were uncommented
    newUsername,
    newDisplayName,
    newFullName,
    newBio,
    newWebsiteUrl,
    newTwitterUrl,
    newLinkedInUrl,
    newGitHubUrl,
    newInstagramUrl,
    newDiscordUrl,
    newPhoneWhatsapp,
    newTikTokUrl,
    newTelegramUrl,
    newFacebookUrl,
    newDollarHandle,
    newTokenName,
    newSupply,
    showWelcomeCard,
    isUploadingAvatar,
    avatarUploadError,
    customSkillInput,
    skillChoiceInAdder,
    successMessage,
    saving,
    setNewUsername,
    setNewDisplayName,
    setNewFullName,
    setNewBio,
    setNewWebsiteUrl,
    setNewTwitterUrl,
    setNewLinkedInUrl,
    setNewGitHubUrl,
    setNewInstagramUrl,
    setNewDiscordUrl,
    setNewPhoneWhatsapp,
    setNewTikTokUrl,
    setNewTelegramUrl,
    setNewFacebookUrl,
    setNewDollarHandle,
    setNewTokenName,
    setNewSupply,
    setShowWelcomeCard,
    setIsUploadingAvatar,
    setAvatarUploadError,
    setCustomSkillInput,
    setSkillChoiceInAdder,
    setSuccessMessage,
    setSaving,
    handleDismissWelcomeCard,
    handleSaveProfile,
    handleSkillToggle,
    handleAddCustomSkill,
    handleAutoSave,
  };
} 