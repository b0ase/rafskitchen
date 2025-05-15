'use client';

import React, { useEffect, useState, FormEvent, ChangeEvent, useRef } from 'react';
import Link from 'next/link'; 
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaSave, FaUserCircle, FaImage, FaSignature, FaInfoCircle, FaLink, FaRocket, FaPlus, FaUsers, FaPlusSquare, FaHandshake, FaBriefcase } from 'react-icons/fa'; 
import { useRouter, usePathname } from 'next/navigation';

interface Profile {
  username: string | null;
  display_name: string | null;
  avatar_url?: string | null; 
  full_name?: string | null;
  bio?: string | null;
  website_url?: string | null;
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
  const supabase = createClientComponentClient();
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
        console.log('[ProfilePage] User signed out. Clearing states and redirecting.');
        setProfile(null);
        setNewUsername('');
        setNewDisplayName('');
        setNewFullName('');
        setNewBio('');
        setNewWebsiteUrl('');
        setSelectedSkills([]);
        setSuccessMessage(null);
        setAvatarUploadError(null);
        router.push('/login');
      } else if (event === 'SIGNED_IN' && currentUser) {
        console.log('[ProfilePage] User signed in:', currentUser.id);
      } else if (event === 'USER_UPDATED' && currentUser) {
        console.log('[ProfilePage] User updated:', currentUser.id);
      }
      if (!currentUser && event !== 'SIGNED_OUT') {
        console.log('[ProfilePage] Session/user became null without explicit SIGNED_OUT. Redirecting.');
        setProfile(null);
        router.push('/login');
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
        if (pathname === '/profile') {
             setLoading(false);
        }
        return;
      }

      console.log(`[ProfilePage] User ID ${user.id} present. Fetching profile and skills.`);
      setLoading(true); 
      setError(null);   

      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*, user_skills(skill_id, skills(name, category, description))')
          .eq('id', user.id)
          .single();

        if (profileError) {
          console.error("[ProfilePage] Error fetching profile:", profileError.message, profileError.details);
          if (profileError.code === 'PGRST116') {
            setError("Profile not found. You may need to complete your profile setup.");
          } else {
            setError(`Failed to load profile: ${profileError.message}`);
          }
          setProfile(null);
        } else if (profileData) {
          console.log("[ProfilePage] Profile data fetched:", profileData);
          setProfile(profileData as unknown as Profile);
          setNewUsername(profileData.username || '');
          setNewDisplayName(profileData.display_name || '');
          setNewFullName(profileData.full_name || '');
          setNewBio(profileData.bio || '');
          setNewWebsiteUrl(profileData.website_url || '');
          
          const currentSkills = profileData.user_skills?.map((us: any) => ({
            id: us.skill_id,
            name: us.skills.name,
            category: us.skills.category,
            description: us.skills.description,
          })) || [];
          setSelectedSkills(currentSkills);
          console.log("[ProfilePage] User skills set:", currentSkills);
        }

        const { data: allSkillsData, error: allSkillsError } = await supabase
          .from('skills')
          .select('*');

        if (allSkillsError) {
          console.error("[ProfilePage] Error fetching all skills:", allSkillsError.message);
        } else {
          setAllSkills(allSkillsData || []);
        }

      } catch (e: any) {
        console.error("[ProfilePage] Exception in loadProfileAndSkills:", e);
        setError(`An unexpected error occurred: ${e.message}`);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadProfileAndSkills();
    } else {
      setProfile(null);
      setLoading(false); 
    }
  }, [user, supabase, router]); // Added supabase and router as they are used or their methods are called.

  // --- NEW Function to Handle Skill Toggle ---
  const handleSkillToggle = async (skillId: string, isCurrentlySelected: boolean) => {
    if (!user) {
      setError('User not authenticated.');
      return;
    }
    setSavingSkills(true); // Indicate a skill save operation is in progress
    setError(null);
    setSuccessMessage(null);

    if (isCurrentlySelected) {
      // User wants to remove the skill
      const { error: deleteError } = await supabase
        .from('user_skills')
        .delete()
        .eq('user_id', user.id)
        .eq('skill_id', skillId);

      if (deleteError) {
        console.error('Error removing skill:', deleteError);
        setError(`Failed to remove skill: ${deleteError.message}`);
      } else {
        setUserSkillIds(prevIds => {
          const newIds = new Set(prevIds);
          newIds.delete(skillId);
          return newIds;
        });
        setSuccessMessage('Skill removed.');
      }
    } else {
      // User wants to add the skill
      const { error: insertError } = await supabase
        .from('user_skills')
        .insert({ user_id: user.id, skill_id: skillId });

      if (insertError) {
        console.error('Error adding skill:', insertError);
        setError(`Failed to add skill: ${insertError.message}`);
      } else {
        setUserSkillIds(prevIds => new Set(prevIds).add(skillId));
        setSuccessMessage('Skill added!');
      }
    }
    setSavingSkills(false);
    setTimeout(() => setSuccessMessage(null), 2000); // Clear message after 2 seconds
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

      let potentialUrl = publicUrlData.publicUrl;
      const incorrectSegment = '/object/public/avatars/public/';
      const correctSegment = '/object/public/avatars/';

      if (potentialUrl.includes(incorrectSegment)) {
        console.log('[handleSimpleAvatarUpload] Detected incorrect public URL segment. Correcting...');
        potentialUrl = potentialUrl.replace(incorrectSegment, correctSegment);
      }
      
      const newPublicAvatarUrl = `${potentialUrl}?t=${new Date().getTime()}`; // Cache busting
      console.log('[handleSimpleAvatarUpload] newPublicAvatarUrl to be stored (after potential correction):', newPublicAvatarUrl);

      // Update profile in DB
      const { error: profileUpdateError } = await supabase
        .from('profiles')
        .update({ avatar_url: newPublicAvatarUrl, updated_at: new Date().toISOString() })
        .eq('id', user.id);

      if (profileUpdateError) throw profileUpdateError;

      // Update local profile state
      setProfile(prev => prev ? { ...prev, avatar_url: newPublicAvatarUrl } : null);
      setSuccessMessage('Avatar updated successfully!');

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

    const updates: Partial<Omit<Profile, 'avatar_url'>> & { updated_at: string } = {
      username: sanitizedUsername,
      display_name: newDisplayName.trim() || sanitizedUsername,
      full_name: newFullName.trim() || null,
      bio: newBio.trim() || null,
      website_url: newWebsiteUrl.trim() || null,
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
      setProfile(prevProfile => prevProfile ? { ...prevProfile, ...updates } : null);
      setNewUsername(sanitizedUsername);
      setNewDisplayName(updates.display_name!);
      setNewFullName(updates.full_name || '');
      setNewBio(updates.bio || '');
      setNewWebsiteUrl(updates.website_url || '');
      setSuccessMessage('Profile updated successfully!');
    }
    setSaving(false);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <div className="text-center">
          <FaRocket className="text-sky-400 text-6xl mx-auto mb-4 animate-pulse" />
          <p className="text-xl text-gray-300">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-300 py-8 px-4 md:px-8 lg:px-12">
      <div className="max-w-5xl mx-auto">
        
        <section className="mb-12 p-6 md:p-8 bg-gradient-to-r from-sky-700 via-sky-600 to-cyan-500 rounded-xl shadow-2xl text-white border border-sky-500/60">
          <div className="flex flex-col md:flex-row items-center">
            <FaRocket className="text-5xl md:text-6xl text-sky-200 mr-0 md:mr-6 mb-4 md:mb-0 flex-shrink-0" />
            <div className="text-center md:text-left flex-grow">
              <h2 className="text-3xl font-bold mb-3">Ready to build something amazing?</h2>
              <p className="text-sky-100 mb-6 text-lg leading-relaxed">
                Welcome to b0ase.com! This is your hub to bring your digital ideas to life. Start a new project to define your vision, outline features, and begin collaborating with our team. Whether it's a website, a mobile app, an AI solution, or something entirely new, we're here to help you build it.
              </p>
              <div className="mt-6 flex flex-wrap gap-3 justify-center md:justify-start">
                <Link href="/projects/new" passHref legacyBehavior>
                  <a className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-sky-700 bg-white hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-700 focus:ring-white transition-transform transform hover:scale-105 shadow-md">
                    <FaRocket className="mr-2 h-4 w-4" /> Start a New Project
                  </a>
                </Link>
                <Link href="/teams/new" passHref legacyBehavior>
                  <a className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-700 focus:ring-white transition-transform transform hover:scale-105 shadow-md">
                    <FaPlusSquare className="mr-2 h-4 w-4" /> Start a New Team
                  </a>
                </Link>
                <Link href="/projects/join" passHref legacyBehavior>
                  <a className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-purple-700 focus:ring-white transition-transform transform hover:scale-105 shadow-md">
                    <FaHandshake className="mr-2 h-4 w-4" /> Join a Project
                  </a>
                </Link>
                <Link href="/teams/join" passHref legacyBehavior>
                  <a className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-green-700 bg-white hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-green-700 focus:ring-white transition-transform transform hover:scale-105 shadow-md">
                    <FaUsers className="mr-2 h-4 w-4" /> Join a Team
                  </a>
                </Link>
                <Link href="/careers" passHref legacyBehavior>
                  <a className="inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-lg text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-orange-700 focus:ring-white transition-transform transform hover:scale-105 shadow-md">
                    <FaBriefcase className="mr-2 h-4 w-4" /> Careers
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Your Profile</h1>

        <div className="flex flex-col sm:flex-row items-center mb-10 pb-6 border-b border-gray-700">
          {/* --- NEW Simplified Avatar Display and Upload --- */}
          <div className="relative mr-0 sm:mr-6 mb-4 sm:mb-0">
            {profile?.avatar_url ? (
              <img 
                src={profile.avatar_url} 
                alt="Avatar" 
                className="w-24 h-24 rounded-full border-4 border-sky-600 object-cover shadow-md" 
                crossOrigin="anonymous"
              />
            ) : (
              <FaUserCircle 
                className="text-7xl text-sky-500 w-24 h-24" 
              />
            )}
            {isUploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
              </div>
            )}
            <label 
              htmlFor="simpleAvatarUpload"
              className="absolute -bottom-2 -right-2 cursor-pointer bg-sky-600 hover:bg-sky-700 text-white p-2 rounded-full shadow-md transition-transform transform hover:scale-110"
              title="Change avatar"
            >
              <FaImage className="w-4 h-4" />
              <input
                type="file"
                id="simpleAvatarUpload"
                name="simpleAvatarUpload"
                accept="image/png, image/jpeg, image/gif, image/webp"
                onChange={handleSimpleAvatarUpload}
                className="sr-only"
                disabled={isUploadingAvatar}
              />
            </label>
          </div>
          {/* --- END NEW Simplified Avatar Display and Upload --- */}
          
          <div className="text-center sm:text-left ml-0 sm:ml-6 flex-grow">
            {/* Editable Display Name */}
            <input
              type="text"
              value={newDisplayName}
              onChange={(e) => setNewDisplayName(e.target.value)}
              maxLength={50}
              placeholder="Your Display Name"
              className="text-3xl font-semibold text-white bg-transparent focus:outline-none focus:border-b focus:border-sky-500 w-full mb-0.5 placeholder-gray-500"
              aria-label="Display Name"
            />
            {/* Static Username Display */}
            {profile?.username && (
              <p className="text-md text-gray-400 mt-0">@{profile.username}</p>
            )}
            <p className="text-lg text-gray-400 mt-1 hidden sm:block">Manage your public identity, personal information, and online presence.</p>
          </div>
        </div>

        {/* --- NEW Section to Display Selected Skill Badges --- */}
        <section className="mb-10 pb-6 border-b border-gray-700">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-xl font-semibold text-sky-400">My Skills</h3>
          </div>
          
          {loadingSkills ? (
            <p className="text-gray-400 italic">Loading your skills...</p>
          ) : (
            <div className="flex flex-wrap gap-3 items-center">
              {/* Display existing skill badges */}
              {allSkills
                .filter(skill => userSkillIds.has(skill.id))
                .sort((a, b) => (a.category || 'zzzz').localeCompare(b.category || 'zzzz') || a.name.localeCompare(b.name))
                .map(skill => (
                  <span 
                    key={skill.id} 
                    className={`${getSkillBadgeStyle(skill.category)} transition-all duration-150 ease-in-out transform hover:scale-105`}
                    title={skill.description || skill.name}
                  >
                    {skill.name}
                    <button
                      onClick={() => handleSkillToggle(skill.id, true)}
                      disabled={savingSkills}
                      className="ml-2 p-0.5 rounded-full text-xs leading-none hover:bg-black/20 focus:outline-none disabled:opacity-50 transition-colors"
                      aria-label={`Remove ${skill.name} skill`}
                    >
                      &times;
                    </button>
                  </span>
                ))}

              {/* Skill Adders Area - Conditionally render if user is loaded and not saving/loading skills */}
              {user && !loadingSkills && (
                <>
                  {/* Input for custom skill */}
                  <input
                    type="text"
                    value={customSkillInput}
                    onChange={(e) => setCustomSkillInput(e.target.value)}
                    onKeyDown={async (e) => {
                      if (e.key === 'Enter' && customSkillInput.trim()) {
                        e.preventDefault();
                        await handleAddCustomSkill(customSkillInput.trim());
                      }
                    }}
                    placeholder="+ Type custom skill & Enter"
                    className="px-3 py-1.5 text-xs font-semibold rounded-full shadow-md bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors min-w-[180px] disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={savingSkills}
                    title="Add a skill not in the list"
                  />

                  {/* Dropdown for predefined skills (only if there are any unselected predefined ones) */}
                  {allSkills.filter(skill => !userSkillIds.has(skill.id) && skill.category !== 'User-defined').length > 0 && (
                    <div className="inline-block relative animate-fadeInQuickly">
                      <select 
                        value={skillChoiceInAdder} // Controlled component
                        onChange={async (e) => {
                          const selectedValue = e.target.value;
                          if (selectedValue) {
                            setSkillChoiceInAdder(selectedValue); 
                            await handleSkillToggle(selectedValue, false); 
                            setSkillChoiceInAdder(''); 
                          }
                        }}
                        disabled={savingSkills}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full shadow-md appearance-none min-w-[150px] focus:outline-none focus:ring-2 focus:ring-sky-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed
                                    ${skillChoiceInAdder === '' ? 'bg-gray-700 text-gray-400 hover:bg-gray-600' : 'bg-gray-800 text-gray-300'} `}
                      >
                        <option value="" disabled={skillChoiceInAdder !== ''} className="text-gray-500">+ Add from list</option>
                        {Object.entries(
                          allSkills
                            .filter(skill => !userSkillIds.has(skill.id) && skill.category !== 'User-defined') // Exclude user-defined
                            .reduce((acc, skill) => {
                              const category = skill.category || 'Other';
                              if (!acc[category]) acc[category] = [];
                              acc[category].push(skill);
                              return acc;
                            }, {} as Record<string, Skill[]>)
                        ).map(([category, skillsInCategory]) => (
                          <optgroup label={category} key={category} className="bg-gray-750 text-sky-300 font-semibold">
                            {skillsInCategory.map(skill => (
                              <option key={skill.id} value={skill.id} className="bg-gray-800 text-gray-200">
                                {skill.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                  )}
                </>
              )}
              
              {/* Message for all predefined skills added */}
              {userSkillIds.size > 0 && 
               !loadingSkills && 
               allSkills.filter(skill => !userSkillIds.has(skill.id) && skill.category !== 'User-defined').length === 0 &&
               allSkills.some(skill => skill.category !== 'User-defined') && // Ensure there were predefined skills to begin with
              (
                <p className="text-xs text-amber-400 italic ml-2">All predefined skills added! Add more custom ones using the input field.</p>
              )}
            </div>
          )}
        </section>
        {/* --- END NEW Section for Skill Badges --- */}

        {avatarUploadError && <p className="text-red-400 bg-red-900/30 p-3 rounded-md mb-4 text-sm shadow text-center">{avatarUploadError}</p>}
        {error && <p className="text-red-400 bg-red-900/30 p-4 rounded-md mb-8 text-sm shadow">{error.split('\n').map((line, idx) => <React.Fragment key={idx}>{line}<br/></React.Fragment>)}</p>}
        {successMessage && <p className="text-green-400 bg-green-900/30 p-4 rounded-md mb-8 text-sm shadow">{successMessage}</p>}
        
        {!user || !profile ? (
          <p className="text-center text-gray-400 py-10">Could not load profile information. Please try again later.</p>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-1.5">
                    <FaUserCircle className="inline mr-2 mb-0.5 text-gray-500" /> Username
                  </label>
                  <input
                    type="text" id="username" value={newUsername} onChange={(e) => setNewUsername(e.target.value)}
                    required minLength={3} maxLength={20} placeholder="e.g., janedoe (publicly visible)"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm"
                  />
                  <p className="mt-1.5 text-xs text-gray-500">Min 3, Max 20. Alphanumeric & underscores. Used in URLs.</p>
                </div>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-1.5">
                    <FaSignature className="inline mr-2 mb-0.5 text-gray-500" /> Full Name (Optional)
                  </label>
                  <input
                    type="text" id="fullName" value={newFullName} onChange={(e) => setNewFullName(e.target.value)}
                    maxLength={100} placeholder="Your full legal name (private)"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                    <FaUserCircle className="inline mr-2 mb-0.5 text-gray-500" /> Email Address
                  </label>
                  <input type="email" id="email" value={user.email || 'Not available'} disabled
                    className="w-full px-4 py-2.5 bg-gray-800/70 border-gray-700 rounded-md text-gray-500 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-600 shadow-sm"
                  />
                </div>
            </div>

            <section>
              <h3 className="text-xl font-semibold text-sky-400 mb-4 pb-2 border-b border-gray-700">Online Presence</h3>
              <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                <div>
                  <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-300 mb-1.5">
                    <FaLink className="inline mr-2 mb-0.5 text-gray-500" /> Website URL
                  </label>
                  <input
                    type="url" id="websiteUrl" value={newWebsiteUrl} onChange={(e) => setNewWebsiteUrl(e.target.value)}
                    placeholder="https://your-portfolio.com"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm"
                  />
                </div>
              </div>
              <div className="mt-6">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-300 mb-1.5">
                  <FaInfoCircle className="inline mr-2 mb-0.5 text-gray-500" /> Bio / About Me
                </label>
                <textarea
                  id="bio" value={newBio} onChange={(e) => setNewBio(e.target.value)}
                  rows={5} maxLength={500} placeholder="Share a bit about yourself, your skills, or interests (max 500 characters)."
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm"
                />
              </div>
            </section>
            
            <div className="pt-8 border-t border-gray-700">
              <button
                type="submit"
                disabled={saving || 
                    // Logic to disable if no changes have been made
                    (
                      newUsername === (profile?.username || '') &&
                      newDisplayName === (profile?.display_name || '') &&
                      newFullName === (profile?.full_name || '') &&
                      newBio === (profile?.bio || '') &&
                      newWebsiteUrl === (profile?.website_url || '')
                    )
                }
                className="w-full sm:w-auto float-right inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg"
              >
                <FaSave className="mr-2.5 h-5 w-5" />
                {saving ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
} 