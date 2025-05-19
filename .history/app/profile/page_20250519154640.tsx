'use client';

import React, { useEffect, useState, FormEvent, ChangeEvent, useRef } from 'react';
import Link from 'next/link'; 
import { FaSave, FaUserCircle, FaImage, FaSignature, FaInfoCircle, FaLink, FaRocket, FaPlus, FaUsers, FaPlusSquare, FaHandshake, FaBriefcase, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaQuestionCircle, FaSpinner } from 'react-icons/fa'; 
import { useRouter, usePathname } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Adjust path if needed
import { User } from '@supabase/supabase-js'; // Added import for User type
import ProfileDetails from '@/components/ProfileDetails'; // Import the new component
import UserSkills from '@/components/UserSkills'; // Import the new UserSkills component
import UserTeams from '@/components/UserTeams'; // Import the new UserTeams component
import EditProfileForm from '@/components/EditProfileForm'; // Import the new EditProfileForm component
import useProfileData from '@/lib/hooks/useProfileData'; // Import the custom hook

// Remove old interfaces as they are now in the hook or components
-interface Profile {
-  username: string | null;
-  display_name: string | null;
-  avatar_url?: string | null; 
-  full_name?: string | null;
-  bio?: string | null;
-  website_url?: string | null;
-  twitter_url?: string | null;
-  linkedin_url?: string | null;
-  github_url?: string | null;
-  instagram_url?: string | null;
-  discord_url?: string | null;
-  phone_whatsapp?: string | null;
-}
-
-// Define a specific interface for the update payload
-interface ProfileForUpdate {
-  username?: string | null;
-  display_name?: string | null;
-  full_name?: string | null;
-  bio?: string | null;
-  website_url?: string | null;
-  twitter_url?: string | null;
-  linkedin_url?: string | null;
-  github_url?: string | null;
-  instagram_url?: string | null;
-  discord_url?: string | null;
-  phone_whatsapp?: string | null;
-  updated_at: string; 
-  // avatar_url is intentionally omitted as it's handled separately
-}
-
-// --- NEW Skill and UserSkill Interfaces ---
-interface Skill {
-  id: string;
-  name: string;
-  category: string | null;
-  description: string | null;
-}
-
-interface UserSkill {
-  id: string; // This is the id from the user_skills join table
-  user_id: string;
-  skill_id: string;
-  skills?: Pick<Skill, 'id' | 'name' | 'category'>; // To hold joined skill details
-}
-// --- END NEW Interfaces ---
-
-// --- NEW Team Interfaces (similar to app/team/page.tsx) ---
-// Helper to map icon names to components
-const iconMap: { [key: string]: React.ElementType } = {
-  FaDatabase,
-  FaPalette,
-  FaBolt,
-  FaCloud,
-  FaLightbulb,
-  FaBrain,
-  FaUsers, // For a generic team icon
-  FaQuestionCircle, // Default
-  FaSpinner, // For loading states
-};
-
-interface ColorScheme {
-  bgColor: string;
-  textColor: string;
-  borderColor: string;
-}
-
-interface Team {
-  id: string;
-  name: string;
-  slug: string | null;
-  icon_name: string | null;
-  color_scheme: ColorScheme | null;
-}
-// --- END NEW Team Interfaces ---
-
-// ClientProject interface can be removed if My Projects section is gone.
-/*
-interface ClientProject {
-  id: string; 
-  name: string;
-  project_slug: string;
-  status: string | null;
-  project_brief?: string | null;
-}
-*/
-
-// --- NEW Skill Badge Styling Function ---
-const getSkillBadgeStyle = (category: string | null): string => {
-  const baseStyle = "px-3 py-1.5 text-xs font-semibold rounded-full shadow-md flex items-center justify-center";
-  switch (category?.toLowerCase().trim()) {
-    case 'frontend development': return `${baseStyle} bg-green-600 text-green-100 border border-green-500`;
-    case 'backend development': return `${baseStyle} bg-blue-600 text-blue-100 border border-blue-500`;
-    case 'programming': return `${baseStyle} bg-indigo-600 text-indigo-100 border border-indigo-500`;
-    case 'design': return `${baseStyle} bg-pink-600 text-pink-100 border border-pink-500`;
-    case 'management': return `${baseStyle} bg-purple-600 text-purple-100 border border-purple-500`;
-    case 'databases': return `${baseStyle} bg-yellow-500 text-yellow-900 border border-yellow-400`; // Adjusted for better contrast
-    case 'devops': return `${baseStyle} bg-red-600 text-red-100 border border-red-500`;
-    case 'cloud computing': return `${baseStyle} bg-cyan-600 text-cyan-100 border border-cyan-500`;
-    case 'marketing': return `${baseStyle} bg-orange-600 text-orange-100 border border-orange-500`;
-    case 'user-defined': return `${baseStyle} bg-teal-600 text-teal-100 border border-teal-500`; // Style for user-defined skills
-    default: return `${baseStyle} bg-gray-600 text-gray-100 border border-gray-500`; // For 'Other' or uncategorized
-  }
-};
-// --- END NEW Skill Badge Styling Function ---

