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
  badge1?: string | null;
  badge2?: string | null;
  badge3?: string | null;
  // Add other fields you want to display
}

export default function MyProjectsPage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loadingProjects, setLoadingProjects] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserAndProjects = async () => {
    setLoadingProjects(true);
    setError(null); // Clear main page error
    const { data: { user: authUser } } = await supabase.auth.getUser();
    
    if (authUser) {
      setUser(authUser);
      const { data: projectData, error: projectError } = await supabase
        .from('clients') 
        .select('id, name, project_slug, status, project_brief, badge1, badge2, badge3')
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
                <div className="flex space-x-2 mt-2 mb-3">
                    {project.badge1 && <span className="px-2 py-0.5 text-xs bg-purple-700 text-purple-200 rounded-full">{project.badge1}</span>}
                    {project.badge2 && <span className="px-2 py-0.5 text-xs bg-pink-700 text-pink-200 rounded-full">{project.badge2}</span>}
                    {project.badge3 && <span className="px-2 py-0.5 text-xs bg-indigo-700 text-indigo-200 rounded-full">{project.badge3}</span>}
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