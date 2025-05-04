'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import ClientSignupForm from '@/app/components/ClientSignupForm';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import Link from 'next/link';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// --- DEBUG LOG: Check if env vars are loaded client-side ---
console.log('Supabase URL:', supabaseUrl ? 'Loaded' : 'MISSING!');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Loaded' : 'MISSING!');
// -----------------------------------------------------------

const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Treatment {
  id: string;
  phase: 'current' | 'next' | 'ultimate';
  title: string;
  description: string;
  sort_order: number;
}

interface TimelineEntry {
  id: string;
  phase: 'now' | 'next' | 'roadmap';
  title: string;
  description: string | null;
  sort_order: number;
  is_summary: boolean;
  preview_image_url?: string | null;
}

interface Feature {
  id: string;
  feature: string;
  priority: string;
  est_cost: number | null;
  status: string;
  approved: boolean;
  completed?: boolean;
}

interface Feedback {
  id: string;
  email: string;
  message: string;
  created_at: string;
}

interface ProjectData {
  id: string;
  client_name: string;
  client_email: string;
  project_name: string;
  project_description: string;
  project_type: string[];
  budget_tier: string | null;
  timeline_preference: string | null;
  required_integrations: string[] | null;
  design_style_preference: string | null;
  key_features: string | null;
  anything_else: string | null;
  slug: string;
  github_repo_url?: string | null;
  preview_url?: string | null;
}

interface ClientFormData {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
  logo_url?: string;
  project_brief?: string;
  project_types?: string[];
  requested_budget?: number | string | null;
  github_links?: string | null;
}

