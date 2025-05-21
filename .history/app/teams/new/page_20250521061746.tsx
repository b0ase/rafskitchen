'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaPlusSquare, FaSpinner, FaExclamationCircle, FaUsers, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaQuestionCircle, FaNetworkWired, FaServer, FaCodeBranch, FaMicrochip, FaSitemap } from 'react-icons/fa';
import { FiActivity, FiBriefcase, FiCloudLightning, FiCpu, FiHardDrive, FiLayers, FiShield, FiTerminal, FiZap, FiDatabase as FiDb } from 'react-icons/fi';

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
  FaNetworkWired,
  FaServer,
  FaCodeBranch,
  FaMicrochip,
  FaSitemap,
  FiActivity,
  FiBriefcase,
  FiCloudLightning,
  FiCpu,
  FiDb,
  FiHardDrive,
  FiLayers,
  FiShield,
  FiTerminal,
  FiZap,
};
const iconNames = Object.keys(iconMap);

// Updated predefined color schemes with subtle gradients - Expanded and Reordered List
const predefinedColorSchemes: ColorScheme[] = [
  // Grays & Neutrals
  { name: 'Stone Gray', bgColor: 'bg-gradient-to-br from-stone-700 to-stone-800', textColor: 'text-stone-300', borderColor: 'border-stone-600' }, 
  { name: 'Charcoal Flow', bgColor: 'bg-gradient-to-br from-neutral-700 to-neutral-800', textColor: 'text-neutral-300', borderColor: 'border-neutral-600' },
  { name: 'True Gray', bgColor: 'bg-gradient-to-r from-neutral-800 to-stone-800', textColor: 'text-neutral-400', borderColor: 'border-neutral-700' },
  { name: 'Warm Gray', bgColor: 'bg-gradient-to-bl from-warmGray-700 to-warmGray-800', textColor: 'text-warmGray-300', borderColor: 'border-warmGray-600' }, 
  { name: 'Graphite Peak', bgColor: 'bg-gradient-to-bl from-zinc-700 to-zinc-800', textColor: 'text-zinc-300', borderColor: 'border-zinc-600' },
  
  // Slates & Cool Grays
  { name: 'Cool Slate', bgColor: 'bg-gradient-to-br from-gray-700 to-slate-800', textColor: 'text-gray-300', borderColor: 'border-gray-600' },
  { name: 'Steel Blue', bgColor: 'bg-gradient-to-br from-slate-600 to-slate-700', textColor: 'text-slate-300', borderColor: 'border-slate-500' },
  { name: 'Blue Night', bgColor: 'bg-gradient-to-tl from-blue-gray-700 to-blue-gray-800', textColor: 'text-blue-gray-300', borderColor: 'border-blue-gray-600' }, 
  { name: 'Slate Depths', bgColor: 'bg-gradient-to-r from-slate-800 to-gray-900', textColor: 'text-slate-400', borderColor: 'border-slate-700' },

  // Blues & Cyans
  { name: 'Sky Tint', bgColor: 'bg-gradient-to-bl from-lightBlue-600 to-sky-700', textColor: 'text-lightBlue-200', borderColor: 'border-lightBlue-500' }, 
  { name: 'Cyan Depth', bgColor: 'bg-gradient-to-br from-cyan-700 to-sky-800', textColor: 'text-cyan-200', borderColor: 'border-cyan-600' },
  { name: 'Azure Sky', bgColor: 'bg-gradient-to-r from-sky-700 to-blue-800', textColor: 'text-sky-300', borderColor: 'border-sky-600' },
  { name: 'Deep Ocean', bgColor: 'bg-gradient-to-br from-blue-800 to-sky-900', textColor: 'text-blue-200', borderColor: 'border-blue-700' },
  { name: 'Deep Cyan', bgColor: 'bg-gradient-to-r from-sky-800 to-cyan-900', textColor: 'text-sky-300', borderColor: 'border-sky-700' },

  // Teals & Aquas
  { name: 'Twilight Teal', bgColor: 'bg-gradient-to-br from-teal-700 to-cyan-800', textColor: 'text-teal-200', borderColor: 'border-teal-600' },
  { name: 'Emerald Sea', bgColor: 'bg-gradient-to-tl from-emerald-700 to-teal-800', textColor: 'text-emerald-200', borderColor: 'border-emerald-600' },
  { name: 'Aqua Marine', bgColor: 'bg-gradient-to-r from-cyan-800 to-teal-900', textColor: 'text-cyan-300', borderColor: 'border-cyan-700' },
  { name: 'Dark Teal', bgColor: 'bg-gradient-to-tl from-teal-800 to-cyan-900', textColor: 'text-teal-200', borderColor: 'border-teal-700' },
  
  // Greens & Limes
  { name: 'Forest Whisper', bgColor: 'bg-gradient-to-br from-emerald-800 to-green-900', textColor: 'text-emerald-200', borderColor: 'border-emerald-700' },
  { name: 'Olive Drab', bgColor: 'bg-gradient-to-bl from-lime-800 to-green-900', textColor: 'text-lime-200', borderColor: 'border-lime-700' },
  { name: 'Mossy Green', bgColor: 'bg-gradient-to-r from-green-800 to-lime-900', textColor: 'text-green-300', borderColor: 'border-green-700' },

  // Yellows & Ambers & Oranges
  { name: 'Amber Haze', bgColor: 'bg-gradient-to-br from-amber-700 to-yellow-800', textColor: 'text-amber-200', borderColor: 'border-amber-600' },
  { name: 'Golden Hour', bgColor: 'bg-gradient-to-tl from-yellow-700 to-amber-800', textColor: 'text-yellow-200', borderColor: 'border-yellow-600' },
  { name: 'Bright Amber', bgColor: 'bg-gradient-to-r from-amber-600 to-yellow-700', textColor: 'text-amber-300', borderColor: 'border-amber-500' },
  { name: 'Burnt Orange', bgColor: 'bg-gradient-to-r from-red-700 to-orange-800', textColor: 'text-red-300', borderColor: 'border-red-600' },
  { name: 'Copper Rust', bgColor: 'bg-gradient-to-bl from-orange-700 to-red-800', textColor: 'text-orange-200', borderColor: 'border-orange-600' },

  // Reds & Roses & Pinks
  { name: 'Muted Rose', bgColor: 'bg-gradient-to-br from-rose-800 to-pink-900', textColor: 'text-rose-200', borderColor: 'border-rose-700' },
  { name: 'Crimson Fall', bgColor: 'bg-gradient-to-tl from-red-800 to-rose-900', textColor: 'text-red-200', borderColor: 'border-red-700' },
  { name: 'Ruby Glow', bgColor: 'bg-gradient-to-r from-rose-700 to-red-800', textColor: 'text-rose-300', borderColor: 'border-rose-600' },
  { name: 'Rich Magenta', bgColor: 'bg-gradient-to-r from-pink-800 to-fuchsia-900', textColor: 'text-pink-300', borderColor: 'border-pink-700' },

  // Purples & Violets & Indigos
  { name: 'Plum Velvet', bgColor: 'bg-gradient-to-bl from-fuchsia-800 to-purple-900', textColor: 'text-fuchsia-200', borderColor: 'border-fuchsia-700' },
  { name: 'Violet Hue', bgColor: 'bg-gradient-to-br from-violet-700 to-purple-800', textColor: 'text-violet-200', borderColor: 'border-violet-600' },
  { name: 'Purple Mist', bgColor: 'bg-gradient-to-tl from-purple-700 to-violet-800', textColor: 'text-purple-200', borderColor: 'border-purple-600' },
  { name: 'Midnight Bloom', bgColor: 'bg-gradient-to-br from-indigo-800 to-purple-900', textColor: 'text-indigo-200', borderColor: 'border-indigo-700' },
  { name: 'Dark Violet', bgColor: 'bg-gradient-to-r from-violet-800 to-indigo-900', textColor: 'text-violet-300', borderColor: 'border-violet-700' },
  { name: 'Deep Indigo', bgColor: 'bg-gradient-to-r from-indigo-900 to-purple-900', textColor: 'text-indigo-300', borderColor: 'border-indigo-800' },
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
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white">Start a New Team</h1>
            <p className="mt-3 text-lg text-gray-400">
              Create a collaborative space for your projects and initiatives.
            </p>
          </div>
          <FaPlusSquare className="text-5xl text-sky-500" />
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
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-2 mt-2">
                {iconNames.map((iconKey) => {
                  const IconComponent = iconMap[iconKey];
                  return (
                    <button
                      type="button"
                      key={iconKey}
                      onClick={() => setSelectedIcon(iconKey)}
                      className={`p-2.5 rounded-md border-2 transition-all duration-150 ease-in-out flex items-center justify-center
                                  ${selectedIcon === iconKey ? 'border-sky-500 bg-sky-600/30 ring-2 ring-sky-500' : 'border-gray-700 hover:border-sky-400 bg-gray-800 hover:bg-gray-700'}`}
                      title={iconKey.replace('Fa', '').replace('Fi', '')}
                    >
                      <IconComponent className={`h-5 w-5 ${selectedIcon === iconKey ? 'text-sky-400' : 'text-gray-400 group-hover:text-sky-300'}`} />
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
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
                {predefinedColorSchemes.map((scheme) => {
                  const displayName = scheme.name || "Color Scheme";
                  return (
                    <button
                      type="button"
                      key={scheme.bgColor}
                      onClick={() => setSelectedColorScheme(scheme)}
                      className={`p-2 rounded-md border-2 transition-all duration-150 ease-in-out text-center h-12 w-full
                                  ${scheme.bgColor} ${scheme.borderColor}
                                  ${selectedColorScheme.bgColor === scheme.bgColor ? 'ring-3 ring-offset-2 ring-offset-black ring-white transform scale-105' : 'hover:opacity-80'}`}
                      title={displayName}
                    >
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