'use client';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUsers, FaSpinner, FaProjectDiagram, FaUserPlus, FaAngleDown, FaAngleRight } from 'react-icons/fa';

// Interface for projects (assuming structure from your 'clients' table)
interface ManagedProject {
  id: string;
  name: string;
  // Add other relevant project fields if needed
}

// Interface for team members
interface TeamMember {
  user_id: string;
  role: string;
  email?: string; // From auth.users
  display_name?: string; // From profiles
  // Add other relevant user fields if needed
}

// Enum for roles (mirroring the SQL ENUM)
enum ProjectRole {
  ProjectManager = 'project_manager',
  Collaborator = 'collaborator',
  ClientContact = 'client_contact',
  Viewer = 'viewer',
}

export default function TeamPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [managedProjects, setManagedProjects] = useState<ManagedProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for adding a new member
  const [newMemberUsername, setNewMemberUsername] = useState('');
  const [newMemberRole, setNewMemberRole] = useState<ProjectRole>(ProjectRole.Collaborator);
  const [isAddingMember, setIsAddingMember] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      setLoadingUser(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        console.log('No user session found on team page, redirecting to login.');
        router.push('/login?redirectedFrom=/team');
      }
      setLoadingUser(false);
    };
    getUser();
  }, [supabase, router]);

  const fetchManagedProjects = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsLoadingProjects(true);
    setError(null);
    try {
      // Step 1: Get project_ids where the user is a project_manager
      const { data: projectUserEntries, error: projectUserError } = await supabase
        .from('project_users')
        .select('project_id')
        .eq('user_id', userId)
        .eq('role', ProjectRole.ProjectManager);

      if (projectUserError) {
        throw projectUserError;
      }

      if (!projectUserEntries || projectUserEntries.length === 0) {
        setManagedProjects([]);
        setIsLoadingProjects(false);
        return;
      }

      const projectIds = projectUserEntries.map(entry => entry.project_id);

      // Step 2: Fetch details for these projects from 'clients' table
      // Assuming 'clients' table has 'id' and 'name'
      const { data: projectsData, error: projectsError } = await supabase
        .from('clients') // Your projects table
        .select('id, name') // Changed project_name to name
        .in('id', projectIds);

      if (projectsError) {
        throw projectsError;
      }
      setManagedProjects(projectsData || []);

    } catch (e: any) {
      console.error('Error fetching managed projects:', e);
      setError(`Failed to load projects: ${e.message}`);
      setManagedProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  }, [supabase]);

  const fetchTeamMembers = useCallback(async (projectId: string) => {
    if (!projectId) return;
    setIsLoadingTeamMembers(true);
    setError(null);
    try {
      const { data: members, error: membersError } = await supabase
        .from('project_users')
        .select('user_id, role')
        .eq('project_id', projectId);

      if (membersError) {
        throw membersError;
      }

      if (!members || members.length === 0) {
        setTeamMembers([]);
        setIsLoadingTeamMembers(false);
        return;
      }

      // Fetch user details (email/display_name) for each member
      const detailedMembers = await Promise.all(
        members.map(async (member) => {
          // Try fetching from profiles first
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('display_name, username')
            .eq('id', member.user_id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') { // PGRST116: no rows found
            console.warn(`Error fetching profile for ${member.user_id}:`, profileError.message);
          }
          
          let email;
          // If no profile or no display_name, try fetching email from auth.users (requires admin or specific policy)
          // For simplicity, we'll assume for now that this might not always be directly available client-side
          // and rely on what `profiles` gives us or show user_id.
          // A backend route might be better for fetching emails securely if needed.

          return {
            ...member,
            display_name: profile?.display_name || profile?.username || 'N/A',
            email: 'N/A' // Placeholder, fetching actual email needs careful consideration
          };
        })
      );
      setTeamMembers(detailedMembers);

    } catch (e: any) {
      console.error('Error fetching team members:', e);
      setError(`Failed to load team members: ${e.message}`);
      setTeamMembers([]);
    } finally {
      setIsLoadingTeamMembers(false);
    }
  }, [supabase]);


  useEffect(() => {
    if (user?.id) {
      fetchManagedProjects(user.id);
    }
  }, [user, fetchManagedProjects]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTeamMembers(selectedProjectId);
      // Clear add member form when project changes
      setNewMemberUsername('');
      setNewMemberRole(ProjectRole.Collaborator);
      setSuccessMessage(null);
      setError(null);
    } else {
      setTeamMembers([]); // Clear team members if no project is selected
    }
  }, [selectedProjectId, fetchTeamMembers]);

  const handleAddNewMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProjectId || !newMemberUsername) {
      setError('Please select a project and enter a username.');
      return;
    }
    setIsAddingMember(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // Step 1: Find user by username in 'profiles' table
      // Assuming 'username' is a unique column in your 'profiles' table
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', newMemberUsername) // Or 'display_name' if that's what you intend to search by
        .single();

      if (profileError || !profile) {
        throw new Error(`User with username "${newMemberUsername}" not found or error fetching profile.`);
      }

      const memberUserId = profile.id;

      // Step 2: Insert into project_users
      const { error: insertError } = await supabase
        .from('project_users')
        .insert({
          project_id: selectedProjectId,
          user_id: memberUserId,
          role: newMemberRole,
        });

      if (insertError) {
        // Handle specific errors like unique constraint violation (user already in project)
        if (insertError.code === '23505') { // Unique violation
          throw new Error(`User "${newMemberUsername}" is already a member of this project.`);
        } else {
          throw insertError;
        }
      }

      setSuccessMessage(`Successfully added ${newMemberUsername} to the project as ${newMemberRole.replace('_',' ')}.`);
      setNewMemberUsername(''); // Clear form
      fetchTeamMembers(selectedProjectId); // Refresh team member list

    } catch (e: any) {
      console.error('Error adding new member:', e);
      setError(`Failed to add member: ${e.message}`);
    } finally {
      setIsAddingMember(false);
    }
  };


  if (loadingUser || (user && isLoadingProjects)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-sky-500" />
        <p className="ml-3 text-xl">Loading your team data...</p>
      </div>
    );
  }

  if (!user && !loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <p className="text-xl mb-4">You need to be logged in to view your team.</p>
        <Link href="/login?redirectedFrom=/team" className="text-sky-400 hover:text-sky-300">
          Go to Login
        </Link>
      </div>
    );
  }
  
  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(prevId => prevId === projectId ? null : projectId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center">
            <FaUsers className="mr-3" /> My Team
          </h1>
          {/* Button to invite to a specific project could go here, enabled when a project is selected */}
        </div>

        {error && !successMessage && <p className="text-red-500 bg-red-900/30 p-3 rounded-md mb-6">{error}</p>}
        {successMessage && <p className="text-green-400 bg-green-900/30 p-3 rounded-md mb-6">{successMessage}</p>}

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">Managed Projects</h2>
          {isLoadingProjects && <FaSpinner className="animate-spin text-sky-500 text-2xl my-4" />}
          {!isLoadingProjects && managedProjects.length === 0 && (
            <div className="bg-gray-900 p-6 border border-gray-800 shadow-lg rounded-md">
              <p className="text-gray-500 italic">You are not managing any projects currently.</p>
              {/* TODO: Link to create a new project or info on how to become a project manager */}
            </div>
          )}
          {!isLoadingProjects && managedProjects.length > 0 && (
            <div className="space-y-4">
              {managedProjects.map(project => (
                <div key={project.id} className="bg-gray-900 border border-gray-800 shadow-lg rounded-md">
                  <button
                    onClick={() => handleProjectSelect(project.id)}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-800/50 transition-colors duration-150"
                  >
                    <span className="text-lg font-medium text-sky-400 flex items-center">
                      <FaProjectDiagram className="mr-3 text-sky-500" />
                      {project.name || 'Unnamed Project'}
                    </span>
                    {selectedProjectId === project.id ? <FaAngleDown className="text-gray-400" /> : <FaAngleRight className="text-gray-400" />}
                  </button>

                  {selectedProjectId === project.id && (
                    <div className="border-t border-gray-700 p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Team Members</h3>
                        <button 
                          className="bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md flex items-center text-sm transition-colors duration-150"
                          onClick={() => alert(`TODO: Implement invite for project ${project.name}`)}
                        >
                          <FaUserPlus className="mr-2" /> Invite Member
                        </button>
                      </div>
                      {isLoadingTeamMembers && <FaSpinner className="animate-spin text-sky-500 text-xl my-3" />}
                      {!isLoadingTeamMembers && teamMembers.length === 0 && (
                        <p className="text-gray-500 italic">No team members assigned to this project yet (besides you).</p>
                      )}
                      {!isLoadingTeamMembers && teamMembers.length > 0 && (
                        <ul className="space-y-2">
                          {teamMembers.map(member => (
                            <li key={member.user_id} className="flex justify-between items-center p-2 bg-gray-800 rounded">
                              <div>
                                <span className="font-medium text-gray-200">{member.display_name || member.user_id}</span>
                                <span className="ml-2 text-xs text-gray-400 uppercase bg-gray-700 px-2 py-0.5 rounded-full">{member.role.replace('_', ' ')}</span>
                              </div>
                              {/* TODO: Add actions like change role, remove member */}
                            </li>
                          ))}
                        </ul>
                      )}
                      
                        <div className="mt-6 pt-4 border-t border-gray-600">
                            <h4 className="text-lg font-semibold text-white mb-3">Add New Member</h4>
                            <p className="text-gray-500 italic text-sm">
                                UI for searching users and assigning roles will go here.
                            </p>
                            {/* TODO: Input for user search (email/username), role selector, add button */}
                        </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Original "Team Permissions & Roles" section - can be repurposed or removed if project-specific roles are enough */}
        {/* <section>
          <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">Global Team Permissions & Roles</h2>
          <div className="bg-gray-900 p-6 border border-gray-800 shadow-lg rounded-md">
            <p className="text-gray-500 italic">Overall permissions management for the platform could be here.</p>
          </div>
        </section> */}
      </main>
    </div>
  );
}
