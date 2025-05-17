'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaPlusSquare, FaSpinner, FaExclamationCircle } from 'react-icons/fa';

// Helper function to generate a slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

export default function NewTeamPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  
  const [teamName, setTeamName] = useState<string>('');
  const [teamDescription, setTeamDescription] = useState<string>('');
  const [autoSlug, setAutoSlug] = useState<string>('');
  
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
      } else {
        router.push('/login?message=Please log in to create a team.');
      }
      setLoading(false);
    };
    fetchUser();
  }, [supabase, router]);

  useEffect(() => {
    if (teamName) {
      setAutoSlug(generateSlug(teamName));
    } else {
      setAutoSlug('');
    }
  }, [teamName]);

  const handleCreateTeam = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('User not authenticated. Please log in again.');
      return;
    }
    if (!teamName.trim()) {
      setError('Team Name is required.');
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const slug = autoSlug || generateSlug(teamName); // Use autoSlug or regenerate

    try {
      // Step 1: Insert into 'teams' table
      const { data: newTeam, error: teamInsertError } = await supabase
        .from('teams')
        .insert({
          name: teamName.trim(),
          slug: slug,
          description: teamDescription.trim() || null,
          created_by: user.id,
          // owner_id: user.id, // Assuming you have an owner_id column for the team itself
        })
        .select('id, slug') // Select the id and slug of the newly created team
        .single();

      if (teamInsertError) {
        console.error('Error inserting team:', teamInsertError);
        if (teamInsertError.code === '23505') { // Unique constraint violation (likely slug)
             setError(`Failed to create team: A team with the name or slug "${slug}" might already exist. Try a different name.`);
        } else {
            setError(`Failed to create team: ${teamInsertError.message}`);
        }
        setSubmitting(false);
        return;
      }

      if (!newTeam) {
        setError('Failed to create team. No data returned after insert.');
        setSubmitting(false);
        return;
      }

      // Step 2: Insert into 'user_team_memberships' table
      const { error: membershipInsertError } = await supabase
        .from('user_team_memberships')
        .insert({
          user_id: user.id,
          team_id: newTeam.id,
          role: 'owner', // Or 'admin', 'member' as appropriate
        });

      if (membershipInsertError) {
        console.error('Error inserting team membership:', membershipInsertError);
        // Attempt to delete the team if membership fails to keep data consistent
        // This is a best-effort cleanup and might need more robust handling
        await supabase.from('teams').delete().eq('id', newTeam.id);
        setError(`Team created, but failed to add you as a member: ${membershipInsertError.message}. The team creation has been rolled back.`);
        setSubmitting(false);
        return;
      }

      setSuccessMessage(`Team "${teamName.trim()}" created successfully!`);
      setTeamName('');
      setTeamDescription('');
      setAutoSlug('');
      
      // Redirect to the new team's page or a general teams page
      router.push(`/teams/${newTeam.slug}`); // Or router.push('/team');

    } catch (e: any) {
      console.error('Unexpected error creating team:', e);
      setError(`An unexpected error occurred: ${e.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <div className="text-center">
          <FaSpinner className="text-sky-400 text-6xl mx-auto mb-4 animate-spin" />
          <p className="text-xl text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
     // This case should ideally be handled by the redirect in useEffect,
     // but as a fallback or if the redirect hasn't happened yet.
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <p className="text-xl text-red-400">You need to be logged in to create a team.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-12">
          <FaPlusSquare className="mx-auto text-5xl text-sky-500 mb-4" />
          <h1 className="text-4xl font-bold text-white">Start a New Team</h1>
          <p className="mt-3 text-lg text-gray-400">
            Create a collaborative space for your projects and initiatives.
          </p>
        </div>

        <div className="bg-gray-800/70 backdrop-blur-md shadow-xl rounded-lg p-8 border border-gray-700">
          <form onSubmit={handleCreateTeam} className="space-y-6">
            <div>
              <label htmlFor="teamName" className="block text-sm font-medium text-gray-300 mb-1.5">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="teamName"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
                maxLength={100}
                placeholder="e.g., Marketing Mavericks, Q4 Project Alpha"
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm placeholder-gray-500"
              />
              {autoSlug && (
                <p className="mt-2 text-xs text-gray-400">
                  Team URL slug: <span className="font-mono text-sky-400">/teams/{autoSlug}</span>
                </p>
              )}
            </div>

            <div>
              <label htmlFor="teamDescription" className="block text-sm font-medium text-gray-300 mb-1.5">
                Team Description (Optional)
              </label>
              <textarea
                id="teamDescription"
                value={teamDescription}
                onChange={(e) => setTeamDescription(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="What is this team about? (objectives, goals, etc.)"
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm placeholder-gray-500"
              />
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm flex items-start">
                <FaExclamationCircle className="mr-2 mt-0.5 flex-shrink-0" />
                <div>{error.split('\n').map((line, idx) => <React.Fragment key={idx}>{line}<br/></React.Fragment>)}</div>
              </div>
            )}
            {successMessage && (
              <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-md text-sm">
                {successMessage}
              </div>
            )}

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting || !teamName.trim()}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg"
              >
                {submitting ? (
                  <>
                    <FaSpinner className="animate-spin mr-2.5 h-5 w-5" />
                    Creating Team...
                  </>
                ) : (
                  <>
                    <FaPlusSquare className="mr-2.5 h-5 w-5" />
                    Create Team
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 