'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Ensure these are loaded correctly, potentially from a shared config or env variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define an interface for the project data we expect
interface Project {
  id: string;
  slug: string;
  project_name: string;
  client_name: string;
  status: string; // From the migration
  preview_deployment_url: string | null; // From the migration
  // Add other fields as needed
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProjects() {
      setLoading(true);
      setError(null);
      try {
        // Select only necessary columns
        const { data, error: fetchError } = await supabase
          .from('clients') // Assuming projects are stored in the 'clients' table
          .select('id, slug, project_name, client_name, status, preview_deployment_url')
          .order('created_at', { ascending: false });

        if (fetchError) {
          throw fetchError;
        }

        setProjects(data || []);
      } catch (err: any) {
        console.error("Error fetching projects:", err);
        setError(`Failed to load projects: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Project Management</h1>
        <Link href="/admin">
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm">
            Back to Dashboard
          </button>
        </Link>
      </div>

      {loading && <p>Loading projects...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && !error && (
        <div className="bg-gray-800/50 rounded-lg shadow-md overflow-hidden">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-700/50 text-xs text-gray-300 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Project Name</th>
                <th className="px-6 py-3">Client Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Preview URL</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-400 italic">No projects found.</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{project.project_name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{project.client_name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                        ${project.status === 'approved' ? 'bg-green-700 text-green-100' : 
                          project.status === 'pending' ? 'bg-yellow-700 text-yellow-100' : 
                          project.status === 'rejected' ? 'bg-red-700 text-red-100' : 
                          'bg-gray-600 text-gray-200'
                        }`}>
                        {project.status || 'unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-blue-400 hover:underline truncate max-w-xs">
                      {project.preview_deployment_url ? (
                        <a href={project.preview_deployment_url} target="_blank" rel="noopener noreferrer">
                          {project.preview_deployment_url}
                        </a>
                      ) : (
                        <span className="text-gray-500 italic">Not set</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {/* Placeholder for Edit Button */}
                      <button 
                        // onClick={() => handleEdit(project.id)} // TODO: Implement edit functionality
                        className="text-indigo-400 hover:text-indigo-300 font-medium text-sm"
                        disabled // Remove disabled when implemented
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
} 