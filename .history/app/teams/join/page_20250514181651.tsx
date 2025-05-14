'use client';

import React, { useEffect, useState } from 'react';
import { FaUsers, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaUserPlus, FaQuestionCircle } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

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
}

export default function JoinTeamPage() {
  const supabase = createClientComponentClient();
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeams = async () => {
      setLoading(true);
      setError(null);
      const { data, error: fetchError } = await supabase
        .from('teams')
        .select('id, name, slug, description, icon_name, color_scheme')
        .order('name', { ascending: true }); 

      if (fetchError) {
        console.error('Error fetching teams:', fetchError);
        setError('Could not load teams. Please try again later.');
        setTeams([]);
      } else if (data) {
        // Ensure color_scheme is parsed if it's a string (though Supabase client might auto-parse JSONB)
        // And provide defaults if null
        const processedData = data.map(team => ({
          ...team,
          color_scheme: team.color_scheme || { bgColor: 'bg-gray-700', textColor: 'text-gray-100', borderColor: 'border-gray-500' },
          icon_name: team.icon_name || 'FaQuestionCircle' // Default icon if none specified
        }));
        setTeams(processedData as Team[]);
      }
      setLoading(false);
    };

    fetchTeams();
  }, [supabase]);

  const handleJoinTeam = (teamId: string, teamName: string) => {
    console.log(`Attempting to join team ID: ${teamId}, Name: ${teamName}`);
    // Placeholder for actual join logic - this will be Phase 2
    alert(`You've clicked to join ${teamName} (ID: ${teamId})! Functionality coming soon.`);
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
                <h2 className={`text-3xl font-bold mb-3 ${textColor}`}>{team.name}</h2>
                <p className={`text-md mb-8 ${textColor} opacity-90 min-h-[60px]`}>{team.description}</p>
              </div>
              <button
                onClick={() => handleJoinTeam(team.id, team.name)}
                className={`w-full mt-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-150
                            bg-white text-gray-800 hover:bg-gray-200 focus:ring-sky-400
                            dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300 dark:focus:ring-sky-500`}
              >
                <FaUserPlus className="mr-2 -ml-1 h-5 w-5" />
                Join {team.name}
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