export default function ProjectPage({ params, searchParams }: { params: { slug: string }, searchParams?: { [key: string]: string | string[] | undefined } }) {
  const projectSlug = params.slug; // Get slug from params
  const notionUrl = typeof searchParams?.notionUrl === 'string' ? searchParams.notionUrl : undefined; // Example of getting search param

  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [treatments, setTreatments] = useState<Treatment[]>([]);
  const [timeline, setTimeline] = useState<TimelineEntry[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [feedbackForm, setFeedbackForm] = useState({ email: '', message: '' });
  const [feedbackSuccess, setFeedbackSuccess] = useState('');
  const [newFeatureForm, setNewFeatureForm] = useState({ name: '', priority: 'Medium' });
  const [newFeatureSuccess, setNewFeatureSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Attempting to fetch client with slug inside fetchData: ${projectSlug}`);
      const { data: coreData, error: coreError } = await supabase
        .from('clients')
        .select('*')
        .eq('slug', projectSlug)
        .single();

      console.log('Supabase core fetch result:', { coreData, coreError });

      if (coreError || !coreData) {
        console.error('Condition (coreError || !coreData) is TRUE. Setting error.');
        setError('Could not load project details.');
        setLoading(false);
        return;
      }
      console.log('Condition (coreError || !coreData) is FALSE. Proceeding...');
      setProjectData(coreData);

      const [treatmentsRes, timelineRes, featuresRes, feedbackRes] = await Promise.all([
        supabase.from('project_treatments').select('*').eq('project_slug', projectSlug).order('sort_order', { ascending: true }),
        supabase.from('project_timelines').select('*, is_summary, preview_image_url').eq('project_slug', projectSlug).order('sort_order', { ascending: true }),
        supabase.from('project_features').select('*, completed').eq('project_slug', projectSlug).order('priority', { ascending: true }),
        supabase.from('project_feedback').select('*').eq('project_slug', projectSlug).order('created_at', { ascending: false })
      ]);

      setTreatments(treatmentsRes.data || []);
      setTimeline(timelineRes.data || []);
      
      // Process features - check for and add defaults
      const existingFeatures = featuresRes.data || [];
      const defaultFeatures = [
        { feature: 'Initial Consultation & Requirements Gathering', priority: 'High', status: 'Core', est_cost: 0, completed: true }, // Example cost/status
        { feature: 'Domain Name Setup/Configuration', priority: 'High', status: 'Core', est_cost: 15 },
        { feature: 'Hosting Setup & Configuration', priority: 'High', status: 'Core', est_cost: 100 },
        { feature: 'Basic Website Structure (Homepage, About, Contact)', priority: 'High', status: 'Core', est_cost: 250 },
        { feature: 'Responsive Design (Mobile/Tablet)', priority: 'High', status: 'Core', est_cost: 150 },
        { feature: 'Contact Form Setup', priority: 'Medium', status: 'Core', est_cost: 50 },
        { feature: 'Basic SEO Setup (Titles, Metas)', priority: 'Medium', status: 'Core', est_cost: 75 },
        { feature: 'Deployment to Live Server', priority: 'High', status: 'Core', est_cost: 50 },
        { feature: 'Handover & Basic Training', priority: 'Medium', status: 'Core', est_cost: 100 },
      ];

      // Adjust type to match the data being inserted
      const featuresToAdd: (Omit<Feature, 'id' | 'approved' | 'completed'> & { project_slug: string, completed?: boolean })[] = []; 
      defaultFeatures.forEach(defaultFeature => {
        const exists = existingFeatures.some(existing => existing.feature === defaultFeature.feature);
        if (!exists) {
          featuresToAdd.push({
             project_slug: projectSlug, 
             ...defaultFeature 
            });
        }
      });

      let finalFeatures = existingFeatures;
      if (featuresToAdd.length > 0) {
         console.log(`Adding ${featuresToAdd.length} default features...`);
         const { data: addedFeatures, error: insertError } = await supabase
           .from('project_features')
           .insert(featuresToAdd)
           .select('*, completed');

         if (insertError) {
           console.error("Error inserting default features:", insertError);
           // Continue with existing features even if defaults fail to insert
         } else if (addedFeatures) {
           finalFeatures = [...existingFeatures, ...addedFeatures];
         }
      }
      
      setFeatures(finalFeatures);
      setFeedback(feedbackRes.data || []);

    } catch (err) {
      console.error('Unexpected error in fetchData try block:', err);
      setError('An unexpected error occurred while loading project data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log('Fetching data for slug:', projectSlug);
    // -------------------------------------
    // Explicitly check for projectSlug before defining/calling fetchData
    if (projectSlug) {
      fetchData(); // Call fetchData only if projectSlug is truthy
    } else {
      // Handle the case where slug is initially missing or becomes undefined
      console.error('Project slug is missing or undefined, cannot fetch data.');
      setError("Project slug is missing.");
      setLoading(false);
    }
  }, [projectSlug]); // Re-run effect if projectSlug changes

  // Function to toggle feature approval status
  const handleToggleFeatureApproval = async (featureId: string, currentStatus: boolean) => {
    if (!projectData) return;

    const newStatus = !currentStatus;

    // Optimistic UI update
    setFeatures(currentFeatures => 
      currentFeatures.map(f => 
        f.id === featureId ? { ...f, approved: newStatus } : f
      )
    );

    // Update database
    const { error } = await supabase
      .from('project_features')
      .update({ approved: newStatus })
      .eq('id', featureId);

    if (error) {
      console.error("Error updating feature approval:", error);
      setError(`Failed to update feature status: ${error.message}`);
      // Revert optimistic update on error
      setFeatures(currentFeatures => 
        currentFeatures.map(f => 
          f.id === featureId ? { ...f, approved: currentStatus } : f
        )
      );
    }
  };

  // Function to toggle feature completed status
  const handleToggleFeatureCompleted = async (featureId: string, currentStatus: boolean | undefined) => {
    if (!projectData) return;

    const newStatus = !currentStatus; // Toggle status

    // Optimistic UI update
    setFeatures(currentFeatures => 
      currentFeatures.map(f => 
        f.id === featureId ? { ...f, completed: newStatus } : f
      )
    );

    // Update database
    const { error } = await supabase
      .from('project_features')
      .update({ completed: newStatus })
      .eq('id', featureId);

    if (error) {
      console.error("Error updating feature completion:", error);
      setError(`Failed to update feature status: ${error.message}`);
      // Revert optimistic update on error
      setFeatures(currentFeatures => 
        currentFeatures.map(f => 
          f.id === featureId ? { ...f, completed: currentStatus } : f
        )
      );
    }
  };

  // Function to handle new feature submission
  const handleNewFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, priority } = newFeatureForm;
    if (!name || !projectSlug) return;

    setLoading(true); // Indicate loading
    setNewFeatureSuccess('');
    setError(null);

    const newFeatureData = {
      project_slug: projectSlug,
      feature: name,
      priority: priority,
      status: 'Requested', // Default status for client requests
      approved: false, // Default to not approved
      // est_cost is left null by default
    };

    const { data, error } = await supabase
      .from('project_features')
      .insert(newFeatureData)
      .select() // Select the newly inserted row
      .single(); // Expect a single row back

    if (error) {
      console.error("Error inserting new feature:", error);
      setError(`Failed to submit feature request: ${error.message}`);
    } else if (data) {
      // Optimistic UI update: Add the new feature to the list
      setFeatures(currentFeatures => [...currentFeatures, data]);
      setNewFeatureForm({ name: '', priority: 'Medium' }); // Reset form
      setNewFeatureSuccess('Feature request submitted successfully!');
    }
    setLoading(false);
  };

  async function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    const { email, message } = feedbackForm;
    if (!email || !message) return;
    const { error } = await supabase.from('project_feedback').insert({
      project_slug: projectSlug,
      email,
      message,
    });
    if (!error) {
      setFeedbackSuccess('Thank you for your feedback!');
      setFeedbackForm({ email: '', message: '' });
    }
  }

  const handleUpdateProject = async (updatedFormData: Partial<ClientFormData>) => {
    if (!projectData) return;
    setLoading(true);
    setError(null);

    // Map form data ONLY to columns that EXIST in the clients table schema
    const updatePayload: Partial<{
        name: string | undefined;
        email: string | undefined;
        website: string | undefined;
        notes: string | undefined;
        logo_url: string | undefined;
        phone: string | undefined;
        github_repo_url: string | null | undefined;
        // Remove non-existent columns
    }> = {
      name: updatedFormData.name, 
      email: updatedFormData.email, 
      website: updatedFormData.website,
      notes: updatedFormData.project_brief, // Map project_brief -> notes
      logo_url: updatedFormData.logo_url,
      phone: updatedFormData.phone,
      github_repo_url: updatedFormData.github_links, // Map github_links -> github_repo_url
    };

    // Remove undefined fields to avoid errors during update
    Object.keys(updatePayload).forEach(key => 
      updatePayload[key as keyof typeof updatePayload] === undefined && delete updatePayload[key as keyof typeof updatePayload]
    );

    // Ensure we don't send an empty object if no fields changed
    if (Object.keys(updatePayload).length === 0) {
      console.log("No changes detected to update.");
      setIsEditing(false); // Close edit mode
      setLoading(false);
      return; 
    }

    console.log("Attempting to update clients table with payload:", updatePayload);

    try {
      const { data: updatedClientData, error: updateError } = await supabase
        .from('clients')
        .update(updatePayload) // Use the correctly mapped payload
        .eq('id', projectData.id)
        .select() // Select the updated data
        .single(); // Expect a single row back

      if (updateError) {
        console.error('Error updating project:', updateError);
        setError(`Failed to save changes: ${updateError.message}`);
      } else if (updatedClientData) {
        // Update projectData state with the *actual* data returned from DB
        // This ensures consistency, especially if DB has triggers/defaults
        setProjectData(prev => prev ? { ...prev, ...updatedClientData } : null);
        setFeedbackSuccess("Project details updated successfully!"); // Show success message
        setIsEditing(false);
        
        // Force refresh data to ensure all components reflect the latest changes
        fetchData(); 
      } else {
         // Handle case where update succeeded but no data was returned (shouldn't happen with .single() unless row deleted)
         console.warn("Update seemed successful but no data returned.");
         setIsEditing(false);
      }
    } catch (err) {
       console.error('Unexpected error updating project:', err);
       setError('An unexpected error occurred while saving changes.');
    } finally {
       setLoading(false);
    }
  };

  const phaseLabels: Record<string, string> = {
    current: 'Current State',
    next: 'Next State (Quick Wins)',
    ultimate: 'Ultimate State (Vision)',
  };

  const phases = [
    { key: 'now', label: 'Now (Live)' },
    { key: 'next', label: 'Next (1-4 Weeks)' },
    { key: 'roadmap', label: 'Roadmap (1-6 Months)' },
  ] as const;

  if (loading) {
    return <div className="w-full px-4 py-8 text-center">Loading project details...</div>;
  }

  if (error) {
     return <div className="w-full px-4 py-8 text-center text-red-500">Error: {error}</div>;
  }

  if (!projectData) {
     return <div className="w-full px-4 py-8 text-center">Project details could not be loaded.</div>;
  }

  return (
    <div className="w-full px-4 md:px-8 lg:px-12 py-8">
      <div className="mb-8 flex flex-wrap justify-end gap-4">
          {projectData?.github_repo_url && (
              <a 
                  href={projectData.github_repo_url}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition duration-200 shadow"
              >
                  <FaGithub /> GitHub Repo
              </a>
          )}
      </div>

      {isEditing ? (
        <section className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-white">Edit Project Details</h2>
          <ClientSignupForm 
             initialData={projectData || undefined} 
             onSave={handleUpdateProject}
          />
          <div className="mt-6 flex justify-end gap-4">
             <button 
                onClick={() => setIsEditing(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
             >
                Cancel
             </button>
          </div>
        </section>
      ) : (
        <>
          {/* REMOVED Project Title/Desc Section */}
          {/* 
          <section className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">{projectData.project_name || projectSlug}</h1>
            <p className="text-lg text-gray-300 mb-6">{projectData.project_description || 'No description provided.'}</p>
          </section>
          */}

          {/* Combined Project Info Card */}
          <section className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
            {/* Main Project Title */}
            <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">{projectData.project_name || projectSlug}</h1>
            {/* Project Description */}
            <p className="text-base text-gray-300 mb-4 border-b border-gray-700 pb-4">{projectData.project_description || 'No description provided.'}</p>

            {/* Summary Header + Edit Button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Project Summary</h2>
              <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-1 px-3 rounded text-sm transition duration-200 shadow"
              >
                  Edit Project Details
              </button>
            </div>
            
            {/* Summary Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
              <div>
                <span className="font-semibold text-gray-400">Client Name: </span>
                <span className="text-gray-300">{projectData.client_name || 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400">Client Email: </span>
                <span className="text-gray-300">{projectData.client_email || 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400">Project Type: </span>
                <span className="text-gray-300">{projectData.project_type?.join(', ') || 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400">Budget Tier: </span>
                <span className="text-gray-300">{projectData.budget_tier || 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400">Timeline Preference: </span>
                <span className="text-gray-300">{projectData.timeline_preference || 'N/A'}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-400">Design Style: </span>
                <span className="text-gray-300">{projectData.design_style_preference || 'N/A'}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold text-gray-400">Required Integrations: </span>
                <span className="text-gray-300">{projectData.required_integrations?.join(', ') || 'N/A'}</span>
              </div>
              <div className="md:col-span-2">
                <span className="font-semibold text-gray-400">Key Features: </span>
                <span className="text-gray-300 whitespace-pre-line">{projectData.key_features || 'N/A'}</span>
              </div>
               <div className="md:col-span-2">
                <span className="font-semibold text-gray-400">Anything Else: </span>
                <span className="text-gray-300 whitespace-pre-line">{projectData.anything_else || 'N/A'}</span>
              </div>
            </div>
          </section>
  
          {['current', 'next', 'ultimate'].map(phase => {
            const items = treatments.filter(t => t.phase === phase);
            if (items.length === 0) return null;
            return (
              <section className="mb-8" key={`${phase}-treatments`}>
                <h2 className="text-2xl font-semibold mb-4 text-cyan-400">{phaseLabels[phase]}</h2>
                <div className="space-y-3">
                  {items.map(item => (
                    <div key={item.id} className="bg-gray-800 p-4 rounded shadow">
                      {item.title && <h3 className="text-lg font-bold mb-1 text-white">{item.title}</h3>}
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}

          <section className="mb-8" key="timeline-section">
              <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Development Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {phases.map(phase => {
                  // Find the first timeline item in this phase with a preview URL
                  const previewItem = timeline.find(t => t.phase === phase.key && t.preview_image_url);
                  const previewUrl = previewItem?.preview_image_url;

                  if (phase.key === 'now') {
                    // Render 'now' phase card differently
                    return (
                      <div key={phase.key} className="bg-gray-900 p-4 rounded shadow flex flex-col">
                        {/* Card Header with Button */}
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-lg font-bold text-white">{phase.label}</h3>
                          {/* View Live Button */}
                          <a 
                            href={`https://${projectSlug}`} // Link to actual live site
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-1 px-2 rounded transition duration-200 shadow"
                          >
                            View Live
                          </a>
                        </div>
                        
                        {/* Preview Panel - MODIFIED for Live Site iframe with Zoom-out and fitted container */}
                        <div 
                          className="mb-4 bg-gray-700 rounded flex items-center justify-center text-gray-500 overflow-hidden border border-gray-700 relative" 
                          style={{
                             width: '448px', // = 1280 * 0.35
                             height: '252px' // = 720 * 0.35
                          }}
                        >
                          {/* Simple placeholder instead of trying to load missing images */}
                          <div className="w-full h-full flex items-center justify-center bg-gray-800">
                            <div className="text-center">
                              <span className="text-cyan-400 text-lg font-semibold">
                                {projectSlug}
                              </span>
                              <p className="text-gray-400 text-sm mt-2">
                                Preview available at<br/>
                                <a 
                                  href={`/previews/${projectSlug}`} 
                                  target="_blank"
                                  className="text-blue-400 hover:underline"
                                >
                                  /previews/{projectSlug}
                                </a>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* --- Feature Request Form Start --- */}
                        <div className="my-4 pt-4 border-t border-gray-700">
                          <h4 className="text-md font-semibold mb-2 text-white">Request Feature for {phase.label}</h4>
                          {/* Note: Submission still goes to the main features list, not tied to phase here */}
                          <form onSubmit={handleNewFeatureSubmit} className="flex flex-col gap-2">
                            <input
                              type="text"
                              placeholder="Feature Name / Description"
                              value={newFeatureForm.name}
                              onChange={(e) => setNewFeatureForm(f => ({ ...f, name: e.target.value }))}
                              className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded w-full text-white" 
                              required
                            />
                            <div className="flex gap-2 items-center">
                              <select
                                value={newFeatureForm.priority}
                                onChange={(e) => setNewFeatureForm(f => ({ ...f, priority: e.target.value }))}
                                className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded w-auto text-white flex-grow"
                              >
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                              </select>
                              <button
                                type="submit"
                                disabled={loading} // Disable button while loading
                                className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {loading ? '...' : 'Request'}
                              </button>
                            </div>
                          </form>
                          {/* Potentially show success message specific to this card if needed, 
                              but global success message might be sufficient. 
                              Keeping global for now. */}
                        </div>
                        {/* --- Feature Request Form End --- */}
                        
                        {/* Rest of the card content (Summary/Items) */}
                        <div className="flex-grow">
                          {/* Render Summary Items First */}
                          {timeline.filter(t => t.phase === phase.key && t.is_summary).map(t => (
                            <div key={`${t.id}-summary`} className="mb-3 pb-3 border-b border-gray-700 last:border-b-0 last:pb-0 last:mb-0">
                              <h4 className="text-md font-semibold text-cyan-300 mb-1">{t.title}</h4>
                              {t.description && <p className="text-sm text-gray-400 italic">{t.description}</p>}
                            </div>
                          ))}
                          
                          {/* Render Regular Timeline Items */}
                          <ul className="list-disc pl-4 space-y-1">
                            {(() => {
                              const regularTimeline = timeline.filter(t => t.phase === phase.key && !t.is_summary);
                              // Original simple emptiness check for timeline items
                              if (regularTimeline.length === 0 && !timeline.some(t => t.phase === phase.key && t.is_summary)) {
                                 return <li className="text-gray-500 italic">No items yet.</li>;
                              }
                              return regularTimeline.map(t => (
                                <li key={t.id} className="text-gray-300">
                                  <strong>{t.title}</strong>
                                  {t.description && <span className="ml-1 text-gray-400"> - {t.description}</span>}
                                </li>
                              ));
                            })()}
                          </ul>
                        </div>

                        {/* --- Features Table (Conditionally Rendered for 'now' phase AFTER timeline items) --- */}
                        {phase.key === 'now' && (
                          <div className="mt-4 pt-4 border-t border-gray-700">
                            <h4 className="text-md font-semibold mb-3 text-white">Feature & Budget Collaboration</h4>
                            <div className="overflow-x-auto bg-gray-900">
                              <table className="w-full text-left text-sm"> 
                                <thead className="border-b border-gray-700">
                                  <tr>
                                    <th className="py-2 px-3 text-gray-400">Feature</th>
                                    <th className="py-2 px-3 text-gray-400">Priority</th>
                                    <th className="py-2 px-3 text-gray-400">Est. Cost</th>
                                    <th className="py-2 px-3 text-gray-400">Status</th>
                                    <th className="py-2 px-3 text-gray-400">Approved</th>
                                    <th className="py-2 px-3 text-gray-400">Completed</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {features.length === 0 ? (
                                    <tr>
                                      <td colSpan={6} className="text-gray-500 italic py-2 px-3">No features yet.</td>
                                    </tr>
                                  ) : (
                                    features.map(f => (
                                      <tr key={f.id} className="border-b border-gray-800 hover:bg-gray-800">
                                        <td className="py-2 px-3 text-gray-300">{f.feature}</td>
                                        <td className="py-2 px-3 text-gray-300">
                                          <span className={`px-2 py-0.5 rounded text-xs font-medium 
                                            ${f.priority === 'High' ? 'bg-red-800 text-red-100' : 
                                              f.priority === 'Medium' ? 'bg-yellow-800 text-yellow-100' : 
                                              f.priority === 'Low' ? 'bg-green-800 text-green-100' : 
                                              'bg-gray-700 text-gray-200' 
                                            }`}>
                                            {f.priority}
                                          </span>
                                        </td>
                                        <td className="py-2 px-3 text-gray-300">{f.est_cost ? `£${f.est_cost}` : '-'}</td>
                                        <td className="py-2 px-3 text-gray-300">{f.status}</td>
                                        <td className="py-2 px-3 text-center">
                                          <input 
                                            type="checkbox" 
                                            checked={f.approved}
                                            onChange={() => handleToggleFeatureApproval(f.id, f.approved)}
                                            className="form-checkbox h-5 w-5 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 cursor-pointer"
                                            aria-label={`Approve feature ${f.feature}`}
                                          />
                                        </td>
                                        <td className="py-2 px-3 text-center">
                                          <input 
                                            type="checkbox" 
                                            checked={!!f.completed} 
                                            onChange={() => handleToggleFeatureCompleted(f.id, f.completed)}
                                            className="form-checkbox h-5 w-5 text-green-600 bg-gray-700 border-gray-600 rounded focus:ring-green-500 cursor-pointer"
                                            aria-label={`Mark feature ${f.feature} as completed`}
                                          />
                                        </td>
                                      </tr>
                                    ))
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}
                        {/* --- END Features Table --- */}

                      </div>
                    );
                  } else {
                    // Render other phase cards normally (Next & Roadmap)
                    // Find the first timeline item in this phase with a preview URL (Still useful for 'Next')
                    const previewItem = timeline.find(t => t.phase === phase.key && t.preview_image_url);
                    const previewUrl = previewItem?.preview_image_url; 
                    
                    return (
                      <div key={phase.key} className="bg-gray-900 p-4 rounded shadow flex flex-col">
                        {/* Card Header with Button */}
                        <div className="flex justify-between items-center mb-3">
                           <h3 className="text-lg font-bold text-white">{phase.label}</h3>
                           {/* Conditional Button based on phase */}
                           {phase.key === 'next' && (
                             <Link href={`/previews/${projectSlug}`} passHref legacyBehavior>
                               <a
                                 target="_blank" // Open preview in new tab
                                 rel="noopener noreferrer"
                                 className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold py-1 px-2 rounded transition duration-200 shadow"
                               >
                                 View Preview
                               </a>
                             </Link>
                           )}
                           {phase.key === 'roadmap' && notionUrl && ( // Only show if notionUrl exists
                             <Link href={`/projects/${projectSlug}/roadmap`} passHref legacyBehavior>
                               <a 
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="bg-red-600 hover:bg-red-700 text-white text-xs font-semibold py-1 px-2 rounded transition duration-200 shadow"
                               >
                                 View Roadmap
                               </a>
                             </Link>
                           )}
                        </div>

                        {/* Preview Panel - Conditional Rendering */}
                        <div className="mb-4 aspect-video bg-gray-800 rounded flex items-center justify-center text-gray-500 overflow-hidden border border-gray-700">
                          {/* IFRAME for 'next' phase */}
                          {phase.key === 'next' ? (
                             <iframe
                                src={`/previews/${projectSlug}`} 
                                title={`${phase.label} Live Preview for ${projectSlug}`}
                                style={{ width: '100%', height: '100%', border: 'none' }}
                                loading="lazy" 
                             />
                          ) : (
                          /* TBD placeholder for 'roadmap' phase (or any other future phase) */
                          <span className="text-sm italic">TBD</span>
                          )}
                          {/* Original logic for images/TBD - can be removed or kept commented */}
                          {/* 
                          {previewUrl ? ( 
                             <img src={previewUrl} alt={`${phase.label} Preview`} className="object-cover w-full h-full"/> 
                          ) : ( 
                             <span className="text-sm italic">TBD</span> 
                          )} 
                          */}
                        </div>
        
                        {/* --- Feature Request Form Start --- */}
                        <div className="my-4 pt-4 border-t border-gray-700">
                          <h4 className="text-md font-semibold mb-2 text-white">Request Feature for {phase.label}</h4>
                          {/* Note: Submission still goes to the main features list, not tied to phase here */}
                          <form onSubmit={handleNewFeatureSubmit} className="flex flex-col gap-2">
                            <input
                              type="text"
                              placeholder="Feature Name / Description"
                              value={newFeatureForm.name}
                              onChange={(e) => setNewFeatureForm(f => ({ ...f, name: e.target.value }))}
                              className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded w-full text-white" 
                              required
                            />
                            <div className="flex gap-2 items-center">
                              <select
                                value={newFeatureForm.priority}
                                onChange={(e) => setNewFeatureForm(f => ({ ...f, priority: e.target.value }))}
                                className="px-3 py-2 text-sm bg-gray-800 border border-gray-700 rounded w-auto text-white flex-grow"
                              >
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                              </select>
                              <button
                                type="submit"
                                disabled={loading} // Disable button while loading
                                className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {loading ? '...' : 'Request'}
                              </button>
                            </div>
                          </form>
                          {/* Potentially show success message specific to this card if needed, 
                              but global success message might be sufficient. 
                              Keeping global for now. */}
                        </div>
                        {/* --- Feature Request Form End --- */}
                        
                        {/* Rest of the card content (Summary/Items) */}
                        <div className="flex-grow">
                          {/* Render Summary Items First */}
                          {timeline.filter(t => t.phase === phase.key && t.is_summary).map(t => (
                            <div key={`${t.id}-summary`} className="mb-3 pb-3 border-b border-gray-700 last:border-b-0 last:pb-0 last:mb-0">
                              <h4 className="text-md font-semibold text-cyan-300 mb-1">{t.title}</h4>
                              {t.description && <p className="text-sm text-gray-400 italic">{t.description}</p>}
                            </div>
                          ))}
                          
                          {/* Render Regular Timeline Items */}
                          <ul className="list-disc pl-4 space-y-1">
                            {(() => {
                              const regularTimeline = timeline.filter(t => t.phase === phase.key && !t.is_summary);
                              // Original simple emptiness check for timeline items
                              if (regularTimeline.length === 0 && !timeline.some(t => t.phase === phase.key && t.is_summary)) {
                                 return <li className="text-gray-500 italic">No items yet.</li>;
                              }
                              return regularTimeline.map(t => (
                                <li key={t.id} className="text-gray-300">
                                  <strong>{t.title}</strong>
                                  {t.description && <span className="ml-1 text-gray-400"> - {t.description}</span>}
                                </li>
                              ));
                            })()}
                          </ul>
                        </div>
                      </div>
                    );
                  }
                })}
              </div>
          </section>

          <section className="mb-8" key="feedback-section">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Requirements & Feedback</h2>
            <form onSubmit={handleFeedbackSubmit} className="flex flex-col md:flex-row gap-3 mb-4">
              <input
                type="email"
                placeholder="Your Email"
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded w-full md:w-1/3 text-white"
                value={feedbackForm.email}
                onChange={e => setFeedbackForm(f => ({ ...f, email: e.target.value }))}
                required
              />
              <input
                type="text"
                placeholder="Your Feedback or Requirement"
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded w-full md:w-2/3 text-white"
                value={feedbackForm.message}
                onChange={e => setFeedbackForm(f => ({ ...f, message: e.target.value }))}
                required
              />
              <button
                type="submit"
                className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Submit
              </button>
            </form>
            {feedbackSuccess && <p className="text-green-400 mb-2">{feedbackSuccess}</p>}
            <div className="mt-6 bg-gray-900 p-4 rounded shadow">
              <h3 className="text-lg font-semibold mb-2 text-white">Recent Feedback</h3>
              <ul className="space-y-2">
                {feedback.length === 0 ? (
                   <li className="text-gray-500 italic">No feedback yet.</li>
                ) : (
                  feedback.map(fb => (
                    <li key={fb.id} className="bg-gray-800 p-3 rounded">
                      <p className="text-gray-300"><strong className="text-white">{fb.email}:</strong> {fb.message}</p>
                      <p className="mt-1 text-xs text-gray-500 text-right">{new Date(fb.created_at).toLocaleString()}</p>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </section>

          {notionUrl && (
            <section className="mb-8" key="notion-section">
              <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Project Docs & Collaboration (Notion)</h2>
              <iframe
                src={notionUrl}
                style={{ width: '100%', height: 600, border: 'none', borderRadius: 8 }}
                allowFullScreen
                title="Project Documentation (Notion)"
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}
