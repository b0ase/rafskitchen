'use client';

import React, { useEffect, useState, FormEvent, useCallback } from 'react';
import Link from 'next/link';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaProjectDiagram, FaPlusCircle, FaTimes, FaSpinner, FaEdit, FaTrash, FaUserPlus, FaComments, FaExternalLinkAlt } from 'react-icons/fa'; // Added FaExternalLinkAlt
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
  Owner = 'Platform Owner', // New role for clarity
  ProjectManager = 'project_manager',
  Collaborator = 'collaborator',
  ClientContact = 'client_contact',
  Viewer = 'viewer',
}
// --- END ADDED ENUM ---

interface ClientProject {
  id: string; // This will now be the projects.id
  name: string;
  project_slug: string; // From projects table
  status: string | null; // From projects table (or clients if overridden)
  project_brief?: string | null; // From projects table
  badge1?: string | null; // From projects table (or clients if overridden)
  badge2?: string | null; // From projects table (or clients if overridden)
  badge3?: string | null; // From projects table (or clients if overridden)
  is_featured?: boolean; // From projects table (or clients if overridden)
  badge4?: string | null; // From projects table (or clients if overridden)
  badge5?: string | null; // From projects table (or clients if overridden)
  url?: string | null; // From projects table or project_websites
  user_id: string; // Keep for now, but its meaning might shift. Primarily owner_user_id or client's user_id
  created_at: string; // For sorting, from projects table
  currentUserRole?: ProjectRole | string; // Role of the currently logged-in user for this project
  is_public?: boolean; // NEW: From projects table
  // Fields that were primarily from the 'clients' table if they differ from 'projects'
  client_specific_status?: string | null; 
  client_specific_badge1?: string | null;
  // Add other client_specific fields if necessary
}

const badge1Options = ['Pending_setup', 'Planning', 'In Development', 'Live', 'Maintenance', 'On Hold', 'Archived', 'Needs Review', 'Completed', 'Requires Update']; // Added Pending_setup
const badge2Options = ['SaaS', 'Mobile App', 'Website', 'E-commerce', 'AI/ML', 'Consulting', 'Internal Tool', 'Web3/Blockchain', 'Creative Services', 'Platform', 'Service'];
const badge3Options = ['High Priority', 'Medium Priority', 'Low Priority', 'Needs Feedback', 'Client Approved', 'Phase 1', 'Phase 2', 'Experimental', 'Showcase Ready', 'Internal'];

// Helper function to get badge color based on value
const getBadgeStyle = (badgeValue: string | null): string => {
  let baseStyle = "text-xs font-semibold p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border"; // Removed rounded-md
  // Neutral badge style with black background and square edges
  return `${baseStyle} bg-black text-gray-300 border-gray-700 hover:bg-gray-800`;
};

// Helper function to get badge color for Badge 2
const getBadge2Style = (badgeValue: string | null): string => {
  let baseStyle = "text-xs font-semibold p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border"; // Removed rounded-md
  // Neutral badge style with black background and square edges
  return `${baseStyle} bg-black text-gray-300 border-gray-700 hover:bg-gray-800`;
};

