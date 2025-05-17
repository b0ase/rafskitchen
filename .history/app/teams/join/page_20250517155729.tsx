'use client';

import React, { useEffect, useState } from 'react';
import { FaUsers, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaUserPlus, FaQuestionCircle } from 'react-icons/fa';
// import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // Old client
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Use singleton

// Helper to map icon names to components
const iconMap: { [key: string]: React.ElementType } = {
  FaDatabase,
  FaPalette,
  FaBolt,
  FaCloud,
  FaLightbulb,
  FaBrain,
  FaUsers, // In case you use it for a team icon
};

interface ColorScheme {
  bgColor: string;
  textColor: string;
  borderColor: string;
}

interface Team {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon_name: string | null;
  color_scheme: ColorScheme | null;
  profiles: {
    display_name: string | null;
    avatar_url?: string | null;
  } | null; // For creator's profile
}

export default function JoinTeamPage() {
  // const supabase = createClientComponentClient(); // Old client
  const supabase = getSupabaseBrowserClient(); // Use singleton
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningTeamId, setJoiningTeamId] = useState<string | null>(null); // For loading state on join button
  const [joinError, setJoinError] = useState<string | null>(null); // For specific join errors
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null); // For success messages

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('teams')
        .select('id, name, slug, description, icon_name, color_scheme, profiles:created_by (display_name, avatar_url)') // Added profiles join
        .order('name', { ascending: true }); 

      if (fetchError) {
        console.error('Error fetching teams on /teams/join page:', JSON.stringify(fetchError, null, 2)); // Log the full error
        setError('Could not load teams. Please try again later.');
        setTeams([]);
      } else if (data) {
        const processedData = data.map((rawTeamData) => {
          // Assuming rawTeamData.profiles could be an array from the join or an object/null
          let creatorProfile: Team['profiles'] = null;
          const rawProfiles = rawTeamData.profiles as any; // Cast to any to handle Supabase's flexible join result

          if (Array.isArray(rawProfiles) && rawProfiles.length > 0) {
            creatorProfile = rawProfiles[0] as Team['profiles'];
          } else if (rawProfiles && !Array.isArray(rawProfiles)) {
            creatorProfile = rawProfiles as Team['profiles'];
          }

          // Ensure color_scheme is correctly typed
          let finalColorScheme: ColorScheme = { bgColor: 'bg-gray-700', textColor: 'text-gray-100', borderColor: 'border-gray-500' };
          if (rawTeamData.color_scheme && typeof rawTeamData.color_scheme === 'object' && 'bgColor' in rawTeamData.color_scheme) {
            finalColorScheme = rawTeamData.color_scheme as ColorScheme;
          }

          // Construct the final Team object with asserted types where necessary
          const teamEntry: Team = {
            id: rawTeamData.id as string,
            name: rawTeamData.name as string,
            slug: rawTeamData.slug as string,
            description: rawTeamData.description as string,
            icon_name: (rawTeamData.icon_name || 'FaQuestionCircle') as string,
            color_scheme: finalColorScheme,
            profiles: creatorProfile,
          };
          return teamEntry;
        });
        setTeams(processedData); // No need for `as Team[]` if processedData is correctly Team[]
      }
      setLoading(false);
    };

    fetchTeams();
  }, [supabase]);

  const handleJoinTeam = async (teamId: string, teamName: string) => {
    setJoiningTeamId(teamId);
    setJoinError(null);
    setJoinSuccess(null);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error fetching user or no user logged in:', userError);
      setJoinError('You must be logged in to join a team.');
      setJoiningTeamId(null);
      return;
    }

    const { error: insertError } = await supabase
      .from('user_team_memberships')
      .insert({ team_id: teamId, user_id: user.id }); // Assuming 'role' or other fields might have defaults or are nullable

    if (insertError) {
      console.error(`Error joining team ${teamName} (ID: ${teamId}):`, insertError);
      if (insertError.code === '23505') { // Unique violation
        setJoinError(`You are already a member of ${teamName} or have a pending request.`);
      } else {
        setJoinError(`Failed to join ${teamName}. Please try again. ${insertError.message}`);
      }
    } else {
      setJoinSuccess(`Successfully joined ${teamName}! You can now see it in "My Team".`);
      // Optionally, you might want to refresh the user's teams list if displayed elsewhere,
      // or redirect them, or update the UI to reflect membership.
      // For now, we'll just show a message.
    }
    setJoiningTeamId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500 mb-4"></div>
        <p className="text-xl text-sky-300">Loading Awesome Teams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center px-4 text-center">
        <FaQuestionCircle className="text-6xl text-red-500 mb-6" />
        <h2 className="text-3xl font-semibold text-red-400 mb-4">Oops! Something went wrong.</h2>
        <p className="text-xl text-gray-400">{error}</p>
        {joinError && <p className="text-lg text-red-400 mt-4">{joinError}</p>}
        {joinSuccess && <p className="text-lg text-green-400 mt-4">{joinSuccess}</p>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-16">
        <FaUsers className="mx-auto text-6xl text-sky-500 mb-6" />
        <h1 className="text-5xl font-extrabold text-white tracking-tight">
          Find Your <span className="text-sky-400">Squad!</span>
        </h1>
        <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
          Join one of our elite teams and start collaborating on amazing projects. 
          Each team has a unique focus and a vibrant community.
        </p>
        {joinError && <p className="text-center text-red-400 mt-4 p-2 bg-red-900/30 rounded-md">{joinError}</p>}
        {joinSuccess && <p className="text-center text-green-400 mt-4 p-2 bg-green-900/30 rounded-md">{joinSuccess}</p>}
      </header>

      {teams.length === 0 && !loading && (
         <div className="text-center">
            <FaQuestionCircle className="mx-auto text-5xl text-gray-500 mb-4" />
            <p className="text-xl text-gray-400">No teams available at the moment. Check back soon!</p>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {teams.map((team) => {
          const IconComponent = iconMap[team.icon_name || 'FaQuestionCircle'] || FaQuestionCircle;
          const bgColor = team.color_scheme?.bgColor || 'bg-gray-700';
          const textColor = team.color_scheme?.textColor || 'text-gray-100';
          const borderColor = team.color_scheme?.borderColor || 'border-gray-500';

          return (
            <div 
              key={team.id} 
              className={`rounded-xl shadow-2xl p-8 flex flex-col justify-between border-2 transition-all duration-300 ease-in-out hover:shadow-sky-500/50 hover:scale-105 ${bgColor} ${borderColor}`}
            >
              <div>
                <IconComponent className={`text-5xl mb-6 ${textColor} opacity-80`} />
                <h2 className={`text-3xl font-bold mb-1 ${textColor}`}>{team.name}</h2>
                {team.profiles?.display_name && (
                  <div className="mb-3 text-sm flex items-center opacity-70">
                    <img 
                      src={team.profiles.avatar_url || 'https://via.placeholder.com/150/000000/FFFFFF/?text=C'} 
                      alt={team.profiles.display_name || 'Creator'} 
                      className="w-5 h-5 rounded-full mr-2 object-cover"
                      crossOrigin="anonymous"
                    />
                    <span className={textColor}>Created by: {team.profiles.display_name}</span>
                  </div>
                )}
                <p className={`text-md mb-8 ${textColor} opacity-90 min-h-[60px]`}>{team.description}</p>
              </div>
              <button
                onClick={() => handleJoinTeam(team.id, team.name)}
                disabled={joiningTeamId === team.id}
                className={`w-full mt-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-150
                            ${joiningTeamId === team.id ? 'bg-gray-500 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-800 hover:bg-gray-200 focus:ring-sky-400 dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300 dark:focus:ring-sky-500'}`}
              >
                {joiningTeamId === team.id ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                    Joining...
                  </>
                ) : (
                  <>
                <FaUserPlus className="mr-2 -ml-1 h-5 w-5" />
                Join {team.name}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>

      <footer className="text-center mt-20 text-gray-500">
        <p>&copy; {new Date().getFullYear()} b0ase.com - Let's build something incredible together.</p>
      </footer>
    </div>
  );
} 