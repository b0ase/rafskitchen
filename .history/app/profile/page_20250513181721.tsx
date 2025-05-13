'use client';

import React, { useEffect, useState, FormEvent } from 'react';
// Link is no longer needed on this page if My Projects section is removed and no other Links are present.
// import Link from 'next/link'; 
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaSave, FaUserCircle, FaImage, FaSignature, FaInfoCircle, FaLink } from 'react-icons/fa';

interface Profile {
  username: string | null;
  display_name: string | null;
  avatar_url?: string | null; 
  full_name?: string | null;
  bio?: string | null;
  website_url?: string | null;
}

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

  useEffect(() => {
    const fetchUserAndProfile = async () => {
      setLoading(true);
      setError(null);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        setUser(authUser);
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('username, display_name, avatar_url, full_name, bio, website_url') // Added new fields
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError('Could not load your profile. It might not exist yet or there was a network issue.');
        } else if (profileData) {
          setProfile(profileData);
          setNewUsername(profileData.username || '');
          setNewDisplayName(profileData.display_name || '');
          setNewAvatarUrl(profileData.avatar_url || '');
          setNewFullName(profileData.full_name || '');
          setNewBio(profileData.bio || '');
          setNewWebsiteUrl(profileData.website_url || '');
          // Projects fetching logic removed
        } else {
            setError('Profile not found. If you are a new user, please try refreshing. If this persists, contact support.');
        }
      } else {
        setError('You must be logged in to view your profile.');
      }
      setLoading(false);
    };

    fetchUserAndProfile();
  }, [supabase]); // Removed 'error' from dependency array previously

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
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">My Profile</h1>

        <div className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-lg rounded-lg max-w-2xl mx-auto">
          <div className="flex items-center mb-8">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-16 h-16 rounded-full mr-4 border-2 border-sky-500 object-cover" />
            ) : (
              <FaUserCircle className="text-5xl text-sky-400 mr-4" />
            )}
            <div>
              <h2 className="text-2xl font-semibold text-white">{profile?.display_name || profile?.username || 'User Profile'}</h2>
              <p className="text-sm text-gray-400">Update your personal details and preferences.</p>
            </div>
          </div>

          {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-md mb-6 text-sm">{error}</p>}
          {successMessage && <p className="text-green-400 bg-green-900/30 p-3 rounded-md mb-6 text-sm">{successMessage}</p>}
          
          {!user || !profile ? (
            <p className="text-center text-gray-400">Could not load profile information.</p>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1.5">
                  <FaUserCircle className="inline mr-2 mb-0.5" />Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={user.email || 'Not available'}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-500 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
              </div>

              <div>
                <label htmlFor="displayName" className="block text-sm font-medium text-gray-400 mb-1.5">
                 <FaUserCircle className="inline mr-2 mb-0.5" /> Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  maxLength={50}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="How you want your name to appear (e.g., Jane Doe)"
                />
              </div>
              
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1.5">
                  <FaUserCircle className="inline mr-2 mb-0.5" />Username
                </label>
                <input
                  type="text"
                  id="username"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  required
                  minLength={3}
                  maxLength={20}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="e.g., janedoe (letters, numbers, underscores)"
                />
                 <p className="mt-1 text-xs text-gray-500">Min 3, Max 20 chars. Alphanumeric & underscores. Publicly visible.</p>
              </div>

              <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-400 mb-1.5">
                  <FaSignature className="inline mr-2 mb-0.5" />Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  value={newFullName}
                  onChange={(e) => setNewFullName(e.target.value)}
                  maxLength={100}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="Your full legal name (optional, private)"
                />
              </div>

              <div>
                <label htmlFor="avatarUrl" className="block text-sm font-medium text-gray-400 mb-1.5">
                  <FaImage className="inline mr-2 mb-0.5" />Avatar URL
                </label>
                <input
                  type="url"
                  id="avatarUrl"
                  value={newAvatarUrl}
                  onChange={(e) => setNewAvatarUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="https://example.com/your-avatar.png"
                />
                {newAvatarUrl && <img src={newAvatarUrl} alt="Avatar Preview" className="mt-3 w-20 h-20 rounded-full object-cover border border-gray-700" />}
              </div>

              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-400 mb-1.5">
                  <FaInfoCircle className="inline mr-2 mb-0.5" />Bio / About Me
                </label>
                <textarea
                  id="bio"
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="Tell us a little about yourself (max 500 characters)"
                />
              </div>

              <div>
                <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-400 mb-1.5">
                  <FaLink className="inline mr-2 mb-0.5" />Website URL
                </label>
                <input
                  type="url"
                  id="websiteUrl"
                  value={newWebsiteUrl}
                  onChange={(e) => setNewWebsiteUrl(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors"
                  placeholder="https://your-portfolio.com"
                />
              </div>
              
              <button
                type="submit"
                disabled={saving 
                    // Check if any of the new fields have changed from their initial profile state OR if username/displayname changed
                    && (newUsername === (profile?.username || '')) 
                    && (newDisplayName === (profile?.display_name || ''))
                    && (newAvatarUrl === (profile?.avatar_url || ''))
                    && (newFullName === (profile?.full_name || ''))
                    && (newBio === (profile?.bio || ''))
                    && (newWebsiteUrl === (profile?.website_url || ''))
                }
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaSave className="mr-2 h-5 w-5" />
                {saving ? 'Saving Profile...' : 'Save Profile Changes'}
              </button>
            </form>
          )}
        </div>

        {/* My Projects Section REMOVED */}
      </main>
    </div>
  );
} 