export default function ProfilePage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  // const [projects, setProjects] = useState<ClientProject[]>([]); // Removed projects state
  // const [loadingProjects, setLoadingProjects] = useState<boolean>(true); // Removed projects loading state
  
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

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- NEW Simplified Avatar State ---
  const [isUploadingAvatar, setIsUploadingAvatar] = useState<boolean>(false);
  const [avatarUploadError, setAvatarUploadError] = useState<string | null>(null);
  // --- END NEW Simplified Avatar State ---

  // --- NEW Skills State ---
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<Skill[]>([]);
  const [userSkillIds, setUserSkillIds] = useState<Set<string>>(new Set()); // Store IDs of user's skills
  const [loadingSkills, setLoadingSkills] = useState<boolean>(true);
  const [savingSkills, setSavingSkills] = useState<boolean>(false); // For individual skill toggle operations
  // --- END NEW Skills State ---

  // --- NEW User Teams State ---
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [loadingUserTeams, setLoadingUserTeams] = useState<boolean>(true);
  const [errorUserTeams, setErrorUserTeams] = useState<string | null>(null);
  // --- END NEW User Teams State ---

  // --- NEW State for Custom Skill Input ---
  const [customSkillInput, setCustomSkillInput] = useState<string>('');
  // --- END NEW State for Custom Skill Input ---

  // --- State for Inline Skill Adder ---
  // const [showSkillAdderDropdown, setShowSkillAdderDropdown] = useState<boolean>(false); // No longer needed
  const [skillChoiceInAdder, setSkillChoiceInAdder] = useState<string>(''); // To control the value of the adder select
  // --- END State for Inline Skill Adder ---

  // NEW useEffect for initial user fetch and auth state changes
  useEffect(() => {
      setLoading(true);
    const fetchInitialUser = async () => {
      const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser();

      if (userError) {
        console.error("[ProfilePage] Error fetching initial user with getUser():", userError.message);
        setUser(null);
        setError("Failed to authenticate. Please try logging in again.");
        setLoading(false);
        router.push('/login');
        return;
      }
      
      if (!fetchedUser) {
        console.log('[ProfilePage] No user found with getUser() on initial load. Redirecting to login.');
        setUser(null);
        setLoading(false);
        router.push('/login');
        return;
      }
      
      console.log('[ProfilePage] Initial user fetched with getUser():', fetchedUser.id);
      setUser(fetchedUser);
    };

    fetchInitialUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log(`[ProfilePage] Auth state changed. Event: ${event}`);
      const currentUser = session?.user ?? null;
      
      if (user?.id !== currentUser?.id) {
        setUser(currentUser);
      }

      if (event === 'SIGNED_OUT') {
        console.log('[ProfilePage] User signed out. Clearing states.');
        setProfile(null);
        setNewUsername('');
        setNewDisplayName('');
        setNewFullName('');
        setNewBio('');
        setNewWebsiteUrl('');
        setNewTwitterUrl('');
        setNewLinkedInUrl('');
        setNewGitHubUrl('');
        setNewInstagramUrl('');
        setNewDiscordUrl('');
        setNewPhoneWhatsapp('');
        setSelectedSkills([]);
        setSuccessMessage(null);
        setAvatarUploadError(null);
      } else if (event === 'SIGNED_IN' && currentUser) {
        console.log('[ProfilePage] User signed in:', currentUser.id);
      } else if (event === 'USER_UPDATED' && currentUser) {
        console.log('[ProfilePage] User updated:', currentUser.id);
      }
      if (!currentUser && event !== 'SIGNED_OUT') {
        console.log('[ProfilePage] Session/user became null without explicit SIGNED_OUT. Clearing profile state.');
        setProfile(null);
      }
    });

    return () => {
      authListener.subscription?.unsubscribe();
    };
  }, [router, supabase]); // Added supabase to dependencies as it's used within the effect.

  // NEW useEffect for fetching profile and skills when user is available or changes
  useEffect(() => {
    const loadProfileAndSkills = async () => {
      if (!user?.id) {
        setProfile(null);
        setSelectedSkills([]);
        setUserTeams([]); // Clear teams if no user
        setLoading(false); 
        setLoadingSkills(false);
        setLoadingUserTeams(false);
        return;
      }

      console.log(`[ProfilePage] User ID ${user.id} present. Starting to fetch profile, skills, and teams.`);
      // setLoading(true); // setLoading is handled by the calling context of this useEffect
      // setLoadingSkills(true); // setLoadingSkills is handled by the calling context of this useEffect
      setLoadingUserTeams(true);
      setError(null);
      setErrorUserTeams(null);
      setProfile(null); 
      setSelectedSkills([]); 
      setUserTeams([]);

      try {
        // Step 1: Fetch Profile Data
        console.log("[ProfilePage] Fetching basic profile data...");
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*') 
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("[ProfilePage] Error fetching profile:", profileError.message, profileError.details);
          if (profileError.code === 'PGRST116') {
            setError("Profile not found. You may need to complete your profile setup.");
          } else {
            setError(`Failed to load profile: ${profileError.message}`);
          }
          // setLoadingSkills(false); // Moved to finally block
        } else if (profileData) {
          console.log("[ProfilePage] Profile data fetched:", profileData);
          // const typedProfileData = profileData as unknown as Profile; // Keep if needed, but access directly for now

          setProfile(profileData as unknown as Profile); // This cast is for the state setter
          setNewUsername((profileData as any).username || '');
          setNewDisplayName((profileData as any).display_name || '');
          setNewFullName((profileData as any).full_name || '');
          setNewBio((profileData as any).bio || '');
          setNewWebsiteUrl((profileData as any).website_url || '');
          setNewTwitterUrl((profileData as any).twitter_url || ''); 
          setNewLinkedInUrl((profileData as any).linkedin_url || '');
          setNewGitHubUrl((profileData as any).github_url || ''); 
          setNewInstagramUrl((profileData as any).instagram_url || '');
          setNewDiscordUrl((profileData as any).discord_url || '');
          setNewPhoneWhatsapp((profileData as any).phone_whatsapp || '');

          // Step 2: Fetch User's Skills
          console.log("[ProfilePage] Fetching user skills for user:", user.id);
          const { data: userSkillsData, error: userSkillsError } = await supabase
            .from('user_skills')
            .select(`
              skill_id, 
              skills (id, name, category, description)
            `)
            .eq('user_id', user.id);

          if (userSkillsError) {
            console.error("[ProfilePage] Error fetching user skills:", userSkillsError.message);
            setError(prevError => prevError ? `${prevError} | Failed to load skills: ${userSkillsError.message}` : `Failed to load skills: ${userSkillsError.message}`);
          } else if (userSkillsData) {
            const currentSkillsWithDetails = userSkillsData.map(us => {
              let skillDetail: Skill | null = null;
              if (Array.isArray(us.skills)) {
                if (us.skills.length > 0) {
                  skillDetail = us.skills[0] as Skill; 
        } else {
                  console.warn("[ProfilePage] User skill entry found with an empty skills array:", us);
                  return null; 
                }
              } else if (us.skills) {
                skillDetail = us.skills as Skill; 
              } else {
                console.warn("[ProfilePage] User skill entry found without corresponding skill detail (us.skills is null/undefined):", us);
                return null; 
              }
              if (!skillDetail) return null;
              return {
                id: skillDetail.id,
                name: skillDetail.name,
                category: skillDetail.category || 'Other',
                description: skillDetail.description || ''
              };
            }).filter(Boolean) as Skill[];
            
            console.log("[ProfilePage] User skills processed. Setting selectedSkills and userSkillIds.");
            setSelectedSkills(currentSkillsWithDetails);
            setUserSkillIds(new Set(currentSkillsWithDetails.map(s => s.id)));
          }

          // Step 3: Fetch User's Teams
          console.log("[ProfilePage] Fetching user teams for user:", user.id);
          try {
            const { data: teamUserEntries, error: teamUserError } = await supabase
              .from('user_team_memberships')
              .select('team_id')
              .eq('user_id', user.id);

            if (teamUserError) throw teamUserError;

            if (teamUserEntries && teamUserEntries.length > 0) {
              const teamIds = teamUserEntries.map(entry => entry.team_id);
              const { data: teamsData, error: teamsError } = await supabase
                .from('teams')
                .select('id, name, slug, icon_name, color_scheme')
                .in('id', teamIds);

              if (teamsError) throw teamsError;

              const processedTeamsData = teamsData?.map(team => {
                let parsedColorScheme: ColorScheme | null = null;
                const rawColorScheme = team.color_scheme as unknown; // Treat as unknown first

                if (typeof rawColorScheme === 'string') {
                  try {
                    const parsed = JSON.parse(rawColorScheme);
                    // Validate structure after parsing
                    if (parsed && typeof parsed.bgColor === 'string' && typeof parsed.textColor === 'string' && typeof parsed.borderColor === 'string') {
                      parsedColorScheme = parsed as ColorScheme;
                    } else {
                      console.warn(`[ProfilePage] Parsed color_scheme for team ${team.id} does not match ColorScheme structure:`, parsed);
                      parsedColorScheme = null;
                    }
                  } catch (e) {
                    console.warn(`[ProfilePage] Failed to parse color_scheme string for team ${team.id}:`, rawColorScheme, e);
                    parsedColorScheme = null;
                  }
                } else if (typeof rawColorScheme === 'object' && rawColorScheme !== null) {
                  const potentialScheme = rawColorScheme as Partial<ColorScheme>; // Cast to partial for checking
                  if (
                    typeof potentialScheme.bgColor === 'string' &&
                    typeof potentialScheme.textColor === 'string' &&
                    typeof potentialScheme.borderColor === 'string'
                  ) {
                    parsedColorScheme = potentialScheme as ColorScheme;
                  } else {
                    console.warn(`[ProfilePage] color_scheme for team ${team.id} is an object but not a valid ColorScheme:`, rawColorScheme);
                    parsedColorScheme = null;
                  }
                }
                // If rawColorScheme is not a string or a suitable object (or parsing failed), parsedColorScheme remains null.

                return {
                  // Explicitly list all properties of the Team interface to ensure type conformity
                  id: team.id,
                  name: team.name,
                  slug: team.slug || null,
                  icon_name: team.icon_name || 'FaQuestionCircle',
                  color_scheme: parsedColorScheme || { bgColor: 'bg-gray-700', textColor: 'text-gray-100', borderColor: 'border-gray-500' },
                };
              }) || [];
              setUserTeams(processedTeamsData); 
            } else {
              setUserTeams([]);
            }
          } catch (e: any) {
            console.error("[ProfilePage] Error fetching user teams:", e.message);
            setErrorUserTeams(`Failed to load teams: ${e.message}`);
          }
        }
        
        // Step 4: Fetch All Available Skills for dropdown
        console.log("[ProfilePage] Fetching all available skills for dropdown...");
        const { data: allSkillsData, error: allSkillsError } = await supabase
          .from('skills')
            .select('*')
          .order('name', { ascending: true });

        if (allSkillsError) {
            console.error("[ProfilePage] Error fetching all skills:", allSkillsError.message);
            setError(prevError => prevError ? `${prevError} | Failed to load skill list: ${allSkillsError.message}` : `Failed to load skill list: ${allSkillsError.message}`);
        } else if (allSkillsData) {
            console.log("[ProfilePage] All skills for dropdown fetched successfully.");
            setAllSkills(allSkillsData as Skill[]);
        }

      } catch (e:any) {
        console.error("[ProfilePage] Critical error in loadProfileAndSkills:", e.message);
        setError(`An unexpected error occurred: ${e.message}`);
      } finally {
        setLoading(false); 
        setLoadingSkills(false); 
        setLoadingUserTeams(false);
        console.log(`[ProfilePage] loadProfileAndSkills finished. States set: main loading = false, skills loading = false, teams loading = false.`);
      }
    };

    if (user?.id && pathname === '/profile') {
      setLoading(true); // Set main loading to true before starting data fetch for profile page
      setLoadingSkills(true); // Also set skills loading to true
      setLoadingUserTeams(true); // Also set teams loading to true
      loadProfileAndSkills();
    } else if (!user?.id && pathname === '/profile') { 
      setLoading(true); // Keep main loader active
      setLoadingSkills(true); // And skills loader, though less relevant if no user
      setLoadingUserTeams(true); // And teams loader, though less relevant if no user
      setProfile(null);
      setSelectedSkills([]);
      setUserTeams([]);
      // The first useEffect (auth handler) will redirect if user remains null.
      } else {
      // Not on profile page, or user object is present but no ID / user is null and not on profile page.
      setLoading(false);
      setLoadingSkills(false);
      setLoadingUserTeams(false);
    }
  }, [user, supabase, pathname]); // Ensure all dependencies like supabase and pathname are listed.

  // --- NEW Function to Handle Skill Toggle ---
  const handleSkillToggle = async (skillId: string, isCurrentlySelected: boolean) => {
    if (!user) {
      setError("User not found. Please log in again.");
      return;
    }
    setSavingSkills(true); // Indicate that a skill saving operation is in progress

    try {
    if (isCurrentlySelected) {
        // Remove the skill
      const { error: deleteError } = await supabase
        .from('user_skills')
        .delete()
          .match({ user_id: user.id, skill_id: skillId });

      if (deleteError) {
          throw new Error(`Failed to remove skill: ${deleteError.message}`);
        }
        setSelectedSkills(prev => prev.filter(skill => skill.id !== skillId));
        setUserSkillIds(prev => {
          const newSet = new Set(prev);
          newSet.delete(skillId);
          return newSet;
        });
        setSuccessMessage("Skill removed successfully.");
    } else {
        // Add the skill
        const { data: newSkillMapping, error: insertError } = await supabase
        .from('user_skills')
          .insert({ user_id: user.id, skill_id: skillId })
          .select('skill_id, skills(id, name, category, description)') // Select to get details
          .single();

      if (insertError) {
          // Check for unique constraint violation for user_id_skill_id_key
          if (insertError.code === '23505' && insertError.message.includes('user_skills_user_id_skill_id_key')) {
             // This skill is already associated with the user, likely a UI sync issue. Refresh.
             console.warn("[ProfilePage] Attempted to add a skill that's already present (unique constraint violation). Refreshing skills from DB.");
             // Re-fetch user's skills to ensure UI consistency
             // Find the skill from allSkills to add to selectedSkills
             const skillToAdd = allSkills.find(s => s.id === skillId);
             if (skillToAdd && !userSkillIds.has(skillId)) { // Defensive check
                setSelectedSkills(prev => [...prev, skillToAdd]);
                setUserSkillIds(prev => new Set(prev).add(skillId));
                setSuccessMessage(`Skill '${skillToAdd.name}' was already associated. UI synced.`);
             } else if (skillToAdd) {
                setSuccessMessage(`Skill '${skillToAdd.name}' is already selected.`);
      } else {
                setError("Could not add skill: Skill details not found locally after duplicate error.");
             }
          } else {
            throw new Error(`Failed to add skill: ${insertError.message}`);
          }
        } else if (newSkillMapping && newSkillMapping.skills) {
            let skillDetail: Skill | null = null;
            if (Array.isArray(newSkillMapping.skills)) { // Should not be an array based on .single() and typical foreign table relation
                skillDetail = newSkillMapping.skills.length > 0 ? newSkillMapping.skills[0] as Skill : null;
            } else {
                skillDetail = newSkillMapping.skills as Skill;
            }

            if(skillDetail) {
                setSelectedSkills(prev => [...prev, skillDetail]);
                setUserSkillIds(prev => new Set(prev).add(skillDetail!.id));
                setSuccessMessage("Skill added successfully.");
            } else {
                console.error("[ProfilePage] Added skill but couldn't retrieve its details fully:", newSkillMapping);
                setError("Skill added, but details might not be fully displayed. Please refresh.");
                 // Fallback: add just the ID if details are missing, or re-fetch. For now, let's re-fetch all user skills.
                const skillFromAll = allSkills.find(s => s.id === skillId);
                if (skillFromAll) {
                    setSelectedSkills(prev => [...prev, skillFromAll]);
                    setUserSkillIds(prev => new Set(prev).add(skillId));
                }
            }
        } else {
             // Fallback if newSkillMapping or newSkillMapping.skills is null
            const skillFromAll = allSkills.find(s => s.id === skillId);
            if (skillFromAll) {
                setSelectedSkills(prev => [...prev, skillFromAll]);
                setUserSkillIds(prev => new Set(prev).add(skillId));
                setSuccessMessage("Skill added successfully (fallback).");
            } else {
                 setError("Failed to add skill: details not found after insert.");
            }
        }
      }
      setError(null); // Clear previous errors on success
      setTimeout(() => setSuccessMessage(null), 3000); // Clear success message after 3 seconds
    } catch (err: any) {
      console.error("[ProfilePage] Error in handleSkillToggle:", err);
      setError(err.message);
      setSuccessMessage(null); // Clear success message on error
    } finally {
      setSavingSkills(false); // Operation finished
    }
  };
  // --- END NEW Function ---

  // --- NEW Function to Handle Adding Custom Skill ---
  const handleAddCustomSkill = async (skillName: string) => {
    if (!user) {
      setError('User not authenticated.');
      return;
    }
    if (!skillName) return;

    setSavingSkills(true);
    setError(null);
    setSuccessMessage(null);

    // Normalize skill name for checking
    const normalizedSkillName = skillName.trim().toLowerCase();
    const existingSkill = allSkills.find(s => s.name.trim().toLowerCase() === normalizedSkillName);

    if (existingSkill) {
      if (userSkillIds.has(existingSkill.id)) {
        setSuccessMessage(`Skill "${existingSkill.name}" is already added.`);
        setCustomSkillInput('');
        setSavingSkills(false);
        setTimeout(() => setSuccessMessage(null), 2000);
        return;
      } else {
        // Skill exists globally, just add it to user_skills
        // handleSkillToggle will set savingSkills to false and clear input
        await handleSkillToggle(existingSkill.id, false);
        setCustomSkillInput(''); 
        // Note: handleSkillToggle already sets savingSkills to false.
        return; 
      }
    } else {
      // Skill does not exist globally, create it and then add to user_skills
      try {
        const { data: newSkillData, error: newSkillError } = await supabase
          .from('skills')
          .insert({ name: skillName.trim(), category: 'User-defined', description: null })
          .select('id, name, category, description')
          .single();

        if (newSkillError) {
          console.error('Error creating new skill:', newSkillError);
          setError(`Failed to create new skill: ${newSkillError.message}`);
          setSavingSkills(false);
          return;
        }

        if (newSkillData) {
          // Add to allSkills locally so it can be rendered
          setAllSkills(prevSkills => [...prevSkills, newSkillData]);
          
          const { error: insertUserSkillError } = await supabase
            .from('user_skills')
            .insert({ user_id: user.id, skill_id: newSkillData.id });

          if (insertUserSkillError) {
            console.error('Error adding new skill to user:', insertUserSkillError);
            setError(`Failed to associate new skill: ${insertUserSkillError.message}`);
            // Rollback local allSkills update
            setAllSkills(prevSkills => prevSkills.filter(s => s.id !== newSkillData.id));
          } else {
            setUserSkillIds(prevIds => new Set(prevIds).add(newSkillData.id));
            setSelectedSkills(prevSelectedSkills => [...prevSelectedSkills, newSkillData]); // Add new skill to selectedSkills
            setSuccessMessage(`Custom skill "${newSkillData.name}" added!`);
            setCustomSkillInput('');
          }
        }
      } catch (e) {
        console.error("Unexpected error in handleAddCustomSkill:", e);
        setError("An unexpected error occurred while adding the custom skill.");
      } finally {
        setSavingSkills(false);
        // Success/error message for custom skill already handled or will be, clear generic one after a delay
        setTimeout(() => { if (!error && !successMessage) setSuccessMessage(null); }, 2000);
      }
    }
  };
  // --- END NEW Function for Custom Skill ---

  // --- NEW Simplified Avatar Upload Function ---
  const handleSimpleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('[handleSimpleAvatarUpload] Function triggered.');
    console.log('[handleSimpleAvatarUpload] User object:', user);

    if (!user) {
      setAvatarUploadError('User not authenticated.');
      console.log('[handleSimpleAvatarUpload] Exiting: User not authenticated.');
      return;
    }
    const file = event.target.files?.[0];
    console.log('[handleSimpleAvatarUpload] File object:', file);

    if (!file) {
      setAvatarUploadError('No file selected.');
      console.log('[handleSimpleAvatarUpload] Exiting: No file selected.');
      return;
    }

    setIsUploadingAvatar(true);
    setAvatarUploadError(null);
    setSuccessMessage(null);
    console.log('[handleSimpleAvatarUpload] Starting upload process...');

    const fileExt = file.name.split('.').pop();
    const filePath = `public/${user.id}/avatar.${fileExt}`;

    try {
      // Attempt to remove existing avatar to avoid orphaned files if extension changes
      const commonExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
      for (const ext of commonExtensions) {
        // We don't want to error out if removal fails (e.g., file didn't exist)
        await supabase.storage.from('avatars').remove([`public/${user.id}/avatar.${ext}`]);
      }

      // Upload new avatar
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      // Get public URL - use the original filePath
      const { data: publicUrlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      console.log('[handleSimpleAvatarUpload] publicUrlData from getPublicUrl (original filePath):', publicUrlData);
      
      if (!publicUrlData?.publicUrl) throw new Error('Could not get public URL for avatar.');

      // The filePath is `public/${user.id}/avatar.${fileExt}`.
      // The getPublicUrl for this should correctly be <base_storage_url>/avatars/public/${user.id}/avatar.${fileExt}
      // We assume Supabase constructs this correctly and avoid manual manipulation unless proven problematic by logs.
      let finalPublicUrl = publicUrlData.publicUrl;
      
      const newPublicAvatarUrl = `${finalPublicUrl}?t=${new Date().getTime()}`; // Cache busting
      console.log('[handleSimpleAvatarUpload] newPublicAvatarUrl to be stored:', newPublicAvatarUrl);

      // Update profile in DB
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newPublicAvatarUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (profileUpdateError) throw profileUpdateError;

      // Update local profile state
      setProfile(prev => prev ? { ...prev, avatar_url: newPublicAvatarUrl } : null);
      setSuccessMessage('Avatar updated successfully!');

      // Also update the user metadata in Supabase Auth
      if (user) { // Ensure user object is available
        const { data: updatedUserData, error: updateUserError } = await supabase.auth.updateUser({
          data: { avatar_url: newPublicAvatarUrl } // Make sure your user_metadata schema can hold this
        });

        if (updateUserError) {
          console.error('[ProfilePage][handleSimpleAvatarUpload] Error updating user auth metadata with new avatar_url:', updateUserError.message);
          // Decide if this error should be shown to the user or just logged
          // setAvatarUploadError(prevError => prevError ? `${prevError}\nFailed to update auth metadata.` : 'Failed to update auth metadata.');
        } else {
          console.log('[ProfilePage][handleSimpleAvatarUpload] Successfully updated user auth metadata with new avatar_url:', updatedUserData);
          // The onAuthStateChange listener in this component and UserSidebar should pick this up.
        }
      }

    } catch (error: any) {
      console.error('[handleSimpleAvatarUpload] Error during upload process:', error);
      setAvatarUploadError(`Upload failed: ${error.message}`);
      setSuccessMessage(null);
    } finally {
      setIsUploadingAvatar(false);
      // Clear file input value so the same file can be selected again if needed after an error
      event.target.value = '';
      setTimeout(() => {
        setSuccessMessage(null);
        setAvatarUploadError(null);
      }, 3000);
    }
  };
  // --- END NEW Simplified Avatar Upload Function ---

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      setError("User or profile not loaded.");
      setSaving(false);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    let sanitizedUsername = newUsername.trim().toLowerCase();
    sanitizedUsername = sanitizedUsername.replace(/\s+/g, '_');
    sanitizedUsername = sanitizedUsername.replace(/[^a-z0-9_]/g, '');
    sanitizedUsername = sanitizedUsername.replace(/^_+|_+$/g, '');

    if (!sanitizedUsername || sanitizedUsername.length < 3) {
      setError('Username must be at least 3 characters long after sanitization (letters, numbers, underscores only).');
      setSaving(false);
      return;
    }
    if (sanitizedUsername.length > 20) {
      setError('Username cannot exceed 20 characters after sanitization.');
      setSaving(false);
      return;
    }

    const updates: ProfileForUpdate = {
      username: sanitizedUsername,
      display_name: newDisplayName.trim() || sanitizedUsername,
      full_name: newFullName.trim() || null,
      bio: newBio.trim() || null,
      website_url: newWebsiteUrl.trim() || null,
      twitter_url: newTwitterUrl.trim() || null,
      linkedin_url: newLinkedInUrl.trim() || null,
      github_url: newGitHubUrl.trim() || null,
      instagram_url: newInstagramUrl.trim() || null,
      discord_url: newDiscordUrl.trim() || null,
      phone_whatsapp: newPhoneWhatsapp.trim() || null,
      updated_at: new Date().toISOString(),
    };

    const { error: updateError } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      setError(`Failed to update profile: ${updateError.message}. Username might be taken or some fields invalid.`);
    } else {
      // For the profile state, we spread the existing profile and then the updates.
      // Since updates doesn't have avatar_url, profile.avatar_url will persist if it exists.
      setProfile(prevProfile => {
        if (!prevProfile) return null; 
        const updatedProfileState: Profile = {
          ...prevProfile, // Keeps avatar_url and any other non-updated fields from prevProfile
          username: updates.username !== undefined ? updates.username : prevProfile.username,
          display_name: updates.display_name !== undefined ? updates.display_name : prevProfile.display_name,
          full_name: updates.full_name !== undefined ? updates.full_name : prevProfile.full_name,
          bio: updates.bio !== undefined ? updates.bio : prevProfile.bio,
          website_url: updates.website_url !== undefined ? updates.website_url : prevProfile.website_url,
          twitter_url: updates.twitter_url !== undefined ? updates.twitter_url : prevProfile.twitter_url,
          linkedin_url: updates.linkedin_url !== undefined ? updates.linkedin_url : prevProfile.linkedin_url,
          github_url: updates.github_url !== undefined ? updates.github_url : prevProfile.github_url,
          instagram_url: updates.instagram_url !== undefined ? updates.instagram_url : prevProfile.instagram_url,
          discord_url: updates.discord_url !== undefined ? updates.discord_url : prevProfile.discord_url,
          phone_whatsapp: updates.phone_whatsapp !== undefined ? updates.phone_whatsapp : prevProfile.phone_whatsapp,
        };
        return updatedProfileState;
      });
      setNewUsername(updates.username || ''); // Use || '' as fallback if updates.username is null
      setNewDisplayName(updates.display_name || '');
      setNewFullName(updates.full_name || '');
      setNewBio(updates.bio || '');
      setNewWebsiteUrl(updates.website_url || '');
      setNewTwitterUrl(updates.twitter_url || '');
      setNewLinkedInUrl(updates.linkedin_url || '');
      setNewGitHubUrl(updates.github_url || '');
      setNewInstagramUrl(updates.instagram_url || '');
      setNewDiscordUrl(updates.discord_url || '');
      setNewPhoneWhatsapp(updates.phone_whatsapp || '');
      setSuccessMessage('Profile updated successfully!');
    }
    setSaving(false);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <FaRocket className="text-6xl text-sky-500 mb-4 animate-pulse" />
        <p className="text-xl text-gray-400">Loading your universe...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 overflow-x-hidden">
      <main className="flex-grow bg-black">
        <div className="mx-auto bg-black">
          {/* Content within this div will be commented out for diagnosis*/}
          <section className="mb-12 p-6 md:p-8 bg-sky-700 via-sky-600 to-cyan-500 rounded-xl shadow-2xl text-white border border-sky-500/60">
            {/* Welcome card/Hero Section */}
            <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
              {/* Avatar */}
              <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full overflow-hidden border-4 border-sky-400 shadow-lg">
                {isUploadingAvatar ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75">
                    <FaSpinner className="text-sky-300 animate-spin text-3xl" />
                  </div>
                ) : (
                  <img 
                    src={profile?.avatar_url || 'https://klaputzxeqgypphzdxpr.supabase.co/storage/v1/object/public/avatars/public/user_icon.png'} 
                    alt={`${profile?.username || 'User'}'s avatar`} 
                    className="w-full h-full object-cover"
                  />
                )}
                {/* Avatar Upload Button */}
                <label 
                  htmlFor="avatar-upload" 
                  className="absolute bottom-0 right-0 bg-sky-500 p-2 rounded-full cursor-pointer border-2 border-sky-300 hover:bg-sky-600 transition-colors duration-200 ease-in-out shadow-md"
                  title="Upload new avatar"
                >
                  <FaImage className="text-white text-lg" />
                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleSimpleAvatarUpload}
                    disabled={isUploadingAvatar}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Profile Info */}
              <div className="flex-grow text-center md:text-left">
                <h1 className="text-4xl font-bold mb-2 tracking-tight">{profile?.display_name || profile?.username || 'New User'}</h1>
                {profile?.full_name && <p className="text-lg text-gray-200 mb-2">{profile.full_name}</p>}
                {profile?.bio && <p className="text-md text-gray-300 leading-relaxed">{profile.bio}</p>}
                <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-gray-200">
                  {profile?.website_url && (
                    <Link href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-200 transition-colors">
                      <FaLink className="mr-2" /> Website
                    </Link>
                  )}
                  {profile?.github_url && (
                    <Link href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-200 transition-colors">
                      <FaLink className="mr-2" /> GitHub
                    </Link>
                  )}
                   {profile?.linkedin_url && (
                    <Link href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-200 transition-colors">
                      <FaLink className="mr-2" /> LinkedIn
                    </Link>
                  )}
                   {profile?.twitter_url && (
                    <Link href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-200 transition-colors">
                      <FaLink className="mr-2" /> Twitter
                    </Link>
                  )}
                   {profile?.instagram_url && (
                    <Link href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-200 transition-colors">
                      <FaLink className="mr-2" /> Instagram
                    </Link>
                  )}
                   {profile?.discord_url && (
                    <Link href={profile.discord_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-200 transition-colors">
                      <FaLink className="mr-2" /> Discord
                    </Link>
                  )}
                   {profile?.phone_whatsapp && (
                    <Link href={`tel:${profile.phone_whatsapp}`} className="flex items-center hover:text-sky-200 transition-colors">
                      <FaLink className="mr-2" /> Phone/WhatsApp
                    </Link>
                   )}
                </div>
              </div>
            </div>
          </section>

          {/* Render ProfileDetails Component */}
          <ProfileDetails
            profile={profile}
            isUploadingAvatar={isUploadingAvatar}
            avatarUploadError={avatarUploadError}
            onAvatarUpload={handleSimpleAvatarUpload}
          />

          {/* Sticky Header for Navigation/Actions (Optional, depends on design) */}
          {/* <div className="sticky top-0 z-50 bg-black flex flex-col sm:flex-row items-center py-4 border-b border-gray-700">
            // ... sticky header content ...
          </div> */}

          {/* Main Content Sections */}
          <div className="mt-10">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              {/* Render UserSkills Component */}
              <UserSkills
                selectedSkills={selectedSkills}
                allSkills={allSkills}
                userSkillIds={userSkillIds}
                loadingSkills={loadingSkills}
                savingSkills={savingSkills}
                customSkillInput={customSkillInput}
                skillChoiceInAdder={skillChoiceInAdder}
                onSkillToggle={handleSkillToggle}
                onAddCustomSkill={handleAddCustomSkill}
                onCustomSkillInputChange={(e) => setCustomSkillInput(e.target.value)}
                onSkillChoiceInAdderChange={(e) => setSkillChoiceInAdder(e.target.value)}
              />

              {/* Render UserTeams Component */}
              <UserTeams
                userTeams={userTeams}
                loadingUserTeams={loadingUserTeams}
                errorUserTeams={errorUserTeams}
              />
            </div>

            {/* Edit Profile Form */}
            <section className="pb-6 w-full mt-6 md:mt-8 p-6 bg-gray-800 rounded-xl shadow-inner border border-gray-700">
              <h2 className="text-2xl font-semibold mb-6 text-purple-400 flex items-center"><FaUserCircle className="mr-3 text-purple-300"/> Edit Your Profile</h2>
              <form onSubmit={handleUpdateProfile} className="space-y-6">
                {/* Status Messages */}
                {error && <p className="text-red-400 text-sm">{error}</p>}
                {successMessage && <p className="text-green-400 text-sm">{successMessage}</p>}
                 {avatarUploadError && <p className="text-red-400 text-sm">{avatarUploadError}</p>}
                
                {/* Form Fields */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 flex items-center"><FaSignature className="mr-2 text-gray-400"/> Username</label>
                  <input
                    type="text"
                    id="username"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm text-white focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    placeholder="Your unique username"
                  />
                </div>
                <div>
                  <label htmlFor="display_name" className="block text-sm font-medium text-gray-300 flex items-center"><FaUserCircle className="mr-2 text-gray-400"/> Display Name</label>
                  <input
                    type="text"
                    id="display_name"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm text-white focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    placeholder="Name shown publicly (defaults to username)"
                  />
                </div>
                 <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 flex items-center"><FaSignature className="mr-2 text-gray-400"/> Full Name</label>
                  <input
                    type="text"
                    id="full_name"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm text-white focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    placeholder="Your full legal name (optional)"
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-300 flex items-center"><FaInfoCircle className="mr-2 text-gray-400"/> Bio</label>
                  <textarea
                    id="bio"
                    rows={4}
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm text-white focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                    placeholder="Tell us about yourself..."
                  ></textarea>
                </div>

                {/* Social & Contact Links */}
                <h3 className="text-lg font-semibold mt-8 mb-4 text-gray-300">Links & Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="website_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Website URL</label>
                    <input
                      type="url"
                      id="website_url"
                      value={newWebsiteUrl}
                      onChange={(e) => setNewWebsiteUrl(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm text-white focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="github_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> GitHub URL</label>
                    <input
                      type="url"
                      id="github_url"
                      value={newGitHubUrl}
                      onChange={(e) => setNewGitHubUrl(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm text-white focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="https://github.com/yourprofile"
                    />
                  </div>
                   <div>
                    <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> LinkedIn URL</label>
                    <input
                      type="url"
                      id="linkedin_url"
                      value={newLinkedInUrl}
                      onChange={(e) => setNewLinkedInUrl(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm text-white focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                   <div>
                    <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Twitter URL</label>
                    <input
                      type="url"
                      id="twitter_url"
                      value={newTwitterUrl}
                      onChange={(e) => setNewTwitterUrl(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm text-white focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </div>
                   <div>
                    <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Instagram URL</label>
                    <input
                      type="url"
                      id="instagram_url"
                      value={newInstagramUrl}
                      onChange={(e) => setNewInstagramUrl(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm text-white focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="https://instagram.com/yourhandle"
                    />
                  </div>
                   <div>
                    <label htmlFor="discord_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Discord URL</label>
                    <input
                      type="url"
                      id="discord_url"
                      value={newDiscordUrl}
                      onChange={(e) => setNewDiscordUrl(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm text-white focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="Your Discord invite link or tag"
                    />
                  </div>
                   <div>
                    <label htmlFor="phone_whatsapp" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Phone/WhatsApp</label>
                    <input
                      type="text"
                      id="phone_whatsapp"
                      value={newPhoneWhatsapp}
                      onChange={(e) => setNewPhoneWhatsapp(e.target.value)}
                      className="mt-1 block w-full rounded-md bg-gray-700 border-gray-600 shadow-sm text-white focus:border-sky-500 focus:ring-sky-500 sm:text-sm"
                      placeholder="Your phone or WhatsApp number (optional)"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex justify-end mt-6">
                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {saving ? <FaSpinner className="animate-spin mr-3" /> : <FaSave className="mr-3" />}
                    {saving ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </section>
          </div>
          {/*End of commented out content */}
        </div>
      </main>
    </div>
  );
} 