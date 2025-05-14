'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link'; // Re-added Link for the new button
// Link is no longer needed on this page if My Projects section is removed and no other Links are present.
// import Link from 'next/link'; 
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaSave, FaUserCircle, FaImage, FaSignature, FaInfoCircle, FaLink, FaRocket } from 'react-icons/fa'; // Added FaRocket

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

export default function ProfilePage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  // const [projects, setProjects] = useState<ClientProject[]>([]); // Removed projects state
  // const [loadingProjects, setLoadingProjects] = useState<boolean>(true); // Removed projects loading state
  
  const [newUsername, setNewUsername] = useState<string>('');
  const [newDisplayName, setNewDisplayName] = useState<string>('');
  const [newAvatarUrl, setNewAvatarUrl] = useState<string>('');
  const [newFullName, setNewFullName] = useState<string>('');
  const [newBio, setNewBio] = useState<string>('');
  const [newWebsiteUrl, setNewWebsiteUrl] = useState<string>('');

  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // --- NEW Skills State ---
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userSkillIds, setUserSkillIds] = useState<Set<string>>(new Set()); // Store IDs of user's skills
  const [loadingSkills, setLoadingSkills] = useState<boolean>(true);
  const [savingSkills, setSavingSkills] = useState<boolean>(false); // For individual skill toggle operations
  // --- END NEW Skills State ---

  useEffect(() => {
    const fetchUserAndProfileAndSkills = async () => {
      setLoading(true);
      setLoadingSkills(true);
      setError(null);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        setUser(authUser);
        // Fetch Profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, display_name, avatar_url, full_name, bio, website_url')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError(prev => prev ? `${prev}\nProfile load error.` : 'Could not load your profile.');
        } else if (profileData) {
          setProfile(profileData);
          setNewUsername(profileData.username || '');
          setNewDisplayName(profileData.display_name || '');
          setNewAvatarUrl(profileData.avatar_url || '');
          setNewFullName(profileData.full_name || '');
          setNewBio(profileData.bio || '');
          setNewWebsiteUrl(profileData.website_url || '');
        } else {
            setError(prev => prev ? `${prev}\nProfile not found.` : 'Profile not found.');
        }

        // Fetch All Skills
        const { data: allSkillsData, error: allSkillsError } = await supabase
          .from('skills')
          .select('id, name, category, description')
          .order('category', { ascending: true })
          .order('name', { ascending: true });

        if (allSkillsError) {
          console.error('Error fetching all skills:', allSkillsError);
          setError(prev => prev ? `${prev}\nSkills load error.` : 'Could not load available skills.');
          setAllSkills([]);
        } else {
          setAllSkills(allSkillsData || []);
        }

        // Fetch User's Selected Skills
        const { data: userSkillsData, error: userSkillsError } = await supabase
          .from('user_skills')
          .select('skill_id')
          .eq('user_id', authUser.id);

        if (userSkillsError) {
          console.error('Error fetching user skills:', userSkillsError);
          setError(prev => prev ? `${prev}\nUser skills load error.` : 'Could not load your selected skills.');
          setUserSkillIds(new Set());
        } else {
          setUserSkillIds(new Set(userSkillsData?.map(us => us.skill_id) || []));
        }

      } else {
        setError('You must be logged in to view your profile.');
      }
      setLoading(false);
      setLoadingSkills(false);
    };

    fetchUserAndProfileAndSkills();
  }, [supabase]);

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

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      setError('User or profile not loaded.');
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

    const updates: Partial<Profile> & { updated_at: string } = {
      username: sanitizedUsername,
      display_name: newDisplayName.trim() || sanitizedUsername,
      avatar_url: newAvatarUrl.trim() || null,
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
      setProfile(prevProfile => ({ ...prevProfile, ...updates }));
      setNewUsername(sanitizedUsername);
      setNewDisplayName(updates.display_name!);
      setNewAvatarUrl(updates.avatar_url || '');
      setNewFullName(updates.full_name || '');
      setNewBio(updates.bio || '');
      setNewWebsiteUrl(updates.website_url || '');
      setSuccessMessage('Profile updated successfully!');
    }
    setSaving(false);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <p className="text-xl">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-gray-900 shadow-2xl rounded-lg p-6 sm:p-8 md:p-10 w-full mx-auto border border-gray-700/50">
        {/* New Project Initiation Section */}
        <section className="mb-12 p-6 bg-gradient-to-r from-sky-800 via-sky-700 to-cyan-600 rounded-lg shadow-lg text-white border border-sky-500/50">
          <div className="flex flex-col md:flex-row items-center">
            <FaRocket className="text-5xl md:text-6xl text-sky-300 mr-0 md:mr-6 mb-4 md:mb-0 flex-shrink-0" />
            <div className="text-center md:text-left">
              <h3 className="text-2xl font-semibold mb-2">Ready to build something amazing?</h3>
              <p className="text-sky-100 mb-4">
                Welcome to b0ase.com! This is your hub to bring your digital ideas to life. 
                Start a new project to define your vision, outline features, and begin collaborating with our team. 
                Whether it's a website, a mobile app, an AI solution, or something entirely new, we're here to help you build it.
              </p>
              <Link href="/projects/new" passHref legacyBehavior>
                <a className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-sky-700 bg-white hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-sky-700 focus:ring-white transition-transform transform hover:scale-105 shadow-md">
                  <FaRocket className="mr-2 -ml-1 h-5 w-5" /> Start a New Project
                </a>
              </Link>
            </div>
          </div>
        </section>

        <h1 className="text-4xl md:text-5xl font-bold text-white mb-12 text-center">Your Profile</h1>

        <div className="flex flex-col sm:flex-row items-center mb-10 pb-6 border-b border-gray-700">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full mr-0 sm:mr-6 mb-4 sm:mb-0 border-4 border-sky-600 object-cover shadow-md" />
          ) : (
            <FaUserCircle className="text-7xl text-sky-500 mr-0 sm:mr-6 mb-4 sm:mb-0" />
          )}
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-semibold text-white">{profile?.display_name || profile?.username || 'Welcome to b0ase.com!'}</h2>
            <p className="text-lg text-gray-400 mt-1">Manage your public identity, personal information, and online presence.</p>
          </div>
        </div>

        {error && <p className="text-red-400 bg-red-900/30 p-4 rounded-md mb-8 text-sm shadow">{error}</p>}
        {successMessage && <p className="text-green-400 bg-green-900/30 p-4 rounded-md mb-8 text-sm shadow">{successMessage}</p>}
        
        {!user || !profile ? (
          <p className="text-center text-gray-400 py-10">Could not load profile information. Please try again later.</p>
        ) : (
          <form onSubmit={handleUpdateProfile} className="space-y-8">
            <section>
              <h3 className="text-xl font-semibold text-sky-400 mb-4 pb-2 border-b border-gray-700">Identity</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="displayName" className="block text-sm font-medium text-gray-300 mb-1.5">
                    <FaUserCircle className="inline mr-2 mb-0.5 text-gray-500" /> Display Name
                  </label>
                  <input
                    type="text" id="displayName" value={newDisplayName} onChange={(e) => setNewDisplayName(e.target.value)}
                    maxLength={50} placeholder="e.g., Jane M. Doe"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm"
                  />
                </div>
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
            </section>

            <section>
              <h3 className="text-xl font-semibold text-sky-400 mb-4 pb-2 border-b border-gray-700">Online Presence</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-300 mb-1.5">
                    <FaImage className="inline mr-2 mb-0.5 text-gray-500" /> Avatar URL
                  </label>
                  <input
                    type="url" id="avatarUrl" value={newAvatarUrl} onChange={(e) => setNewAvatarUrl(e.target.value)}
                    placeholder="https://example.com/your-avatar.png"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm"
                  />
                  {newAvatarUrl && <img src={newAvatarUrl} alt="Avatar Preview" className="mt-3 w-20 h-20 rounded-full object-cover border-2 border-gray-700 shadow-sm" />}
                </div>
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
            
            <div className="pt-6 border-t border-gray-700">
              <button
                type="submit"
                disabled={saving 
                    // Logic to disable if no changes have been made
                    && (newUsername === (profile?.username || '')) 
                    && (newDisplayName === (profile?.display_name || ''))
                    && (newAvatarUrl === (profile?.avatar_url || ''))
                    && (newFullName === (profile?.full_name || ''))
                    && (newBio === (profile?.bio || ''))
                    && (newWebsiteUrl === (profile?.website_url || ''))
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