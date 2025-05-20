'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { FaUsers, FaQuestionCircle, FaSpinner, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaHandshake, FaPlus } from 'react-icons/fa';
import getSupabaseBrowserClient from '@/lib/supabase/client';

// Import or define necessary interfaces and iconMap
const iconMap: { [key: string]: React.ElementType } = {
  FaDatabase,
  FaPalette,
  FaBolt,
  FaCloud,
  FaLightbulb,
  FaBrain,
  FaUsers, // For a generic team icon
  FaQuestionCircle, // Default
  FaSpinner, // For loading states
};

interface ColorScheme {
  bgColor: string;
  textColor: string;
  borderColor: string;
}

interface Team {
  id: string;
  name: string;
  slug: string | null;
  icon_name: string | null;
  color_scheme: ColorScheme | null;
}

interface UserTeamsProps {
  userTeams: Team[];
  loadingUserTeams: boolean;
  errorUserTeams: string | null;
  userId: string;
}

export default function UserTeams({
  userTeams,
  loadingUserTeams,
  errorUserTeams,
  userId,
}: UserTeamsProps) {
  const supabase = getSupabaseBrowserClient();

  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [joinableTeams, setJoinableTeams] = useState<Team[]>([]);
  const [selectedTeamToJoin, setSelectedTeamToJoin] = useState<string>('');
  const [loadingAllTeams, setLoadingAllTeams] = useState<boolean>(false);
  const [joiningTeam, setJoiningTeam] = useState<boolean>(false);
  const [joinTeamError, setJoinTeamError] = useState<string | null>(null);

  // Fetch all teams
  useEffect(() => {
    const fetchTeams = async () => {
      setLoadingAllTeams(true);
      const { data, error } = await supabase
        .from('teams')
        .select('id, name, slug, icon_name, color_scheme');
      if (error) {
        console.error('Error fetching all teams:', error);
        setJoinTeamError('Could not load available teams.');
      } else {
        setAllTeams(data || []);
      }
      setLoadingAllTeams(false);
    };
    fetchTeams();
  }, [supabase]);

  // Calculate joinable teams
  useEffect(() => {
    const currentUserTeamIds = new Set(userTeams.map(team => team.id));
    const filteredTeams = allTeams.filter(team => !currentUserTeamIds.has(team.id));
    setJoinableTeams(filteredTeams);
  }, [allTeams, userTeams]);

  const handleJoinTeam = useCallback(async () => {
    if (!selectedTeamToJoin || !userId) {
      setJoinTeamError('Please select a team to join.');
      return;
    }
    setJoiningTeam(true);
    setJoinTeamError(null);

    const { error } = await supabase
      .from('user_team_memberships')
      .insert({ user_id: userId, team_id: selectedTeamToJoin, role: 'member' }); 
      // Assuming 'member' is a default role

    if (error) {
      console.error('Error joining team:', error);
      setJoinTeamError(`Failed to join team: ${error.message}`);
    } else {
      // Success!
      setSelectedTeamToJoin('');
      // Ideally, trigger a refresh of profile data here to update userTeams list
      // This might involve calling a prop function like onTeamJoined()
      // For now, the user might need to manually refresh or navigate away/back
      alert('Team joined successfully! The team list will update on next profile load or refresh.');
      // To force a re-fetch of user teams, we'd need to lift state or pass a callback from useProfileData
      // Example: if (onTeamJoined) onTeamJoined();
    }
    setJoiningTeam(false);
  }, [selectedTeamToJoin, userId, supabase]);

  return (
    <section className="pb-6 lg:w-1/2 p-6 bg-black rounded-xl shadow-md border border-gray-800 flex flex-col">
      <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
        <FaHandshake className="mr-3 text-sky-500"/> 
        <Link href="https://www.b0ase.com/teams/join" target="_blank" rel="noopener noreferrer" className="hover:underline">
          Your Teams
        </Link>
      </h2>
      {loadingUserTeams ? (
         <div className="flex items-center text-gray-400"><FaSpinner className="animate-spin mr-2" /> Loading teams...</div>
      ) : userTeams.length === 0 ? (
        <p className="text-gray-400">Not a member of any teams yet.</p>
      ) : (
        <div className="flex flex-wrap gap-4 mb-6">
          {userTeams.map(team => {
            const IconComponent = iconMap[team.icon_name || 'FaQuestionCircle'] || FaQuestionCircle;
            const badgeBaseStyle = "flex items-center px-4 py-2 rounded-lg shadow-sm border transition-colors duration-150 ease-in-out";
            let teamStyle;
            let iconColorClass = 'text-gray-300';
            if (team.color_scheme) {
              teamStyle = `${team.color_scheme.bgColor} ${team.color_scheme.textColor} ${team.color_scheme.borderColor} hover:brightness-90 transition-all`;
              iconColorClass = team.color_scheme.textColor;
            } else {
              teamStyle = "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 transition-colors";
            }
            return (
              <Link 
                key={team.id} 
                href={`/teams/${team.slug || team.id}`}
                className={`${badgeBaseStyle} ${teamStyle}`}
              >
                <IconComponent className={`mr-2 text-lg ${iconColorClass}`}/>
                <span className="font-medium">{team.name}</span>
              </Link>
            );
          })}
        </div>
      )}
      {errorUserTeams && <p className="mt-4 text-sm text-red-400">{errorUserTeams}</p>}

      {/* Join Existing Team Section */}
      <div className="mt-auto pt-6 border-t border-gray-700">
        <h3 className="text-lg font-semibold mb-3 text-gray-100">Join Existing Team</h3>
        {loadingAllTeams ? (
          <div className="flex items-center text-gray-400"><FaSpinner className="animate-spin mr-2" /> Loading available teams...</div>
        ) : joinableTeams.length === 0 && allTeams.length > 0 ? (
           <p className="text-gray-400 text-sm">You are a member of all available teams.</p>
        ) : joinableTeams.length === 0 && allTeams.length === 0 ? (
          <p className="text-gray-400 text-sm">No other teams available to join currently.</p>
        ) : (
          <div className="flex items-center gap-3">
            <select 
              value={selectedTeamToJoin}
              onChange={(e) => setSelectedTeamToJoin(e.target.value)}
              className="block w-full bg-gray-800 border border-gray-700 text-gray-300 py-2 px-3 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm disabled:opacity-50"
              disabled={joiningTeam || loadingAllTeams}
            >
              <option value="">-- Select a team to join --</option>
              {joinableTeams.map(team => (
                <option key={team.id} value={team.id}>{team.name}</option>
              ))}
            </select>
            <button 
              onClick={handleJoinTeam}
              disabled={!selectedTeamToJoin || joiningTeam || loadingAllTeams}
              className="px-4 py-2 bg-sky-600 text-white text-sm font-medium rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 flex items-center whitespace-nowrap"
            >
              {joiningTeam ? <FaSpinner className="animate-spin mr-2" /> : <FaPlus className="mr-1.5" />}
              Join Team
            </button>
          </div>
        )}
        {joinTeamError && <p className="mt-2 text-sm text-red-400">{joinTeamError}</p>}
      </div>
    </section>
  );
}
