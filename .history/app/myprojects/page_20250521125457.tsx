'use client';

import React, { useEffect, useState, FormEvent, useCallback } from 'react';
import Link from 'next/link';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaProjectDiagram, FaPlusCircle, FaTimes, FaSpinner, FaEdit, FaTrash } from 'react-icons/fa'; // Added FaEdit, FaTrash
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from '@/app/components/Providers'; // ADDED IMPORT

// --- BEGIN ADDED ENUM ---
enum ProjectRole {
  ProjectManager = 'project_manager',
  Collaborator = 'collaborator',
  ClientContact = 'client_contact',
  Viewer = 'viewer',
}
// --- END ADDED ENUM ---

interface ClientProject {
  id: string; // UUID
  name: string;
  project_slug: string;
  status: string | null;
  project_brief?: string | null;
  badge1?: string | null;
  badge2?: string | null;
  badge3?: string | null;
  is_featured?: boolean;
  badge4?: string | null;
  badge5?: string | null;
  live_url?: string | null;
  user_id: string; // ID of the user who created/owns the project (from 'clients' table)
  created_at: string; // For sorting
  currentUserRole?: ProjectRole | string; // Role of the currently logged-in user for this project
}

const badge1Options = ['Pending_setup', 'Planning', 'In Development', 'Live', 'Maintenance', 'On Hold', 'Archived', 'Needs Review', 'Completed', 'Requires Update']; // Added Pending_setup
const badge2Options = ['SaaS', 'Mobile App', 'Website', 'E-commerce', 'AI/ML', 'Consulting', 'Internal Tool', 'Web3/Blockchain', 'Creative Services', 'Platform', 'Service'];
const badge3Options = ['High Priority', 'Medium Priority', 'Low Priority', 'Needs Feedback', 'Client Approved', 'Phase 1', 'Phase 2', 'Experimental', 'Showcase Ready', 'Internal'];

// Helper function to get badge color based on value
const getBadgeStyle = (badgeValue: string | null): string => {
  let baseStyle = "text-xs font-semibold rounded-md p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border";
  switch (badgeValue?.toLowerCase()) {
    case 'pending_setup':
      return `${baseStyle} bg-yellow-700 text-yellow-200 border-yellow-600`;
    case 'planning':
      return `${baseStyle} bg-indigo-700 text-indigo-200 border-indigo-600`;
    case 'in development':
      return `${baseStyle} bg-sky-700 text-sky-200 border-sky-600`;
    case 'live':
      return `${baseStyle} bg-green-700 text-green-200 border-green-600`;
    case 'maintenance':
      return `${baseStyle} bg-gray-600 text-gray-200 border-gray-500`;
    case 'on hold':
      return `${baseStyle} bg-orange-600 text-orange-100 border-orange-500`;
    case 'archived':
      return `${baseStyle} bg-slate-700 text-slate-300 border-slate-600`;
    case 'completed':
      return `${baseStyle} bg-teal-600 text-teal-100 border-teal-500`;
    default: // Includes "Needs Review", "Requires Update", "Badge 1..." placeholder, or null/undefined
      return `${baseStyle} bg-gray-800 text-gray-300 border-gray-700`;
  }
};

// Helper function to get badge color for Badge 2
const getBadge2Style = (badgeValue: string | null): string => {
  let baseStyle = "text-xs font-semibold rounded-md p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border";
  switch (badgeValue?.toLowerCase()) {
    case 'saas':
      return `${baseStyle} bg-purple-700 text-purple-200 border-purple-600`;
    case 'mobile app':
      return `${baseStyle} bg-pink-700 text-pink-200 border-pink-600`;
    case 'website':
      return `${baseStyle} bg-cyan-600 text-cyan-100 border-cyan-500`;
    case 'e-commerce':
      return `${baseStyle} bg-lime-600 text-lime-100 border-lime-500`;
    case 'ai/ml':
      return `${baseStyle} bg-rose-600 text-rose-100 border-rose-500`;
    // Add more cases for other badge2Options as needed
    default: // Placeholder "Badge 2..." or null/undefined
      return `${baseStyle} bg-gray-800 text-gray-300 border-gray-700`;
  }
};

