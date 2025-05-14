'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { FaUsers, FaUserPlus, FaSpinner, FaExclamationCircle, FaArrowLeft } from 'react-icons/fa';

interface ProjectDetails {
  id: string; // Project (client) ID
  name: string;
  project_slug: string;
  user_id: string; // Owner's user_id
}

// TODO: Add interface for existing members when we list them

export default function ManageProjectMembersPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const params = useParams();
  const projectSlug = params.projectSlug as string;

  const [user, setUser] = useState<User | null>(null);
  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isOwner, setIsOwner] = useState<boolean>(false);

  const [inviteEmail, setInviteEmail] = useState<string>('');
  const [inviting, setInviting] = useState<boolean>(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviteSuccess, setInviteSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      setUser(authUser);

      if (!authUser) {
        router.push('/login?message=Please log in.');
        setLoading(false);
        return;
      }

      if (!projectSlug) {
        setError('Project slug not found.');
        setLoading(false);
        return;
      }

      // Fetch project details (from 'clients' table)
      const { data: projectData, error: projectError } = await supabase
        .from('clients')
        .select('id, name, project_slug, user_id')
        .eq('project_slug', projectSlug)
        .single();

      if (projectError) {
        console.error('Error fetching project:', projectError);
        setError(`Failed to load project details: ${projectError.message}`);
        setProject(null);
      } else if (projectData) {
        setProject(projectData);
        if (projectData.user_id === authUser.id) {
          setIsOwner(true);
        } else {
          setError('You are not authorized to manage members for this project.');
          setIsOwner(false);
        }
      } else {
        setError('Project not found.');
        setProject(null);
      }
      setLoading(false);
    };

    fetchData();
  }, [supabase, router, projectSlug]);

  const handleInviteUser = async (e: FormEvent) => {
    e.preventDefault();
    if (!isOwner || !project || !user || !inviteEmail.trim()) {
      setInviteError('Cannot send invite. Ensure you are the owner and email is provided.');
      return;
    }

    setInviting(true);
    setInviteError(null);
    setInviteSuccess(null);

    try {
      // Step 1: Find the user_id for the given email
      // Note: This requires RLS on profiles/auth.users to be readable or a dedicated function
      const { data: invitedUserData, error: userLookupError } = await supabase
        .from('profiles') // Assuming email is in profiles table and profiles.id is auth.users.id
        .select('id')
        .eq('email', inviteEmail.trim().toLowerCase())
        .single();

      if (userLookupError || !invitedUserData) {
        console.error('User lookup error:', userLookupError);
        setInviteError(`User with email "${inviteEmail.trim()}" not found or an error occurred.`);
        setInviting(false);
        return;
      }

      const invitedUserId = invitedUserData.id;

      if (invitedUserId === user.id) {
        setInviteError('You cannot invite yourself to the project.');
        setInviting(false);
        return;
      }

      // Step 2: Check if user is already a member or has a pending invite
      const { data: existingMembership, error: checkError } = await supabase
        .from('project_memberships')
        .select('id, status')
        .eq('project_client_id', project.id)
        .eq('user_id', invitedUserId)
        .maybeSingle(); // Use maybeSingle as they might not be a member yet

      if (checkError) {
        console.error('Error checking existing membership:', checkError);
        setInviteError('Could not verify existing membership status.');
        setInviting(false);
        return;
      }

      if (existingMembership) {
        if (existingMembership.status === 'approved') {
          setInviteError(`User "${inviteEmail.trim()}" is already a member of this project.`);
        } else if (existingMembership.status === 'invited') {
          setInviteError(`User "${inviteEmail.trim()}" already has a pending invitation.`);
        } else if (existingMembership.status === 'pending_owner_approval') {
          setInviteError(`User "${inviteEmail.trim()}" has already requested to join and is awaiting approval.`);
        } else {
             // Potentially update an existing 'left' or 'rejected' record to 'invited'
             // For simplicity now, we just error out if any record exists.
             // A more advanced system might allow re-inviting.
            const { error: updateExistingError } = await supabase
            .from('project_memberships')
            .update({
                status: 'invited',
                invited_by: user.id,
                updated_at: new Date().toISOString(),
                role: 'member' // Reset role on re-invite
            })
            .eq('id', existingMembership.id);

            if (updateExistingError) {
                setInviteError(`User "${inviteEmail.trim()}" has a previous interaction with this project. Failed to send a new invite.`);
                setInviting(false);
                return;
            }
            setInviteSuccess(`Invitation re-sent to "${inviteEmail.trim()}"! They will find it in their Project Invitations page.`);

        }
        setInviting(false);
        return;
      }

      // Step 3: Insert into 'project_memberships' table
      const { error: inviteInsertError } = await supabase
        .from('project_memberships')
        .insert({
          project_client_id: project.id,
          user_id: invitedUserId,
          status: 'invited',
          invited_by: user.id,
          role: 'member',
        });

      if (inviteInsertError) {
        console.error('Error inserting invitation:', inviteInsertError);
        setInviteError(`Failed to send invitation: ${inviteInsertError.message}`);
      } else {
        setInviteSuccess(`Invitation sent to "${inviteEmail.trim()}"! They will find it in their Project Invitations page.`);
        setInviteEmail('');
      }
    } catch (e: any) {
      console.error('Unexpected error sending invitation:', e);
      setInviteError(`An unexpected error occurred: ${e.message}`);
    } finally {
      setInviting(false);
      setTimeout(() => {
        setInviteError(null);
        setInviteSuccess(null);
      }, 5000);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <FaSpinner className="text-sky-400 text-6xl mx-auto animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6 text-center">
        <FaExclamationCircle className="text-red-500 text-5xl mb-4" />
        <p className="text-xl text-red-400 mb-6">{error}</p>
        <Link href="/myprojects" legacyBehavior>
          <a className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-sky-100 bg-sky-600 hover:bg-sky-700">
            <FaArrowLeft className="mr-2" /> Go Back to My Projects
          </a>
        </Link>
      </div>
    );
  }

  if (!project || !user || !isOwner) {
    // This case should be covered by the error state handling above for non-owners or project not found
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
        <p className="text-xl text-gray-400">Access denied or project not found.</p>
      </div>
    );
  }
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
            <Link href="/myprojects" legacyBehavior>
              <a className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors text-sm">
                <FaArrowLeft className="mr-2" /> Back to My Projects
              </a>
            </Link>
        </div>

        <div className="text-center mb-10">
          <FaUsers className="mx-auto text-5xl text-sky-500 mb-3" />
          <h1 className="text-3xl md:text-4xl font-bold text-white">Manage Members</h1>
          <p className="mt-2 text-xl text-sky-300">{project.name}</p>
        </div>

        {/* Invite New Member Section */}
        <section className="bg-gray-800/70 backdrop-blur-md shadow-xl rounded-lg p-6 md:p-8 border border-gray-700 mb-10">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <FaUserPlus className="mr-3 text-sky-400" />
            Invite New Member
          </h2>
          <form onSubmit={handleInviteUser} className="space-y-4">
            <div>
              <label htmlFor="inviteEmail" className="block text-sm font-medium text-gray-300 mb-1.5">
                User's Email Address
              </label>
              <input
                type="email"
                id="inviteEmail"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="e.g., newmember@example.com"
                required
                className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm placeholder-gray-500"
              />
            </div>
            <button
              type="submit"
              disabled={inviting || !inviteEmail.trim()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-green-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg"
            >
              {inviting ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaUserPlus className="mr-2" />
              )}
              Send Invitation
            </button>
            {inviteError && <p className="text-sm text-red-400 mt-2">{inviteError}</p>}
            {inviteSuccess && <p className="text-sm text-green-400 mt-2">{inviteSuccess}</p>}
          </form>
        </section>

        {/* TODO: Section to list existing members, their roles, statuses, and actions (approve, change role, remove) */}
        {/* This would involve another fetch to 'project_memberships' joined with 'profiles' */}
        {/* Example: 
        <section className="bg-gray-800/60 backdrop-blur-md shadow-lg rounded-lg p-6 md:p-8 border border-gray-700">
          <h2 className="text-2xl font-semibold text-white mb-6">Current Members</h2>
          <p className="text-gray-400 italic">Member listing and management coming soon...</p>
        </section>
        */}
      </div>
    </div>
  );
} 