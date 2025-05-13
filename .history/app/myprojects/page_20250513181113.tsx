'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaProjectDiagram } from 'react-icons/fa'; // Icon for projects

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

  useEffect(() => {
    const fetchUserAndProjects = async () => {
      setLoadingProjects(true);
      setError(null);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        setUser(authUser);
        const { data: projectData, error: projectError } = await supabase
          .from('clients') 
          .select('id, name, project_slug, status, project_brief') // Ensure all desired fields are selected
          .eq('user_id', authUser.id)
          .order('created_at', { ascending: false });

        if (projectError) {
          console.error('Error fetching projects:', projectError);
          setError(`Could not load projects. DB Error: ${projectError.message}`);
        } else {
          setProjects(projectData || []);
        }
      } else {
        setError('You must be logged in to view your projects.');
        // Optionally redirect to login, though middleware should handle route protection
      }
      setLoadingProjects(false);
    };

    fetchUserAndProjects();
  }, [supabase]);

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
        <div className="flex items-center mb-8">
            <FaProjectDiagram className="text-3xl text-sky-400 mr-3" />
            <h1 className="text-3xl md:text-4xl font-bold text-white">My Projects</h1>
        </div>

        {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-md mb-4 text-sm">{error}</p>}
        
        {!user && !loadingProjects && !error && (
            <p className="text-gray-400">Please log in to see your projects.</p> 
        )}

        {user && !loadingProjects && !error && projects.length === 0 && (
          <p className="text-gray-400 text-center py-8">You are not currently associated with any projects.</p>
        )}

        {user && projects.length > 0 && (
          <div className="space-y-6">
            {projects.map((project) => (
              <div key={project.id} className="bg-gray-900 p-6 border border-gray-800 shadow-lg rounded-lg">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2">
                  <h2 className="text-2xl font-semibold text-sky-400 mb-1 sm:mb-0">{project.name}</h2>
                  {project.status && (
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${project.status === 'active' ? 'bg-green-700 text-green-200' : 'bg-yellow-700 text-yellow-200'}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                  )}
                </div>
                {project.project_slug && (
                  <Link href={`/projects/${project.project_slug}`} legacyBehavior>
                    <a className="text-sm text-gray-500 hover:text-sky-300 hover:underline block mb-3">View Project Details (/projects/{project.project_slug})</a>
                  </Link>
                )}
                {project.project_brief && (
                  <p className="text-sm text-gray-400 prose prose-sm prose-invert max-w-none">
                    {project.project_brief}
                  </p>
                )}
                 {!project.project_brief && (
                  <p className="text-sm text-gray-500 italic">No project brief available.</p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
} 