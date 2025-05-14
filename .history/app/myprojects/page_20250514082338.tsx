'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaProjectDiagram, FaPlusCircle, FaTimes, FaSpinner } from 'react-icons/fa'; // Added FaPlusCircle, FaTimes, FaSpinner

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

const badge1Options = ['Planning', 'In Development', 'Live', 'Maintenance', 'On Hold', 'Archived', 'Needs Review', 'Completed', 'Requires Update'];
const badge2Options = ['SaaS', 'Mobile App', 'Website', 'E-commerce', 'AI/ML', 'Consulting', 'Internal Tool', 'Web3/Blockchain', 'Creative Services', 'Platform', 'Service'];
const badge3Options = ['High Priority', 'Medium Priority', 'Low Priority', 'Needs Feedback', 'Client Approved', 'Phase 1', 'Phase 2', 'Experimental', 'Showcase Ready', 'Internal'];

export default function MyProjectsPage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingItemId, setUpdatingItemId] = useState<string | null>(null);

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
    payload[badgeKey] = newValue === '' ? null : newValue; // Set to null if empty string is chosen (e.g. "Select..." option)

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
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-900 p-6 border border-gray-800 shadow-lg rounded-lg hover:border-sky-700/70 transition-colors duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                  <Link href={`/myprojects/${project.project_slug}`} legacyBehavior>
                    <a className="text-2xl font-semibold text-sky-400 hover:text-sky-300 hover:underline mb-1 sm:mb-0 block">
                        {project.name}
                    </a>
                  </Link>
                  {project.status && (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap mt-2 sm:mt-0 ${project.status.toLowerCase() === 'active' ? 'bg-green-700 text-green-200' : project.status.toLowerCase() === 'completed' ? 'bg-blue-700 text-blue-200' : 'bg-yellow-700 text-yellow-200'}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  )}
                </div>
                <Link href={`/myprojects/${project.project_slug}`} legacyBehavior>
                    <a className="text-sm text-gray-500 hover:text-sky-300 hover:underline block mb-3">
                        View Project Dashboard (Slug: {project.project_slug})
                    </a>
                </Link>
                <div className="mt-2 mb-4 space-y-3 sm:space-y-0 sm:flex sm:flex-wrap sm:items-center sm:gap-3">
                  <div className="flex-shrink-0">
                    <label htmlFor={`badge1-${project.id}`} className="sr-only">Badge 1</label>
                    <select 
                      id={`badge1-${project.id}`} 
                      value={project.badge1 || ''} 
                      onChange={(e) => handleBadgeChange(project.id, 'badge1', e.target.value)}
                      disabled={updatingItemId === project.id}
                      className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-md p-1.5 focus:ring-sky-500 focus:border-sky-500 appearance-none min-w-[100px]"
                    >
                      <option value="">Badge 1...</option>
                      {badge1Options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="flex-shrink-0">
                    <label htmlFor={`badge2-${project.id}`} className="sr-only">Badge 2</label>
                    <select 
                      id={`badge2-${project.id}`} 
                      value={project.badge2 || ''} 
                      onChange={(e) => handleBadgeChange(project.id, 'badge2', e.target.value)}
                      disabled={updatingItemId === project.id}
                      className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-md p-1.5 focus:ring-sky-500 focus:border-sky-500 appearance-none min-w-[100px]"
                    >
                      <option value="">Badge 2...</option>
                      {badge2Options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="flex-shrink-0">
                    <label htmlFor={`badge3-${project.id}`} className="sr-only">Badge 3</label>
                    <select 
                      id={`badge3-${project.id}`} 
                      value={project.badge3 || ''} 
                      onChange={(e) => handleBadgeChange(project.id, 'badge3', e.target.value)}
                      disabled={updatingItemId === project.id}
                      className="text-xs bg-gray-800 border border-gray-700 text-gray-300 rounded-md p-1.5 focus:ring-sky-500 focus:border-sky-500 appearance-none min-w-[100px]"
                    >
                      <option value="">Badge 3...</option>
                      {badge3Options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                  </div>
                  <div className="flex items-center flex-shrink-0 ml-auto sm:ml-0 pt-2 sm:pt-0">
                    <input 
                      type="checkbox" 
                      id={`featured-${project.id}`} 
                      checked={project.is_featured || false} 
                      onChange={() => handleIsFeaturedToggle(project.id, project.is_featured || false)}
                      disabled={updatingItemId === project.id}
                      className="h-4 w-4 text-sky-600 bg-gray-700 border-gray-600 rounded focus:ring-sky-500 focus:ring-offset-gray-900 cursor-pointer"
                    />
                    <label htmlFor={`featured-${project.id}`} className="ml-2 text-xs text-gray-400 cursor-pointer select-none">
                      Showcase
                    </label>
                  </div>
                  {updatingItemId === project.id && <FaSpinner className="animate-spin ml-2 text-sky-500 text-xs" />}
                </div>
                {project.project_brief ? (
                  <p className="text-sm text-gray-400 prose prose-sm prose-invert max-w-none line-clamp-3">
                    {project.project_brief}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 italic">No project brief available. Click to add details.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 