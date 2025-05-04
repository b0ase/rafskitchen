'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Ensure these are loaded correctly
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Define an interface for the project data we expect - using correct field names
interface Project {
  id: string;
  slug: string;
  name: string; // Client/Project Name (from form)
  email: string | null; // Client Email (from form)
  status: string;
  preview_deployment_url: string | null;
  website: string | null;
  notes: string | null; // Actual column name for brief/description
  // Add other fields from 'clients' table if needed
}

// Define the shape of the form data for editing - using correct field names
interface EditFormData {
  name: string;
  email: string | null;
  website: string | null;
  preview_deployment_url: string | null;
  notes: string | null; // Use 'notes' here as well
  // Add other editable fields if necessary
}

// --- Edit Project Modal Component ---
function EditProjectModal({ 
  project,
  onSave,
  onCancel,
  isOpen 
}: { 
  project: Project | null;
  onSave: (id: string, formData: EditFormData) => Promise<void>;
  onCancel: () => void;
  isOpen: boolean;
}) {
  const [formData, setFormData] = useState<EditFormData>({
    name: '',
    email: null,
    website: null,
    preview_deployment_url: null,
    notes: null
  });
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Pre-fill form when project data changes
    if (project) {
      setFormData({
        name: project.name || '',
        email: project.email || null,
        website: project.website || null,
        preview_deployment_url: project.preview_deployment_url || null,
        notes: project.notes || null,
      });
    } else {
      // Reset form
      setFormData({
        name: '',
        email: null,
        website: null,
        preview_deployment_url: null,
        notes: null
      });
    }
  }, [project]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value || null }));
  };

  const handleSave = async () => {
    if (!project) return;
    setIsSaving(true);
    await onSave(project.id, formData);
    setIsSaving(false);
  };

  if (!isOpen || !project) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-white">Edit Project: {project.name}</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Client/Project Name</label>
            <input type="text" id="name" name="name" value={formData.name || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
          </div>
           <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Client Email</label>
            <input type="email" id="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
          </div>
          <div>
            <label htmlFor="website" className="block text-sm font-medium text-gray-300 mb-1">Live Website URL</label>
            <input type="url" id="website" name="website" placeholder="https://example.com" value={formData.website || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
          </div>
          <div>
            <label htmlFor="preview_deployment_url" className="block text-sm font-medium text-gray-300 mb-1">Preview Deployment URL</label>
            <input type="url" id="preview_deployment_url" name="preview_deployment_url" placeholder="https://project-preview.vercel.app" value={formData.preview_deployment_url || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white" />
          </div>
           <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-300 mb-1">Notes/Project Brief</label>
            <textarea id="notes" name="notes" rows={3} value={formData.notes || ''} onChange={handleChange} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white"></textarea>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <button 
            onClick={onCancel}
            className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button 
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
// --- End Edit Project Modal ---

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Select correct columns based on form and likely schema
      const { data, error: fetchError } = await supabase
        .from('clients')
        .select('id, slug, name, email, status, preview_deployment_url, website, notes')
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
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleEditClick = (project: Project) => {
    setEditingProject(project);
    setIsEditModalOpen(true);
  };

  const handleCancelEdit = () => {
    setIsEditModalOpen(false);
    setEditingProject(null);
  };

  const handleSaveEdit = async (id: string, formData: EditFormData) => {
    setError(null);
    try {
      // Prepare payload with correct fields matching EditFormData and Project interface
      const updatePayload: Partial<Omit<Project, 'id' | 'slug' | 'status'>> = {
        name: formData.name,
        email: formData.email,
        website: formData.website,
        preview_deployment_url: formData.preview_deployment_url,
        notes: formData.notes,
      };

      const { error: updateError } = await supabase
        .from('clients')
        .update(updatePayload)
        .eq('id', id);

      if (updateError) {
        throw updateError;
      }

      await fetchProjects(); 
      handleCancelEdit();

    } catch (err: any) {
      console.error("Error saving project:", err);
      setError(`Failed to save project: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Project Management</h1>
        <Link href="/admin">
          <button className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded text-sm">
            Back to Dashboard
          </button>
        </Link>
      </div>

      {loading && <p>Loading projects...</p>}
      {error && !isEditModalOpen && <p className="text-red-500 mb-4">Error: {error}</p>}

      {!loading && (
        <div className="bg-gray-800/50 rounded-lg shadow-md overflow-hidden">
          <table className="w-full table-auto text-left">
            <thead className="bg-gray-700/50 text-xs text-gray-300 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3">Client/Project Name</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Preview URL</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-400 italic">No projects found.</td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-700/30">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{project.name || 'N/A'}</td>
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
                      <button 
                        onClick={() => handleEditClick(project)} 
                        className="text-indigo-400 hover:text-indigo-300 font-medium text-sm"
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

      <EditProjectModal 
        isOpen={isEditModalOpen} 
        project={editingProject}
        onSave={handleSaveEdit}
        onCancel={handleCancelEdit}
      />

    </div>
  );
} 