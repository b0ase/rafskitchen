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

// Helper function to get role display style
const getRoleStyle = (role: string): string => {
  const roleLower = role.toLowerCase();
  let style = "ml-3 text-xs uppercase px-2 py-1 rounded-full font-semibold ";
  if (roleLower === ProjectRole.ProjectManager || roleLower === 'project_manager') {
    style += "bg-sky-700/70 text-sky-200";
  } else if (roleLower === ProjectRole.Freelancer || roleLower === 'collaborator') {
    style += "bg-indigo-700/70 text-indigo-200";
  } else if (roleLower === ProjectRole.CLIENT || roleLower === 'clientcontact') {
    style += "bg-green-700/70 text-green-200";
  } else if (roleLower === ProjectRole.Viewer) {
    style += "bg-gray-600/70 text-gray-100";
  } else {
    style += "bg-gray-700/70 text-gray-200"; // Default/fallback
  }
  return style;
};

// Enum for roles (mirroring the SQL ENUM)
enum ProjectRole {
  ProjectManager = 'project_manager',
  Freelancer = 'freelancer',
  CLIENT = 'client',
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
  const [displayProjects, setDisplayProjects] = useState<DisplayProject[]>([]);
  const [isLoadingDisplayProjects, setIsLoadingDisplayProjects] = useState(false);
  const [errorFetchingDisplayProjects, setErrorFetchingDisplayProjects] = useState<string | null>(null);
  const [managedProjects, setManagedProjects] = useState<ManagedProject[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>([]);
  const [isLoadingPlatformUsers, setIsLoadingPlatformUsers] = useState(false);
  const [selectedPlatformUserId, setSelectedPlatformUserId] = useState<string>('');
  const [newMemberRole, setNewMemberRole] = useState<ProjectRole>(ProjectRole.Freelancer);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ userId: string; displayName: string; projectId: string; projectName: string; } | null>(null);
  const [isRemovingMember, setIsRemovingMember] = useState(false);

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

