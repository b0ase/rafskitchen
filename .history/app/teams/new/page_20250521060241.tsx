'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaPlusSquare, FaSpinner, FaExclamationCircle, FaUsers, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaQuestionCircle } from 'react-icons/fa';

// Interface for ColorScheme
interface ColorScheme {
  bgColor: string;
  textColor: string;
  borderColor: string;
  name?: string; // Optional: for display in selector
}

// Icon map (similar to create page)
const iconMap: { [key: string]: React.ElementType } = {
  FaDatabase,
  FaPalette,
  FaBolt,
  FaCloud,
  FaLightbulb,
  FaBrain,
  FaUsers, // Default/general
  FaQuestionCircle,
};
const iconNames = Object.keys(iconMap);

// Predefined color schemes (similar to create page)
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

// Helper function to generate a slug
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with a single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

const SUPER_ADMIN_EMAIL = "richardwboase@gmail.com"; // Added Super Admin Email

export default function NewTeamPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  
  const [teamName, setTeamName] = useState<string>('');
  const [teamDescription, setTeamDescription] = useState<string>('');
  const [autoSlug, setAutoSlug] = useState<string>('');
  const [selectedIcon, setSelectedIcon] = useState<string>(iconNames[0] || 'FaUsers');
  const [selectedColorScheme, setSelectedColorScheme] = useState<ColorScheme>(predefinedColorSchemes[0]);
  
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

    // Prepare color scheme for DB (without the 'name' property)
    const colorSchemeForDb = {
      bgColor: selectedColorScheme.bgColor,
      textColor: selectedColorScheme.textColor,
      borderColor: selectedColorScheme.borderColor,
    };

    try {
      // Step 1: Insert into 'teams' table
      const { data: newTeam, error: teamInsertError } = await supabase
        .from('teams')
        .insert({
          name: teamName.trim(),
          slug: slug,
          description: teamDescription.trim() || null,
          created_by: user.id,
          icon_name: selectedIcon,
          color_scheme: colorSchemeForDb,
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

      // Step 2: Insert into 'user_team_memberships' table (for the creator)
      const { error: membershipInsertError } = await supabase
        .from('user_team_memberships')
        .insert({
          user_id: user.id,
          team_id: newTeam.id,
          role: 'owner', 
        });

      if (membershipInsertError) {
        console.error('Error inserting team membership for creator:', membershipInsertError);
        await supabase.from('teams').delete().eq('id', newTeam.id);
        setError(`Team created, but failed to add you as a member: ${membershipInsertError.message}. The team creation has been rolled back.`);
        setSubmitting(false);
        return;
      }

      // Step 3: Add Super Admin as an owner, if they are not the creator
      if (user.email !== SUPER_ADMIN_EMAIL) {
        // First, get the user ID for the super admin
        // Note: This query assumes RLS allows fetching users by email.
        // If not, this logic might need to be moved to a Supabase Function or use a profiles table.
        const { data: superAdminUser, error: superAdminError } = await supabase
          .from('users') // Assuming 'users' is the auth.users table accessible this way
          .select('id')
          .eq('email', SUPER_ADMIN_EMAIL)
          .single();

        if (superAdminError) {
          console.warn(`Could not find super admin user ${SUPER_ADMIN_EMAIL} to add as owner:`, superAdminError.message);
          // Optionally, set a non-critical error/warning for the UI if desired
          // For now, we proceed without adding the super admin if they can't be found
        } else if (superAdminUser) {
          const { error: superAdminMembershipError } = await supabase
            .from('user_team_memberships')
            .insert({
              user_id: superAdminUser.id,
              team_id: newTeam.id,
              role: 'owner',
            });

          if (superAdminMembershipError) {
            console.warn(`Failed to add super admin ${SUPER_ADMIN_EMAIL} as owner to team ${newTeam.id}:`, superAdminMembershipError.message);
            // Decide if this failure is critical enough to affect the success message or rollback.
            // For now, we'll just log a warning.
          } else {
            console.log(`Super admin ${SUPER_ADMIN_EMAIL} added as owner to team ${newTeam.id}`);
          }
        }
      }

      setSuccessMessage(`Team "${teamName.trim()}" created successfully!`);
      setTeamName('');
      setTeamDescription('');
      setAutoSlug('');
      // Reset icon and color to default after successful creation
      setSelectedIcon(iconNames[0] || 'FaUsers');
      setSelectedColorScheme(predefinedColorSchemes[0]);
      
      // Redirect to the new team's page or a general teams page
      setTimeout(() => {
        router.push(`/teams/${newTeam.slug}`); // Or router.push('/team');
      }, 1500);

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

        <div className="bg-black shadow-xl rounded-lg p-8 border border-gray-700">
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
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm placeholder-gray-500"
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
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm placeholder-gray-500"
              />
            </div>

            {/* Icon Selection UI */}
            <div>
              <label htmlFor="teamIcon" className="block text-sm font-medium text-gray-300 mb-1.5">
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

            {/* Color Scheme Selection UI */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Team Color Scheme
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {predefinedColorSchemes.map((scheme) => {
                  const displayName = scheme.name || "Color Scheme";
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