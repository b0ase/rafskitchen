'use client';

import React, { useEffect, useState, FormEvent, ChangeEvent, useRef } from 'react';
import Link from 'next/link'; 
import { FaSave, FaUserCircle, FaImage, FaSignature, FaInfoCircle, FaLink, FaRocket, FaPlus, FaUsers, FaPlusSquare, FaHandshake, FaBriefcase, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaQuestionCircle, FaSpinner } from 'react-icons/fa'; 
import { useRouter, usePathname } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Adjust path if needed
import { User } from '@supabase/supabase-js'; // Added import for User type

interface Profile {
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
}

// Define a specific interface for the update payload
interface ProfileForUpdate {
  username?: string | null;
  display_name?: string | null;
  full_name?: string | null;
  bio?: string | null;
  website_url?: string | null;
  twitter_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  instagram_url?: string | null;
  discord_url?: string | null;
  phone_whatsapp?: string | null;
  updated_at: string; 
  // avatar_url is intentionally omitted as it's handled separately
}

// --- NEW Skill and UserSkill Interfaces ---
interface Skill {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
}

interface UserSkill {
  id: string; // This is the id from the user_skills join table
  user_id: string;
  skill_id: string;
  skills?: Pick<Skill, 'id' | 'name' | 'category'>; // To hold joined skill details
}
// --- END NEW Interfaces ---

// --- NEW Team Interfaces (similar to app/team/page.tsx) ---
// Helper to map icon names to components
const iconMap: { [key: string]: React.ElementType } = {
  FaDatabase,
  FaPalette,
  FaBolt,
  FaCloud,
  FaLightbulb,
  FaBrain,
  FaUsers, // For a generic team icon
  FaQuestionCircle, // Default
  FaSpinner, // For loading states
};

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
// --- END NEW Team Interfaces ---

// ClientProject interface can be removed if My Projects section is gone.
/*
interface ClientProject {
  id: string; 
  name: string;
  project_slug: string;
  status: string | null;
  project_brief?: string | null;
}
*/

