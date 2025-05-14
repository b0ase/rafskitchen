'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { useParams } from 'next/navigation'; // To get projectId from URL
import { FaProjectDiagram, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

interface ClientProject {
  id: string;
  name: string;
  project_slug: string;
  status: string | null;
  project_brief?: string | null;
  created_at: string;
  // Add other fields you might want to display
}

export default function ProjectDetailPage() {
  const supabase = createClientComponentClient();
  const params = useParams();
  const projectId = params.projectId as string; // Extract projectId from URL

  const [user, setUser] = useState<User | null>(null);
  const [project, setProject] = useState<ClientProject | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserAndProjectDetails = async () => {
      if (!projectId) {
        setError('Project ID is missing.');
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        setError('You must be logged in to view this project.');
        setLoading(false);
        return;
      }
      setUser(authUser);

      // Fetch the specific project
      const { data: projectData, error: projectError } = await supabase
        .from('clients')
        .select('*') // Select all columns for now, can be optimized later
        .eq('project_slug', projectId) // Query by project_slug now
        .eq('user_id', authUser.id) // Ensure the user owns this project
        .single(); // Expecting only one project or null

      if (projectError) {
        console.error('Error fetching project details:', projectError);
        if (projectError.code === 'PGRST116') { // Not found or no permission
             setError('Project not found or you do not have permission to view it.');
        } else {
            setError(`Could not load project details. DB Error: ${projectError.message}`);
        }
        setProject(null);
      } else if (projectData) {
        setProject(projectData);
      } else {
        setError('Project not found.');
        setProject(null);
      }
      setLoading(false);
    };

    fetchUserAndProjectDetails();
  }, [supabase, projectId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <p className="text-xl">Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="mb-8">
            <Link href="/myprojects" legacyBehavior>
                <a className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors">
                    <FaArrowLeft className="mr-2" />
                    Back to My Projects
                </a>
            </Link>
        </div>

        {error && (
            <div className="bg-red-900/30 border border-red-700/50 text-red-300 p-6 rounded-lg shadow-lg mb-8">
                <h2 className="text-2xl font-semibold mb-3">Error Loading Project</h2>
                <p>{error}</p>
            </div>
        )}

        {!project && !loading && !error && (
            <div className="text-center py-10">
                 <FaProjectDiagram className="text-6xl text-gray-600 mx-auto mb-4" />
                <p className="text-2xl text-gray-500">Project not found.</p>
            </div>
        )}

        {project && (
          <div className="bg-gray-900 p-6 sm:p-8 border border-gray-800 shadow-2xl rounded-lg">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 pb-6 border-b border-gray-700">
                <div>
                    <div className="flex items-center mb-2">
                        <FaProjectDiagram className="text-3xl text-sky-400 mr-3 hidden sm:block" />
                        <h1 className="text-3xl md:text-4xl font-bold text-white">{project.name}</h1>
                    </div>
                    <p className="text-sm text-gray-500 ml-0 sm:ml-10">Project ID: {project.id}</p>
                </div>
                {project.status && (
                    <span className={`mt-3 sm:mt-0 px-4 py-1.5 text-sm font-semibold rounded-full whitespace-nowrap ${project.status.toLowerCase() === 'active' ? 'bg-green-600 text-green-100' : project.status.toLowerCase() === 'completed' ? 'bg-blue-600 text-blue-100' : 'bg-yellow-600 text-yellow-100'}`}>
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                )}
            </div>
            
            <div className="space-y-6">
                <section>
                    <h2 className="text-xl font-semibold text-sky-400 mb-3">Project Brief</h2>
                    {project.project_brief ? (
                        <div className="prose prose-invert prose-sm max-w-none text-gray-300 bg-gray-800/50 p-4 rounded-md">
                            <p>{project.project_brief}</p> {/* Assuming brief is simple text, adjust if markdown */} 
                        </div>
                    ) : (
                        <p className="text-gray-500 italic p-4 bg-gray-800/30 rounded-md">No project brief has been added yet.</p>
                    )}
                </section>

                <section>
                    <h2 className="text-xl font-semibold text-sky-400 mb-3">Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        <div className="bg-gray-800/50 p-3 rounded-md">
                            <span className="text-gray-500">Slug:</span>
                            <p className="text-gray-300 break-all">{project.project_slug || 'N/A'}</p>
                        </div>
                        <div className="bg-gray-800/50 p-3 rounded-md">
                            <span className="text-gray-500">Created:</span>
                            <p className="text-gray-300">{new Date(project.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                </section>

                {/* Placeholder for more project-specific content */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                    <p className="text-center text-gray-600 italic">More project-specific details and management tools will go here.</p>
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 