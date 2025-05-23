'use client';

import React, { useState, useEffect, useCallback, FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FaUsers, FaSpinner, FaProjectDiagram, FaUserPlus, FaAngleDown, FaAngleRight,
  FaEdit, FaExternalLinkAlt, FaComments, FaTrash
} from 'react-icons/fa';

// --- BEGIN HELPERS AND ENUMS ---

enum ProjectRole {
  Owner = 'Platform Owner',
  ProjectManager = 'project_manager',
  Freelancer = 'freelancer',
  CLIENT = 'client',
  Viewer = 'viewer',
}

const getProjectRoleStyle = (role: string | ProjectRole | undefined): string => {
  if (!role) return "bg-gray-700 text-gray-200 text-xs px-2 py-0.5 font-medium whitespace-nowrap";
  let roleString = '';
  if (typeof role === 'string') {
    roleString = (ProjectRole as any)[role]?.toLowerCase() || role.toLowerCase();
  } else {
    const enumKey = Object.keys(ProjectRole).find(key => (ProjectRole as any)[key] === role);
    roleString = enumKey ? (ProjectRole as any)[enumKey].toLowerCase() : '';
  }
  let c = "text-xs px-2 py-0.5 font-medium whitespace-nowrap ";
  if (roleString === ProjectRole.Owner.toLowerCase() || roleString === 'platform owner') c += "bg-blue-700 text-blue-200";
  else if (roleString === ProjectRole.Freelancer.toLowerCase()) c += "bg-green-700 text-green-200";
  else if (roleString === ProjectRole.CLIENT.toLowerCase()) c += "bg-purple-700 text-purple-200";
  else if (roleString === ProjectRole.ProjectManager.toLowerCase()) c += "bg-sky-700 text-sky-200";
  else if (roleString === ProjectRole.Viewer.toLowerCase()) c += "bg-gray-600 text-gray-100";
  else c += "bg-gray-700 text-gray-200";
  return c;
};

const badge1Options = ['Pending_setup', 'Planning', 'In Development', 'Live', 'Maintenance', 'On Hold', 'Archived', 'Needs Review', 'Completed', 'Requires Update'];
const badge2Options = ['SaaS', 'Mobile App', 'Website', 'E-commerce', 'AI/ML', 'Consulting', 'Internal Tool', 'Web3/Blockchain', 'Creative Services', 'Platform', 'Service'];
const badge3Options = ['High Priority', 'Medium Priority', 'Low Priority', 'Needs Feedback', 'Client Approved', 'Phase 1', 'Phase 2', 'Experimental', 'Showcase Ready', 'Internal'];

const getBadgeStyle = (_badgeValue: string | null): string => {
  return `text-xs font-semibold p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border bg-black text-gray-300 border-gray-700 hover:bg-gray-800`;
};

// --- END HELPERS AND ENUMS ---

interface ManagedProject { // For collapsible admin list
  id: string;
  name: string;
}

interface TeamMember { // For members within an expanded managed project
  user_id: string;
  role: string;
  display_name?: string;
  project_id?: string;
}

interface PlatformUser { // For user selection dropdown
  id: string;
  display_name: string;
}

interface DisplayProject { // For Vercel-style cards at the top
  id: string;
  name: string;
  slug: string | null;
  url?: string | null;
  project_brief?: string | null;
  status?: string | null;
  badge1?: string | null;
  badge2?: string | null;
  badge3?: string | null;
  badge4?: string | null;
  badge5?: string | null;
  owner_user_id?: string;
  currentUserRole?: string | null;
  is_public?: boolean;
  project_category?: string | null;
}

