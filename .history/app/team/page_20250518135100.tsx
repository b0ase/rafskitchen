'use client';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUsers, FaSpinner, FaProjectDiagram, FaUserPlus, FaAngleDown, FaAngleRight, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaQuestionCircle } from 'react-icons/fa';

// Helper to map icon names to components (copied from JoinTeamPage)
const iconMap: { [key: string]: React.ElementType } = {
  FaDatabase,
  FaPalette,
  FaBolt,
  FaCloud,
  FaLightbulb,
  FaBrain,
  FaUsers, // For a generic team icon
  FaQuestionCircle, // Default
};

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

// For the dropdown of all platform users
interface PlatformUser {
  id: string;
  display_name: string; // Or username, whatever is best for display
}

// --- NEW Team Interface ---
interface ColorScheme {
  bgColor: string;
  textColor: string;
  borderColor: string;
}

interface Team {
  id: string;
  name: string;
  slug: string | null; // Added
  icon_name: string | null;
  color_scheme: ColorScheme | null;
}
// --- END NEW Team Interface ---

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

  // --- NEW State for User's Teams ---
  const [userTeams, setUserTeams] = useState<Team[]>([]);
  const [isLoadingUserTeams, setIsLoadingUserTeams] = useState(false);
  const [errorFetchingUserTeams, setErrorFetchingUserTeams] = useState<string | null>(null);
  // --- END NEW State for User's Teams ---

  const [managedProjects, setManagedProjects] = useState<ManagedProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // State for adding a new member
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>([]);
  const [isLoadingPlatformUsers, setIsLoadingPlatformUsers] = useState(false);
  const [selectedPlatformUserId, setSelectedPlatformUserId] = useState<string>(''); // For the dropdown
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

  // --- NEW Function to Fetch User's Teams ---
  const fetchUserTeams = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsLoadingUserTeams(true);
    setErrorFetchingUserTeams(null);
    try {
      // Step 1: Get team_ids from user_team_memberships join table
      const { data: teamUserEntries, error: teamUserError } = await supabase
        .from('user_team_memberships') // Corrected table name
        .select('team_id')
        .eq('user_id', userId);

      if (teamUserError) {
        throw teamUserError;
      }

      if (!teamUserEntries || teamUserEntries.length === 0) {
        setUserTeams([]);
        setIsLoadingUserTeams(false);
        return;
      }

      const teamIds = teamUserEntries.map(entry => entry.team_id);

      // Step 2: Fetch details for these teams from the 'teams' table
      const { data: teamsData, error: teamsError } = await supabase
        .from('teams') // Assuming this is your main teams table
        .select('id, name, slug, icon_name, color_scheme') // Added slug
        .in('id', teamIds);

      if (teamsError) {
        throw teamsError;
      }
      
      // Process teamsData to add default color_scheme and icon_name if null
      const processedTeamsData = teamsData?.map(team => ({
        ...team,
        color_scheme: team.color_scheme || { bgColor: 'bg-gray-700', textColor: 'text-gray-100', borderColor: 'border-gray-500' },
        icon_name: team.icon_name || 'FaQuestionCircle' // Default icon if none specified
      })) || [];

      setUserTeams(processedTeamsData as Team[]);

    } catch (e: any) {
      console.error('Error fetching user teams:', e);
      setErrorFetchingUserTeams(`Failed to load your teams: ${e.message}`);
      setUserTeams([]);
    } finally {
      setIsLoadingUserTeams(false);
    }
  }, [supabase]);
  // --- END NEW Function ---

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

  const fetchPlatformUsers = useCallback(async () => {
    setIsLoadingPlatformUsers(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, username') // Fetch fields needed for display and ID
        .order('display_name', { ascending: true }); // Optional: order them

      if (error) throw error;
      setPlatformUsers(data?.map(p => ({ id: p.id, display_name: p.display_name || p.username || p.id.substring(0,8) })) || []);
    } catch (e: any) {
      console.error('Error fetching platform users:', e);
      setError(`Failed to load users for dropdown: ${e.message}`);
      setPlatformUsers([]);
    } finally {
      setIsLoadingPlatformUsers(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (user?.id) {
      fetchManagedProjects(user.id);
      fetchPlatformUsers(); // Fetch all users once the main user is loaded
      fetchUserTeams(user.id); // --- NEW: Fetch user's teams ---
    }
  }, [user, fetchManagedProjects, fetchPlatformUsers, fetchUserTeams]); // --- UPDATED dependencies ---

  useEffect(() => {
    if (selectedProjectId) {
      fetchTeamMembers(selectedProjectId);
      setSelectedPlatformUserId(''); // Reset selected user in dropdown
      setNewMemberRole(ProjectRole.Collaborator);
      setSuccessMessage(null);
      setError(null);
    } else {
      setTeamMembers([]); // Clear team members if no project is selected
    }
  }, [selectedProjectId, fetchTeamMembers]);

  const handleAddNewMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProjectId || !selectedPlatformUserId) {
      setError('Please select a project and a user to add.');
      return;
    }
    setIsAddingMember(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error: insertError } = await supabase
        .from('project_users')
        .insert({
          project_id: selectedProjectId,
          user_id: selectedPlatformUserId,
          role: newMemberRole,
        });

      if (insertError) {
        if (insertError.code === '23505') { 
          throw new Error(`This user is already a member of this project.`);
        } else {
          throw insertError;
        }
      }
      const addedUser = platformUsers.find(u => u.id === selectedPlatformUserId);
      setSuccessMessage(`Successfully added ${addedUser?.display_name || 'user'} to the project as ${newMemberRole.replace('_',' ')}.`);
      setSelectedPlatformUserId(''); 
      fetchTeamMembers(selectedProjectId); 
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
        <div className="flex flex-col sm:flex-row justify-end items-center mb-10">
          <div className="flex gap-x-4">
            <Link href="/teams/new" passHref legacyBehavior>
              <a className="inline-flex items-center bg-green-600 hover:bg-green-500 !text-white font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-md hover:shadow-lg text-base transform hover:scale-105 no-underline">
                <FaUserPlus className="mr-2 h-5 w-5" />
                Start a New Team
              </a>
            </Link>
            <Link href="/teams/join" passHref legacyBehavior>
              <a className="inline-flex items-center bg-sky-600 hover:bg-sky-500 !text-white font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-md hover:shadow-lg text-base transform hover:scale-105 no-underline">
                <FaUsers className="mr-2 h-5 w-5" />
                Join a Team
              </a>
            </Link>
          </div>
        </div>

        {error && (
          <div className="text-red-500 bg-red-900/30 p-3 rounded-md">{error}</div>
        )}

        {/* User Teams Section - Only show if user is loaded and present */}
        {loadingUser && (
          <div className="flex items-center justify-center h-screen">
            <FaSpinner className="animate-spin text-4xl text-sky-500" />
          </div>
        )}

        {!loadingUser && user && (
          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-sky-400 mb-6">My Teams</h2>
            {isLoadingUserTeams && (
              <div className="flex justify-center items-center col-span-1 md:col-span-2 lg:col-span-3 py-10">
                <FaSpinner className="animate-spin text-3xl text-sky-400" />
                <p className="ml-3 text-lg text-gray-300">Loading your teams...</p>
              </div>
            )}
            {errorFetchingUserTeams && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md">
                <p><strong>Error:</strong> {errorFetchingUserTeams}</p>
              </div>
            )}
            {!isLoadingUserTeams && !errorFetchingUserTeams && userTeams.length === 0 && !managedProjects.length && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 py-10 text-center">
                <FaUsers className="mx-auto text-5xl text-gray-500 mb-4" />
                <p className="text-gray-400 text-lg">You are not part of any teams yet.</p>
              </div>
            )}
            {!isLoadingUserTeams && !errorFetchingUserTeams && userTeams.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userTeams.map((team) => {
                  const IconComponent = iconMap[team.icon_name || 'FaQuestionCircle'] || FaQuestionCircle;
                  const cardBgColor = team.color_scheme?.bgColor || 'bg-slate-700';
                  const cardTextColor = team.color_scheme?.textColor || 'text-slate-100';
                  const cardBorderColor = team.color_scheme?.borderColor || 'border-slate-600';

                  return (
                    <Link key={team.id} href={`/teams/${team.slug || team.id}`} passHref legacyBehavior>
                      <a className={`block rounded-xl shadow-2xl p-6 flex flex-col justify-between border-2 transition-all duration-300 ease-in-out hover:shadow-sky-500/50 hover:scale-105 ${cardBgColor} ${cardBorderColor} ${cardTextColor} cursor-pointer`}>
                        <div className="flex items-center mb-4">
                          <IconComponent className={`text-4xl mr-4 ${cardTextColor} opacity-90`} />
                          <h3 className={`text-2xl font-semibold ${cardTextColor}`}>{team.name}</h3>
                        </div>
                        <div className="mt-auto pt-4 text-right">
                          <span className={`text-sm ${cardTextColor} opacity-80 hover:opacity-100`}>Open Chat <FaAngleRight className="inline ml-1" /></span>
                        </div>
                      </a>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Managed Projects Section - Only show if user is loaded and present */}
        {!loadingUser && user && (
          <div className="mt-12">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold text-sky-400">Managed Projects</h2>
            </div>
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
                    <div className="border-t border-gray-700 p-6">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-semibold text-white">Team Members</h3>
                        {/* The button below was the old placeholder, it's being removed as the form handles adding members now */}
                        {/* <button 
                          className="bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md flex items-center text-sm transition-colors duration-150"
                          onClick={() => alert(`TODO: Implement invite for project ${project.name}`)} 
                        >
                          <FaUserPlus className="mr-2" /> Invite Member
                        </button> */}
                      </div>
                      {isLoadingTeamMembers && <FaSpinner className="animate-spin text-sky-500 text-xl my-3" />}
                      {!isLoadingTeamMembers && teamMembers.length === 0 && (
                        <p className="text-gray-500 italic">No team members assigned to this project yet (besides you).</p>
                      )}
                      {!isLoadingTeamMembers && teamMembers.length > 0 && (
                        <ul className="space-y-3 mb-6">
                          {teamMembers.map(member => (
                            <li key={member.user_id} className="flex justify-between items-center p-3 bg-gray-800 rounded-md shadow">
                              <div>
                                <span className="font-medium text-gray-100">{member.display_name || member.user_id}</span>
                                <span className="ml-3 text-xs text-sky-300 uppercase bg-sky-700/50 px-2 py-1 rounded-full">{(member.role || 'N/A').replace('_', ' ')}</span>
                              </div>
                              {/* TODO: Add actions like change role, remove member */}
                              { user?.id !== member.user_id && (
                                <button className="text-xs text-red-400 hover:text-red-300">Remove</button> // Placeholder
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      
                        <div className="mt-6 pt-6 border-t border-gray-700">
                            <h4 className="text-lg font-semibold text-white mb-4">Add New Member to "{project.name}"</h4>
                            <form onSubmit={handleAddNewMember} className="space-y-4">
                                <div>
                                    <label htmlFor="platformUserSelect" className="block text-sm font-medium text-gray-300 mb-1">Select User</label>
                                    {isLoadingPlatformUsers ? <FaSpinner className="animate-spin" /> : (
                                      <select 
                                          id="platformUserSelect"
                                          value={selectedPlatformUserId}
                                          onChange={(e) => setSelectedPlatformUserId(e.target.value)}
                                          className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                                          required
                                      >
                                          <option value="" disabled>-- Select a user --</option>
                                          {platformUsers.filter(pUser => pUser.id !== user?.id).map(pUser => ( // Exclude current user from list
                                              <option key={pUser.id} value={pUser.id}>{pUser.display_name}</option>
                                          ))}
                                      </select>
                                    )}
                                </div>
                                <div>
                                    <label htmlFor="newMemberRole" className="block text-sm font-medium text-gray-300 mb-1">Assign Role</label>
                                    <select 
                                        id="newMemberRole"
                                        value={newMemberRole}
                                        onChange={(e) => setNewMemberRole(e.target.value as ProjectRole)}
                                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm"
                                    >
                                        {Object.values(ProjectRole).map(role => (
                                            <option key={role} value={role}>{role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>
                                        ))}
                                    </select>
                                </div>
                                <button 
                                    type="submit"
                                    disabled={isAddingMember || isLoadingPlatformUsers}
                                    className="w-full flex justify-center items-center bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isAddingMember ? <FaSpinner className="animate-spin mr-2" /> : <FaUserPlus className="mr-2" />} Add Member
                                </button>
                            </form>
                        </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          </div>
        )}
      </main>
    </div>
  );
}