  const fetchDisplayProjects = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsLoadingDisplayProjects(true);
    setErrorFetchingDisplayProjects(null);
    try {
      const { data: userProjectMemberships, error: userProjectError } = await supabase
        .from('project_members')
        .select('project_id, role')
        .eq('user_id', userId);
      if (userProjectError) throw userProjectError;
      if (!userProjectMemberships || userProjectMemberships.length === 0) {
        setDisplayProjects([]);
        setIsLoadingDisplayProjects(false);
        return;
      }
      const projectIds = userProjectMemberships.map(entry => entry.project_id);
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, slug, project_category, owner_user_id')
        .in('id', projectIds);
      if (projectsError) throw projectsError;
      const displayProjectsWithDetails = await Promise.all(projectsData?.map(async (proj) => {
        let teamLeaderObj: { display_name: string | null } | null = null;
        if (proj.owner_user_id) {
          const { data: ownerProfile, error: ownerProfileError } = await supabase
            .from('profiles').select('display_name, username').eq('id', proj.owner_user_id).single();
          if (ownerProfileError && ownerProfileError.code !== 'PGRST116') console.error('Error fetching owner profile for project', proj.name, ':', ownerProfileError);
          if (ownerProfile) teamLeaderObj = { display_name: ownerProfile.display_name || ownerProfile.username || 'Unnamed Owner' };
        }
        const { data: membersData, error: membersError } = await supabase
          .from('project_members').select('user_id, role, profiles (display_name, username)').eq('project_id', proj.id);
        if (membersError) console.error('Error fetching members for project', proj.name, ':', membersError);
        const fetchedTeamMembers = membersData?.map(m => ({
          user_id: m.user_id, role: m.role, display_name: (m.profiles as any)?.display_name || (m.profiles as any)?.username || 'Unnamed Member', project_id: proj.id
        })) || [];
        return {
          id: proj.id, name: proj.name, slug: proj.slug, icon_name: null, color_scheme: null,
          team_leader: teamLeaderObj, token: null, client_name: proj.name, project_type: proj.project_category,
          team_members: fetchedTeamMembers.map(m => ({ display_name: m.display_name})),
          project_data: { id: proj.id, name: proj.name },
        } as DisplayProject;
      }) || []);
      setDisplayProjects(displayProjectsWithDetails.filter(p => p !== null) as DisplayProject[]);
    } catch (e: any) {
      console.error('Error in fetchDisplayProjects:', e);
      setErrorFetchingDisplayProjects(`Failed to load team projects: ${e.message}`);
      setDisplayProjects([]);
    } finally {
      setIsLoadingDisplayProjects(false);
    }
  }, [supabase]);

  const fetchManagedProjects = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsLoadingProjects(true);
    setError(null);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles').select('role').eq('id', userId).single();
      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching user profile for managed projects:', profileError);
      }
      const userRole = profile?.role;
      let query = supabase.from('projects').select('id, name');
      if (userRole !== 'Admin') {
        query = query.eq('owner_user_id', userId);
      }
      const { data, error: projectsError } = await query;
      if (projectsError) throw projectsError;
      setManagedProjects(data || []);
    } catch (e: any) {
      console.error('Error fetching managed projects:', e);
      setError('Failed to load managed projects. ' + e.message);
    } finally {
      setIsLoadingProjects(false);
    }
  }, [supabase]);

  const fetchTeamMembers = useCallback(async (projectId: string | null) => {
    if (!projectId || !user) return;
    setIsLoadingTeamMembers(true);
    setError(null);
    try {
      // Step 1: Fetch basic member data (user_id, role) from project_members
      const { data: membersBasicData, error: membersError } = await supabase
        .from('project_members')
        .select('user_id, role')
        .eq('project_id', projectId);

      if (membersError) throw membersError;
      if (!membersBasicData) {
        setTeamMembers([]);
        setIsLoadingTeamMembers(false);
        return;
      }

      // Step 2: For each member, fetch their profile information
      const membersWithProfiles = await Promise.all(
        membersBasicData.map(async (member) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('display_name, username')
            .eq('id', member.user_id)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            console.warn(`Error fetching profile for user ${member.user_id}:`, profileError.message);
            return {
              ...member,
              display_name: 'Error Loading Name',
              project_id: projectId,
            };
          }
          return {
            ...member,
            display_name: profileData?.display_name || profileData?.username || 'Unnamed Member',
            project_id: projectId,
          };
        })
      );
      setTeamMembers(membersWithProfiles as TeamMember[]); // Ensure type consistency

    } catch (err: any) {
      console.error('Error fetching team members:', err);
      setError('Failed to fetch team members. ' + err.message);
      setTeamMembers([]);
    } finally {
      setIsLoadingTeamMembers(false);
    }
  }, [supabase, user]);

  const fetchPlatformUsers = useCallback(async () => {
    setIsLoadingPlatformUsers(true);
    try {
      const { data, error } = await supabase
        .from('profiles').select('id, display_name, username'); // Fetch from profiles
      if (error) throw error;
      setPlatformUsers(data?.map(p => ({ id: p.id, display_name: p.display_name || p.username || p.id })) || []);
    } catch (e: any) {
      console.error('Error fetching platform users:', e);
      setError('Failed to load users for selection. ' + e.message);
    } finally {
      setIsLoadingPlatformUsers(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (user && user.id) {
      fetchManagedProjects(user.id);
      fetchDisplayProjects(user.id);
      fetchPlatformUsers();
    }
  }, [user, fetchManagedProjects, fetchDisplayProjects, fetchPlatformUsers]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTeamMembers(selectedProjectId);
      setSelectedPlatformUserId('');
      setNewMemberRole(ProjectRole.Freelancer);
      setSuccessMessage(null);
      setError(null);
    }
  }, [selectedProjectId, fetchTeamMembers]);

  const handleProjectSelect = (projectId: string) => {
    setSelectedProjectId(projectId);
  };

  const handleAddNewMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProjectId || !selectedPlatformUserId || !newMemberRole) {
      setError('Please select a project, user, and role.');
      return;
    }
    if (!user) {
      setError('You must be logged in to add members.');
      return;
    }
    setIsAddingMember(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { data: existingMember, error: checkError } = await supabase
        .from('project_members').select('user_id').eq('project_id', selectedProjectId).eq('user_id', selectedPlatformUserId).single();
      if (checkError && checkError.code !== 'PGRST116') throw checkError;
      if (existingMember) {
        setError('This user is already a member of this project.');
        setIsAddingMember(false);
        return;
      }

      // Capitalize the first letter of the role for the database enum
      const roleForDb = newMemberRole.charAt(0).toUpperCase() + newMemberRole.slice(1);
      // Special handling for 'project_manager' if it needs to be stored differently or is not in user_role_enum
      // For now, assuming simple capitalization works for 'Freelancer', 'Client', 'Viewer', 'Admin'
      // If ProjectManager from enum is 'project_manager', this will become 'Project_manager'
      // Ensure 'Project_manager' is a valid value in user_role_enum or adjust as needed.
      // Based on user_role_enum ('Client', 'Freelancer', 'Admin'), ProjectManager might not be directly storable
      // Let's assume ProjectManager is handled by 'Admin' or a specific logic not covered here for direct DB storage.
      // We need to ensure the value matches one of 'Client', 'Freelancer', 'Admin'.
      
      let dbEnumValue = '';
      if (newMemberRole === ProjectRole.CLIENT) dbEnumValue = 'Client';
      else if (newMemberRole === ProjectRole.Freelancer) dbEnumValue = 'Freelancer';
      else if (newMemberRole === ProjectRole.Viewer) dbEnumValue = 'Viewer'; 
      // Add Admin if it's an option in this dropdown, currently ProjectManager is ProjectRole.ProjectManager ('project_manager')
      // else if (newMemberRole === ProjectRole.Admin) dbEnumValue = 'Admin'; 
      else {
        // Handle roles like ProjectManager or fallback if direct mapping is not available
        // For now, if it's not explicitly Client, Freelancer, Viewer, this will error if not in DB enum
        console.warn(`Role "${newMemberRole}" may not directly map to DB enum. Attempting to save: ${roleForDb}`);
        // Defaulting to a capitalized version, ensure this is valid in your DB enum or map appropriately.
        dbEnumValue = roleForDb; 
        if (newMemberRole === ProjectRole.ProjectManager) {
             // If ProjectManager is a concept but not in user_role_enum, decide how to store it.
             // Maybe it implies an Admin role?
             // For now, let's assume 'Admin' if ProjectManager is selected, if 'Admin' is a valid DB enum.
             // This needs clarification based on your DB enum for user_role_enum.
             // Current DB enum: Client, Freelancer, Admin. So ProjectManager is not directly storable.
             // Setting to Admin if ProjectManager is chosen, as an example.
             // You might want a distinct 'ProjectManager' in your user_role_enum.
             dbEnumValue = 'Admin'; // Example: Mapping ProjectManager to Admin for DB storage
             console.log("Mapping UI Role 'Project Manager' to DB role 'Admin'");
        }
      }

      if (!['Client', 'Freelancer', 'Admin', 'Viewer'].includes(dbEnumValue) && dbEnumValue !== 'Project_manager') { // Added Viewer just in case
        // A more robust check against actual DB enum values might be needed if roleForDb is used
        // setError(`Invalid role for database: ${dbEnumValue}`);
        // setIsAddingMember(false);
        // return;
        // For now, let the DB catch it if `dbEnumValue` is not one of the capitalized enum values.
      }

      const { error: insertError } = await supabase
        .from('project_members').insert({ project_id: selectedProjectId, user_id: selectedPlatformUserId, role: dbEnumValue as any }); // Cast to any if dbEnumValue might not perfectly match enum type hint
      if (insertError) throw insertError;
      setSuccessMessage('Member added successfully!');
      fetchTeamMembers(selectedProjectId);
      setSelectedPlatformUserId('');
      setNewMemberRole(ProjectRole.Freelancer);
    } catch (e: any) {
      console.error('Error adding new member:', e);
      setError(`Failed to add member: ${e.message}`);
    } finally {
      setIsAddingMember(false);
    }
  };

  const openRemoveConfirmModal = (member: TeamMember, projectId: string, projectName: string) => {
    if (!member || !member.user_id || !member.display_name) {
      console.error('Cannot remove member: member data is incomplete', member);
      setError('Cannot remove member due to incomplete data.');
      return;
    }
    setMemberToRemove({ userId: member.user_id, displayName: member.display_name, projectId: projectId, projectName: projectName });
    setShowRemoveConfirmModal(true);
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove || !memberToRemove.userId || !memberToRemove.projectId) {
      setError('Error: Member information or project context is missing for removal.');
      setShowRemoveConfirmModal(false);
      return;
    }
    setIsRemovingMember(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const { error: deleteError } = await supabase
        .from('project_members').delete().eq('project_id', memberToRemove.projectId).eq('user_id', memberToRemove.userId);
      if (deleteError) throw deleteError;
      setSuccessMessage(`Successfully removed ${memberToRemove.displayName} from ${memberToRemove.projectName}.`);
      fetchTeamMembers(memberToRemove.projectId);
    } catch (e: any) {
      console.error('Error removing member:', e);
      setError(`Failed to remove member: ${e.message}`);
    } finally {
      setIsRemovingMember(false);
      setShowRemoveConfirmModal(false);
      setMemberToRemove(null);
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
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
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
                                <span className={getRoleStyle(member.role)}>
                                  {member.role.toLowerCase() === 'collaborator' ? 'FREELANCER' :
                                   member.role.toLowerCase() === 'clientcontact' ? 'CLIENT' :
                                   member.role.replace(/_/g, ' ')}
                                </span>
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
