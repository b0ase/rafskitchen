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
  const [processingOrphanedTeams, setProcessingOrphanedTeams] = useState<boolean>(false);

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
      // Simplified: Directly delete from the teams table.
      // Relies on ON DELETE CASCADE for user_team_memberships and team_messages.
      const { error: teamDeleteError } = await supabase
        .from('teams')
        .delete()
        .match({ id: teamId });

      if (teamDeleteError) {
        if (teamDeleteError.message.includes('violates foreign key constraint')) {
          setError(
            `Failed to delete team "${teamName}": This team likely still has members or messages. ` +
            `Ensure cascading deletes are correctly set up in your Supabase dashboard (e.g., for 'user_team_memberships' and 'team_messages' referencing 'teams'). ` +
            `Original error: ${teamDeleteError.message}`
          );
        } else {
          // Provide more detailed error from Supabase
          const newError = 
            `Error deleting team "${teamName}" from Supabase. ` +
            `Message: ${teamDeleteError.message} ` +
            `(Code: ${teamDeleteError.code || 'N/A'}, Details: ${teamDeleteError.details || 'N/A'}, Hint: ${teamDeleteError.hint || 'N/A'}). ` +
            `Please double-check RLS policies on the 'teams' table for DELETE operations, or look for other database constraints/triggers.`;
          setError(newError);
          console.error("Full Supabase delete error for team:", teamName, teamDeleteError);
        }
      } else {
        // Verification if deleteError was null
        const { data: stillExists, error: verifyError } = await supabase
          .from('teams')
          .select('id')
          .eq('id', teamId)
          .maybeSingle();
        
        if (verifyError) {
          console.error('Error verifying team deletion:', verifyError);
          alert(`Team "${teamName}" deletion command sent, but verification step encountered an error. Please check manually.`);
          // Still refresh, as the delete might have worked.
          fetchAllTeams();
        } else if (stillExists) {
          // This case means the delete command returned no error, but the team is still there.
          // This could be due to RLS silently preventing the delete without raising an error, 
          // or other complex DB triggers/rules.
          console.error('Team deletion reported success by Supabase, but team still found in database:', stillExists);
          setError(`Failed to delete team "${teamName}". The team might be protected by RLS or other database rules not allowing its deletion by the current operation.`);
        } else {
          // Team is actually gone
          alert(`Team "${teamName}" deleted successfully.`);
          fetchAllTeams(); // Refresh the list
        }
      }
    } catch (e: any) {
      console.error('Error deleting team from admin page:', e);
      // Ensure error that was not already set by FK check is displayed
      if (!error) { 
        setError(`Failed to delete team "${teamName}": ${e.message}`);
      }
    } finally {
      setDeletingTeamId(null);
    }
  };

  const handleAssignOrphanedTeams = async () => {
    if (!isSuperAdmin || !currentUser?.id) {
      setError('Super admin privileges required.');
      return;
    }
    setProcessingOrphanedTeams(true);
    setError(null);
    let successCount = 0;
    let failureCount = 0;

    try {
      const { data: orphanedTeams, error: fetchOrphanedError } = await supabase
        .from('teams')
        .select('id, name, created_by')
        .is('created_by', null);

      if (fetchOrphanedError) throw fetchOrphanedError;

      if (!orphanedTeams || orphanedTeams.length === 0) {
        alert('No orphaned teams (teams with a null creator) found.');
        setProcessingOrphanedTeams(false);
        return;
      }

      for (const team of orphanedTeams) {
        try {
          // 1. Update created_by in the teams table
          const { error: updateTeamError } = await supabase
            .from('teams')
            .update({ created_by: currentUser.id })
            .eq('id', team.id);
          if (updateTeamError) throw updateTeamError;

          // 2. Upsert membership with 'owner' role
          const { error: upsertMembershipError } = await supabase
            .from('user_team_memberships')
            .upsert(
              { team_id: team.id, user_id: currentUser.id, role: 'owner' },
              { onConflict: 'team_id,user_id' } // Assumes a unique constraint on (team_id, user_id)
            );
          if (upsertMembershipError) throw upsertMembershipError;
          successCount++;
        } catch (singleTeamError: any) {
          console.error(
            `Failed to process orphaned team ${team.name} (ID: ${team.id}):`,
            {
              message: singleTeamError.message,
              code: singleTeamError.code,
              details: singleTeamError.details,
              hint: singleTeamError.hint,
              fullError: singleTeamError
            }
          );
          failureCount++;
        }
      }

      if (failureCount > 0) {
        setError(`Processed ${successCount} orphaned teams successfully. Failed to process ${failureCount} teams. Check console for details.`);
      } else {
        alert(`Successfully assigned ownership of ${successCount} orphaned team(s) to ${currentUser.email}.`);
      }
      fetchAllTeams(); // Refresh the list
    } catch (e: any) {
      console.error('Error assigning orphaned teams:', e);
      setError(`Failed to assign orphaned teams: ${e.message}`);
    } finally {
      setProcessingOrphanedTeams(false);
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
        <button
          onClick={handleAssignOrphanedTeams}
          disabled={processingOrphanedTeams || loadingTeams}
          className="mt-4 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-semibold rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center text-sm"
        >
          {processingOrphanedTeams ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : (
            <FaShieldAlt className="mr-2" />
          )}
          {processingOrphanedTeams ? 'Processing...' : 'Assign Ownership of Orphaned Teams'}
        </button>
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