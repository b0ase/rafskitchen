'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { FaEnvelopeOpenText, FaSpinner, FaCheckCircle, FaExclamationCircle, FaUserShield } from 'react-icons/fa';

interface ProjectInvitation {
  membership_id: string; // id from project_memberships table
  project_client_id: string; // id from clients table (acting as project id)
  project_name: string | null;
  project_brief: string | null;
  project_status: string | null; // Status from clients table
  owner_display_name: string | null; // Display name of the project owner
  invited_at: string; // created_at from project_memberships
}

export default function JoinProjectPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [invitations, setInvitations] = useState<ProjectInvitation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [processingStates, setProcessingStates] = useState<Record<string, boolean>>({}); // membership_id -> boolean
  const [error, setError] = useState<string | null>(null);
  const [overallSuccessMessage, setOverallSuccessMessage] = useState<string | null>(null);

  const fetchInvitations = useCallback(async (currentUser: User) => {
    setError(null);
    setLoading(true);
    try {
      const { data, error: fetchError } = await supabase
        .from('project_memberships')
        .select(`
          id, 
          project_client_id, 
          created_at,
          clients:project_client_id (
            name,
            project_brief,
            status,
            user_id,
            profiles ( display_name )
          )
        `)
        .eq('user_id', currentUser.id)
        .eq('status', 'invited');

      if (fetchError) throw fetchError;

      if (data) {
        const formattedInvitations: ProjectInvitation[] = data.map((item: any) => ({
          membership_id: item.id,
          project_client_id: item.project_client_id,
          project_name: item.clients?.name || 'N/A',
          project_brief: item.clients?.project_brief || 'No brief available.',
          project_status: item.clients?.status || 'Unknown',
          owner_display_name: item.clients?.profiles?.display_name || item.clients?.user_id || 'Unknown Owner',
          invited_at: item.created_at,
        }));
        setInvitations(formattedInvitations);
      }
    } catch (e: any) {
      console.error('Error fetching invitations:', e);
      setError(`Failed to load project invitations: ${e.message}`);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    const init = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
        fetchInvitations(authUser);
      } else {
        router.push('/login?message=Please log in to see project invitations.');
        setLoading(false);
      }
    };
    init();
  }, [supabase, router, fetchInvitations]);

  const handleAcceptInvitation = async (membershipId: string, projectName: string | null) => {
    if (!user) {
      setError('User not authenticated. Please log in again.');
      return;
    }
    setProcessingStates(prev => ({ ...prev, [membershipId]: true }));
    setError(null);
    setOverallSuccessMessage(null);

    try {
      const { error: updateError } = await supabase
        .from('project_memberships')
        .update({ status: 'pending_owner_approval', updated_at: new Date().toISOString() })
        .eq('id', membershipId)
        .eq('user_id', user.id) // Ensure user is only updating their own invite
        .eq('status', 'invited'); // Ensure it's still an active invite

      if (updateError) {
        throw updateError;
      }

      setOverallSuccessMessage(`Request to join "${projectName || 'this project'}" sent! You will be notified upon owner approval.`);
      // Refresh invitations list (or remove the accepted one)
      setInvitations(prevInvites => prevInvites.filter(inv => inv.membership_id !== membershipId));
      setTimeout(() => setOverallSuccessMessage(null), 4000);

    } catch (e: any) {
      console.error('Error accepting invitation:', e);
      setError(`Failed to accept invitation for "${projectName || 'this project'}": ${e.message}. It might have been revoked or an issue occurred.`);
    } finally {
      setProcessingStates(prev => ({ ...prev, [membershipId]: false }));
    }
  };

  if (loading && !user) { // Initial load before user is determined
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <FaSpinner className="text-sky-400 text-6xl mx-auto animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <FaEnvelopeOpenText className="mx-auto text-5xl text-sky-500 mb-4" />
          <h1 className="text-4xl font-bold text-white">Project Invitations</h1>
          <p className="mt-3 text-lg text-gray-400">
            Here are the projects you've been invited to join.
          </p>
        </div>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md text-sm mb-6 flex items-start">
            <FaExclamationCircle className="mr-2 mt-0.5 flex-shrink-0" />
            <div>{error.split('\n').map((line, idx) => <React.Fragment key={idx}>{line}<br/></React.Fragment>)}</div>
          </div>
        )}
        {overallSuccessMessage && (
          <div className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-md text-sm mb-6">
            {overallSuccessMessage}
          </div>
        )}

        {loading && user ? (
          <div className="text-center py-10">
            <FaSpinner className="text-sky-400 text-4xl mx-auto animate-spin mb-3" />
            <p className="text-gray-400">Loading your invitations...</p>
          </div>
        ) : invitations.length > 0 ? (
          <div className="space-y-6">
            {invitations.map((invite) => (
              <div key={invite.membership_id} className="bg-gray-800/70 backdrop-blur-md shadow-lg rounded-lg p-6 border border-gray-700 hover:border-sky-600 transition-colors duration-200">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                  <h2 className="text-2xl font-semibold text-sky-400 mb-2 sm:mb-0">{invite.project_name}</h2>
                  <span className="text-xs text-gray-500">
                    Invited: {new Date(invite.invited_at).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-400 mb-2 text-sm">
                  <FaUserShield className="inline mr-1.5 mb-0.5 text-gray-500" /> 
                  Project Owner: <span className="font-medium text-gray-300">{invite.owner_display_name}</span>
                </p>
                <p className="text-gray-400 mb-1 text-sm">Current Status: <span className="font-semibold text-yellow-400">{invite.project_status || 'N/A'}</span></p>
                
                {invite.project_brief && invite.project_brief !== 'No brief available.' && (
                    <p className="text-gray-300 mt-3 mb-4 text-sm leading-relaxed bg-gray-700/50 p-3 rounded-md border border-gray-600">
                        {invite.project_brief}
                    </p>
                )}

                <div className="mt-4 pt-4 border-t border-gray-700/50 flex justify-end">
                  <button
                    onClick={() => handleAcceptInvitation(invite.membership_id, invite.project_name)}
                    disabled={processingStates[invite.membership_id]}
                    className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg"
                  >
                    {processingStates[invite.membership_id] ? (
                      <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <FaCheckCircle className="mr-2 h-4 w-4" />
                    )}
                    Accept Invitation & Request to Join
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <FaEnvelopeOpenText className="mx-auto text-5xl text-gray-600 mb-4" />
            <p className="text-xl text-gray-400">You have no pending project invitations.</p>
            <p className="mt-2 text-sm text-gray-500">
              If you're expecting an invitation, please check back later or contact the project owner.
            </p>
            <Link href="/myprojects" legacyBehavior>
                <a className="mt-6 inline-block text-sky-500 hover:text-sky-400 transition-colors">
                    Go to My Projects
                </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 