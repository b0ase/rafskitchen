'use client';

import React, { useEffect, useState, FormEvent, ChangeEvent, useRef } from 'react';
import Link from 'next/link'; 
import { FaSave, FaUserCircle, FaImage, FaSignature, FaInfoCircle, FaLink, FaRocket, FaPlus, FaUsers, FaPlusSquare, FaHandshake, FaBriefcase, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaQuestionCircle, FaSpinner, FaGithub } from 'react-icons/fa'; 
import { useRouter, usePathname } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Adjust path if needed
import { User } from '@supabase/supabase-js'; // Added import for User type

interface Profile {
  id: string;
  username: string | null;
  display_name: string | null;
  avatar_url: string | null;
  full_name: string | null;
  bio: string | null;
  website_url: string | null;
  twitter_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  instagram_url: string | null;
  discord_url: string | null;
  phone_whatsapp: string | null;
  updated_at: string | null;
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
    let isSubscribed = true; // For cleanup
    setLoading(true);
    
    const fetchInitialUser = async () => {
      try {
        const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser();

        if (!isSubscribed) return; // Don't update state if unmounted

        if (userError) {
          console.error("[ProfilePage] Error fetching initial user with getUser():", userError.message);
          setUser(null);
          setError("Failed to authenticate. Please try logging in again.");
          router.push('/login');
          return;
        }
        
        if (!fetchedUser) {
          console.log('[ProfilePage] No user found with getUser() on initial load. Redirecting to login.');
          setUser(null);
          router.push('/login');
          return;
        }
        
        console.log('[ProfilePage] Initial user fetched with getUser():', fetchedUser.id);
        setUser(fetchedUser);
      } catch (e) {
        console.error("[ProfilePage] Critical error in fetchInitialUser:", e);
        setError("An unexpected error occurred. Please try refreshing the page.");
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    fetchInitialUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isSubscribed) return;

      if (event === 'SIGNED_OUT') {
        setUser(null);
        setProfile(null);
        router.push('/login');
        return;
      }

      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (currentUser) {
          setUser(currentUser);
        }
      }
    });

    return () => {
      isSubscribed = false;
      authListener.subscription?.unsubscribe();
    };
  }, [router, supabase]);

  // Separate useEffect for loading profile data
  useEffect(() => {
    let isSubscribed = true;

    const loadProfileData = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select(`
            id,
            username,
            display_name,
            avatar_url,
            full_name,
            bio,
            website_url,
            twitter_url,
            linkedin_url,
            github_url,
            instagram_url,
            discord_url,
            phone_whatsapp,
            updated_at
          `)
          .eq('id', user.id)
          .single();

        if (!isSubscribed) return;

        if (profileError) {
          console.error("[ProfilePage] Error fetching profile:", profileError);
          setError("Failed to load profile. Please try refreshing the page.");
          return;
        }

        if (profileData) {
          setProfile(profileData as Profile);
          // Update form states
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
        }
      } catch (e) {
        if (!isSubscribed) return;
        console.error("[ProfilePage] Error in loadProfileData:", e);
        setError("Failed to load profile data. Please try again.");
      } finally {
        if (isSubscribed) {
          setLoading(false);
        }
      }
    };

    loadProfileData();

    return () => {
      isSubscribed = false;
    };
  }, [user?.id]);

  // Separate useEffect for loading skills
  useEffect(() => {
    let isSubscribed = true;

    const loadSkills = async () => {
      if (!user?.id) return;

      try {
        setLoadingSkills(true);

        // Fetch user's skills
        const { data: userSkillsData, error: userSkillsError } = await supabase
          .from('user_skills')
          .select(`
            skill_id,
            skills (id, name, category, description)
          `)
          .eq('user_id', user.id);

        if (!isSubscribed) return;

        if (userSkillsError) {
          console.error("[ProfilePage] Error fetching user skills:", userSkillsError);
          return;
        }

        if (userSkillsData) {
          const processedSkills = userSkillsData
            .map(us => {
              const skillDetail = Array.isArray(us.skills) ? us.skills[0] : us.skills;
              if (!skillDetail) return null;
              return {
                id: skillDetail.id,
                name: skillDetail.name,
                category: skillDetail.category || 'Other',
                description: skillDetail.description || ''
              };
            })
            .filter(Boolean) as Skill[];

          setSelectedSkills(processedSkills);
          setUserSkillIds(new Set(processedSkills.map(s => s.id)));
        }

        // Fetch all available skills
        const { data: allSkillsData, error: allSkillsError } = await supabase
          .from('skills')
          .select('*')
          .order('name');

        if (!isSubscribed) return;

        if (allSkillsError) {
          console.error("[ProfilePage] Error fetching all skills:", allSkillsError);
          return;
        }

        if (allSkillsData) {
          setAllSkills(allSkillsData);
        }
      } catch (e) {
        if (!isSubscribed) return;
        console.error("[ProfilePage] Error in loadSkills:", e);
      } finally {
        if (isSubscribed) {
          setLoadingSkills(false);
        }
      }
    };

    loadSkills();

    return () => {
      isSubscribed = false;
    };
  }, [user?.id]);

  // Separate useEffect for loading teams
  useEffect(() => {
    let isSubscribed = true;

    const loadTeams = async () => {
      if (!user?.id) return;

      try {
        setLoadingUserTeams(true);
        setErrorUserTeams(null);

        const { data: teamUserEntries, error: teamUserError } = await supabase
          .from('user_team_memberships')
          .select('team_id')
          .eq('user_id', user.id);

        if (!isSubscribed) return;

        if (teamUserError) throw teamUserError;

        if (teamUserEntries?.length) {
          const teamIds = teamUserEntries.map(entry => entry.team_id);
          const { data: teamsData, error: teamsError } = await supabase
            .from('teams')
            .select('id, name, slug, icon_name, color_scheme')
            .in('id', teamIds);

          if (!isSubscribed) return;

          if (teamsError) throw teamsError;

          const processedTeams = teamsData?.map(team => ({
            id: team.id,
            name: team.name,
            slug: team.slug || null,
            icon_name: team.icon_name || 'FaQuestionCircle',
            color_scheme: team.color_scheme ? {
              bgColor: team.color_scheme.bgColor || 'bg-gray-700',
              textColor: team.color_scheme.textColor || 'text-gray-100',
              borderColor: team.color_scheme.borderColor || 'border-gray-500'
            } : null
          })) || [];

          setUserTeams(processedTeams);
        } else {
          setUserTeams([]);
        }
      } catch (e: any) {
        if (!isSubscribed) return;
        console.error("[ProfilePage] Error loading teams:", e);
        setErrorUserTeams(`Failed to load teams: ${e.message}`);
      } finally {
        if (isSubscribed) {
          setLoadingUserTeams(false);
        }
      }
    };

    loadTeams();

    return () => {
      isSubscribed = false;
    };
  }, [user?.id]);

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
          <section className="mb-12 p-6 md:p-8 bg-sky-700 via-sky-600 to-cyan-500 rounded-xl shadow-2xl text-white border border-sky-500/60">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 flex items-center">
              <FaUserCircle className="mr-4 text-4xl md:text-5xl text-sky-300" />
              Welcome, {profile?.display_name || profile?.username || 'Explorer'}!
            </h1>
            <p className="text-lg text-sky-100 mb-6">
              This is your personal space in the universe. Here you can manage your profile, skills, and team memberships.
            </p>
          </section>

          <div className="sticky top-0 z-50 bg-black flex flex-col sm:flex-row items-center py-4 border-b border-gray-700">
            <h2 className="text-2xl font-semibold text-sky-400 mb-4 sm:mb-0">Your Profile</h2>
          </div>

          <div className="mt-10">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              {/* Skills Section */}
              <section className="pb-6 lg:w-1/2 bg-gray-800/30 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                <h2 className="text-xl font-semibold text-sky-400 hover:text-sky-300 transition-colors duration-150 flex items-center mb-5">
                  <FaRocket className="mr-3 text-2xl text-sky-500" /> Your Skills
                </h2>
                <div className="space-y-4">
                  {loadingSkills ? (
                    <div className="flex items-center justify-center py-8">
                      <FaSpinner className="animate-spin text-3xl text-sky-500" />
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-2">
                        {selectedSkills.map((skill) => (
                          <div
                            key={skill.id}
                            className={`${getSkillBadgeStyle(skill.category)} group relative`}
                          >
                            {skill.name}
                            <button
                              onClick={() => handleSkillToggle(skill.id, true)}
                              className="ml-2 text-red-300 hover:text-red-100 transition-colors duration-150"
                              disabled={savingSkills}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customSkillInput}
                            onChange={(e) => setCustomSkillInput(e.target.value)}
                            placeholder="Add a new skill..."
                            className="flex-grow px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                          />
                          <button
                            onClick={() => handleAddCustomSkill(customSkillInput)}
                            disabled={!customSkillInput.trim() || savingSkills}
                            className="px-4 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-150 flex items-center"
                          >
                            <FaPlus className="mr-2" /> Add
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* User Teams Section */}
              <section className="pb-6 lg:w-1/2 bg-gray-800/30 p-4 md:p-6 rounded-xl border border-gray-700 shadow-lg">
                <h2 className="text-xl font-semibold text-sky-400 hover:text-sky-300 transition-colors duration-150 flex items-center mb-5">
                  <FaUsers className="mr-3 text-2xl text-sky-500" /> Your Teams
                </h2>
                {loadingUserTeams ? (
                  <div className="flex items-center justify-center py-8">
                    <FaSpinner className="animate-spin text-3xl text-sky-500" />
                  </div>
                ) : errorUserTeams ? (
                  <div className="text-red-400 p-4 rounded-lg bg-red-900/20 border border-red-800">
                    {errorUserTeams}
                  </div>
                ) : userTeams.length === 0 ? (
                  <div className="text-gray-400 text-center py-8">
                    <p>You're not part of any teams yet.</p>
                    <Link
                      href="/teams"
                      className="inline-block mt-4 px-6 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg transition-colors duration-150"
                    >
                      <FaPlusSquare className="inline-block mr-2" />
                      Join or Create a Team
                    </Link>
                  </div>
                ) : (
                  <div className="grid gap-4">
                    {userTeams.map((team) => {
                      const IconComponent = iconMap[team.icon_name || 'FaUsers'] || FaUsers;
                      return (
                        <Link
                          key={team.id}
                          href={`/teams/${team.slug || team.id}`}
                          className="block p-4 bg-gray-800/50 hover:bg-gray-700/50 rounded-lg border border-gray-600 transition-all duration-150 group"
                        >
                          <div className="flex items-center">
                            <IconComponent className="text-2xl mr-3 text-sky-500 group-hover:text-sky-400" />
                            <h3 className="text-lg font-medium text-white group-hover:text-sky-300">
                              {team.name}
                            </h3>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </section>
            </div>

            {/* User Profile Form Section */}
            <section className="pb-6 w-full mt-6 md:mt-8">
              <h2 className="text-xl font-semibold text-sky-400 hover:text-sky-300 transition-colors duration-150 flex items-center mb-5">
                <FaUserCircle className="mr-3 text-2xl text-sky-500" /> Edit Profile
              </h2>
              <form id="profileForm" onSubmit={handleUpdateProfile} className="space-y-6 bg-gray-750 p-6 rounded-lg border border-gray-600 shadow-xl">
                {/* Avatar Upload Section */}
                <div className="flex flex-col items-center space-y-4 p-6 border border-gray-600 rounded-lg bg-gray-800/30">
                  <div className="relative">
                    <img
                      src={profile?.avatar_url || '/default-avatar.png'}
                      alt="Profile Avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-sky-500/30"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 bg-sky-600 hover:bg-sky-500 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors duration-150"
                    >
                      <FaImage className="text-xl" />
                    </label>
                  </div>
                  <input
                    type="file"
                    id="avatar-upload"
                    accept="image/*"
                    onChange={handleSimpleAvatarUpload}
                    className="hidden"
                    disabled={isUploadingAvatar}
                  />
                  {isUploadingAvatar && (
                    <div className="flex items-center text-sky-400">
                      <FaSpinner className="animate-spin mr-2" /> Uploading...
                    </div>
                  )}
                  {avatarUploadError && (
                    <p className="text-red-400 text-sm">{avatarUploadError}</p>
                  )}
                </div>

                {/* Basic Info Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <FaSignature className="mr-2" /> Username
                    </label>
                    <input
                      type="text"
                      id="username"
                      value={newUsername}
                      onChange={(e) => setNewUsername(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="Choose a unique username"
                    />
                  </div>
                  <div>
                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <FaUserCircle className="mr-2" /> Display Name
                    </label>
                    <input
                      type="text"
                      id="displayName"
                      value={newDisplayName}
                      onChange={(e) => setNewDisplayName(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="How should we address you?"
                    />
                  </div>
                </div>

                {/* Bio Field */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                    <FaInfoCircle className="mr-2" /> Bio
                  </label>
                  <textarea
                    id="bio"
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
                    placeholder="Tell us about yourself..."
                  />
                </div>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <FaLink className="mr-2" /> Website
                    </label>
                    <input
                      type="url"
                      id="website"
                      value={newWebsiteUrl}
                      onChange={(e) => setNewWebsiteUrl(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="https://your-website.com"
                    />
                  </div>
                  <div>
                    <label htmlFor="github" className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                      <FaGithub className="mr-2" /> GitHub
                    </label>
                    <input
                      type="url"
                      id="github"
                      value={newGitHubUrl}
                      onChange={(e) => setNewGitHubUrl(e.target.value)}
                      className="w-full px-4 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>

                {/* Save Button and Messages */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-600">
                  <button
                    type="submit"
                    disabled={saving}
                    className="px-6 py-2 bg-sky-600 hover:bg-sky-500 disabled:bg-gray-600 text-white rounded-lg transition-colors duration-150 flex items-center"
                  >
                    {saving ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <FaSave className="mr-2" />
                        Save Changes
                      </>
                    )}
                  </button>
                  {error && (
                    <p className="text-red-400 text-sm">{error}</p>
                  )}
                  {successMessage && (
                    <p className="text-green-400 text-sm">{successMessage}</p>
                  )}
                </div>
              </form>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
} 