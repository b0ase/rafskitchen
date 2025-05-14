'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { FaEdit, FaUsers, FaGithub, FaExternalLinkAlt, FaSpinner } from 'react-icons/fa';
import { useParams } from 'next/navigation'; // Import useParams

interface ProjectDetailsData {
  id: string;
  name: string; // Assuming 'name' from clients table is project name
  project_description: string | null; // Reverted to project_description
  user_id: string | null; // Owner of the project (from clients table)
  github_repo_url?: string | null;
  website?: string | null;
  // Add other fields from 'clients' table you want to display
}

export default function MyProjectViewPage() {
  const params = useParams();
  const projectSlug = params.projectSlug as string; // Get projectSlug from dynamic route

  const supabase = createClientComponentClient();
  const [project, setProject] = useState<ProjectDetailsData | null>(null);
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);

      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setAuthUser(currentUser);

      if (!projectSlug) {
        setError('Project slug is missing.');
        setLoading(false);
        return;
      }

      const { data: projectData, error: projectError } = await supabase
        .from('clients') // Projects are in the 'clients' table
        .select('id, name, project_description, user_id, github_repo_url, website') // Reverted to project_description
        .eq('slug', projectSlug)
        .single();

      if (projectError) {
        console.error('Error fetching project details:', projectError);
        setError(`Failed to load project: ${projectError.message}`);
        setProject(null);
      } else if (projectData) {
        setProject(projectData as ProjectDetailsData);
      } else {
        setError('Project not found.');
        setProject(null);
      }
      setLoading(false);
    };

    fetchInitialData();
  }, [projectSlug, supabase]);

  const isOwner = authUser && project && project.user_id === authUser.id;

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100"><FaSpinner className="animate-spin mr-2" /> Loading project...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-red-400">Error: {error}</div>;
  }

  if (!project) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100">Project could not be loaded or not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <main className="container mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-sky-400">{project.name}</h1>
          {isOwner && (
            <Link href={`/myprojects/${projectSlug}/manage-members`} passHref legacyBehavior>
              <a className="inline-flex items-center bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-md text-sm transition-colors shadow hover:shadow-md">
                <FaUsers className="mr-2" /> Manage Members
              </a>
            </Link>
          )}
        </div>

        <div className="bg-gray-800 shadow-xl rounded-lg p-6 mb-8 border border-gray-700/50">
          <h2 className="text-2xl font-semibold text-gray-200 mb-4">Project Overview</h2>
          {project.project_description ? (
            <p className="text-gray-300 mb-4 whitespace-pre-wrap">{project.project_description}</p>
          ) : (
            <p className="text-gray-400 italic mb-4">No description provided.</p>
          )}
          
          <div className="flex flex-wrap gap-4 mt-4">
            {project.website && (
              <a
                href={project.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-3 rounded-md transition-colors"
              >
                <FaExternalLinkAlt className="mr-2" /> Visit Website
              </a>
            )}
            {project.github_repo_url && (
              <a
                href={project.github_repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-3 rounded-md transition-colors"
              >
                <FaGithub className="mr-2" /> GitHub Repository
              </a>
            )}
          </div>
        </div>
        
        {/* Placeholder for more project details, tasks, files, etc. */}
        <div className="bg-gray-800 shadow-xl rounded-lg p-6 border border-gray-700/50">
            <h3 className="text-xl font-semibold text-gray-200 mb-3">Further Details</h3>
            <p className="text-gray-400 italic">More project-specific components and information can be added here.</p>
            {/* Example: Link to an edit page for the owner */}
            {isOwner && (
                 <div className="mt-6">
                    <Link href={`/myprojects/${projectSlug}/edit`} passHref legacyBehavior>
                        <a className="inline-flex items-center text-sm bg-yellow-600 hover:bg-yellow-500 text-white font-medium py-2 px-3 rounded-md transition-colors">
                            <FaEdit className="mr-2" /> Edit Project Details
                        </a>
                    </Link>
                 </div>
            )}
        </div>

      </main>
    </div>
  );
} 