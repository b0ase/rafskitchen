'use client';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUsers, FaSpinner, FaProjectDiagram, FaUserPlus, FaAngleDown, FaAngleRight, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaQuestionCircle, FaUserShield, FaEdit, FaExternalLinkAlt, FaComments, FaTrash } from 'react-icons/fa';

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
  Owner = 'Platform Owner', // Matches myprojects
  ProjectManager = 'project_manager',
  Freelancer = 'freelancer',
  CLIENT = 'client',
  Viewer = 'viewer',
}

// --- Helper functions for styling (similar to myprojects/page.tsx) ---

// Helper function to get project role display style (ensure this is consistent with myprojects)
const getProjectRoleStyle = (role: string | ProjectRole | undefined): string => {
  if (!role) return "bg-gray-700 text-gray-200 text-xs px-2 py-0.5 font-medium whitespace-nowrap";
  
  let roleString = '';
  if (typeof role === 'string') {
    if (role in ProjectRole) {
      roleString = (ProjectRole as any)[role].toLowerCase();
    } else {
      roleString = role.toLowerCase();
    }
  } else {
    const enumKey = Object.keys(ProjectRole).find(key => (ProjectRole as any)[key] === role);
    roleString = enumKey ? (ProjectRole as any)[enumKey].toLowerCase() : '';
  }

  let styleClasses = "text-xs px-2 py-0.5 font-medium whitespace-nowrap ";

  if (roleString === ProjectRole.Owner.toLowerCase() || roleString === 'platform owner') {
    styleClasses += "bg-blue-700 text-blue-200";
  } else if (roleString === ProjectRole.Freelancer.toLowerCase()) {
    styleClasses += "bg-green-700 text-green-200";
  } else if (roleString === ProjectRole.CLIENT.toLowerCase()) {
    styleClasses += "bg-purple-700 text-purple-200";
  } else if (roleString === ProjectRole.ProjectManager.toLowerCase()) {
    styleClasses += "bg-sky-700 text-sky-200";
  } else if (roleString === ProjectRole.Viewer.toLowerCase()) {
    styleClasses += "bg-gray-600 text-gray-100";
  } else {
    styleClasses += "bg-gray-700 text-gray-200"; 
  }
  return styleClasses;
};

// Badge options (ensure these are consistent or adapt as needed)
const badge1Options = ['Pending_setup', 'Planning', 'In Development', 'Live', 'Maintenance', 'On Hold', 'Archived', 'Needs Review', 'Completed', 'Requires Update'];
const badge2Options = ['SaaS', 'Mobile App', 'Website', 'E-commerce', 'AI/ML', 'Consulting', 'Internal Tool', 'Web3/Blockchain', 'Creative Services', 'Platform', 'Service'];
const badge3Options = ['High Priority', 'Medium Priority', 'Low Priority', 'Needs Feedback', 'Client Approved', 'Phase 1', 'Phase 2', 'Experimental', 'Showcase Ready', 'Internal'];

