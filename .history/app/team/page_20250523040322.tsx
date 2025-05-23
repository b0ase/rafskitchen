'use client';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// ADDED/UPDATED FaEdit, FaExternalLinkAlt, FaComments, FaTrash
import {
  FaUsers, FaSpinner, FaProjectDiagram, FaUserPlus, FaAngleDown, FaAngleRight,
  FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaQuestionCircle,
  FaUserShield, FaEdit, FaExternalLinkAlt, FaComments, FaTrash
} from 'react-icons/fa';

// --- BEGIN NEW/UPDATED HELPERS AND ENUMS ---

// ProjectRole enum - MUST BE IDENTICAL to myprojects/page.tsx for consistency
enum ProjectRole {
  Owner = 'Platform Owner',
  ProjectManager = 'project_manager',
  Freelancer = 'freelancer',
  CLIENT = 'client',
  Viewer = 'viewer',
}

// Helper function to get project role display style (consistent with myprojects)
const getProjectRoleStyle = (role: string | ProjectRole | undefined): string => {
  if (!role) return "bg-gray-700 text-gray-200 text-xs px-2 py-0.5 font-medium whitespace-nowrap";
  
  let roleString = '';
  if (typeof role === 'string') {
    if (role in ProjectRole) { // Check if string is an enum key
      roleString = (ProjectRole as any)[role].toLowerCase();
    } else { // Assume it's an enum value or direct role string
      roleString = role.toLowerCase();
    }
  } else { // Handle enum type if passed directly (should be rare if state is string)
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
    styleClasses += "bg-gray-700 text-gray-200"; // Fallback
  }
  return styleClasses;
};


// Badge options
const badge1Options = ['Pending_setup', 'Planning', 'In Development', 'Live', 'Maintenance', 'On Hold', 'Archived', 'Needs Review', 'Completed', 'Requires Update'];
const badge2Options = ['SaaS', 'Mobile App', 'Website', 'E-commerce', 'AI/ML', 'Consulting', 'Internal Tool', 'Web3/Blockchain', 'Creative Services', 'Platform', 'Service'];
const badge3Options = ['High Priority', 'Medium Priority', 'Low Priority', 'Needs Feedback', 'Client Approved', 'Phase 1', 'Phase 2', 'Experimental', 'Showcase Ready', 'Internal'];

const getBadgeStyle = (badgeValue: string | null): string => {
  return `text-xs font-semibold p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border bg-black text-gray-300 border-gray-700 hover:bg-gray-800`;
};

// --- END NEW/UPDATED HELPERS AND ENUMS ---


// Interface for projects managed by the user (for the collapsible list)
interface ManagedProject {
  id: string;
  name: string;
}

// Interface for team members in the collapsible list
interface TeamMember {
  user_id: string;
  role: string;
  email?: string;
  display_name?: string;
  project_id?: string;
}

// For the dropdown of all platform users
interface PlatformUser {
  id: string;
  display_name: string;
}

// This interface is for the cards at the top, listing projects the user is associated with
interface DisplayProject {
  id: string;
  name: string;
  slug: string | null;
  // Fields from 'projects' table, similar to ClientProject in myprojects/page.tsx
  url?: string | null;
  project_brief?: string | null;
  status?: string | null;
  badge1?: string | null;
  badge2?: string | null;
  badge3?: string | null;
  badge4?: string | null;
  badge5?: string | null;
  owner_user_id?: string;
  currentUserRole?: string | null; // Logged-in user's role for this specific project
  is_public?: boolean;
  project_category?: string | null; // Retained from previous version for potential use
}

