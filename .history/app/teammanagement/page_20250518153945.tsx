'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { FaUsers, FaSpinner, FaShieldAlt, FaTrashAlt, FaExclamationTriangle, FaUserCog } from 'react-icons/fa';

const SUPER_ADMIN_EMAIL = "richardwboase@gmail.com";

interface TeamFromDb {
  id: string;
  name: string;
  slug: string | null;
  created_at: string | null;
  created_by: string | null; // User ID of the creator
  description: string | null;
}

interface EnrichedTeam extends TeamFromDb {
  creator_display_name?: string | null;
}

export default function TeamManagementPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState<boolean>(false);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  
  const [allTeams, setAllTeams] = useState<EnrichedTeam[]>([]);
  const [loadingTeams, setLoadingTeams] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [deletingTeamId, setDeletingTeamId] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (user && user.email === SUPER_ADMIN_EMAIL) {
        setIsSuperAdmin(true);
      } else if (user) {
        // Not super admin, but logged in
        setIsSuperAdmin(false);
      } else {
        // Not logged in
        router.push('/login?message=Please log in to access this page.');
      }
      setLoadingUser(false);
    };
    fetchUser();
  }, [supabase, router]);

  const fetchAllTeams = useCallback(async () => {
    if (!isSuperAdmin) return;
    setLoadingTeams(true);
    setError(null);
    try {
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams')
        .select('*') // Fetches all columns, including created_by
        .order('name', { ascending: true });

      if (teamsError) throw teamsError;

      if (teamsData) {
        const enrichedTeams = await Promise.all(
          teamsData.map(async (team) => {
            let creatorName: string | null = 'Unknown';
            if (team.created_by) {
              const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('display_name, username')
                .eq('id', team.created_by)
                .single();
              if (profile) {
                creatorName = profile.display_name || profile.username || 'Unnamed Creator';
              } else {
                console.warn(`Failed to fetch profile for creator ID ${team.created_by}: ${profileError?.message}`);
              }
            }
            return { ...team, creator_display_name: creatorName };
          })
        );
        setAllTeams(enrichedTeams);
      }
    } catch (e: any) {
      console.error('Error fetching all teams:', e);
      setError(`Failed to load teams: ${e.message}`);
    } finally {
      setLoadingTeams(false);
    }
  }, [supabase, isSuperAdmin]);

  useEffect(() => {
    if (isSuperAdmin) {
      fetchAllTeams();
    }
  }, [isSuperAdmin, fetchAllTeams]);

  const handleDeleteTeam = async (teamId: string, teamName: string) => {
    if (!isSuperAdmin) {
      setError('Unauthorized action.');
      return;
    }
    const confirmed = window.confirm(`Are you absolutely sure you want to PERMANENTLY DELETE the team "${teamName}" (ID: ${teamId})? This action cannot be undone and will delete all associated data if cascades are set up.`);
    if (!confirmed) return;

    setDeletingTeamId(teamId);
    setError(null);

    try {
      // Attempt to delete related memberships first (if no cascade on DB)
      // This is a precaution. ON DELETE CASCADE is the robust solution.
      const { error: memberDeleteError } = await supabase
        .from('user_team_memberships')
        .delete()
        .eq('team_id', teamId);

      if (memberDeleteError) {
        console.warn('Error deleting team memberships, RLS might prevent or cascade not set up:', memberDeleteError);
        // Proceed to delete team anyway, but log this.
      }
      
      const { error: messageDeleteError } = await supabase
        .from('team_messages')
        .delete()
        .eq('team_id', teamId);

      if (messageDeleteError) {
        console.warn('Error deleting team messages, RLS might prevent or cascade not set up:', messageDeleteError);
      }

      const { error: teamDeleteError } = await supabase
        .from('teams')
        .delete()
        .match({ id: teamId });

      if (teamDeleteError) throw teamDeleteError;

      // Verification
      const { data: stillExists } = await supabase
        .from('teams')
        .select('id')
        .eq('id', teamId)
        .maybeSingle();
      
      if (stillExists) {
        throw new Error('Team was reported deleted by Supabase, but it still exists in the database.');
      }

      alert(`Team "${teamName}" deleted successfully.`);
      fetchAllTeams(); // Refresh the list
    } catch (e: any) {
      console.error('Error deleting team from admin page:', e);
      setError(`Failed to delete team "${teamName}": ${e.message}`);
    } finally {
      setDeletingTeamId(null);
    }
  };


  if (loadingUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4">
        <FaSpinner className="animate-spin text-4xl text-sky-500 mb-4" />
        <p>Verifying access...</p>
      </div>
    );
  }

  if (!isSuperAdmin && currentUser) { // Logged in but not super admin
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
        <FaExclamationTriangle className="text-5xl text-red-500 mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-400">You do not have permission to view this page.</p>
        <Link href="/profile" className="mt-6 px-4 py-2 bg-sky-600 hover:bg-sky-700 rounded-md text-white font-medium transition-colors">
          Go to Profile
        </Link>
      </div>
    );
  }
  
  if (!currentUser) { // Should have been redirected, but as a fallback
      return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-4 text-center">
              <p>Redirecting to login...</p>
          </div>
      )
  }


  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-8">
      <header className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
            <FaUserCog className="text-4xl text-sky-500" />
            <h1 className="text-4xl font-bold text-white">Team Management (Super Admin)</h1>
        </div>
        <p className="text-gray-400">Manage all teams in the system. Use these powers responsibly.</p>
      </header>

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md mb-6 text-sm">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {loadingTeams && (
        <div className="flex items-center justify-center py-10">
          <FaSpinner className="animate-spin text-3xl text-sky-400 mr-3" />
          <p className="text-xl">Loading all teams...</p>
        </div>
      )}

      {!loadingTeams && allTeams.length === 0 && !error && (
        <p className="text-center text-gray-500 py-10">No teams found in the system.</p>
      )}

      {!loadingTeams && allTeams.length > 0 && (
        <div className="bg-gray-800 shadow-xl rounded-lg border border-gray-700 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-750">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Slug</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Creator</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Description</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {allTeams.map((team) => (
                <tr key={team.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Link href={`/teams/${team.slug || team.id}`} className="text-sky-400 hover:text-sky-300 font-medium">
                      {team.name}
                    </Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{team.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                    {team.creator_display_name} <br/>
                    <span className="text-xs text-gray-500">({team.created_by || 'N/A'})</span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400 max-w-xs truncate" title={team.description || ''}>{team.description || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDeleteTeam(team.id, team.name)}
                      disabled={deletingTeamId === team.id}
                      className="text-red-500 hover:text-red-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {deletingTeamId === team.id ? (
                        <FaSpinner className="animate-spin mr-1.5" /> 
                      ) : (
                        <FaTrashAlt className="mr-1.5" />
                      )}
                      {deletingTeamId === team.id ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 