const getBadgeStyle = (badgeValue: string | null): string => {
  return `text-xs font-semibold p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border bg-black text-gray-300 border-gray-700 hover:bg-gray-800`;
};
// --- END Helper functions ---

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
  // project_data: ManagedProject; // The original client object - No longer needed with direct project fields

  // Fields from 'projects' table, similar to ClientProject in myprojects/page.tsx
  url?: string | null;
  project_brief?: string | null;
  status?: string | null;
  badge1?: string | null;
  badge2?: string | null;
  badge3?: string | null;
  badge4?: string | null;
  badge5?: string | null;
  owner_user_id?: string; // From projects table
  currentUserRole?: string | null; // Role of the currently logged-in user for this project
  is_public?: boolean; // From projects table
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
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null); // For badge updates

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
      // Step 1: Get all project memberships for the current user, including their role.
      const { data: userProjectMemberships, error: userProjectError } = await supabase
        .from('project_members')
        .select('project_id, role') // role here is the user's role in that project
        .eq('user_id', userId);

      if (userProjectError) throw userProjectError;

      if (!userProjectMemberships || userProjectMemberships.length === 0) {
        setDisplayProjects([]);
        setIsLoadingDisplayProjects(false);
        return;
      }

      const projectIds = userProjectMemberships.map(entry => entry.project_id);
      
      // Create a map for easy lookup of user's role in a project
      const userRoleInProjectMap = new Map(userProjectMemberships.map(m => [m.project_id, m.role]));

      // Step 2: Fetch details for these projects
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, slug, project_category, owner_user_id, url, project_brief, status, badge1, badge2, badge3, badge4, badge5, is_public') // Added new fields
        .in('id', projectIds);

      if (projectsError) throw projectsError;

      const displayProjectsWithDetails = await Promise.all(projectsData?.map(async (proj) => {
        let teamLeaderObj: { display_name: string | null } | null = null;
        if (proj.owner_user_id) {
          const { data: ownerProfile, error: ownerProfileError } = await supabase
            .from('profiles').select('display_name, username').eq('id', proj.owner_user_id).single();
          if (ownerProfileError && ownerProfileError.code !== 'PGRST116') {
            console.error('Error fetching owner profile for project', proj.name, ':', ownerProfileError);
          } else if (ownerProfile) {
            teamLeaderObj = { display_name: ownerProfile.display_name || ownerProfile.username || 'Unnamed Owner' };
          }
        }

        // Fetch basic member info first (for team_members display, not for currentUserRole)
        const { data: membersBasicData, error: membersBasicError } = await supabase
          .from('project_members').select('user_id, role').eq('project_id', proj.id);

        let fetchedTeamMembersForDisplay: { display_name: string | null }[] = [];
        if (membersBasicError) {
          console.error('Error fetching basic member data for project', proj.name, ':', membersBasicError);
        } else if (membersBasicData) {
          fetchedTeamMembersForDisplay = await Promise.all(
            membersBasicData.map(async (member) => {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('display_name, username')
                .eq('id', member.user_id)
                .single();
              if (profileError && profileError.code !== 'PGRST116') {
                console.warn(`Error fetching profile for member ${member.user_id} in project ${proj.name}:`, profileError.message);
                return { display_name: 'Error Name' };    
              }
              return { display_name: profileData?.display_name || profileData?.username || 'Unnamed Member' };
            })
          );
        }
        
        // Get the current user's role for this specific project
        const currentUserRoleForThisProject = userRoleInProjectMap.get(proj.id) || null;
        // If the current user is the owner, their role should be 'Platform Owner' (or your Owner enum value)
        // This logic needs to align with how ProjectRole.Owner is defined and used for display.
        // For now, using the role from project_members or 'Platform Owner' if they are the owner_user_id.
        let finalCurrentUserRole = currentUserRoleForThisProject;
        if (proj.owner_user_id === userId) {
          // Assuming ProjectRole.Owner is 'Platform Owner' or similar.
          // This should map to the actual value of your ProjectRole.Owner enum if you want strict typing.
          finalCurrentUserRole = 'Platform Owner'; // Or ProjectRole.Owner if it's 'Platform Owner'
        }


        return {
          id: proj.id,
          name: proj.name,
          slug: proj.slug,
          // icon_name: null, // Keep for now, can be added later
          // color_scheme: null, // Keep for now, can be added later
          team_leader: teamLeaderObj,
          // token: null, // If not used, can remove
          client_name: proj.name, // Or a specific client name if different
          project_type: proj.project_category,
          team_members: fetchedTeamMembersForDisplay,
          
          // Added fields for new card style
          url: proj.url,
          project_brief: proj.project_brief,
          status: proj.status,
          badge1: proj.badge1,
          badge2: proj.badge2,
          badge3: proj.badge3,
          badge4: proj.badge4,
          badge5: proj.badge5,
          owner_user_id: proj.owner_user_id,
          is_public: proj.is_public,
          currentUserRole: finalCurrentUserRole, // Set the current user's role for this project

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
      // Determine the DB-compatible role value first
      let dbEnumValue = '';
      const roleForDbCapitalized = newMemberRole.charAt(0).toUpperCase() + newMemberRole.slice(1);

      if (newMemberRole === ProjectRole.CLIENT) dbEnumValue = 'Client';
      else if (newMemberRole === ProjectRole.Freelancer) dbEnumValue = 'Freelancer';
      else if (newMemberRole === ProjectRole.Viewer) dbEnumValue = 'Viewer';
      else if (newMemberRole === ProjectRole.ProjectManager) {
        dbEnumValue = 'Admin'; // Mapping ProjectManager UI role to Admin DB role
        console.log("Mapping UI Role 'Project Manager' to DB role 'Admin'");
      } else {
        // Fallback for any other roles, ensure they are valid in user_role_enum or add them
        dbEnumValue = roleForDbCapitalized; 
        console.warn(`Role "${newMemberRole}" is being saved as "${dbEnumValue}". Ensure this is a valid DB enum value.`);
      }

      // Check if the user is already a member of this project
      const { data: existingMember, error: checkError } = await supabase
        .from('project_members')
        .select('user_id, role') // Select role as well to see if it needs changing
        .eq('project_id', selectedProjectId)
        .eq('user_id', selectedPlatformUserId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no row found, which is fine for insert
        throw checkError;
      }

      if (existingMember) {
        // User is already a member, update their role if it's different
        if (existingMember.role === dbEnumValue) {
          setSuccessMessage('User is already a member with this role.');
        } else {
          const { error: updateError } = await supabase
            .from('project_members')
            .update({ role: dbEnumValue as any })
            .eq('project_id', selectedProjectId)
            .eq('user_id', selectedPlatformUserId);
          if (updateError) throw updateError;
          setSuccessMessage('Member role updated successfully!');
        }
      } else {
        // User is not a member, insert new record
        const { error: insertError } = await supabase
          .from('project_members').insert({ 
            project_id: selectedProjectId, 
            user_id: selectedPlatformUserId, 
            role: dbEnumValue as any 
          });
        if (insertError) throw insertError;
        setSuccessMessage('Member added successfully!');
      }
      
      fetchTeamMembers(selectedProjectId); // Refresh the member list
      setSelectedPlatformUserId(''); // Reset user selection
      setNewMemberRole(ProjectRole.Freelancer); // Reset role selection

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

  // Badge change handler for DisplayProjects (similar to myprojects/page.tsx)
  const handleDisplayProjectBadgeChange = async (projectId: string, badgeKey: 'badge1' | 'badge2' | 'badge3' | 'badge4' | 'badge5', newValue: string | null) => {
    if (!user) return;
    setUpdatingItemId(projectId);
    const payload: { [key: string]: string | null } = {};
    payload[badgeKey] = newValue === '' ? null : newValue;

    const { error: updateError } = await supabase
      .from('projects')
      .update(payload)
      .eq('id', projectId);

    if (updateError) {
      console.error(`Error updating ${badgeKey} for project ${projectId}:`, updateError);
      setError(`Failed to update ${badgeKey}.`);
    } else {
      setDisplayProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === projectId ? { ...p, [badgeKey]: newValue === '' ? null : newValue } : p
        )
      );
    }
    setUpdatingItemId(null);
  };

  if (loadingUser || (user && isLoadingProjects && isLoadingDisplayProjects)) {
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
      <main className="flex-grow container mx-auto px-4 pb-12 md:pb-16">
        {error && (
          <div className="text-red-500 bg-red-900/30 p-3 rounded-md mt-4">{error}</div>
        )}

        {/* User Teams Section - UPDATED to Display Projects */}
        {loadingUser && (
          <div className="flex items-center justify-center h-screen">
            <FaSpinner className="animate-spin text-4xl text-sky-500" />
          </div>
        )}

        {!loadingUser && user && (
          <div className="mt-0">
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
              <div className="space-y-6 mt-6">
                {displayProjects.map((project) => (
                  <div 
                    key={project.id} 
                    className="p-6 shadow-lg rounded-lg hover:border-gray-500 transition-colors duration-300 relative border bg-black border-gray-700"
                  >
                    {updatingItemId === project.id && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg z-[101]">
                        <FaSpinner className="animate-spin text-sky-500 text-3xl" />
                      </div>
                    )}

                    {/* Header Section */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                      <div className="flex items-center gap-x-3 flex-wrap">
                        <Link href={`/myprojects/${project.slug}`} legacyBehavior>
                          <a className="text-xl font-semibold text-sky-400 hover:text-sky-300 hover:underline">
                            {project.name}
                          </a>
                        </Link>
                        {/* Edit link can point to the same place as /myprojects if desired */}
                        <Link href={`/myprojects/${project.slug}/edit`} passHref legacyBehavior>
                          <a className="text-gray-400 hover:text-sky-400 transition-colors" title="Edit Project Settings">
                            <FaEdit className="w-4 h-4" />
                          </a>
                        </Link>
                        {project.currentUserRole && (
                          <span className={getProjectRoleStyle(project.currentUserRole)}>
                            {project.currentUserRole === ProjectRole.Owner ? 'Platform Owner' :
                             project.currentUserRole === ProjectRole.Freelancer ? 'FREELANCER' :
                             project.currentUserRole === ProjectRole.CLIENT ? 'CLIENT' :
                             project.currentUserRole === ProjectRole.ProjectManager ? 'PROJECT MANAGER' :
                             project.currentUserRole === ProjectRole.Viewer ? 'VIEWER' :
                             (typeof project.currentUserRole === 'string' ? project.currentUserRole.replace(/_/g, ' ').toUpperCase() : 'MEMBER')}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Primary Action Buttons */}
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-4">
                      <Link href={`/myprojects/${project.slug}`} legacyBehavior>
                        <a className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-700 text-sm font-medium shadow-sm text-gray-300 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900">
                          <FaProjectDiagram className="mr-1.5 h-4 w-4" /> Open Project Page
                        </a>
                      </Link>
                      {project.url && (
                        <a 
                          href={project.url.startsWith('http') ? project.url : `https://${project.url}`} 
                          target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-700 text-sm font-medium shadow-sm text-gray-300 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-slate-900"
                        >
                          <FaExternalLinkAlt className="mr-1.5 h-4 w-4" /> View live site
                        </a>
                      )}
                      <button 
                          onClick={() => alert(`Invite members to ${project.name}`)} // Placeholder
                          className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-700 text-sm font-medium shadow-sm text-gray-300 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-slate-900"
                      >
                          <FaUserPlus className="mr-1.5 h-4 w-4" /> Invite Members
                      </button>
                      <button 
                          onClick={() => alert(`Open team chat for ${project.name}`)} // Placeholder
                          className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-700 text-sm font-medium shadow-sm text-gray-300 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900"
                      >
                          <FaComments className="mr-1.5 h-4 w-4" /> Open Team Chat
                      </button>
                    </div>

                    {/* Badges/Controls Section */}
                    <div className="mb-4 space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                      {[
                        { key: 'badge1', options: badge1Options, value: project.badge1, defaultLabel: 'Status...' },
                        { key: 'badge2', options: badge2Options, value: project.badge2, defaultLabel: 'Type...' },
                        { key: 'badge3', options: badge3Options, value: project.badge3, defaultLabel: 'Priority...' },
                        { key: 'badge4', options: badge2Options, value: project.badge4, defaultLabel: 'Badge 4...' }, // Assuming badge4 uses badge2Options
                        { key: 'badge5', options: badge2Options, value: project.badge5, defaultLabel: 'Badge 5...' }, // Assuming badge5 uses badge2Options
                      ].map(badgeInfo => (
                        <div key={badgeInfo.key} className="flex-shrink-0">
                          <label htmlFor={`${badgeInfo.key}-${project.id}`} className="sr-only">{badgeInfo.defaultLabel}</label>
                          <select 
                            id={`${badgeInfo.key}-${project.id}`} 
                            value={badgeInfo.value || ''} 
                            onChange={(e) => handleDisplayProjectBadgeChange(project.id, badgeInfo.key as 'badge1' | 'badge2' | 'badge3' | 'badge4' | 'badge5', e.target.value)}
                            disabled={updatingItemId === project.id}
                            className={`${getBadgeStyle(badgeInfo.value)} text-xs p-1 min-w-[90px]`}
                          >
                            <option value="">{badgeInfo.defaultLabel}</option>
                            {badgeInfo.options.map(opt => <option key={opt} value={opt} className="bg-gray-800 text-gray-300">{opt}</option>)}
                          </select>
                        </div>
                      ))}
                    </div>
                    
                    {/* Footer/Description Section */}
                    {project.project_brief ? (
                      <p className="text-sm text-gray-400 prose prose-sm prose-invert max-w-none line-clamp-2">
                        {project.project_brief}
                      </p>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No project brief available.</p>
                    )}

                    {/* Delete button - RLS should control if this project appears. Admin/Owner can delete. */}
                    {/* This delete logic would need to be wired up like in myprojects/page.tsx */}
                    {/* For now, only show if current user is the project owner */}
                    {project.owner_user_id === user?.id && (
                        <div className="absolute bottom-6 right-6"> 
                        <button 
                            onClick={(e) => {
                                e.stopPropagation(); 
                                // openDeleteModal(project.id, project.name); // Wire up delete modal
                                alert(`Placeholder: Delete project ${project.name}`);
                            }}
                            className="inline-flex items-center justify-center px-2 py-1 border border-gray-700 text-xs font-medium shadow-sm text-gray-400 bg-black hover:text-red-500 hover:border-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900"
                            title="Delete Project"
                        >
                            <FaTrash className="mr-1 h-3 w-3" /> Delete
                        </button>
                        </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Managed Projects Section - Kept as is for now */}
        <div className="mt-12">
          {/* <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-300">Managed Projects</h2>
          </div> */}
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
                    onClick={() => {
                      // If this project is already selected, deselect it (collapse).
                      // Otherwise, select this project (expand).
                      setSelectedProjectId(prevSelectedProjectId => 
                        prevSelectedProjectId === project.id ? null : project.id
                      );
                    }}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer"
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
                                <span className={getProjectRoleStyle(member.role)}>
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