export default function TeamPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // For Vercel-style cards at the top (projects user is part of)
  const [displayProjects, setDisplayProjects] = useState<DisplayProject[]>([]);
  const [isLoadingDisplayProjects, setIsLoadingDisplayProjects] = useState(false);
  const [errorFetchingDisplayProjects, setErrorFetchingDisplayProjects] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null); // For badge updates on DisplayProject cards

  // For collapsible "Managed Projects" list
  const [managedProjects, setManagedProjects] = useState<ManagedProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false); // Loading state for managed projects list
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null); // Currently expanded managed project
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]); // Members of the expanded managed project
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false);

  // For "Add New Member" form
  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>([]);
  const [isLoadingPlatformUsers, setIsLoadingPlatformUsers] = useState(false);
  const [selectedPlatformUserId, setSelectedPlatformUserId] = useState<string>('');
  const [newMemberRole, setNewMemberRole] = useState<ProjectRole>(ProjectRole.Freelancer);
  const [isAddingMember, setIsAddingMember] = useState(false);

  // Modals and messages
  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ userId: string; displayName: string; projectId: string; projectName: string; } | null>(null);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  const [error, setError] = useState<string | null>(null); // General error for forms
  const [successMessage, setSuccessMessage] = useState<string | null>(null);


  useEffect(() => {
    const getUser = async () => {
      setLoadingUser(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
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
      const userRoleInProjectMap = new Map(userProjectMemberships.map(m => [m.project_id, m.role]));

      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, slug, project_category, owner_user_id, url, project_brief, status, badge1, badge2, badge3, badge4, badge5, is_public')
        .in('id', projectIds);

      if (projectsError) throw projectsError;
      if (!projectsData) {
        setDisplayProjects([]);
        setIsLoadingDisplayProjects(false);
        return;
      }
      
      const projectsToDisplay = projectsData.map(proj => {
        let finalCurrentUserRole = userRoleInProjectMap.get(proj.id) || null;
        if (proj.owner_user_id === userId) {
          finalCurrentUserRole = ProjectRole.Owner; // Enum value
        }
        return {
          id: proj.id,
          name: proj.name,
          slug: proj.slug,
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
          currentUserRole: finalCurrentUserRole,
          project_category: proj.project_category,
        } as DisplayProject;
      });

      setDisplayProjects(projectsToDisplay);
    } catch (e: any) {
      setErrorFetchingDisplayProjects(`Failed to load your projects: ${e.message}`);
      setDisplayProjects([]);
    } finally {
      setIsLoadingDisplayProjects(false);
    }
  }, [supabase]);

  const fetchManagedProjects = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsLoadingProjects(true); // Loading state for the "Managed Projects" list
    setError(null);
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles').select('role').eq('id', userId).single();
      if (profileError && profileError.code !== 'PGRST116') console.error('Error fetching user profile:', profileError);
      
      const userAppRole = profile?.role;
      let query = supabase.from('projects').select('id, name');
      if (userAppRole !== 'Admin') { // Assuming 'Admin' is a role in your 'profiles' table
        query = query.eq('owner_user_id', userId);
      }
      const { data, error: projectsError } = await query;
      if (projectsError) throw projectsError;
      setManagedProjects(data || []);
    } catch (e: any) {
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
      const { data: membersBasicData, error: membersError } = await supabase
        .from('project_members').select('user_id, role').eq('project_id', projectId);
      if (membersError) throw membersError;
      if (!membersBasicData) {
        setTeamMembers([]);
        setIsLoadingTeamMembers(false);
        return;
      }
      const membersWithProfiles = await Promise.all(
        membersBasicData.map(async (member) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles').select('display_name, username').eq('id', member.user_id).single();
          if (profileError && profileError.code !== 'PGRST116') {
            console.warn(`Error fetching profile for user ${member.user_id}:`, profileError.message);
            return { ...member, display_name: 'Error Loading Name', project_id: projectId };
          }
          return { ...member, display_name: profileData?.display_name || profileData?.username || 'Unnamed Member', project_id: projectId };
        })
      );
      setTeamMembers(membersWithProfiles as TeamMember[]);
    } catch (err: any) {
      setError('Failed to fetch team members. ' + err.message);
      setTeamMembers([]);
    } finally {
      setIsLoadingTeamMembers(false);
    }
  }, [supabase, user]);

  const fetchPlatformUsers = useCallback(async () => {
    setIsLoadingPlatformUsers(true);
    try {
      const { data, error } = await supabase.from('profiles').select('id, display_name, username');
      if (error) throw error;
      setPlatformUsers(data?.map(p => ({ id: p.id, display_name: p.display_name || p.username || p.id })) || []);
    } catch (e: any) {
      setError('Failed to load users for selection. ' + e.message);
    } finally {
      setIsLoadingPlatformUsers(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (user && user.id) {
      fetchDisplayProjects(user.id); // For cards at the top
      fetchManagedProjects(user.id); // For collapsible list
      fetchPlatformUsers(); // For "Add Member" dropdown
    }
  }, [user, fetchDisplayProjects, fetchManagedProjects, fetchPlatformUsers]);

  useEffect(() => {
    if (selectedProjectId) { // When a managed project is expanded
      fetchTeamMembers(selectedProjectId);
      setSelectedPlatformUserId('');
      setNewMemberRole(ProjectRole.Freelancer);
      setSuccessMessage(null);
      setError(null);
    }
  }, [selectedProjectId, fetchTeamMembers]);

  const handleDisplayProjectBadgeChange = async (projectId: string, badgeKey: 'badge1' | 'badge2' | 'badge3' | 'badge4' | 'badge5', newValue: string | null) => {
    if (!user) return;
    setUpdatingItemId(projectId);
    const payload: { [key: string]: string | null } = { [badgeKey]: newValue === '' ? null : newValue };
    const { error: updateError } = await supabase.from('projects').update(payload).eq('id', projectId);
    if (updateError) {
      setError(`Failed to update ${badgeKey}.`);
    } else {
      setDisplayProjects(prev => prev.map(p => p.id === projectId ? { ...p, [badgeKey]: newValue === '' ? null : newValue } : p));
    }
    setUpdatingItemId(null);
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
      let dbEnumValue = '';
      if (newMemberRole === ProjectRole.CLIENT) dbEnumValue = 'Client';
      else if (newMemberRole === ProjectRole.Freelancer) dbEnumValue = 'Freelancer';
      else if (newMemberRole === ProjectRole.Viewer) dbEnumValue = 'Viewer';
      else if (newMemberRole === ProjectRole.ProjectManager) dbEnumValue = 'Admin';
      else dbEnumValue = newMemberRole.charAt(0).toUpperCase() + newMemberRole.slice(1);

      const { data: existingMember, error: checkError } = await supabase
        .from('project_members').select('user_id, role').eq('project_id', selectedProjectId).eq('user_id', selectedPlatformUserId).single();
      if (checkError && checkError.code !== 'PGRST116') throw checkError;

      if (existingMember) {
        if (existingMember.role === dbEnumValue) {
          setSuccessMessage('User is already a member with this role.');
        } else {
          const { error: updateError } = await supabase.from('project_members').update({ role: dbEnumValue as any }).eq('project_id', selectedProjectId).eq('user_id', selectedPlatformUserId);
          if (updateError) throw updateError;
          setSuccessMessage('Member role updated successfully!');
        }
      } else {
        const { error: insertError } = await supabase.from('project_members').insert({ project_id: selectedProjectId, user_id: selectedPlatformUserId, role: dbEnumValue as any });
        if (insertError) throw insertError;
        setSuccessMessage('Member added successfully!');
      }
      fetchTeamMembers(selectedProjectId);
      setSelectedPlatformUserId('');
      setNewMemberRole(ProjectRole.Freelancer);
    } catch (e: any) {
      setError(`Failed to add/update member: ${e.message}`);
    } finally {
      setIsAddingMember(false);
    }
  };

  const openRemoveConfirmModal = (member: TeamMember, projectId: string, projectName: string) => {
    if (!member || !member.user_id || !member.display_name) {
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
      const { error: deleteError } = await supabase.from('project_members').delete().eq('project_id', memberToRemove.projectId).eq('user_id', memberToRemove.userId);
      if (deleteError) throw deleteError;
      setSuccessMessage(`Successfully removed ${memberToRemove.displayName} from ${memberToRemove.projectName}.`);
      fetchTeamMembers(memberToRemove.projectId);
    } catch (e: any) {
      setError(`Failed to remove member: ${e.message}`);
    } finally {
      setIsRemovingMember(false);
      setShowRemoveConfirmModal(false);
      setMemberToRemove(null);
    }
  };

  if (loadingUser || (user && isLoadingDisplayProjects && isLoadingProjects)) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-sky-500" />
        <p className="ml-3 text-xl">Loading team data...</p>
      </div>
    );
  }

  if (!user && !loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <p className="text-xl mb-4">You need to be logged in to view your team.</p>
        <Link href="/login?redirectedFrom=/team" className="text-sky-400 hover:text-sky-300">Go to Login</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 pb-12 md:pb-16">
        {error && (<div className="text-red-500 bg-red-900/30 p-3 rounded-md mt-4">{error}</div>)}
        {successMessage && (<div className="text-green-500 bg-green-900/30 p-3 rounded-md mt-4">{successMessage}</div>)}

        {/* Vercel-style cards for projects user is part of */}
        <div className="mt-0">
          {isLoadingDisplayProjects && (
            <div className="flex justify-center items-center py-10"><FaSpinner className="animate-spin text-3xl text-sky-400" /><p className="ml-3">Loading projects...</p></div>
          )}
          {errorFetchingDisplayProjects && (
            <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-md"><p><strong>Error:</strong> {errorFetchingDisplayProjects}</p></div>
          )}
          {!isLoadingDisplayProjects && !errorFetchingDisplayProjects && displayProjects.length === 0 && (
            <div className="py-10 text-center"><FaProjectDiagram className="mx-auto text-5xl text-gray-500 mb-4" /><p>You are not associated with any projects yet.</p></div>
          )}
          {!isLoadingDisplayProjects && !errorFetchingDisplayProjects && displayProjects.length > 0 && (
            <div className="space-y-6 mt-6">
              {displayProjects.map((project) => (
                <div key={project.id} className="p-6 shadow-lg rounded-lg hover:border-gray-500 transition-colors duration-300 relative border bg-black border-gray-700">
                  {updatingItemId === project.id && (
                    <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg z-[101]"><FaSpinner className="animate-spin text-sky-500 text-3xl" /></div>
                  )}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <div className="flex items-center gap-x-3 flex-wrap">
                      <Link href={`/myprojects/${project.slug || project.id}`} legacyBehavior>
                        <a className="text-xl font-semibold text-sky-400 hover:text-sky-300 hover:underline">{project.name}</a>
                      </Link>
                      <Link href={`/myprojects/${project.slug || project.id}/edit`} passHref legacyBehavior>
                        <a className="text-gray-400 hover:text-sky-400 transition-colors" title="Edit Project Settings"><FaEdit className="w-4 h-4" /></a>
                      </Link>
                      {project.currentUserRole && (
                        <span className={getProjectRoleStyle(project.currentUserRole as ProjectRole | string)}>
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
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-4">
                    <Link href={`/myprojects/${project.slug || project.id}`} legacyBehavior>
                      <a className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-700 text-sm font-medium shadow-sm text-gray-300 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900">
                        <FaProjectDiagram className="mr-1.5 h-4 w-4" /> Open Project Page
                      </a>
                    </Link>
                    {project.url && (
                      <a href={project.url.startsWith('http') ? project.url : `https://${project.url}`} target="_blank" rel="noopener noreferrer"
                         className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-700 text-sm font-medium shadow-sm text-gray-300 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-slate-900">
                        <FaExternalLinkAlt className="mr-1.5 h-4 w-4" /> View live site
                      </a>
                    )}
                    <button onClick={() => alert(`Invite members to ${project.name}`)}
                            className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-700 text-sm font-medium shadow-sm text-gray-300 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-slate-900">
                      <FaUserPlus className="mr-1.5 h-4 w-4" /> Invite Members
                    </button>
                    <button onClick={() => alert(`Open team chat for ${project.name}`)}
                            className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-700 text-sm font-medium shadow-sm text-gray-300 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900">
                      <FaComments className="mr-1.5 h-4 w-4" /> Open Team Chat
                    </button>
                  </div>
                  <div className="mb-4 space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                    {[
                      { key: 'badge1', options: badge1Options, value: project.badge1, defaultLabel: 'Status...' },
                      { key: 'badge2', options: badge2Options, value: project.badge2, defaultLabel: 'Type...' },
                      { key: 'badge3', options: badge3Options, value: project.badge3, defaultLabel: 'Priority...' },
                      { key: 'badge4', options: badge2Options, value: project.badge4, defaultLabel: 'Badge 4...' },
                      { key: 'badge5', options: badge2Options, value: project.badge5, defaultLabel: 'Badge 5...' },
                    ].map(badgeInfo => (
                      <div key={badgeInfo.key} className="flex-shrink-0">
                        <label htmlFor={`${badgeInfo.key}-${project.id}`} className="sr-only">{badgeInfo.defaultLabel}</label>
                        <select
                          id={`${badgeInfo.key}-${project.id}`}
                          value={badgeInfo.value || ''}
                          onChange={(e) => handleDisplayProjectBadgeChange(project.id, badgeInfo.key as 'badge1' | 'badge2' | 'badge3' | 'badge4' | 'badge5', e.target.value)}
                          disabled={updatingItemId === project.id}
                          className={`${getBadgeStyle(badgeInfo.value ?? null)} text-xs p-1 min-w-[90px]`} // LINTER FIX: badgeInfo.value ?? null
                        >
                          <option value="">{badgeInfo.defaultLabel}</option>
                          {badgeInfo.options.map(opt => <option key={opt} value={opt} className="bg-gray-800 text-gray-300">{opt}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  {project.project_brief ? (
                    <p className="text-sm text-gray-400 prose prose-sm prose-invert max-w-none line-clamp-2">{project.project_brief}</p>
                  ) : (
                    <p className="text-sm text-gray-500 italic">No project brief available.</p>
                  )}
                  {project.owner_user_id === user?.id && (
                    <div className="absolute bottom-6 right-6">
                      <button onClick={(e) => { e.stopPropagation(); alert(`Placeholder: Delete project ${project.name}`);}}
                              className="inline-flex items-center justify-center px-2 py-1 border border-gray-700 text-xs font-medium shadow-sm text-gray-400 bg-black hover:text-red-500 hover:border-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900"
                              title="Delete Project">
                        <FaTrash className="mr-1 h-3 w-3" /> Delete
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collapsible Managed Projects Section */}
        <div className="mt-12">
          {isLoadingProjects && <div className="flex justify-center py-4"><FaSpinner className="animate-spin text-sky-500 text-2xl" /></div>}
          {!isLoadingProjects && managedProjects.length === 0 && user && (
            <div className="bg-gray-900 p-6 border border-gray-800 shadow-lg rounded-md">
              <p className="text-gray-500 italic">You are not managing any projects currently.</p>
            </div>
          )}
          {!isLoadingProjects && managedProjects.length > 0 && (
            <div className="space-y-4">
              {managedProjects.map(project => (
                <div key={project.id} className="bg-gray-900 border border-gray-800 shadow-lg rounded-md">
                  <button
                    onClick={() => setSelectedProjectId(prev => prev === project.id ? null : project.id)}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer"
                  >
                    <span className="text-base font-medium text-gray-400 flex items-center">
                      <FaProjectDiagram className="mr-3 text-sky-500" />{project.name || 'Unnamed Project'}
                    </span>
                    {selectedProjectId === project.id ? <FaAngleDown className="text-gray-400" /> : <FaAngleRight className="text-gray-400" />}
                  </button>
                  {selectedProjectId === project.id && (
                    <div className="border-t border-gray-700 p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Team Members</h3>
                      {isLoadingTeamMembers && <div className="flex justify-center py-2"><FaSpinner className="animate-spin text-sky-500 text-xl" /></div>}
                      {!isLoadingTeamMembers && teamMembers.length === 0 && (<p className="text-gray-500 italic">No team members assigned to this project yet.</p>)}
                      {!isLoadingTeamMembers && teamMembers.length > 0 && (
                        <ul className="space-y-3 mb-6">
                          {teamMembers.map(member => (
                            <li key={member.user_id} className="flex justify-between items-center p-2.5 bg-gray-800 rounded-md shadow">
                              <div>
                                <span className="font-normal text-gray-500 text-xs">{member.display_name || member.user_id}</span>
                                <span className={getProjectRoleStyle(member.role as ProjectRole | string)}>
                                  {/* Display logic for roles from managed project section */}
                                  {member.role.toLowerCase() === 'client' ? 'CLIENT' : 
                                   member.role.toLowerCase() === 'freelancer' ? 'FREELANCER' : 
                                   member.role.toLowerCase() === 'admin' ? 'ADMIN' : 
                                   member.role.replace(/_/g, ' ').toUpperCase()}
                                </span>
                              </div>
                              {user?.id !== member.user_id && (
                                <button onClick={() => openRemoveConfirmModal(member, project.id, project.name || 'Unnamed Project')}
                                        className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/50 hover:border-red-400 transition-colors"
                                        disabled={isAddingMember || isLoadingTeamMembers || isRemovingMember}>Remove</button>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-6 pt-6 border-t border-gray-700">
                        <h4 className="text-lg font-semibold text-white mb-4">Add/Update Member for "{project.name}"</h4>
                        <form onSubmit={handleAddNewMember} className="space-y-4">
                          <div>
                            <label htmlFor={`platformUserSelect-${project.id}`} className="block text-sm font-medium text-gray-300 mb-1">Select User</label>
                            {isLoadingPlatformUsers ? <FaSpinner className="animate-spin" /> : (
                              <select id={`platformUserSelect-${project.id}`} value={selectedPlatformUserId} onChange={(e) => setSelectedPlatformUserId(e.target.value)}
                                      className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm" required>
                                <option value="" disabled>-- Select a user --</option>
                                {platformUsers.filter(pUser => pUser.id !== user?.id).map(pUser => (<option key={pUser.id} value={pUser.id}>{pUser.display_name}</option>))}
                              </select>
                            )}
                          </div>
                          <div>
                            <label htmlFor={`newMemberRole-${project.id}`} className="block text-sm font-medium text-gray-300 mb-1">Assign Role</label>
                            <select id={`newMemberRole-${project.id}`} value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value as ProjectRole)}
                                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-md p-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm">
                              {Object.values(ProjectRole).map(role => (<option key={role} value={role}>{role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>))}
                            </select>
                          </div>
                          <button type="submit" disabled={isAddingMember || isLoadingPlatformUsers}
                                  className="w-full flex justify-center items-center bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isAddingMember ? <FaSpinner className="animate-spin mr-2" /> : <FaUserPlus className="mr-2" />} Add/Update Member
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

      {showRemoveConfirmModal && memberToRemove && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl border border-gray-700 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Confirm Removal</h3>
            <p className="text-gray-300 mb-2">Are you sure you want to remove <strong className="text-sky-400 mx-1">{memberToRemove.displayName}</strong> from the project <strong className="text-sky-400 mx-1">"{memberToRemove.projectName}"</strong>?</p>
            <p className="text-xs text-orange-400 mb-6">This action will revoke their access to this project.</p>
            {error && <p className="text-red-400 bg-red-900/30 p-2 rounded-md mb-4 text-sm">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button onClick={() => { setShowRemoveConfirmModal(false); setMemberToRemove(null); setError(null); }} disabled={isRemovingMember}
                      className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50">Cancel</button>
              <button onClick={handleRemoveMember} disabled={isRemovingMember}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 flex items-center">
                {isRemovingMember ? <FaSpinner className="animate-spin mr-2" /> : null} Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}