export default function TeamPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [displayProjects, setDisplayProjects] = useState<DisplayProject[]>([]);
  const [isLoadingDisplayProjects, setIsLoadingDisplayProjects] = useState(false);
  const [errorFetchingDisplayProjects, setErrorFetchingDisplayProjects] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

  const [managedProjects, setManagedProjects] = useState<ManagedProject[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [isLoadingTeamMembers, setIsLoadingTeamMembers] = useState(false);

  const [platformUsers, setPlatformUsers] = useState<PlatformUser[]>([]);
  const [isLoadingPlatformUsers, setIsLoadingPlatformUsers] = useState(false);
  const [selectedPlatformUserId, setSelectedPlatformUserId] = useState<string>('');
  const [newMemberRole, setNewMemberRole] = useState<ProjectRole>(ProjectRole.Freelancer);
  const [isAddingMember, setIsAddingMember] = useState(false);

  const [showRemoveConfirmModal, setShowRemoveConfirmModal] = useState(false);
  const [memberToRemove, setMemberToRemove] = useState<{ userId: string; displayName: string; projectId: string; projectName: string; } | null>(null);
  const [isRemovingMember, setIsRemovingMember] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      setLoadingUser(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setUser(session.user);
      else router.push('/login?redirectedFrom=/team');
      setLoadingUser(false);
    };
    getUser();
  }, [supabase, router]);

  const fetchDisplayProjects = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsLoadingDisplayProjects(true);
    setErrorFetchingDisplayProjects(null);
    try {
      const { data: accessibleProjectsData, error: projectsError } = await supabase
        .from('projects')
        .select('id, name, slug, project_category, owner_user_id, url, project_brief, status, badge1, badge2, badge3, badge4, badge5, is_public');
      if (projectsError) throw projectsError;
      if (!accessibleProjectsData) { setDisplayProjects([]); setIsLoadingDisplayProjects(false); return; }

      const projectsToDisplayPromises = accessibleProjectsData.map(async (proj) => {
        let userRoleForThisProject: string | null = null;
        if (proj.owner_user_id === userId) {
          userRoleForThisProject = ProjectRole.Owner;
        } else {
          const { data: memberRoleData, error: memberRoleError } = await supabase
            .from('project_members').select('role').eq('project_id', proj.id).eq('user_id', userId).single();
          if (memberRoleError && memberRoleError.code !== 'PGRST116') console.warn(`Error fetching member role for ${proj.id}:`, memberRoleError.message);
          else if (memberRoleData) userRoleForThisProject = memberRoleData.role;
        }
        if (proj.owner_user_id === userId || userRoleForThisProject) {
          return { ...proj, currentUserRole: userRoleForThisProject } as DisplayProject;
        }
        return null;
      });
      const resolvedProjects = (await Promise.all(projectsToDisplayPromises)).filter(p => p !== null) as DisplayProject[];
      setDisplayProjects(resolvedProjects);
    } catch (e: any) { setErrorFetchingDisplayProjects(`Failed to load projects: ${e.message}`); setDisplayProjects([]); }
    finally { setIsLoadingDisplayProjects(false); }
  }, [supabase]);

  const fetchManagedProjects = useCallback(async (userId: string) => {
    if (!userId) return;
    setIsLoadingProjects(true); setError(null);
    try {
      const { data: profile } = await supabase.from('profiles').select('role').eq('id', userId).single();
      let query = supabase.from('projects').select('id, name');
      if (profile?.role !== 'Admin') query = query.eq('owner_user_id', userId);
      const { data, error: e } = await query;
      if (e) throw e;
      setManagedProjects(data || []);
    } catch (e: any) { setError('Failed to load managed projects: ' + e.message); }
    finally { setIsLoadingProjects(false); }
  }, [supabase]);

  const fetchTeamMembers = useCallback(async (projectId: string | null) => {
    if (!projectId || !user) return;
    setIsLoadingTeamMembers(true); setError(null);
    try {
      const { data: membersBasicData, error: e } = await supabase.from('project_members').select('user_id, role').eq('project_id', projectId);
      if (e) throw e;
      if (!membersBasicData) { setTeamMembers([]); setIsLoadingTeamMembers(false); return; }
      const membersWithProfiles = await Promise.all(
        membersBasicData.map(async (member) => {
          const { data: profileData } = await supabase.from('profiles').select('display_name, username').eq('id', member.user_id).single();
          return { ...member, display_name: profileData?.display_name || profileData?.username || 'Unnamed', project_id: projectId };
        })
      );
      setTeamMembers(membersWithProfiles as TeamMember[]);
    } catch (err: any) { setError('Failed to fetch team members: ' + err.message); setTeamMembers([]); }
    finally { setIsLoadingTeamMembers(false); }
  }, [supabase, user]);

  const fetchPlatformUsers = useCallback(async () => {
    setIsLoadingPlatformUsers(true);
    try {
      const { data, error: e } = await supabase.from('profiles').select('id, display_name, username');
      if (e) throw e;
      setPlatformUsers(data?.map(p => ({ id: p.id, display_name: p.display_name || p.username || p.id })) || []);
    } catch (e: any) { setError('Failed to load users: ' + e.message); }
    finally { setIsLoadingPlatformUsers(false); }
  }, [supabase]);

  useEffect(() => {
    if (user?.id) {
      fetchDisplayProjects(user.id);
      fetchManagedProjects(user.id);
      fetchPlatformUsers();
    }
  }, [user, fetchDisplayProjects, fetchManagedProjects, fetchPlatformUsers]);

  useEffect(() => {
    if (selectedProjectId) {
      fetchTeamMembers(selectedProjectId);
      setSelectedPlatformUserId(''); setNewMemberRole(ProjectRole.Freelancer);
      setSuccessMessage(null); setError(null);
    }
  }, [selectedProjectId, fetchTeamMembers]);

  const handleDisplayProjectBadgeChange = async (projectId: string, key: 'badge1'|'badge2'|'badge3'|'badge4'|'badge5', value: string|null) => {
    if (!user) return;
    setUpdatingItemId(projectId);
    const p = { [key]: value === '' ? null : value };
    const { error: e } = await supabase.from('projects').update(p).eq('id', projectId);
    if (e) setError(`Failed to update ${key}.`);
    else setDisplayProjects(prev => prev.map(proj => proj.id === projectId ? { ...proj, [key]: value === '' ? null : value } : proj));
    setUpdatingItemId(null);
  };

  const handleAddNewMember = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedProjectId || !selectedPlatformUserId || !newMemberRole) { setError('Please select project, user, and role.'); return; }
    if (!user) { setError('Login required.'); return; }
    setIsAddingMember(true); setError(null); setSuccessMessage(null);
    try {
      let dbRole = '';
      if (newMemberRole === ProjectRole.CLIENT) dbRole = 'Client';
      else if (newMemberRole === ProjectRole.Freelancer) dbRole = 'Freelancer';
      else if (newMemberRole === ProjectRole.Viewer) dbRole = 'Viewer';
      else if (newMemberRole === ProjectRole.ProjectManager) dbRole = 'Admin';
      else dbRole = newMemberRole.charAt(0).toUpperCase() + newMemberRole.slice(1);

      const { data: existing, error: e } = await supabase.from('project_members').select('role').eq('project_id', selectedProjectId).eq('user_id', selectedPlatformUserId).single();
      if (e && e.code !== 'PGRST116') throw e;
      if (existing) {
        if (existing.role === dbRole) setSuccessMessage('User already has this role.');
        else {
          const { error: ue } = await supabase.from('project_members').update({ role: dbRole as any }).eq('project_id', selectedProjectId).eq('user_id', selectedPlatformUserId);
          if (ue) throw ue; setSuccessMessage('Role updated.');
        }
      } else {
        const { error: ie } = await supabase.from('project_members').insert({ project_id: selectedProjectId, user_id: selectedPlatformUserId, role: dbRole as any });
        if (ie) throw ie; setSuccessMessage('Member added.');
      }
      fetchTeamMembers(selectedProjectId); setSelectedPlatformUserId(''); setNewMemberRole(ProjectRole.Freelancer);
    } catch (e: any) { setError(`Failed to add/update member: ${e.message}`); }
    finally { setIsAddingMember(false); }
  };

  const openRemoveConfirmModal = (member: TeamMember, projId: string, projName: string) => {
    if (!member?.user_id || !member?.display_name) { setError('Incomplete member data.'); return; }
    setMemberToRemove({ userId: member.user_id, displayName: member.display_name, projectId: projId, projectName: projName });
    setShowRemoveConfirmModal(true);
  };

  const handleRemoveMember = async () => {
    if (!memberToRemove) return;
    setIsRemovingMember(true); setError(null); setSuccessMessage(null);
    try {
      const { error: e } = await supabase.from('project_members').delete().eq('project_id', memberToRemove.projectId).eq('user_id', memberToRemove.userId);
      if (e) throw e;
      setSuccessMessage(`Removed ${memberToRemove.displayName}.`);
      fetchTeamMembers(memberToRemove.projectId);
    } catch (e: any) { setError(`Failed to remove: ${e.message}`); }
    finally { setIsRemovingMember(false); setShowRemoveConfirmModal(false); setMemberToRemove(null); }
  };

  if (loadingUser || (user && isLoadingDisplayProjects && isLoadingProjects)) { // Combined initial load
    return <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex items-center justify-center"><FaSpinner className="animate-spin text-4xl text-sky-500" /><p className="ml-3">Loading data...</p></div>;
  }
  if (!user && !loadingUser) {
    return <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center"><p className="text-xl mb-4">Login required.</p><Link href="/login?redirectedFrom=/team" className="text-sky-400 hover:text-sky-300">Go to Login</Link></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 pb-12 md:pb-16">
        {error && <div className="my-3 p-3 bg-red-900/30 text-red-400 rounded-md">{error}</div>}
        {successMessage && <div className="my-3 p-3 bg-green-900/30 text-green-400 rounded-md">{successMessage}</div>}

        {/* Vercel-style cards for projects user is part of */}
        <div className="mt-0"> {/* No top margin for this section */}
          {isLoadingDisplayProjects && <div className="flex justify-center py-10"><FaSpinner className="animate-spin text-3xl" /> <p className="ml-3">Loading projects...</p></div>}
          {errorFetchingDisplayProjects && <div className="p-3 bg-red-900/30 text-red-300 rounded">Error: {errorFetchingDisplayProjects}</div>}
          {!isLoadingDisplayProjects && !errorFetchingDisplayProjects && displayProjects.length === 0 && (
            <div className="py-10 text-center"><FaProjectDiagram className="mx-auto text-5xl text-gray-500 mb-4" /><p>You are not currently associated with any projects.</p></div>
          )}
          {!isLoadingDisplayProjects && !errorFetchingDisplayProjects && displayProjects.length > 0 && (
            <div className="space-y-6 mt-6">
              {displayProjects.map((project) => (
                <div key={project.id} className="p-6 shadow-lg rounded-lg relative border bg-black border-gray-700 hover:border-gray-600">
                  {updatingItemId === project.id && <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg z-10"><FaSpinner className="animate-spin text-sky-500 text-3xl" /></div>}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                    <div className="flex items-center gap-x-3 flex-wrap">
                      <Link href={`/myprojects/${project.slug || project.id}`} legacyBehavior><a className="text-xl font-semibold text-sky-400 hover:underline">{project.name}</a></Link>
                      <Link href={`/myprojects/${project.slug || project.id}/edit`} passHref legacyBehavior><a className="text-gray-400 hover:text-sky-400" title="Edit"><FaEdit /></a></Link>
                      {project.currentUserRole && <span className={getProjectRoleStyle(project.currentUserRole as ProjectRole | string)}>{project.currentUserRole.replace(/_/g, ' ').toUpperCase()}</span>}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-4">
                    <Link href={`/myprojects/${project.slug || project.id}`} legacyBehavior><a className="inline-flex items-center btn-secondary"><FaProjectDiagram className="mr-1.5" /> Open Project</a></Link>
                    {project.url && <a href={project.url.startsWith('http')?project.url:`https://${project.url}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center btn-secondary"><FaExternalLinkAlt className="mr-1.5" /> View Site</a>}
                    <button onClick={() => alert(`Invite: ${project.name}`)} className="inline-flex items-center btn-secondary"><FaUserPlus className="mr-1.5" /> Invite</button>
                    <button onClick={() => alert(`Chat: ${project.name}`)} className="inline-flex items-center btn-secondary"><FaComments className="mr-1.5" /> Chat</button>
                  </div>
                  <div className="mb-4 space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
                    {[
                      { k: 'badge1', opts: badge1Options, val: project.badge1, lbl: 'Status...' }, { k: 'badge2', opts: badge2Options, val: project.badge2, lbl: 'Type...' },
                      { k: 'badge3', opts: badge3Options, val: project.badge3, lbl: 'Priority...' }, { k: 'badge4', opts: badge2Options, val: project.badge4, lbl: 'Badge 4...' },
                      { k: 'badge5', opts: badge2Options, val: project.badge5, lbl: 'Badge 5...' }
                    ].map(b => (
                      <div key={b.k} className="flex-shrink-0">
                        <label htmlFor={`${b.k}-${project.id}`} className="sr-only">{b.lbl}</label>
                        <select id={`${b.k}-${project.id}`} value={b.val || ''}
                                onChange={(e) => handleDisplayProjectBadgeChange(project.id, b.k as any, e.target.value)}
                                disabled={updatingItemId === project.id}
                                className={`${getBadgeStyle(b.val ?? null)} text-xs p-1 min-w-[90px]`}>
                          <option value="">{b.lbl}</option>
                          {b.opts.map(opt => <option key={opt} value={opt} className="bg-gray-800 text-gray-300">{opt}</option>)}
                        </select>
                      </div>
                    ))}
                  </div>
                  {project.project_brief ? <p className="text-sm text-gray-400 prose prose-sm prose-invert max-w-none line-clamp-2">{project.project_brief}</p>
                                          : <p className="text-sm text-gray-500 italic">No brief.</p>}
                  {project.owner_user_id === user?.id && (
                    <div className="absolute bottom-6 right-6">
                      <button onClick={(e)=>{e.stopPropagation();alert(`Delete ${project.name}`)}} className="btn-delete-xs"><FaTrash className="mr-1"/>Delete</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Collapsible Managed Projects Section */}
        <div className="mt-12"> {/* This provides spacing between the two sections */}
          {isLoadingProjects && <div className="flex justify-center py-4"><FaSpinner className="animate-spin text-sky-500 text-2xl" /></div>}
          {!isLoadingProjects && managedProjects.length === 0 && user && (
            <div className="bg-gray-900 p-6 border border-gray-800 shadow-lg rounded-md">
              <p className="text-gray-500 italic">You are not managing any projects currently.</p>
            </div>
          )}
          {!isLoadingProjects && managedProjects.length > 0 && (
            <div className="space-y-4">
              {managedProjects.map(mp => ( // mp for ManagedProject to avoid conflict with project from displayProjects
                <div key={mp.id} className="bg-gray-900 border border-gray-800 shadow-lg rounded-md">
                  <button
                    onClick={() => setSelectedProjectId(prev => prev === mp.id ? null : mp.id)}
                    className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-800/50 transition-colors duration-150 cursor-pointer"
                  >
                    <span className="text-base font-medium text-gray-400 flex items-center">
                      <FaProjectDiagram className="mr-3 text-sky-500" />{mp.name || 'Unnamed Project'}
                    </span>
                    {selectedProjectId === mp.id ? <FaAngleDown className="text-gray-400" /> : <FaAngleRight className="text-gray-400" />}
                  </button>
                  {selectedProjectId === mp.id && (
                    <div className="border-t border-gray-700 p-6">
                      <h3 className="text-xl font-semibold text-white mb-4">Team Members</h3>
                      {isLoadingTeamMembers && <div className="flex justify-center py-2"><FaSpinner className="animate-spin text-sky-500 text-xl" /></div>}
                      {!isLoadingTeamMembers && teamMembers.length === 0 && (<p className="text-gray-500 italic">No team members assigned.</p>)}
                      {!isLoadingTeamMembers && teamMembers.length > 0 && (
                        <ul className="space-y-3 mb-6">
                          {teamMembers.map(member => (
                            <li key={member.user_id} className="flex justify-between items-center p-2.5 bg-gray-800 rounded-md shadow">
                              <div>
                                <span className="font-normal text-gray-400 text-xs">{member.display_name || member.user_id}</span>
                                <span className={getProjectRoleStyle(member.role as ProjectRole | string)}>
                                  {member.role.replace(/_/g, ' ').toUpperCase()}
                                </span>
                              </div>
                              {user?.id !== member.user_id && (
                                <button onClick={() => openRemoveConfirmModal(member, mp.id, mp.name || 'Unnamed Project')}
                                        className="text-xs text-red-400 hover:text-red-300 px-2 py-1 rounded border border-red-500/50 hover:border-red-400"
                                        disabled={isAddingMember || isLoadingTeamMembers || isRemovingMember}>Remove</button>
                              )}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="mt-6 pt-6 border-t border-gray-700">
                        <h4 className="text-lg font-semibold text-white mb-4">Add/Update Member for "{mp.name}"</h4>
                        <form onSubmit={handleAddNewMember} className="space-y-4">
                          <div>
                            <label htmlFor={`platformUserSelect-${mp.id}`} className="block text-sm font-medium text-gray-300 mb-1">User</label>
                            {isLoadingPlatformUsers ? <FaSpinner className="animate-spin" /> : (
                              <select id={`platformUserSelect-${mp.id}`} value={selectedPlatformUserId} onChange={(e) => setSelectedPlatformUserId(e.target.value)}
                                      className="w-full bg-gray-800 border-gray-700 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500" required>
                                <option value="" disabled>-- Select --</option>
                                {platformUsers.filter(p => p.id !== user?.id).map(p => (<option key={p.id} value={p.id}>{p.display_name}</option>))}
                              </select>
                            )}
                          </div>
                          <div>
                            <label htmlFor={`newMemberRole-${mp.id}`} className="block text-sm font-medium text-gray-300 mb-1">Role</label>
                            <select id={`newMemberRole-${mp.id}`} value={newMemberRole} onChange={(e) => setNewMemberRole(e.target.value as ProjectRole)}
                                    className="w-full bg-gray-800 border-gray-700 rounded-md p-2 focus:ring-sky-500 focus:border-sky-500">
                              {Object.values(ProjectRole).map(role => (<option key={role} value={role}>{role.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</option>))}
                            </select>
                          </div>
                          <button type="submit" disabled={isAddingMember || isLoadingPlatformUsers}
                                  className="w-full flex justify-center items-center bg-green-600 hover:bg-green-500 btn-primary disabled:opacity-50">
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
            <p className="text-gray-300 mb-2">Remove <strong className="text-sky-400">{memberToRemove.displayName}</strong> from <strong className="text-sky-400">"{memberToRemove.projectName}"</strong>?</p>
            <p className="text-xs text-orange-400 mb-6">This revokes their project access.</p>
            {error && <p className="text-red-400 bg-red-900/30 p-2 rounded mb-4">{error}</p>}
            <div className="flex justify-end space-x-3">
              <button onClick={() => { setShowRemoveConfirmModal(false); setMemberToRemove(null); setError(null); }} disabled={isRemovingMember}
                      className="btn-secondary">Cancel</button>
              <button onClick={handleRemoveMember} disabled={isRemovingMember}
                      className="btn-danger flex items-center">
                {isRemovingMember && <FaSpinner className="animate-spin mr-2" />} Confirm Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}