'use client';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUsers, FaSpinner, FaProjectDiagram, FaUserPlus, FaAngleDown, FaAngleRight, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaQuestionCircle, FaUserShield } from 'react-icons/fa';

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
  project_id?: string; // Added to identify the project for removal context
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
  // Added fields for related data
  project?: {
    id: string;
    name: string;
    slug: string | null; // Added slug for project
    project_category: string | null;
  } | null;
  team_leader?: {
    display_name: string;
  } | null;
  token?: {
    ticker_symbol: string;
  } | null;
}
// --- END NEW Team Interface ---

// Enum for roles (mirroring the SQL ENUM)
enum ProjectRole {
  ProjectManager = 'project_manager',
  Collaborator = 'collaborator',
  ClientContact = 'client_contact',
  Viewer = 'viewer',
}

// --- UPDATED Team/Project Interface ---
// This interface now primarily represents a Project for display on the /team page,
// structured to fit the existing component logic that expects a list of 'Teams'.
interface DisplayProject {
  id: string; // Corresponds to client.id
  name: string; // Corresponds to client.name
  slug: string | null; // Corresponds to client.slug
  icon_name: string | null; // We can potentially add this to clients table or derive
  color_scheme: ColorScheme | null; // We can potentially add this to clients table or derive
  // Related data fetched
  team_leader?: {
    display_name: string | null; // From profiles.display_name or username
  } | null;
  token?: {
    ticker_symbol: string | null;
  } | null;
  client_name?: string | null; // Using client.name for this
  project_type?: string | null; // Using client.project_category for this
  team_members?: { display_name: string | null }[]; // Added field for team members
  // We keep a reference to the original project data for convenience
  project_data: ManagedProject; // The original client object
}

// --- END UPDATED Team/Project Interface ---