// Helper function to get badge color for Badge 3
const getBadge3Style = (badgeValue: string | null): string => {
  let baseStyle = "text-xs font-semibold rounded-md p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border";
  switch (badgeValue?.toLowerCase()) {
    case 'high priority':
      return `${baseStyle} bg-red-700 text-red-200 border-red-600`;
    case 'medium priority':
      return `${baseStyle} bg-amber-600 text-amber-100 border-amber-500`;
    case 'low priority':
      return `${baseStyle} bg-emerald-700 text-emerald-200 border-emerald-600`;
    case 'needs feedback':
      return `${baseStyle} bg-fuchsia-600 text-fuchsia-100 border-fuchsia-500`;
    // Add more cases for other badge3Options as needed
    default: // Placeholder "Badge 3..." or null/undefined
      return `${baseStyle} bg-gray-800 text-gray-300 border-gray-700`;
  }
};

// Helper function to assign a numeric priority based on badge3 value
const getPriorityOrderValue = (badgeValue: string | null): number => {
  if (!badgeValue) return 4; // Null or empty string is lowest priority
  switch (badgeValue.toLowerCase()) {
    case 'high priority': return 0;
    case 'medium priority': return 1;
    case 'low priority': return 2;
    case 'needs feedback': return 3;
    default: return 4; // All other badge values
  }
};

// Helper function to get dynamic BORDER color for project cards based on their sorted order/priority
const getCardDynamicBorderStyle = (priorityValue: number): string => {
  let baseStyle = "p-6 shadow-lg rounded-lg hover:border-gray-500 transition-colors duration-300 relative border bg-black"; // Changed bg-slate-900 to bg-black, reduced border-2 to border, hover:border-gray-400 to hover:border-gray-500

  // All borders will be a subtle gray, or a slightly lighter gray for hover.
  return `${baseStyle} border-gray-700`; 

  // switch (priorityValue) {
  //   case 0: return `${baseStyle} border-red-700`;    // High Priority
  //   case 1: return `${baseStyle} border-orange-700`; // Medium Priority
  //   case 2: return `${baseStyle} border-sky-700`;    // Low Priority
  //   case 3: return `${baseStyle} border-teal-700`;   // Needs Feedback
  //   default: return `${baseStyle} border-slate-700`; // Default/Other priorities
  // }
};

// New SortableProjectCard component
interface SortableProjectCardProps {
  project: ClientProject;
  updatingItemId: string | null;
  handleBadgeChange: (projectId: string, badgeKey: 'badge1' | 'badge2' | 'badge3' | 'badge4' | 'badge5', newValue: string | null) => void;
  handleIsFeaturedToggle: (projectId: string, currentIsFeatured: boolean) => void;
  openDeleteModal: (projectId: string, projectName: string) => void;
  // Styling and options props
  getCardDynamicBorderStyle: (priorityValue: number) => string;
  getPriorityOrderValue: (badgeValue: string | null) => number;
  badge1Options: string[];
  badge2Options: string[];
  badge3Options: string[];
  getBadgeStyle: (badgeValue: string | null) => string;
  getBadge2Style: (badgeValue: string | null) => string;
  getBadge3Style: (badgeValue: string | null) => string;
}

