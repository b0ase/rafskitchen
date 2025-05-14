'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaProjectDiagram, FaPlusCircle, FaTimes, FaSpinner, FaEdit, FaTrash } from 'react-icons/fa'; // Added FaEdit, FaTrash

interface ClientProject {
  id: string; // UUID
  name: string;
  project_slug: string;
  status: string | null;
  project_brief?: string | null;
  badge1?: string | null;
  badge2?: string | null;
  badge3?: string | null;
  is_featured?: boolean; // Added
  // Add other fields you want to display
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

// Helper function to get dynamic background color for project cards based on their order
const getCardDynamicBgStyle = (index: number, totalProjects: number): string => {
  const position = totalProjects > 1 ? index / (totalProjects - 1) : 0; // Normalized position: 0 (top) to 1 (bottom)
  // Top cards (newest if sorted by creation date desc) are hottest (red)
  // Bottom cards (oldest) are coolest (blue)

  let baseStyle = "p-6 shadow-lg rounded-lg hover:border-sky-700/70 transition-colors duration-300 relative border";

  if (totalProjects <= 1) return `${baseStyle} bg-red-800 border-red-700`; // Single card is hottest

  if (position < 0.2) return `${baseStyle} bg-red-800 border-red-700`;        // Hottest (Top ~20%)
  if (position < 0.4) return `${baseStyle} bg-orange-700 border-orange-600`;  // Warmer
  if (position < 0.6) return `${baseStyle} bg-amber-700 border-amber-600`;   // Neutral Warm
  if (position < 0.8) return `${baseStyle} bg-teal-700 border-teal-600`;      // Cooler
  return `${baseStyle} bg-blue-800 border-blue-700`;                         // Coolest (Bottom ~20%)
};

export default function MyProjectsPage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [projectToDeleteId, setProjectToDeleteId] = useState<string | null>(null);
  const [projectToDeleteName, setProjectToDeleteName] = useState<string | null>(null);

  const fetchUserAndProjects = async () => {
    setLoadingProjects(true);
    setError(null); // Clear main page error
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (authUser) {
      setUser(authUser);
      const { data: projectData, error: projectError } = await supabase
        .from('clients') 
        .select('id, name, project_slug, status, project_brief, badge1, badge2, badge3, is_featured')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false });

      if (projectError) {
        console.error('Error fetching projects:', projectError);
        setError(`Could not load projects. DB Error: ${projectError.message}`);
        setProjects([]); // Ensure projects is empty on error
      } else {
        setProjects(projectData || []);
      }
    } else {
      setError('You must be logged in to view your projects.');
      setProjects([]); // Ensure projects is empty if no user
    }
    setLoadingProjects(false);
  };

  useEffect(() => {
    fetchUserAndProjects();
  }, [supabase]);

  const handleBadgeChange = async (projectId: string, badgeKey: 'badge1' | 'badge2' | 'badge3', newValue: string | null) => {
    if (!user) return;
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

  if (loadingProjects) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <p className="text-xl">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-10">
            <div className="flex items-center mb-4 sm:mb-0">
                <FaProjectDiagram className="text-3xl text-sky-400 mr-3" />
                <h1 className="text-3xl md:text-4xl font-bold text-white">My Projects</h1>
            </div>
            {user && (
                <Link href="/projects/new" passHref legacyBehavior>
                    <a className="inline-flex items-center bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-md hover:shadow-lg">
                        <FaPlusCircle className="mr-2" />
                        Add New Project
                    </a>
                </Link>
            )}
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
          <div className="space-y-6">
            {projects.map((project, index) => (
              <div key={project.id} className={getCardDynamicBgStyle(index, projects.length)}>
                {updatingItemId === project.id && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-lg z-10"> {/* Adjusted overlay color */}
                    <FaSpinner className="animate-spin text-sky-500 text-3xl" />
                  </div>
                )}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                  <div className="flex items-center gap-x-3">
                    <Link href={`/myprojects/${project.project_slug}`} legacyBehavior>
                      <a className="text-2xl font-semibold text-sky-400 hover:text-sky-300 hover:underline">
                          {project.name}
                      </a>
                    </Link>
                    <Link href={`/myprojects/${project.project_slug}/edit`} passHref legacyBehavior>
                        <a className="text-gray-400 hover:text-sky-400 transition-colors" title="Edit Project">
                            <FaEdit />
                        </a>
                    </Link>
                  </div>
                </div>
                <Link href={`/myprojects/${project.project_slug}`} legacyBehavior>
                    <a className="text-sm text-gray-500 hover:text-sky-300 hover:underline block mb-3">
                        View Project Dashboard (Slug: {project.project_slug})
                    </a>
                </Link>
                <div className="mt-2 mb-4 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                  <div className="flex-shrink-0">
                    <label htmlFor={`badge1-${project.id}`} className="sr-only">Badge 1 / Status</label>
                    <select 
                      id={`badge1-${project.id}`} 
                      value={project.badge1 || 'Pending_setup'} // Default to Pending_setup
                      onChange={(e) => handleBadgeChange(project.id, 'badge1', e.target.value)}
                      disabled={updatingItemId === project.id}
                      className={getBadgeStyle(project.badge1 || 'Pending_setup')}
                    >
                      {/* <option value="" disabled>Select Status...</option> No explicit placeholder if Pending_setup is default view */}
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
                    >
                      <option value="">Badge 3...</option>
                      {badge3Options.map(opt => <option key={opt} value={opt} className="bg-gray-800 text-gray-300">{opt}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center flex-shrink-0 sm:ml-0 pt-2 sm:pt-0"> {/* Removed ml-auto */}
                    <input 
                      type="checkbox" 
                      id={`