export default function TeamPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // --- UPDATED State for Display Projects (formerly User's Teams) ---
  const [displayProjects, setDisplayProjects] = useState<DisplayProject[]>([]);
  const [isLoadingDisplayProjects, setIsLoadingDisplayProjects] = useState(false);
  const [errorFetchingDisplayProjects, setErrorFetchingDisplayProjects] = useState<string | null>(null);
  // --- END UPDATED State ---

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

  // --- NEW State for Remove Confirmation Modal ---
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ userId: string; displayName: string; projectId: string; projectName: string; } | null>(null);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  // --- END NEW State ---

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

  // --- NEW Function to Fetch Projects and related data for display ---
  const fetchDisplayProjects = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsLoadingDisplayProjects(true);
    setErrorFetchingDisplayProjects(null);
    try {
      // Step 1: Get project_ids from project_users where the user is a member
      const { data: userProjectMemberships, error: userProjectError } = await supabase
        .from('project_users')
        .select('project_id, role')
        .eq('user_id', userId);

      if (userProjectError) {
        throw userProjectError;
      }

      if (!userProjectMemberships || userProjectMemberships.length === 0) {
        setDisplayProjects([]);
        setIsLoadingDisplayProjects(false);
        return;
      }

      const projectIds = userProjectMemberships.map(entry => entry.project_id);

      // Step 2: Fetch details for these projects from the 'clients' table
      const { data: projectsData, error: projectsError } = await supabase
        .from('clients')
        .select('id, name, slug, project_category, user_id') // Include user_id to potentially link to creator/main contact
        .in('id', projectIds);

      if (projectsError) {
        throw projectsError;
      }

      // Step 3: For each project, fetch additional details like team leader and token
      const displayProjectsWithDetails = await Promise.all(projectsData?.map(async (project) => {
        let teamLeader: { display_name: string | null } | null = null;
        let projectToken: { ticker_symbol: string | null } | null = null;
        let projectMembers: { display_name: string | null }[] = []; // Initialize array for members

        // Fetch project manager(s) for this project
        const { data: projectManagers, error: pmError } = await supabase
          .from('project_users')
          .select('user_id')
          .eq('project_id', project.id)
          .eq('role', ProjectRole.ProjectManager)
          .limit(1);

        if (pmError) {
          console.error('Error fetching project managers for project', project.name, ':', pmError);
        }

        let pmUserId: string | null = null;
        if (projectManagers && projectManagers.length > 0) {
          pmUserId = projectManagers[0].user_id;
          // Fetch display name for the first project manager found
          const { data: pmProfile, error: pmProfileError } = await supabase
            .from('profiles')
            .select('display_name, username')
            .eq('id', pmUserId)
            .single();

          if (pmProfileError && pmProfileError.code !== 'PGRST116') {
            console.error('Error fetching project manager profile for user', pmUserId, ':', pmProfileError);
          }

          if (pmProfile) {
            teamLeader = { display_name: pmProfile.display_name || pmProfile.username || 'Unnamed User' };
          }
        }

        // Fetch token for this project
        const { data: tokenData, error: tokenError } = await supabase
          .from('tokens')
          .select('ticker_symbol')
          .eq('token_category', 'project')
          // Assuming token is linked by project ID or slug or potentially the project manager's user ID.
          // Using a combined filter.
          .or(`name.eq.${project.slug || (project.name?.toLowerCase().replace(/\s+/g, '-') || '')},ticker_symbol.eq.${project.slug || (project.name?.toLowerCase().replace(/\s+/g, '-') || '')}${pmUserId ? `,user_id.eq.${pmUserId}` : ''}`)
          .limit(1);

        if (tokenError && tokenError.code !== 'PGRST116') {
          console.error('Error fetching token for project', project.name, ':', tokenError);
        }

        if (tokenData && tokenData.length > 0) {
          projectToken = tokenData[0];
        }

        // Fetch team members for this project
        const { data: membersData, error: membersError } = await supabase
          .from('project_users')
          .select('user_id')
          .eq('project_id', project.id);

        if (membersError) {
          console.error('Error fetching members for project', project.name, ':', membersError);
        } else if (membersData && membersData.length > 0) {
          // Fetch display names for all members
          const memberUserIds = membersData.map(member => member.user_id);
          const { data: memberProfiles, error: mpError } = await supabase
            .from('profiles')
            .select('id, display_name, username')
            .in('id', memberUserIds);

          if (mpError) {
            console.error('Error fetching member profiles for project', project.name, ':', mpError);
          } else if (memberProfiles) {
            projectMembers = memberProfiles.map(profile => ({ display_name: profile.display_name || profile.username || 'Unnamed User' }));
          }
        }

        // Construct the DisplayProject object
        return {
          id: project.id,
          name: project.name || 'Unnamed Project',
          slug: project.slug,
          icon_name: 'FaProjectDiagram',
          color_scheme: { bgColor: 'bg-black', textColor: 'text-gray-400', borderColor: 'border-gray-800' },
          team_leader: teamLeader,
          token: projectToken,
          client_name: project.name || 'Unnamed Client',
          project_type: project.project_category,
          team_members: projectMembers, // Include fetched members
          project_data: project,
        };
      })) || [];

      setDisplayProjects(displayProjectsWithDetails);

    } catch (e: any) {
      console.error('Error fetching display projects:', e);
      setErrorFetchingDisplayProjects(`Failed to load projects: ${e.message}`);
      setDisplayProjects([]);
    } finally {
      setIsLoadingDisplayProjects(false);
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
      fetchDisplayProjects(user.id); // --- UPDATED: Fetch display projects instead of user teams ---
    }
  }, [user, fetchManagedProjects, fetchPlatformUsers, fetchDisplayProjects]); // --- UPDATED dependencies ---

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

  // --- NEW Function to Open Remove Confirmation Modal ---
  const openRemoveConfirmModal = (member: TeamMember, projectId: string, projectName: string) => {
    if (member.user_id === user?.id) {
      setError("You cannot remove yourself from a project you manage. If you wish to leave, please transfer ownership or contact an administrator.");
      return;
    }
    setMemberToRemove({ 
      userId: member.user_id, 
      displayName: member.display_name || 'this user', 
      projectId: projectId,
      projectName: projectName
    });
    setShowRemoveConfirmModal(true);
    setError(null); // Clear previous errors
    setSuccessMessage(null); // Clear previous success messages
  };
  // --- END NEW Function ---

  // --- NEW Function to Handle Member Removal ---
  const handleRemoveMember = async () => {
    if (!memberToRemove) return;

    setIsRemovingMember(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const { error: deleteError } = await supabase
        .from('project_users')
        .delete()
        .eq('user_id', memberToRemove.userId)
        .eq('project_id', memberToRemove.projectId);

      if (deleteError) {
        throw deleteError;
      }

      setSuccessMessage(`Successfully removed ${memberToRemove.displayName} from project "${memberToRemove.projectName}".`);
      fetchTeamMembers(memberToRemove.projectId); // Refresh list
      setShowRemoveConfirmModal(false);
      setMemberToRemove(null);
    } catch (e: any) {
      console.error('Error removing member:', e);
      setError(`Failed to remove member: ${e.message}`);
    } finally {
      setIsRemovingMember(false);
    }
  };
  // --- END NEW Function ---

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
        <div className="flex flex-col sm:flex-row justify-start items-center mb-10">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {/* Removed Admin button from here */}
            {/* Removed "Start a New Team" and "Join a Team" buttons as they are now in AppSubNavbar */}
            {/*
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
            */}
          </div>
        </div>

        {error && (
          <div className="text-red-500 bg-red-900/30 p-3 rounded-md">{error}</div>
        )}

        {/* User Teams Section - UPDATED to Display Projects */}
        {loadingUser && (
          <div className="flex items-center justify-center h-screen">
            <FaSpinner className="animate-spin text-4xl text-sky-500" />
          </div>
        )}

        {!loadingUser && user && (
          <div className="mb-12">
            {/* Removed "My Teams" heading for minimalistic aesthetic */}
            {isLoadingDisplayProjects && (
              <div className="flex justify-center items-center col-span-1 md:col-span-2 lg:col-span-3 py-10">
                <FaSpinner className="animate-spin text-3xl text-sky-400" />
                <p className="ml-3 text-lg text-gray-300">Loading your projects...</p>
              </div>
            )}
            {errorFetchingDisplayProjects && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md">
                <p><strong>Error:</strong> {errorFetchingDisplayProjects}</p>
              </div>
            )}
            {!isLoadingDisplayProjects && !errorFetchingDisplayProjects && displayProjects.length === 0 && !managedProjects.length && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 py-10 text-center">
                <FaProjectDiagram className="mx-auto text-5xl text-gray-500 mb-4" />
                <p className="text-gray-400 text-lg">You are not associated with any projects yet.</p>
              </div>
            )}
            {!isLoadingDisplayProjects && !errorFetchingDisplayProjects && displayProjects.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayProjects.map((project) => {
                  const IconComponent = iconMap[project.icon_name || 'FaQuestionCircle'] || FaQuestionCircle;
                  const cardBgColor = project.color_scheme?.bgColor || 'bg-black';
                  const cardBorderColor = project.color_scheme?.borderColor || 'border-gray-800';
                  const cardTextColor = project.color_scheme?.textColor || 'text-gray-400';

                  return (
                    <Link key={project.id} href={`/projects/${project.slug || project.id}`} passHref legacyBehavior>
                      <a className={`block rounded-md shadow-none p-3 flex flex-col justify-between border transition-all duration-200 ease-in-out hover:border-gray-600 ${cardBgColor} ${cardBorderColor} ${cardTextColor} cursor-pointer`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center">
                            <IconComponent className={`text-lg mr-2 text-white opacity-90`} />
                            <h3 className={`text-sm font-normal text-white truncate`}>{project.name}</h3>
                          </div>
                          {project.token && <span className="text-white text-xs font-semibold">{project.token.ticker_symbol}</span>}
                        </div>
                        <div className="text-gray-400 text-xs space-y-0.5 mb-2">
                          {project.team_leader && <p>Team Leader: {project.team_leader.display_name}</p>}
                          {project.client_name && <p>Client: {project.client_name}</p>}
                          {project.project_type && <p>Project Type: {project.project_type}</p>}
                        </div>
                        {project.team_members && project.team_members.length > 0 && (
                          <div className="border-t border-gray-700 mt-2 pt-2">
                            <p className="text-gray-600">{project.team_members.map(member => member.display_name).join(', ')}</p>
                          </div>
                        )}
                        {!project.team_leader && !project.client_name && !project.token && !project.project_type && (!project.team_members || project.team_members.length === 0) && project.name !== 'Unnamed Project' && (
                          <p className="text-gray-400 text-xs space-y-0.5 mb-2">Additional details pending...</p>
                        )}
                        <div className="mt-auto pt-3 text-right">
                          <span className={`text-xs text-gray-400 opacity-60 hover:opacity-100`}>View Project <FaAngleRight className="inline ml-1" /></span>
                        </div>
                      </a>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Managed Projects Section - Kept as is for now */}
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-300">Managed Projects</h2>
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
                    <span className="text-base font-medium text-gray-400 flex items-center">
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
                            <li key={member.user_id} className="flex justify-between items-center p-2.5 bg-gray-800 rounded-md shadow">
                              <div>
                                <span className="font-normal text-gray-500 text-xs">{member.display_name || member.user_id}</span>
                                <span className="ml-3 text-xs text-sky-300 uppercase bg-sky-700/50 px-2 py-1 rounded-full">{(member.role || 'N/A').replace('_', ' ')}</span>
                              </div>
                              {/* TODO: Add actions like change role, remove member */}
                              { user?.id !== member.user_id && (
                                <button 
                                  onClick={() => openRemoveConfirmModal(member, project.id, project.name || 'Unnamed Project')}
                                  className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/50 hover:border-red-400 transition-colors"
                                  disabled={isAddingMember || isLoadingTeamMembers || isRemovingMember}
                                >
                                  Remove
                                </button>
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
      </main>
      {/* --- NEW Remove Member Confirmation Modal --- */}
      {showRemoveConfirmModal && memberToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl border border-gray-700 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Confirm Removal</h3>
            <p className="text-gray-300 mb-2">
              Are you sure you want to remove 
              <strong className="text-sky-400 mx-1">{memberToRemove.displayName}</strong> 
              from the project 
              <strong className="text-sky-400 mx-1">"{memberToRemove.projectName}"</strong>?
            </p>
            <p className="text-xs text-orange-400 mb-6">This action will revoke their access to this project.</p>
            {error && <p className="text-red-400 bg-red-900/30 p-2 rounded-md mb-4 text-sm">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => { setShowRemoveConfirmModal(false); setMemberToRemove(null); setError(null); }}
                disabled={isRemovingMember}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleRemoveMember}
                disabled={isRemovingMember}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center"
              >
                {isRemovingMember ? <FaSpinner className="animate-spin mr-2" /> : null}
                Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- END NEW Modal --- */}
    </div>
  );
}
