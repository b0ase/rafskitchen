'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import Link from 'next/link';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaProjectDiagram, FaPlusCircle, FaTimes } from 'react-icons/fa'; // Added FaPlusCircle, FaTimes

interface ClientProject {
  id: string; // UUID
  name: string;
  project_slug: string;
  status: string | null;
  project_brief?: string | null;
  // Add other fields you want to display
}

export default function MyProjectsPage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for Add New Project Modal
  const [showAddProjectModal, setShowAddProjectModal] = useState<boolean>(false);
  const [newProjectName, setNewProjectName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [addProjectError, setAddProjectError] = useState<string | null>(null);

  const fetchUserAndProjects = async () => {
    setLoadingProjects(true);
    setError(null); // Clear main page error
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (authUser) {
      setUser(authUser);
      const { data: projectData, error: projectError } = await supabase
        .from('clients') 
        .select('id, name, project_slug, status, project_brief')
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

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with a single dash
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes
  };

  const handleAddNewProject = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setAddProjectError('You must be logged in to add a project.');
      return;
    }
    if (!newProjectName.trim()) {
      setAddProjectError('Project name cannot be empty.');
      return;
    }

    setIsSubmitting(true);
    setAddProjectError(null);

    const slug = generateSlug(newProjectName);

    const { error: insertError } = await supabase
      .from('clients')
      .insert({
        user_id: user.id,
        name: newProjectName.trim(),
        project_slug: slug, // Use generated slug
        status: 'New', // Default status
        // project_brief can be added/updated later
      });

    if (insertError) {
      console.error('Error inserting project:', insertError);
      setAddProjectError(`Failed to add project: ${insertError.message}`);
    } else {
      setNewProjectName('');
      setShowAddProjectModal(false);
      await fetchUserAndProjects(); // Refresh the project list
    }
    setIsSubmitting(false);
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
                <button
                    onClick={() => { setShowAddProjectModal(true); setAddProjectError(null); }}
                    className="inline-flex items-center bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-4 rounded-md transition-colors shadow-md hover:shadow-lg"
                >
                    <FaPlusCircle className="mr-2" />
                    Add New Project
                </button>
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
                  <Link href={`/myprojects/${project.id}`} legacyBehavior>
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
                {/* Link to the project using its ID */}
                <Link href={`/myprojects/${project.id}`} legacyBehavior>
                    <a className="text-sm text-gray-500 hover:text-sky-300 hover:underline block mb-3">
                        View Project Dashboard (ID: {project.id})
                    </a>
                </Link>
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

      {/* Add New Project Modal */}
      {showAddProjectModal && user && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50 transition-opacity duration-300 ease-in-out">
          <div className="bg-gray-900 p-6 sm:p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Add New Project</h2>
              <button onClick={() => setShowAddProjectModal(false)} className="text-gray-400 hover:text-gray-200">
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleAddNewProject}>
              <div className="mb-5">
                <label htmlFor="newProjectName" className="block text-sm font-medium text-gray-300 mb-1.5">
                  Project Name
                </label>
                <input
                  id="newProjectName"
                  type="text"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm"
                  placeholder="Enter the name of your new project"
                  required
                />
              </div>
              {addProjectError && <p className="text-red-400 bg-red-900/20 p-3 rounded-md mb-4 text-sm">{addProjectError}</p>}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-md text-sm font-medium transition-colors"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-green-600 hover:bg-green-500 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed flex items-center shadow-md"
                  disabled={isSubmitting || !newProjectName.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating Project...
                    </>
                  ) : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 