// --- NEW Skill Badge Styling Function ---
const getSkillBadgeStyle = (category: string | null): string => {
  const baseStyle = "px-3 py-1.5 text-xs font-semibold rounded-full shadow-md flex items-center justify-center";
  switch (category?.toLowerCase().trim()) {
    case 'frontend development': return `${baseStyle} bg-green-600 text-green-100 border border-green-500`;
    case 'backend development': return `${baseStyle} bg-blue-600 text-blue-100 border border-blue-500`;
    case 'programming': return `${baseStyle} bg-indigo-600 text-indigo-100 border border-indigo-500`;
    case 'design': return `${baseStyle} bg-pink-600 text-pink-100 border border-pink-500`;
    case 'management': return `${baseStyle} bg-purple-600 text-purple-100 border border-purple-500`;
    case 'databases': return `${baseStyle} bg-yellow-500 text-yellow-900 border border-yellow-400`; // Adjusted for better contrast
    case 'devops': return `${baseStyle} bg-red-600 text-red-100 border border-red-500`;
    case 'cloud computing': return `${baseStyle} bg-cyan-600 text-cyan-100 border border-cyan-500`;
    case 'marketing': return `${baseStyle} bg-orange-600 text-orange-100 border border-orange-500`;
    case 'user-defined': return `${baseStyle} bg-teal-600 text-teal-100 border border-teal-500`; // Style for user-defined skills
    default: return `${baseStyle} bg-gray-600 text-gray-100 border border-gray-500`; // For 'Other' or uncategorized
  }
};
// --- END NEW Skill Badge Styling Function ---

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
          {/* --- RESTORED WELCOME CARD SECTION --- */}
          <section className="mb-12 p-6 md:p-8 bg-gradient-to-br from-sky-700 via-sky-600 to-cyan-500 rounded-xl shadow-2xl text-white border border-sky-500/60">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="mb-4 sm:mb-0 sm:mr-6 text-center sm:text-left">
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                  Welcome back, <span className="text-sky-300">{profile?.display_name || user?.email || 'Explorer'}</span>!
                </h1>
                <p className="mt-2 text-sky-100 text-base md:text-lg">
                  This is your command center. Manage your profile, skills, and projects.
                </p>
              </div>
              <div className="flex-shrink-0">
                {profile?.avatar_url ? (
                  <img src={profile?.avatar_url || undefined} alt="User Avatar" className="w-20 h-20 md:w-24 md:h-24 rounded-full object-cover border-4 border-sky-400 shadow-lg" />
                ) : (
                  <FaUserCircle className="w-20 h-20 md:w-24 md:h-24 text-sky-300" />
                )}
              </div>
            </div>
            <p className="mt-6 text-sm text-sky-200 bg-black/20 p-3 rounded-md italic">
              <FaInfoCircle className="inline mr-2 mb-0.5" />
              Keep your profile vibrant and skills sharp to make the most of your journey on B0ASE.
            </p>
          </section>
          {/* --- END WELCOME CARD --- */}

          {/* Sticky Header for Tabs/Quick Actions - can be simplified or removed if not strictly necessary */}
          <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-md flex flex-col sm:flex-row items-center justify-between py-3 sm:py-4 border-b border-gray-700 px-2 sm:px-0 mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-sky-400">
              Your Dashboard
            </h2>
            <div className="flex items-center space-x-2 sm:space-x-3 mt-2 sm:mt-0">
              <Link href="/myprojects" className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-md transition-colors flex items-center">
                <FaBriefcase className="mr-1.5 h-4 w-4" />My Projects
              </Link>
              <Link href="/teams" className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-md transition-colors flex items-center">
                <FaUsers className="mr-1.5 h-4 w-4" />My Teams
              </Link>
            </div>
          </div>
          
          <div className="mt-10">
            {/* Container for Skills and Teams (Side by Side on lg) */}
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              {/* Skills Section */}
              <section className="pb-6 lg:w-1/2 bg-gray-800/30 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-semibold text-sky-400 hover:text-sky-300 transition-colors duration-150 flex items-center">
                    <FaLightbulb className="mr-3 text-2xl text-sky-500" /> My Skills & Expertise
                  </h2>
                </div>
                {loadingSkills ? (
                   <div className="flex justify-center items-center py-10">
                     <FaSpinner className="animate-spin text-sky-500 text-3xl" />
                     <p className="ml-3 text-gray-400">Loading skills...</p>
                   </div>
                ) : (
                  <>
                    {selectedSkills.length > 0 ? (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedSkills.map((skill) => (
                          <span 
                            key={skill.id} 
                            className={`${getSkillBadgeStyle(skill.category)} cursor-pointer`}
                            title={`Category: ${skill.category || 'N/A'}. Click to remove (not implemented here yet).`} // Basic remove functionality can be added
                            onClick={() => handleSkillToggle(skill.id, true)} // Call toggle with isCurrentlySelected = true
                          >
                            {skill.name}
                            <button 
                              onClick={(e) => { e.stopPropagation(); handleSkillToggle(skill.id, true); }}
                              className="ml-1.5 text-xs opacity-70 hover:opacity-100"
                              title="Remove skill"
                            >
                              &times;
                            </button>
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400 italic mb-4">You haven't added any skills yet. Showcase your talents!</p>
                    )}

                    {/* Skill Adder Section */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <h3 className="text-md font-semibold text-sky-500 mb-2">Add New Skill</h3>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <select 
                          value={skillChoiceInAdder}
                          onChange={(e) => {
                            const selectedSkillId = e.target.value;
                            setSkillChoiceInAdder(selectedSkillId); // Keep select controlled
                            if (selectedSkillId && !userSkillIds.has(selectedSkillId)) {
                              handleSkillToggle(selectedSkillId, false); // Add skill
                              setSkillChoiceInAdder(''); // Reset select after adding
                            }
                          }}
                          className="flex-grow bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-md p-2.5 focus:ring-sky-500 focus:border-sky-500"
                        >
                          <option value="">Choose from existing skills...</option>
                          {allSkills
                            .filter(skill => !userSkillIds.has(skill.id)) // Only show skills not already added
                            .sort((a, b) => a.name.localeCompare(b.name)) // Sort alphabetically
                            .map(skill => (
                              <option key={skill.id} value={skill.id}>{skill.name} ({skill.category || 'General'})</option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-3 flex flex-col sm:flex-row gap-2">
                        <input 
                          type="text"
                          value={customSkillInput}
                          onChange={(e) => setCustomSkillInput(e.target.value)}
                          placeholder="Or type a new skill..."
                          className="flex-grow bg-gray-700 border border-gray-600 text-gray-200 text-sm rounded-md p-2.5 focus:ring-sky-500 focus:border-sky-500"
                        />
                        <button
                          onClick={() => {
                            if (customSkillInput.trim()) {
                              handleAddCustomSkill(customSkillInput.trim());
                              setCustomSkillInput(''); // Clear input after adding
                            }
                          }}
                          disabled={savingSkills || !customSkillInput.trim()}
                          className="bg-sky-600 hover:bg-sky-500 disabled:bg-sky-800 text-white text-sm font-medium py-2.5 px-4 rounded-md transition-colors flex items-center justify-center"
                        >
                          <FaPlus className="mr-1.5 h-4 w-4" /> Add Custom
                        </button>
                      </div>
                    </div>
                    {savingSkills && <p className="text-xs text-sky-400 mt-2">Updating your skills...</p>}
                  </>
                )}
              </section>

              {/* User Teams Section */}
              <section className="pb-6 lg:w-1/2 bg-gray-800/30 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                <div className="flex justify-between items-center mb-5">
                  <h2 className="text-xl font-semibold text-purple-400 hover:text-purple-300 transition-colors duration-150 flex items-center">
                    <FaUsers className="mr-3 text-2xl text-purple-500" /> My Teams
                  </h2>
                  <Link href="/teams/new" className="px-3 py-1.5 text-xs sm:text-sm font-medium text-white bg-purple-600 hover:bg-purple-500 rounded-md transition-colors flex items-center">
                    <FaPlusSquare className="mr-1.5 h-4 w-4" /> Create Team
                  </Link>
                </div>
                {loadingUserTeams ? (
                  <div className="flex justify-center items-center py-10">
                     <FaSpinner className="animate-spin text-purple-500 text-3xl" />
                     <p className="ml-3 text-gray-400">Loading your teams...</p>
                   </div>
                ) : errorUserTeams ? (
                  <p className="text-sm text-red-400 bg-red-900/30 p-3 rounded-md">{errorUserTeams}</p>
                ) : userTeams.length > 0 ? (
                  <ul className="space-y-3">
                    {userTeams.map((team) => {
                      const IconComponent = team.icon_name && iconMap[team.icon_name] ? iconMap[team.icon_name] : FaQuestionCircle;
                      const bgColor = team.color_scheme?.bgColor || 'bg-gray-700';
                      const textColor = team.color_scheme?.textColor || 'text-gray-200';
                      const borderColor = team.color_scheme?.borderColor || 'border-gray-600';

                      return (
                        <li key={team.id}>
                          <Link href={`/teams/${team.slug}`} legacyBehavior>
                            <a className={`block p-3.5 rounded-lg border ${borderColor} ${bgColor} hover:opacity-90 transition-opacity shadow-md`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <IconComponent className={`w-6 h-6 mr-3 ${textColor}`} />
                                  <span className={`font-medium ${textColor}`}>{team.name}</span>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${bgColor === 'bg-yellow-500' ? 'text-yellow-900 bg-yellow-300' : textColor + ' bg-black/20'}`}>
                                  View Team
                                </span>
                              </div>
                            </a>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="text-center py-6 bg-gray-800/50 p-4 rounded-lg border border-dashed border-gray-700">
                    <FaUsers className="mx-auto text-3xl text-gray-500 mb-2" />
                    <p className="text-sm text-gray-400 mb-3">You're not part of any teams yet.</p>
                    <Link href="/teams/join" className="text-sm text-sky-400 hover:text-sky-300 font-medium inline-flex items-center">
                      <FaHandshake className="mr-1.5" /> Join a Team
                    </Link>
                  </div>
                )}
              </section>
            </div>
            {/* End Skills and Teams Container */}
            
            {/* User Profile Form Section */}
            <section className="pb-6 w-full mt-6 md:mt-8">
              <h2 className="text-xl font-semibold text-sky-400 hover:text-sky-300 transition-colors duration-150 flex items-center mb-5">
                <FaUserCircle className="mr-3 text-2xl text-sky-500" /> Edit Profile
              </h2>
              <form id="profileForm" onSubmit={handleUpdateProfile} className="space-y-6 bg-gray-750 p-6 rounded-lg border border-gray-600 shadow-xl">
                {/* Row for Username and Display Name */}
                <div className="flex flex-col sm:flex-row gap-x-4 gap-y-6">
                  {/* Username Input */}
                  <div className="flex-1 min-w-0 sm:w-1/2">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Username <span className="text-xs text-red-400">(public, unique, 3-20 chars, a-z, 0-9, _)</span>
                    </label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-gray-500"
                      placeholder="your_unique_username"
                      required
                      minLength={3}
                      maxLength={25} // Allow slightly longer input before sanitization
                    />
                  </div>

                  {/* Display Name Input */}
                  <div className="flex-1 min-w-0 sm:w-1/2">
                    <label htmlFor="display_name" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Display Name <span className="text-xs text-gray-500">(public)</span>
                    </label>
                    <input
                      type="text"
                      id="display_name"
                      name="display_name"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      className="block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-gray-500"
                      placeholder="Your Public Name"
                    />
                  </div>
                </div>

                {/* Full Name Input */}
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Full Name <span className="text-xs text-gray-500">(private, optional)</span>
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    id="full_name"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-gray-500"
                    placeholder="Your Full Name"
                  />
                </div>
                
                {/* Bio Textarea */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1.5">
                    Bio <span className="text-xs text-gray-500">(public, optional, max 300 chars)</span>
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    className="block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-gray-500"
                    placeholder="Tell us a bit about yourself..."
                    maxLength={300}
                  ></textarea>
                </div>

                {/* Avatar Upload Section - Simplified */}
                <div className="pt-2">
                  <label className="block text-sm font-medium text-gray-300 mb-1.5">
                    Profile Picture <span className="text-xs text-gray-500">(public, max 1MB, JPG/PNG)</span>
                  </label>
                  <div className="mt-1 flex items-center space-x-4">
                    <span className="inline-block h-16 w-16 rounded-full overflow-hidden bg-gray-700 border-2 border-gray-600">
                      {profile?.avatar_url ? (
                        <img className="h-full w-full object-cover" src={profile?.avatar_url || undefined} alt="Current avatar" />
                      ) : (
                        <FaUserCircle className="h-full w-full text-gray-500" />
                      )}
                    </span>
                    <label htmlFor="avatar-upload-input" className="cursor-pointer bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium py-2 px-3 rounded-md transition-colors flex items-center">
                      <FaImage className="mr-2 h-4 w-4" /> {isUploadingAvatar ? 'Uploading...' : 'Change Avatar'}
                      <input 
                        id="avatar-upload-input" 
                        name="avatar" 
                        type="file" 
                        className="sr-only" 
                        accept="image/png, image/jpeg"
                        onChange={handleSimpleAvatarUpload}
                        disabled={isUploadingAvatar}
                      />
                    </label>
                  </div>
                  {isUploadingAvatar && <p className="text-xs text-sky-400 mt-1">Processing image, please wait...</p>}
                  {avatarUploadError && <p className="text-xs text-red-400 mt-1">{avatarUploadError}</p>}
                </div>

                {/* Social & Contact Links - Two Column Layout on sm+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-6 pt-2">
                  <div>
                    <label htmlFor="website_url" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Website URL <span className="text-xs text-gray-500">(e.g., https://yoursite.com)</span>
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLink className="h-4 w-4 text-gray-500" />
                      </div>
                      <input
                        type="url"
                        name="website_url"
                        id="website_url"
                        value={newWebsiteUrl}
                        onChange={(e) => setNewWebsiteUrl(e.target.value)}
                        className="block w-full bg-gray-800 border-gray-600 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-gray-500"
                        placeholder="https://your.portfolio.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-300 mb-1.5">
                      LinkedIn Profile URL
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.004v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.71zM5.337 7.433a1.062 1.062 0 01-1.06-1.06A1.062 1.062 0 015.337 5.314a1.062 1.062 0 011.06 1.06c0 .585-.476 1.06-1.06 1.06zm.437 8.905H4.02V8.59h2.754v7.748z" clipRule="evenodd" /></svg>
                       </div>
                       <input
                         type="url"
                         name="linkedin_url"
                         id="linkedin_url"
                         value={newLinkedInUrl}
                         onChange={(e) => setNewLinkedInUrl(e.target.value)}
                         className="block w-full bg-gray-800 border-gray-600 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-gray-500"
                         placeholder="https://linkedin.com/in/yourprofile"
                       />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="github_url" className="block text-sm font-medium text-gray-300 mb-1.5">
                      GitHub Profile URL
                    </label>
                     <div className="mt-1 relative rounded-md shadow-sm">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.602-3.369-1.34-3.369-1.34-.455-1.158-1.11-1.468-1.11-1.468-.908-.62.069-.608.069-.608 1.003.074 1.532 1.029 1.532 1.029.891 1.529 2.341 1.089 2.91.833.091-.647.349-1.086.635-1.336-2.22-.251-4.555-1.107-4.555-4.934 0-1.09.39-1.984 1.03-2.682-.103-.253-.446-1.27.098-2.644 0 0 .84-.269 2.75 1.025A9.549 9.549 0 0110 5.018a9.606 9.606 0 012.507.336c1.909-1.294 2.748-1.025 2.748-1.025.546 1.374.203 2.391.1 2.644.64.698 1.026 1.592 1.026 2.682 0 3.839-2.338 4.681-4.567 4.922.357.307.678.915.678 1.846 0 1.332-.012 2.407-.012 2.734 0 .268.18.579.688.481A10.001 10.001 0 0020 10c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg>
                       </div>
                       <input
                         type="url"
                         name="github_url"
                         id="github_url"
                         value={newGitHubUrl}
                         onChange={(e) => setNewGitHubUrl(e.target.value)}
                         className="block w-full bg-gray-800 border-gray-600 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-gray-500"
                         placeholder="https://github.com/yourusername"
                       />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-300 mb-1.5">
                      X (Twitter) Profile URL
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                      </div>
                      <input
                        type="url"
                        name="twitter_url"
                        id="twitter_url"
                        value={newTwitterUrl}
                        onChange={(e) => setNewTwitterUrl(e.target.value)}
                        className="block w-full bg-gray-800 border-gray-600 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-gray-500"
                        placeholder="https://x.com/yourusername"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Instagram Profile URL
                    </label>
                     <div className="mt-1 relative rounded-md shadow-sm">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                         <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162S15.403 5.838 12 5.838zm0 10.328c-2.299 0-4.166-1.867-4.166-4.166s1.867-4.166 4.166-4.166 4.166 1.867 4.166 4.166-1.867 4.166-4.166 4.166zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" /></svg>
                       </div>
                        <input
                          type="url"
                          name="instagram_url"
                          id="instagram_url"
                          value={newInstagramUrl}
                          onChange={(e) => setNewInstagramUrl(e.target.value)}
                          className="block w-full bg-gray-800 border-gray-600 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-gray-500"
                          placeholder="https://instagram.com/yourusername"
                        />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="discord_url" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Discord (e.g., username#1234 or invite link)
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M20.227 4.004A14.077 14.077 0 0012.001 2a14.09 14.09 0 00-8.228 2.004C1.703 6.31.501 9.458.501 12.601c0 3.172 1.25 6.334 3.807 8.622.02.016.042.03.065.043a.5.5 0 00.662-.019c.244-.172.482-.35.713-.533.027-.023.051-.048.074-.075a.499.499 0 00-.07-.727c-.005-.004-.01-.007-.015-.011a11.085 11.085 0 01-2.354-3.072c.88.228 1.79.363 2.725.404a.5.5 0 00.49-.585 11.017 11.017 0 00-.81-3.926.504.504 0 00-.482-.38A12.47 12.47 0 005.28 15.19a.5.5 0 00.481.696c.612-.05 1.212-.137 1.794-.262a11.118 11.118 0 007.892 0c.582.125 1.182.211 1.794.262a.5.5 0 00.481-.695 12.473 12.473 0 00-1.233-2.675.502.502 0 00-.482.378 11.014 11.014 0 00-.811 3.926.5.5 0 00.491.585c.936-.04 1.846-.176 2.725-.404a11.09 11.09 0 01-2.355 3.072c-.005.004-.01.007-.015.01a.5.5 0 00-.07.728c.023.026.047.052.074.075.23.184.47.361.713.533a.5.5 0 00.662.019c.023-.013.044-.027.065-.043 2.557-2.288 3.806-5.45 3.806-8.621 0-3.143-1.202-6.291-3.272-8.597zM8.751 15a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0zm6.5 0a1.75 1.75 0 11-3.5 0 1.75 1.75 0 013.5 0z" /></svg>
                      </div>
                      <input
                        type="text" 
                        name="discord_url"
                        id="discord_url"
                        value={newDiscordUrl}
                        onChange={(e) => setNewDiscordUrl(e.target.value)}
                        className="block w-full bg-gray-800 border-gray-600 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-gray-500"
                        placeholder="your_tag#1234 or server invite"
                      />
                    </div>
                  </div>
                   <div>
                    <label htmlFor="phone_whatsapp" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Phone/WhatsApp <span className="text-xs text-gray-500">(private, optional)</span>
                    </label>
                     <div className="mt-1 relative rounded-md shadow-sm">
                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-4 w-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-1.611-.916-2.206-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01s-.521.074-.792.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
                       </div>
                       <input
                         type="tel"
                         name="phone_whatsapp"
                         id="phone_whatsapp"
                         value={newPhoneWhatsapp}
                         onChange={(e) => setNewPhoneWhatsapp(e.target.value)}
                         className="block w-full bg-gray-800 border-gray-600 rounded-md py-2 px-3 pl-10 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm placeholder-gray-500"
                         placeholder="e.g., +1234567890 (optional)"
                       />
                    </div>
                  </div>
                </div>
                
                {/* Save Button and Messages */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                  <button
                    type="submit"
                    disabled={saving || isUploadingAvatar}
                    className="bg-green-600 hover:bg-green-500 disabled:bg-green-800 text-white font-semibold py-2.5 px-6 rounded-md shadow-md transition-colors duration-150 flex items-center text-sm"
                  >
                    <FaSave className="mr-2 h-4 w-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                  <div className="text-sm text-right">
                    {error && <p className="text-red-400 bg-red-900/20 p-2 rounded-md">{error}</p>}
                    {successMessage && <p className="text-green-400 bg-green-900/20 p-2 rounded-md">{successMessage}</p>}
                  </div>
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 