// Helper function to get badge color for Badge 3
const getBadge3Style = (badgeValue: string | null): string => {
  let baseStyle = "text-xs font-semibold p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border"; // Removed rounded-md
  // Neutral badge style with black background and square edges
  return `${baseStyle} bg-black text-gray-300 border-gray-700 hover:bg-gray-800`;
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
  userId?: string | null; // Added userId prop
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
  userId,
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
  const projectUrl = project.url;

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
        <div className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg z-[101]">
          <FaSpinner className="animate-spin text-sky-500 text-3xl" />
        </div>
      )}

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
        <div className="flex items-center gap-x-3 flex-wrap">
          {/* Project Name now always links to internal project page */}
          <Link href={`/myprojects/${project.project_slug}`} legacyBehavior>
            <a className="text-xl font-semibold text-sky-400 hover:text-sky-300 hover:underline">
              {project.name}
            </a>
          </Link>
          <Link href={`/myprojects/${project.project_slug}/edit`} passHref legacyBehavior>
            <a className="text-gray-400 hover:text-sky-400 transition-colors" title="Edit Project">
              <FaEdit className="w-4 h-4" />
            </a>
          </Link>
          {project.currentUserRole && (
            <span className={`text-xs px-2 py-0.5 font-medium whitespace-nowrap
              ${project.currentUserRole === ProjectRole.ProjectManager || project.currentUserRole === "Owner" ? "bg-sky-700 text-sky-200" : "bg-gray-700 text-gray-200"}
            `}>
              {typeof project.currentUserRole === 'string' ? project.currentUserRole.replace(/_/g, ' ') : 'Member'}
            </span>
          )}
        </div>
      </div>

      {/* Primary Action Buttons - Grouped separately for clarity */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-2 mb-4">
        <Link href={`/myprojects/${projectSlug}`} legacyBehavior>
          <a 
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-700 text-sm font-medium shadow-sm text-gray-300 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-900"
          >
            <FaProjectDiagram className="mr-1.5 h-4 w-4" /> Open Project Page
          </a>
        </Link>
        {/* View Live Site Button - Conditionally rendered */}
        {projectUrl && (
          <a 
            href={projectUrl.startsWith('http') ? projectUrl : `https://${projectUrl}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            onClick={(e) => e.stopPropagation()} 
            className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-700 text-sm font-medium shadow-sm text-gray-300 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-slate-900"
            title={`Visit live site: ${project.name}`}
          >
            <FaExternalLinkAlt className="mr-1.5 h-4 w-4" /> View live site
          </a>
        )}
        {/* Invite Members Button */}
        <button 
            onClick={(e) => {
                e.stopPropagation();
                // Placeholder: Implement invite functionality
                alert(`Invite members to ${project.name}`);
            }}
            className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-700 text-sm font-medium shadow-sm text-gray-300 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 focus:ring-offset-slate-900"
        >
            <FaUserPlus className="mr-1.5 h-4 w-4" /> Invite Members
        </button>
        {/* Open Team Chat Button */}
        <button 
            onClick={(e) => {
                e.stopPropagation();
                // Placeholder: Implement team chat functionality
                // Potentially link to a chat page: router.push(`/team-chat/${project.id}`);
                alert(`Open team chat for ${project.name}`);
            }}
            className="inline-flex items-center justify-center px-3 py-1.5 border border-gray-700 text-sm font-medium shadow-sm text-gray-300 bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 focus:ring-offset-slate-900"
        >
            <FaComments className="mr-1.5 h-4 w-4" /> Open Team Chat
        </button>
      </div>

      {/* Badges/Controls Section */}
      <div className="mb-4 space-y-2 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-2">
        <div className="flex-shrink-0">
          <label htmlFor={`badge1-${project.id}`} className="sr-only">Badge 1 / Status</label>
          <select 
            id={`badge1-${project.id}`} 
            value={project.badge1 || 'Pending_setup'} 
            onChange={(e) => handleBadgeChange(project.id, 'badge1', e.target.value)}
            disabled={updatingItemId === project.id}
            className={`${getBadgeStyle(project.badge1 || 'Pending_setup')} text-xs p-1 min-w-[90px]`}
            onClick={(e) => e.stopPropagation()} 
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
            className={`${getBadge2Style(project.badge2 || '')} text-xs p-1 min-w-[90px]`}
            onClick={(e) => e.stopPropagation()} 
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
            className={`${getBadge3Style(project.badge3 || '')} text-xs p-1 min-w-[90px]`}
            onClick={(e) => e.stopPropagation()} 
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
            className={`${getBadge2Style(project.badge4 || '')} text-xs p-1 min-w-[90px]`}
            onClick={(e) => e.stopPropagation()} 
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
            className={`${getBadge2Style(project.badge5 || '')} text-xs p-1 min-w-[90px]`}
            onClick={(e) => e.stopPropagation()} 
          >
            <option value="">Badge 5...</option>
            {badge2Options.map(opt => <option key={opt} value={opt} className="bg-gray-800 text-gray-300">{opt}</option>)}
          </select>
        </div>
      </div>

      {/* Footer/Description Section */}
      {project.project_brief ? (
        <p className="text-sm text-gray-400 prose prose-sm prose-invert max-w-none line-clamp-2">
          {project.project_brief}
        </p>
      ) : (
        <p className="text-sm text-gray-500 italic">No project brief available.</p>
      )}

      {/* Conditional Delete Button - Will be styled and moved separately */}
      {(project.currentUserRole === ProjectRole.ProjectManager || project.user_id === userId) && (
        <div className="absolute bottom-6 right-6"> 
          <button 
              onClick={(e) => {
                  e.stopPropagation(); // Prevent card click/drag
                  openDeleteModal(project.id, project.name);
              }}
              className="inline-flex items-center justify-center px-2 py-1 border border-gray-700 text-xs font-medium shadow-sm text-gray-400 bg-black hover:text-red-500 hover:border-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-gray-900"
              title="Delete Project"
          >
              <FaTrash className="mr-1 h-3 w-3" /> Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default function MyProjectsPage() {
  const supabaseClient = createClientComponentClient(); // Keep this for direct Supabase calls if needed outside of auth context
  const { session, isLoading: authLoading, supabase } = useAuth(); // Correctly destructure from useAuth
  const user = session?.user ?? null; // Derive user from session
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);
  const [projectToDeleteName, setProjectToDeleteName] = useState<string | null>(null);
  const [activeSort, setActiveSort] = useState('priority');

  // Re-declare sensors for DndContext
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

  const fetchProjectsAndRoles = useCallback(async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    try {
      // 1. Fetch projects where the current user is the owner_user_id
      const { data: ownedProjectsData, error: ownedError } = await supabase
        .from('projects')
        .select('id, name, slug, status, project_brief, badge1, badge2, badge3, badge4, badge5, is_featured, url, owner_user_id, created_at, is_public, client_id, clients ( user_id, name, email )')
        .eq('owner_user_id', user.id);

      if (ownedError) {
        console.error('OWNED PROJECTS FETCH ERROR:', ownedError);
        setError('Failed to fetch owned projects.');
      }

      // 2. Fetch projects where the current user is the client
      // This involves joining projects with clients table
      const { data: clientProjectsData, error: clientError } = await supabase
        .from('projects')
        .select('id, name, slug, status, project_brief, badge1, badge2, badge3, badge4, badge5, is_featured, url, owner_user_id, created_at, is_public, client_id, clients!inner ( user_id, name, email )')
        .eq('clients.user_id', user.id);
      
      if (clientError) {
        console.error('CLIENT PROJECTS FETCH ERROR:', clientError);
        setError(prevError => prevError ? `${prevError} & Failed to fetch client projects.` : 'Failed to fetch client projects.');
      }

      const combinedProjects: ClientProject[] = [];
      const projectMap = new Map<string, ClientProject>();

      // Process owned projects
      (ownedProjectsData || []).forEach(p => {
        const project: ClientProject = {
          id: p.id,
          name: p.name,
          project_slug: p.slug,
          status: p.status,
          project_brief: p.project_brief,
          badge1: p.badge1,
          badge2: p.badge2,
          badge3: p.badge3,
          badge4: p.badge4,
          badge5: p.badge5,
          is_featured: p.is_featured,
          url: p.url,
          user_id: p.owner_user_id, // This is the platform owner
          created_at: p.created_at,
          currentUserRole: ProjectRole.Owner,
          is_public: p.is_public,
        };
        projectMap.set(p.id, project);
      });

      // Process client projects, update role if already in map (user is owner AND client)
      (clientProjectsData || []).forEach(p => {
        if (projectMap.has(p.id)) {
          // User is both owner and client, ensure Owner role takes precedence or handle as combined
          const existing = projectMap.get(p.id)!;
          existing.currentUserRole = ProjectRole.Owner + ' & Client Contact';
        } else {
          const project: ClientProject = {
            id: p.id,
            name: p.name,
            project_slug: p.slug,
            status: p.status, // Consider if client-specific status from 'clients' table should override
            project_brief: p.project_brief,
            badge1: p.badge1, // Consider client-specific overrides
            badge2: p.badge2,
            badge3: p.badge3,
            badge4: p.badge4,
            badge5: p.badge5,
            is_featured: p.is_featured,
            url: p.url,
            // Correctly access user_id from the first element of the clients array
            user_id: p.clients && Array.isArray(p.clients) && p.clients.length > 0 ? p.clients[0]?.user_id || '' : '', 
            created_at: p.created_at,
            currentUserRole: ProjectRole.ClientContact,
            is_public: p.is_public,
          };
          projectMap.set(p.id, project);
        }
      });
      
      // TODO: Add fetching for collaborator projects and merge them similarly

      setProjects(Array.from(projectMap.values()));

    } catch (e: any) {
      console.error('General error fetching projects:', e);
      setError('An unexpected error occurred while loading projects.');
      setProjects([]);
    } finally {
      setLoading(false);
    }
  // Removed user from dependencies as it's from useAuth() and should be stable or handled by useAuth's updates
  // If user object itself changes frequently and is not just id, might need to reconsider
  // supabase from useAuth() is now used, ensure it's the one passed if different from supabaseClient
  }, [user, supabase]); // Use supabase from useAuth context
  
  useEffect(() => {
    if (!authLoading && user) { // Check if auth is done loading AND user exists
      fetchProjectsAndRoles();
    } else if (!authLoading && !user) { // Auth is done, but no user
      setProjects([]);
      setLoading(false); 
    }
  // fetchProjectsAndRoles will be stable due to useCallback, user & authLoading are dependencies.
  }, [user, authLoading, fetchProjectsAndRoles]);

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
      .from('projects')
      .update(payload)
      .eq('id', projectId);

    if (updateError) {
      console.error('Error updating badge for project ' + projectId + ':', updateError);
      setError('Failed to update badge.');
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
      .from('projects')
      .update({ is_featured: newFeaturedState })
      .eq('id', projectId);

    if (updateError) {
      console.error('Error updating is_featured for project ' + projectId + ':', updateError);
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
      setError('Failed to delete project: ' + deleteError.message);
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

  if (loading) {
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
        
        {!user && !loading && !error && (
            <p className="text-gray-400 text-center py-10">Please log in to see your projects.</p> 
        )}

        {user && !loading && !error && projects.length === 0 && (
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
                    userId={user?.id}
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