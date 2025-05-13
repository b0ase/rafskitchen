'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaArrowLeft, FaSave, FaUserCircle } from 'react-icons/fa';

interface Profile {
  username: string | null;
  // Add other profile fields here as needed, e.g., avatar_url
}

export default function ProfilePage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [newUsername, setNewUsername] = useState<string>('');
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
          .select('username')
          .eq('id', authUser.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
          setError('Could not load profile. Your profile might not have been created yet, or there was a network issue.');
        } else if (profileData) {
          setProfile(profileData);
          setNewUsername(profileData.username || '');
        } else {
           // This case means the profile row doesn\'t exist yet for this authenticated user
           // This shouldn\'t happen if the trigger is working correctly for new signups.
           // For existing users before trigger, they might not have a profile.
            setError('Profile not found. If you are a new user, please try refreshing. If this persists, contact support.');
        }
      } else {
        setError('You must be logged in to view your profile.');
        // Optionally redirect to login: router.push('/login');
      }
      setLoading(false);
    };

    fetchUserAndProfile();
  }, [supabase]);

  const handleUpdateProfile = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !profile) {
      setError('User or profile not loaded.');
      return;
    }
    if (!newUsername.trim() || newUsername.trim().length < 3) {
        setError('Username must be at least 3 characters long.');
        return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ username: newUsername.trim(), updated_at: new Date().toISOString() })
      .eq('id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      setError(`Failed to update username: ${updateError.message}. It might be taken or invalid.`);
    } else {
      setProfile({ ...profile, username: newUsername.trim() });
      setSuccessMessage('Username updated successfully!');
    }
    setSaving(false);
    setTimeout(() => setSuccessMessage(null), 3000); // Clear success message after 3s
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
        <div className="mb-8">
          <Link href="/studio" className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Studio
          </Link>
        </div>

        <div className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-lg rounded-lg max-w-lg mx-auto">
          <div className="flex items-center mb-6">
            <FaUserCircle className="text-3xl text-sky-400 mr-3" />
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
          </div>

          {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-md mb-4 text-sm">{error}</p>}
          {successMessage && <p className="text-green-400 bg-green-900/30 p-3 rounded-md mb-4 text-sm">{successMessage}</p>}
          
          {!user || !profile ? (
            <p>Could not load profile information.</p>
          ) : (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={user.email || 'Not available'}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-500 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-600"
                />
                <p className="mt-1 text-xs text-gray-500">Your email address is linked to your login and cannot be changed here.</p>
              </div>

              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-400 mb-1">
                  Username
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
                  placeholder="Enter your desired username"
                />
                 <p className="mt-1 text-xs text-gray-500">Min 3, Max 20 characters. Alphanumeric and underscores only.</p>
              </div>
              
              <button
                type="submit"
                disabled={saving || !newUsername || newUsername === profile.username}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <FaSave className="mr-2 h-5 w-5" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
} 