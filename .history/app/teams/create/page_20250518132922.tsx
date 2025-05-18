'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // USE THIS
import { User } from '@supabase/supabase-js'; // USE THIS for User type
import Link from 'next/link';
import { FaSpinner, FaCheckCircle, FaExclamationTriangle, FaArrowLeft, FaUsers, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaQuestionCircle } from 'react-icons/fa';

interface ColorScheme {
  bgColor: string;
  textColor: string;
  borderColor: string;
  name?: string; // Optional: for display in selector
}

const iconMap: { [key: string]: React.ElementType } = {
  FaDatabase,
  FaPalette,
  FaBolt,
  FaCloud,
  FaLightbulb,
  FaBrain,
  FaUsers,
  FaQuestionCircle,
};
const iconNames = Object.keys(iconMap);

const predefinedColorSchemes: ColorScheme[] = [
  { name: 'Sky Blue', bgColor: 'bg-sky-700', textColor: 'text-sky-100', borderColor: 'border-sky-500' },
  { name: 'Emerald Green', bgColor: 'bg-emerald-700', textColor: 'text-emerald-100', borderColor: 'border-emerald-500' },
  { name: 'Amber Yellow', bgColor: 'bg-amber-700', textColor: 'text-amber-100', borderColor: 'border-amber-500' },
  { name: 'Rose Red', bgColor: 'bg-rose-700', textColor: 'text-rose-100', borderColor: 'border-rose-500' },
  { name: 'Indigo Blue', bgColor: 'bg-indigo-700', textColor: 'text-indigo-100', borderColor: 'border-indigo-500' },
  { name: 'Pink', bgColor: 'bg-pink-700', textColor: 'text-pink-100', borderColor: 'border-pink-500' },
  { name: 'Teal', bgColor: 'bg-teal-700', textColor: 'text-teal-100', borderColor: 'border-teal-500' },
  { name: 'Purple', bgColor: 'bg-purple-700', textColor: 'text-purple-100', borderColor: 'border-purple-500' },
];

export default function CreateTeamPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  const [teamName, setTeamName] = useState('');
  const [teamDescription, setTeamDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<string>(iconNames[0] || 'FaUsers');
  const [selectedColorScheme, setSelectedColorScheme] = useState<ColorScheme>(predefinedColorSchemes[0]);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login?redirect=/teams/create');
      } else {
        setCurrentUser(user);
      }
    };
    getUser();
  }, [supabase, router]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setError('User not authenticated.');
      return;
    }
    if (!teamName.trim()) {
      setError('Team name is required.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Create a slug from the team name
      const slug = teamName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

      const { data: newTeam, error: teamError } = await supabase
        .from('teams')
        .insert({
          name: teamName.trim(),
          description: teamDescription.trim() || null,
          icon_name: selectedIcon,
          color_scheme: selectedColorScheme,
          created_by: currentUser.id, // Make sure your 'teams' table has this column
          slug: slug, 
        })
        .select()
        .single();

      if (teamError) throw teamError;

      if (newTeam) {
        // Add the creator as the first member and owner
        const { error: membershipError } = await supabase
          .from('user_team_memberships')
          .insert({
            user_id: currentUser.id,
            team_id: newTeam.id,
            role: 'owner', // Assuming 'owner' role exists
          });

        if (membershipError) {
          // Attempt to clean up the created team if membership fails
          console.warn('Failed to add creator as member, attempting to delete team:', membershipError);
          await supabase.from('teams').delete().eq('id', newTeam.id);
          throw new Error('Failed to set up team membership. Team creation rolled back.');
        }
        
        setSuccessMessage(`Team "${newTeam.name}" created successfully!`);
        // Redirect to the new team's page after a short delay
        setTimeout(() => {
          router.push(`/teams/${newTeam.slug || newTeam.id}`);
        }, 2000);
      } else {
        throw new Error('Team creation returned no data.');
      }

    } catch (err: any) {
      console.error('Error creating team:', err);
      setError(`Failed to create team: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <FaSpinner className="animate-spin text-sky-500 text-4xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/team" className="inline-flex items-center text-sky-400 hover:text-sky-300 mb-8 group">
          <FaArrowLeft className="mr-2 h-5 w-5 transition-transform group-hover:-translate-x-1" />
          Back to My Teams
        </Link>

        <h1 className="text-4xl font-extrabold text-center mb-2 text-white">Start a New Team</h1>
        <p className="text-center text-gray-400 mb-10">Collaborate and conquer. Create your space.</p>

        <form onSubmit={handleSubmit} className="bg-gray-800 shadow-2xl rounded-xl p-8 md:p-10 space-y-8">
          <div>
            <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-1">
              Team Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="teamName"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              required
            />
          </div>

          <div>
            <label htmlFor="teamDescription" className="block text-sm font-medium text-gray-300 mb-1">
              Team Description (Optional)
            </label>
            <textarea
              id="teamDescription"
              value={teamDescription}
              onChange={(e) => setTeamDescription(e.target.value)}
              rows={3}
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
            />
          </div>

          <div>
            <label htmlFor="teamIcon" className="block text-sm font-medium text-gray-300 mb-1">
              Team Icon
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mt-2">
              {iconNames.map((iconKey) => {
                const IconComponent = iconMap[iconKey];
                return (
                  <button
                    type="button"
                    key={iconKey}
                    onClick={() => setSelectedIcon(iconKey)}
                    className={`p-4 rounded-lg border-2 transition-all duration-150 ease-in-out flex items-center justify-center
                                ${selectedIcon === iconKey ? 'border-sky-500 bg-sky-600/30 ring-2 ring-sky-500' : 'border-gray-600 hover:border-sky-400 bg-gray-700 hover:bg-gray-600'}`}
                    title={iconKey.replace('Fa', '')}
                  >
                    <IconComponent className={`h-6 w-6 ${selectedIcon === iconKey ? 'text-sky-400' : 'text-gray-400 group-hover:text-sky-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Team Color Scheme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {predefinedColorSchemes.map((scheme) => {
                // Remove "Optional: " prefix for display if present
                const displayName = scheme.name?.replace("Optional: ", "") || "Color Scheme"; 
                return (
                  <button
                    type="button"
                    key={scheme.bgColor}
                    onClick={() => setSelectedColorScheme(scheme)}
                    className={`p-3 rounded-lg border-2 transition-all duration-150 ease-in-out text-center 
                                ${scheme.bgColor} ${scheme.textColor} ${scheme.borderColor} 
                                ${selectedColorScheme.bgColor === scheme.bgColor ? 'ring-4 ring-offset-2 ring-offset-gray-800 ring-white transform scale-105' : 'hover:opacity-80'}`}
                    title={displayName}
                  >
                    <span className="font-semibold text-sm">{displayName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {error && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm" role="alert">
              <FaExclamationTriangle className="inline mr-2 mb-0.5" />
              {error}
            </div>
          )}
          {successMessage && (
            <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-md text-sm" role="alert">
              <FaCheckCircle className="inline mr-2 mb-0.5" />
              {successMessage}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-3 h-5 w-5" />
                  Creating Team...
                </>
              ) : (
                'Create Team'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 