function SortableProjectCard({ 
  project, 
  updatingItemId, 
  handleBadgeChange, 
  handleIsFeaturedToggle,
  openDeleteModal,
  getCardDynamicBorderStyle,
  getPriorityOrderValue,
  badge1Options,
  badge2Options,
  badge3Options,
  getBadgeStyle,
  getBadge2Style,
  getBadge3Style
}: SortableProjectCardProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({ id: project.id });

  const projectSlug = project.project_slug;
  const liveUrl = project.live_url;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 100 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners} 
      className={getCardDynamicBorderStyle(getPriorityOrderValue(project.badge3 ?? null))}
    >
      {updatingItemId === project.id && (
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg z-[101]"> {/* Ensure spinner is above dragged item overlay slightly */}
          <FaSpinner className="animate-spin text-sky-500 text-3xl" />
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
        <div className="flex items-center gap-x-3">
          {/* Project Name becomes a direct button to live_url if it exists */}
          {liveUrl ? (
            <a 
              href={liveUrl.startsWith('http') ? liveUrl : `https://${liveUrl}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              onClick={(e) => e.stopPropagation()} 
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-xl font-semibold rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-slate-900"
              title={`Visit live site: ${project.name}`}
            >
              {project.name}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 ml-2">
                <path fillRule="evenodd" d="M4.25 5.5a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5zm0 3a.75.75 0 000 1.5h3.5a.75.75 0 000-1.5h-3.5zm0 3a.75.75 0 000 1.5h5.5a.75.75 0 000-1.5h-5.5zm8-3a.75.75 0 00-.75.75v4.5a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75z" clipRule="evenodd" />
                <path d="M14.75 3.5a.75.75 0 00-1.06 1.06l1.72 1.72H10a.75.75 0 000 1.5h5.41l-1.72 1.72a.75.75 0 101.06 1.06l3-3a.75.75 0 000-1.06l-3-3z" />
              </svg>
            </a>
          ) : (
            <Link href={`/myprojects/${project.project_slug}`} legacyBehavior>
              {/* Fallback: If no live_url, link to internal project page (not styled as a button) */}
              <a className="text-2xl font-semibold text-sky-400 hover:text-sky-300 hover:underline">
                {project.name}
              </a>
            </Link>
          )}
          <Link href={`/myprojects/${project.project_slug}/edit`} passHref legacyBehavior>
            <a className="text-gray-400 hover:text-sky-400 transition-colors" title="Edit Project">
              <FaEdit />
            </a>
          </Link>
          {/* --- BEGIN DISPLAY CURRENT USER ROLE --- */}
          {project.currentUserRole && (
            <span className={`ml-2 text-xs px-2 py-0.5 rounded-full font-medium
              ${project.currentUserRole === ProjectRole.ProjectManager || project.currentUserRole === "Owner" ? "bg-sky-700 text-sky-200" : "bg-gray-600 text-gray-200"}
            `}>
              {typeof project.currentUserRole === 'string' ? project.currentUserRole.replace(/_/g, ' ') : 'Member'}
            </span>
          )}
          {/* --- END DISPLAY CURRENT USER ROLE --- */}
        </div>
      </div>
      {/* --- NEW BUTTONS SECTION --- */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 mt-1 mb-4">
        <Link href={`/myprojects/${projectSlug}`} legacyBehavior>
          <a 
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900"
          >
            <FaProjectDiagram className="mr-1.5 h-4 w-4" /> Open Project Page
          </a>
        </Link>
      </div>
      {/* --- END NEW BUTTONS SECTION --- */}
      <div className="mt-2 mb-4 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
        <div className="flex-shrink-0">
          <label htmlFor={`badge1-${project.id}`} className="sr-only">Badge 1 / Status</label>
          <select 
            id={`badge1-${project.id}`} 
            value={project.badge1 || 'Pending_setup'} 
            onChange={(e) => handleBadgeChange(project.id, 'badge1', e.target.value)}
            disabled={updatingItemId === project.id}
            className={getBadgeStyle(project.badge1 || 'Pending_setup')}
            onClick={(e) => e.stopPropagation()} // Prevent drag start on select click
          >
            {badge1Options.map(opt => <option key={opt} value={opt} className="bg-gray-800 text-gray-300">{opt}</option>)}
          </select>
        </div>
        <div className="flex-shrink-0">
          <label htmlFor={`badge2-${project.id}`} className="sr-only">Badge 2</label>
          <select 
            id={`badge2-${project.id}`} 
            value={project.badge2 || ''} 
            onChange={(e) => handleBadgeChange(project.id, 'badge2', e.target.value)}
            disabled={updatingItemId === project.id}
            className={getBadge2Style(project.badge2 || '')}
            onClick={(e) => e.stopPropagation()} // Prevent drag start on select click
          >
            <option value="">Badge 2...</option>
            {badge2Options.map(opt => <option key={opt} value={opt} className="bg-gray-800 text-gray-300">{opt}</option>)}
          </select>
        </div>
        <div className="flex-shrink-0">
          <label htmlFor={`badge3-${project.id}`} className="sr-only">Badge 3</label>
          <select 
            id={`badge3-${project.id}`} 
            value={project.badge3 || ''} 
            onChange={(e) => handleBadgeChange(project.id, 'badge3', e.target.value)}
            disabled={updatingItemId === project.id}
            className={getBadge3Style(project.badge3 || '')}
            onClick={(e) => e.stopPropagation()} // Prevent drag start on select click
          >
            <option value="">Badge 3...</option>
            {badge3Options.map(opt => <option key={opt} value={opt} className="bg-gray-800 text-gray-300">{opt}</option>)}
          </select>
        </div>
        <div className="flex-shrink-0">
          <label htmlFor={`badge4-${project.id}`} className="sr-only">Badge 4</label>
          <select 
            id={`badge4-${project.id}`} 
            value={project.badge4 || ''} 
            onChange={(e) => handleBadgeChange(project.id, 'badge4', e.target.value)}
            disabled={updatingItemId === project.id}
            className={getBadge2Style(project.badge4 || '')} 
            onClick={(e) => e.stopPropagation()} // Prevent drag start on select click
          >
            <option value="">Badge 4...</option>
            {badge2Options.map(opt => <option key={opt} value={opt} className="bg-gray-800 text-gray-300">{opt}</option>)}
          </select>
        </div>
        <div className="flex-shrink-0">
          <label htmlFor={`badge5-${project.id}`} className="sr-only">Badge 5</label>
          <select 
            id={`badge5-${project.id}`} 
            value={project.badge5 || ''} 
            onChange={(e) => handleBadgeChange(project.id, 'badge5', e.target.value)}
            disabled={updatingItemId === project.id}
            className={getBadge2Style(project.badge5 || '')} 
            onClick={(e) => e.stopPropagation()} // Prevent drag start on select click
          >
            <option value="">Badge 5...</option>
            {badge2Options.map(opt => <option key={opt} value={opt} className="bg-gray-800 text-gray-300">{opt}</option>)}
          </select>
        </div>
      </div>
      {project.project_brief ? (
        <p className="text-sm text-gray-400 prose prose-sm prose-invert max-w-none line-clamp-3">
          {project.project_brief}
        </p>
      ) : (
        <p className="text-sm text-gray-500 italic">No project brief available. Click to add details.</p>
      )}
    </div>
  );
}

export default function MyProjectsPage() {
  const supabase = createClientComponentClient();
  const { session, isLoading: authIsLoading } = useAuth(); // ADDED useAuth hook
  const user = session?.user ?? null; // DERIVE user from session
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);
  const [projectToDeleteName, setProjectToDeleteName] = useState<string | null>(null);

  // Add this console.log to check the user email value
  if (user) {
    console.log('[MyProjectsPage] Current user email from useAuth for showcase check:', user.email);
  } else if (authIsLoading) {
    console.log('[MyProjectsPage] Auth state is loading...');
  } else {
    console.log('[MyProjectsPage] No user object from useAuth for showcase check.');
  }

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const fetchUserAndProjects = useCallback(async () => { // Wrapped in useCallback
    if (authIsLoading) { // Don't fetch if auth is still loading
        console.log('[MyProjectsPage] Waiting for auth to load before fetching projects.');
        setLoadingProjects(true); // Ensure loading state is true if we defer
        return;
    }

    if (!user) { // Check user from useAuth
      console.log('[MyProjectsPage] No user from useAuth, cannot fetch projects.');
      setError('You must be logged in to view your projects.');
      setProjects([]);
      setLoadingProjects(false);
      return;
    }
    console.log('[MyProjectsPage] User from useAuth found, proceeding to fetch projects for ID:', user.id);
    setLoadingProjects(true);
    setError(null);

    const projectsMap = new Map<string, ClientProject>();
    const selectedProjectFields = 'id, name, project_slug, status, project_brief, badge1, badge2, badge3, is_featured, badge4, badge5, user_id, created_at, live_url';

    // Step 1: Fetch projects where the user has a role in project_users
    const { data: userProjectRoles, error: userProjectRolesError } = await supabase
      .from('project_users')
      .select('project_id, role')
      .eq('user_id', user.id); // Use user.id from useAuth

    if (userProjectRolesError) {
      console.error('Error fetching user project roles:', userProjectRolesError);
      setError(`Could not load project roles: ${userProjectRolesError.message}`);
      // Continue to fetch owned projects, but collaborative ones might be missing.
    }

    if (userProjectRoles && userProjectRoles.length > 0) {
      const projectIdsFromRoles = userProjectRoles.map(upr => upr.project_id);
      if (projectIdsFromRoles.length > 0) {
        const { data: collaborativeProjectsData, error: collabProjectsError } = await supabase
          .from('clients')
          .select(selectedProjectFields)
          .in('id', projectIdsFromRoles);

        if (collabProjectsError) {
          console.error('Error fetching collaborative projects:', collabProjectsError);
          setError(prev => prev ? `${prev}\nCould not load collaborative projects: ${collabProjectsError.message}` : `Could not load collaborative projects: ${collabProjectsError.message}`);
        } else if (collaborativeProjectsData) {
          collaborativeProjectsData.forEach(proj => {
            const roleEntry = userProjectRoles.find(upr => upr.project_id === proj.id);
            projectsMap.set(proj.id, { 
              ...proj, 
              currentUserRole: roleEntry?.role as ProjectRole || 'Member' 
            });
          });
        }
      }
    }

    // Step 2: Fetch projects directly owned by the user
    const { data: ownedProjectsData, error: ownedProjectsError } = await supabase
      .from('clients')
      .select(selectedProjectFields)
      .eq('user_id', user.id); // Use user.id from useAuth

    if (ownedProjectsError) {
      console.error('Error fetching owned projects:', ownedProjectsError);
      setError(prev => prev ? `${prev}\nCould not load owned projects: ${ownedProjectsError.message}` : `Could not load owned projects: ${ownedProjectsError.message}`);
    } else if (ownedProjectsData) {
      ownedProjectsData.forEach(proj => {
        // If already in map from project_users, this ensures owner status is primary if applicable.
        // Typically, an owner is also a project_manager in project_users.
        // If they are the user_id on 'clients', their role is effectively 'Owner' or 'ProjectManager'.
        const existingProject = projectsMap.get(proj.id);
        projectsMap.set(proj.id, {
          ...proj,
          // If user_id on clients table matches authUser.id, they are effectively the manager/owner.
          // This overrides role from project_users if it was something different for an owned project.
          currentUserRole: ProjectRole.ProjectManager 
        });
      });
    }
    
    const sortedProjects = Array.from(projectsMap.values()).sort((a, b) => {
      const priorityA = getPriorityOrderValue(a.badge3 ?? null);
      const priorityB = getPriorityOrderValue(b.badge3 ?? null);
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      // Fallback to creation date if priorities are the same (newest first)
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });
    
    setProjects(sortedProjects);
    setLoadingProjects(false);
  }, [supabase, user, authIsLoading]);

  useEffect(() => {
    // Trigger fetchUserAndProjects when user or authIsLoading state changes.
    // It will only run the actual fetch logic if auth is not loading and user is present.
    fetchUserAndProjects();
  }, [fetchUserAndProjects]); // fetchUserAndProjects is now memoized with useCallback

  const handleBadgeChange = async (projectId: string, badgeKey: 'badge1' | 'badge2' | 'badge3' | 'badge4' | 'badge5', newValue: string | null) => {
    if (!user) { // Check user from useAuth
      return;
    }
    setUpdatingItemId(projectId); // Indicate loading for this specific project item
    const payload: { [key: string]: string | null } = {};
    // If "Pending_setup" is selected for badge1 and it's the effective default (was null before),
    // we might want to store null, or store "Pending_setup". Let's store "Pending_setup".
    // The placeholder "" value will set null.
    payload[badgeKey] = newValue === '' ? null : newValue; 

    const { error: updateError } = await supabase
      .from('clients')
      .update(payload)
      .eq('id', projectId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error(`Error updating ${badgeKey} for project ${projectId}:`, updateError);
      // Optionally set an error state specific to this item or a general one
      setError(`Failed to update ${badgeKey}.`);
    } else {
      // Update local state to reflect the change immediately for better UX
      setProjects(prevProjects => 
        prevProjects.map(p => 
          p.id === projectId ? { ...p, [badgeKey]: newValue === '' ? null : newValue } : p
        )
      );
    }
    setUpdatingItemId(null);
  };

  const handleIsFeaturedToggle = async (projectId: string, currentIsFeatured: boolean) => {
    if (!user) return;
    setUpdatingItemId(projectId);
    const newFeaturedState = !currentIsFeatured;

    const { error: updateError } = await supabase
      .from('clients')
      .update({ is_featured: newFeaturedState })
      .eq('id', projectId)
      .eq('user_id', user.id);

    if (updateError) {
      console.error(`Error updating is_featured for project ${projectId}:`, updateError);
      setError('Failed to update featured status.');
    } else {
      setProjects(prevProjects =>
        prevProjects.map(p =>
          p.id === projectId ? { ...p, is_featured: newFeaturedState } : p
        )
      );
    }
    setUpdatingItemId(null);
  };

  const openDeleteModal = (projectId: string, projectName: string) => {
    setProjectToDeleteId(projectId);
    setProjectToDeleteName(projectName);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setProjectToDeleteId(null);
    setProjectToDeleteName(null);
  };

  const confirmDeleteProject = async () => {
    if (!projectToDeleteId || !user) {
      setError("Error: Project ID missing or user not authenticated for deletion.");
      closeDeleteModal();
      return;
    }
    setUpdatingItemId(projectToDeleteId); // Use updatingItemId to show spinner on the card during delete
    setError(null);

    const { error: deleteError } = await supabase
      .from('clients')
      .delete()
      .eq('id', projectToDeleteId)
      .eq('user_id', user.id); // Ensure user can only delete their own projects

    if (deleteError) {
      console.error('Error deleting project:', deleteError);
      setError(`Failed to delete project: ${deleteError.message}`);
    } else {
      setProjects(prevProjects => prevProjects.filter(p => p.id !== projectToDeleteId));
      // Optionally, show a success message
    }
    setUpdatingItemId(null);
    closeDeleteModal();
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setProjects((currentProjects) => {
        const oldIndex = currentProjects.findIndex(p => p.id === active.id);
        const newIndex = currentProjects.findIndex(p => p.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return currentProjects; // Should not happen
        return arrayMove(currentProjects, oldIndex, newIndex);
      });
    }
  };

  if (loadingProjects) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <p className="text-xl">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            {/* <div className="flex items-center mb-4 sm:mb-0">
                <FaProjectDiagram className="text-3xl text-sky-400 mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold text-white">My Projects</h1>
            </div> */}
            {/* {user && (
                <Link href="/projects/new" passHref legacyBehavior>
                    <a className="inline-flex items-center bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-md hover:shadow-lg">
                        <FaPlusCircle className="mr-2" />
                        Add New Project
                    </a>
                </Link>
            )} */}
        </div>

        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-md mb-6 text-sm shadow">{error}</p>}
        
        {!user && !loadingProjects && !error && (
            <p className="text-gray-400 text-center py-10">Please log in to see your projects.</p> 
        )}

        {user && !loadingProjects && !error && projects.length === 0 && (
          <div className="text-center py-10">
            <p className="text-gray-400 mb-4">You are not currently associated with any projects.</p>
            <p className="text-gray-500 text-sm">Click "Add New Project" to get started!</p>
          </div>
        )}

        {user && projects.length > 0 && (
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={projects.map(p => p.id)} 
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-6">
                {projects.map((project) => (
                  <SortableProjectCard 
                    key={project.id} 
                    project={project}
                    updatingItemId={updatingItemId}
                    handleBadgeChange={handleBadgeChange}
                    handleIsFeaturedToggle={handleIsFeaturedToggle}
                    openDeleteModal={openDeleteModal}
                    getCardDynamicBorderStyle={getCardDynamicBorderStyle}
                    getPriorityOrderValue={getPriorityOrderValue}
                    badge1Options={badge1Options}
                    badge2Options={badge2Options}
                    badge3Options={badge3Options}
                    getBadgeStyle={getBadgeStyle}
                    getBadge2Style={getBadge2Style}
                    getBadge3Style={getBadge3Style}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </main>

      {isDeleteModalOpen && projectToDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl border border-gray-700 max-w-md w-full">
            <h3 className="text-xl font-semibold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-1">
              Are you sure you want to delete the project:
            </p>
            <p className="text-sky-400 font-semibold mb-6 break-words">
              {projectToDeleteName || 'this project'}?
            </p>
            <p className="text-xs text-orange-400 mb-6">This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={closeDeleteModal}
                className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteProject}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-500 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Delete Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 