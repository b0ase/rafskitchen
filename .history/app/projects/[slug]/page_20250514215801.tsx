'use client';

import React, { useEffect, useState } from 'react';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import ClientSignupForm from '@/app/components/ClientSignupForm';
import { FaGithub, FaExternalLinkAlt, FaUsers } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// --- DEBUG LOG: Check if env vars are loaded client-side ---
console.log('Supabase URL:', supabaseUrl ? 'Loaded' : 'MISSING!');
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Loaded' : 'MISSING!');
// -----------------------------------------------------------

const supabase = createClientComponentClient();

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
  website?: string | null;
  preview_deployment_url?: string | null;
  user_id?: string;
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
  live_website_url?: string | null;
}

export default function ProjectPage({ params, searchParams }: { params: { slug: string }, searchParams?: { [key: string]: string | string[] | undefined } }) {
  const slug = params.slug;
  const pathname = usePathname();
  const notionUrl = typeof searchParams?.notionUrl === 'string' ? searchParams.notionUrl : undefined;

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
  const [authUser, setAuthUser] = useState<User | null>(null);

  const phases = [
    { key: 'now', label: 'LIVE' },
    { key: 'next', label: 'PREVIEW' },
    { key: 'roadmap', label: 'Roadmap (1-6 Months)' }
  ];
  
  const phaseLabels: { [key: string]: string } = {
    current: 'Current Focus',
    next: 'Next Up',
    ultimate: 'Ultimate State (Vision)',
  };

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setAuthUser(user);
    };
    getUser();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log(`Attempting to fetch client with slug inside fetchData: ${slug}`);
      const response: { data: ProjectData | null; error: any | null } = await supabase
        .from('clients')
        .select('*, user_id')
        .eq('slug', slug)
        .single();

      const { data: coreData, error: coreError } = response;

      console.log('Supabase core fetch result:', { coreData, coreError });

      if (coreError) {
        console.error('Supabase error fetching client:', coreError);
        setError(`Error loading project details: ${coreError.message}`);
        setLoading(false);
        return;
      } 
      if (!coreData) {
        console.error('No client data returned from Supabase for slug:', slug);
        setError('Could not find project details for this slug.');
        setLoading(false);
        return;
      }

      console.log('Successfully fetched core project data.');
      setProjectData(coreData);

      const [treatmentsRes, timelineRes, featuresRes, feedbackRes] = await Promise.all([
        supabase.from('project_treatments').select('*').eq('project_slug', slug).order('sort_order', { ascending: true }),
        supabase.from('project_timelines').select('*, is_summary, preview_image_url').eq('project_slug', slug).order('sort_order', { ascending: true }),
        supabase.from('project_features').select('*, completed').eq('project_slug', slug).order('priority', { ascending: true }),
        supabase.from('project_feedback').select('*').eq('project_slug', slug).order('created_at', { ascending: false })
      ]);

      setTreatments(treatmentsRes.data || []);
      setTimeline(timelineRes.data || []);
      
      const existingFeatures = featuresRes.data || [];
      console.log(`Fetched ${existingFeatures.length} existing features for slug ${slug}:`, existingFeatures.map(f => f.feature));

      const defaultFeatures = [
        { feature: 'Initial Consultation & Requirements Gathering', priority: 'High', status: 'Core', est_cost: 0, completed: true },
        { feature: 'Domain Name Setup/Configuration', priority: 'High', status: 'Core', est_cost: 15 },
        { feature: 'Hosting Setup & Configuration', priority: 'High', status: 'Core', est_cost: 100 },
        { feature: 'Basic Website Structure (Homepage, About, Contact)', priority: 'High', status: 'Core', est_cost: 250 },
        { feature: 'Responsive Design (Mobile/Tablet)', priority: 'High', status: 'Core', est_cost: 150 },
        { feature: 'Contact Form Setup', priority: 'Medium', status: 'Core', est_cost: 50 },
        { feature: 'Basic SEO Setup (Titles, Metas)', priority: 'Medium', status: 'Core', est_cost: 75 },
        { feature: 'Deployment to Live Server', priority: 'High', status: 'Core', est_cost: 50 },
        { feature: 'Handover & Basic Training', priority: 'Medium', status: 'Core', est_cost: 100 },
      ];

      const featuresToAdd: (Omit<Feature, 'id' | 'approved' | 'completed'> & { project_slug: string, completed?: boolean })[] = []; 
      defaultFeatures.forEach(defaultFeature => {
        const currentSlug = slug;
        const exists = existingFeatures.some(existing => 
           existing.feature?.trim().toLowerCase() === defaultFeature.feature.trim().toLowerCase()
        );
        
        if (!exists) {
          console.log(`[${currentSlug}] Default feature "${defaultFeature.feature}" does not exist, preparing to add.`);
          featuresToAdd.push({
             project_slug: currentSlug,
             ...defaultFeature 
            });
        } else {
          console.log(`[${currentSlug}] Default feature "${defaultFeature.feature}" already exists.`);
        }
      });

      let finalFeatures = [...existingFeatures];
      if (featuresToAdd.length > 0) {
         console.log(`[${slug}] Attempting to insert ${featuresToAdd.length} new default features...`);
         const { data: addedFeatures, error: insertError } = await supabase
           .from('project_features')
           .insert(featuresToAdd)
           .select('*, completed');

         if (insertError) {
           console.error(`[${slug}] Error inserting default features:`, insertError);
         } else if (addedFeatures && addedFeatures.length > 0) {
           console.log(`[${slug}] Successfully inserted ${addedFeatures.length} features:`, addedFeatures.map(f => f.feature));
           finalFeatures = [...finalFeatures, ...addedFeatures];
         } else {
            console.log(`[${slug}] Insert call succeeded but returned no added features.`);
         }
      } else {
          console.log(`[${slug}] No new default features needed insertion.`);
      }

      const uniqueFeatures = Array.from(new Map(finalFeatures.map(f => [f.feature?.trim().toLowerCase(), f])).values());
      console.log(`[${slug}] Total features after processing: ${finalFeatures.length}, Unique features set: ${uniqueFeatures.length}`);

      setFeatures(uniqueFeatures);
      setFeedback(feedbackRes.data || []);

    } catch (err) {
      console.error('Unexpected error in fetchData try block:', err);
      setError('An unexpected error occurred while loading project data.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    console.log('Fetching data for slug:', slug);
    if (slug) {
      fetchData();
    } else {
      console.error('Project slug is missing or undefined, cannot fetch data.');
      setError("Project slug is missing.");
      setLoading(false);
    }
  }, [slug]);

  const handleToggleFeatureApproval = async (featureId: string, currentStatus: boolean) => {
    if (!projectData) return;

    const newStatus = !currentStatus;

    setFeatures(currentFeatures => 
      currentFeatures.map(f => 
        f.id === featureId ? { ...f, approved: newStatus } : f
      )
    );

    const { error: updateError } = await supabase
      .from('project_features')
      .update({ approved: newStatus })
      .eq('id', featureId);

    if (updateError) {
      console.error('Error updating feature approval:', updateError);
      setFeatures(currentFeatures => 
        currentFeatures.map(f => 
          f.id === featureId ? { ...f, approved: currentStatus } : f // Revert optimistic update
        )
      );
      setError('Failed to update feature approval.');
    }
  };
  
  const handleToggleFeatureCompleted = async (featureId: string, currentStatus: boolean | undefined) => {
    if (!projectData) return;
    const newStatus = !currentStatus;

    setFeatures(currentFeatures =>
      currentFeatures.map(f =>
        f.id === featureId ? { ...f, completed: newStatus } : f
      )
    );

    const { error: updateError } = await supabase
      .from('project_features')
      .update({ completed: newStatus })
      .eq('id', featureId);

    if (updateError) {
      console.error('Error updating feature completion:', updateError);
      setFeatures(currentFeatures =>
        currentFeatures.map(f =>
          f.id === featureId ? { ...f, completed: currentStatus } : f
        )
      );
      setError('Failed to update feature completion.');
    }
  };

  const handleNewFeatureSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectData || !newFeatureForm.name.trim()) {
      setError('Project data is not loaded or feature name is empty.');
      return;
    }
    setLoading(true);
    setError(null);
    setNewFeatureSuccess('');

    const featureToInsert = {
      project_slug: slug,
      feature: newFeatureForm.name.trim(),
      priority: newFeatureForm.priority,
      status: 'Requested', // Default status for new requests
      est_cost: null, // Can be filled later
      approved: false, // Needs approval
      completed: false,
    };

    const { data: addedFeature, error: insertError } = await supabase
      .from('project_features')
      .insert(featureToInsert)
      .select('*, completed')
      .single();

    if (insertError) {
      console.error('Error inserting new feature:', insertError);
      setError(`Failed to add feature: ${insertError.message}`);
    } else if (addedFeature) {
      setFeatures(currentFeatures => [...currentFeatures, addedFeature]);
      setNewFeatureSuccess(`Feature "${addedFeature.feature}" requested successfully!`);
      setNewFeatureForm({ name: '', priority: 'Medium' }); // Reset form
    } else {
      setError('Failed to add feature for an unknown reason.');
    }
    setLoading(false);
  };

  async function handleFeedbackSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectData) return;
    setError(null);
    setFeedbackSuccess('');

    const { data, error: insertError } = await supabase
      .from('project_feedback')
      .insert({ 
        project_slug: slug, 
        email: feedbackForm.email, 
        message: feedbackForm.message 
      })
      .select()
      .single();

    if (insertError) {
      setError(`Error submitting feedback: ${insertError.message}`);
    } else if (data) {
      setFeedback([data, ...feedback]);
      setFeedbackSuccess('Feedback submitted, thank you!');
      setFeedbackForm({ email: '', message: '' });
    }
  }

  const handleUpdateProject = async (updatedFormData: Partial<ClientFormData>) => {
    if (!projectData) {
      setError("Project data not loaded, cannot update.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const updatePayload: { [key: string]: any } = {};
      if (updatedFormData.name) updatePayload.client_name = updatedFormData.name; 
      if (updatedFormData.email) updatePayload.client_email = updatedFormData.email;
      if (updatedFormData.phone) updatePayload.phone = updatedFormData.phone;
      if (updatedFormData.website) updatePayload.website = updatedFormData.website;
      if (updatedFormData.logo_url) updatePayload.logo_url = updatedFormData.logo_url;
      if (updatedFormData.project_brief) updatePayload.project_description = updatedFormData.project_brief; 
      if (updatedFormData.project_types) updatePayload.project_type = updatedFormData.project_types; 
      
      const { data: updatedClientData, error: updateError } = await supabase
        .from('clients')
        .update(updatePayload)
        .eq('id', projectData.id)
        .select('*, user_id')
        .single();

      if (updateError) {
        throw updateError;
      }
      if (updatedClientData) {
        setProjectData(updatedClientData);
        setIsEditing(false);
      } else {
        setError("Failed to update project details: No data returned.");
      }
    } catch (err: any) {
      console.error('Error updating project:', err);
      setError(`Failed to update project details: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  const isOwner = authUser && projectData && projectData.user_id === authUser.id;
  const showManageMembersButton = pathname?.startsWith('/myprojects/') && isOwner;

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-950 text-gray-300"><p>Loading project details...</p></div>;
  }

  if (error) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-950 text-red-400"><p>Error: {error}</p></div>;
  }

  if (!projectData) {
    return <div className="flex justify-center items-center min-h-screen bg-gray-950 text-gray-300"><p>No project data found for this slug.</p></div>;
  }

  return (
    <div className="min-h-screen bg-gray-950 text-gray-300">
      <main className="container mx-auto px-4 py-12 md:py-16">
        {projectData ? (
          <>
            <div className="mb-8 md:mb-12">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-4xl md:text-5xl font-bold text-sky-400 break-all">
                  {projectData.project_name || projectData.client_name || 'Project Details'}
                </h1>
              </div>
              <p className="text-sm text-gray-500 mt-2">Project ID: {projectData.id}</p>
            </div>

            <section className="mb-10 p-6 bg-gray-900 rounded-lg shadow-xl border border-gray-700/50">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            </section>

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
                <section className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
                  <h1 className="text-2xl md:text-3xl font-bold mb-2 text-white">{projectData.project_name || slug}</h1>
                  <p className="text-base text-gray-300 mb-4 border-b border-gray-700 pb-4">{projectData.project_description || 'No description provided.'}</p>
                  
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
        
                {['current', 'next', 'ultimate'].map(phaseKey => {
                  const items = treatments.filter(t => t.phase === phaseKey);
                  if (items.length === 0) return null;
                  return (
                    <section className="mb-8" key={`${phaseKey}-treatments`}>
                      <h2 className="text-2xl font-semibold mb-4 text-cyan-400">{phaseLabels[phaseKey]}</h2>
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
                        const previewItem = timeline.find(t => t.phase === phase.key && t.preview_image_url);
                        const previewUrl = previewItem?.preview_image_url;

                        if (phase.key === 'now') {
                          return (
                            <div key={phase.key} className="bg-gray-900 p-4 rounded shadow flex flex-col">
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="text-lg font-bold text-white">{phase.label}</h3>
                                {projectData.website && (
                                  <a 
                                    href={projectData.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-green-600 hover:bg-green-700 text-white text-xs font-semibold py-1 px-2 rounded transition duration-200 shadow"
                                  >
                                    View Live
                                  </a>
                                )}
                              </div>
                              
                              <div 
                                className="mb-4 bg-gray-700 rounded flex items-center justify-center text-gray-500 overflow-hidden border border-gray-700 relative" 
                                style={{
                                   width: '448px',
                                   height: '252px'
                                }}
                              >
                                {projectData.website ? (
                                  <iframe
                                    src={projectData.website}
                                    title={`${phase.label} Live Site Preview for ${projectData.client_name}`}
                                    style={{
                                      width: '1280px',
                                      height: '720px',
                                      transform: 'scale(0.35)',
                                      transformOrigin: '0 0',
                                      border: 'none',
                                      position: 'absolute',
                                      top: 0,
                                      left: 0,
                                    }}
                                    sandbox="allow-scripts allow-same-origin"
                                    loading="lazy"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                    <p className="text-gray-400 italic text-center">
                                      Preview Placeholder
                                      <br />
                                      <span className="text-xs">(No live website URL specified)</span>
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="my-4 pt-4 border-t border-gray-700">
                                <h4 className="text-md font-semibold mb-2 text-white">Request Feature for {phase.label}</h4>
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
                                      disabled={loading}
                                      className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {loading ? '...' : 'Request'}
                                    </button>
                                  </div>
                                </form>
                              </div>
                              
                              <div className="flex-grow">
                                {timeline.filter(t => t.phase === phase.key && t.is_summary).map(t => (
                                  <div key={`${t.id}-summary`} className="mb-3 pb-3 border-b border-gray-700 last:border-b-0 last:pb-0 last:mb-0">
                                    <h4 className="text-md font-semibold text-cyan-300 mb-1">{t.title}</h4>
                                    {t.description && <p className="text-sm text-gray-400 italic">{t.description}</p>}
                                  </div>
                                ))}
                                
                                <ul className="list-disc pl-4 space-y-1">
                                  {(() => {
                                    const regularTimeline = timeline.filter(t => t.phase === phase.key && !t.is_summary);
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
                            </div>
                          );
                        } else {
                          const previewItem = timeline.find(t => t.phase === phase.key && t.preview_image_url);
                          const previewUrl = previewItem?.preview_image_url; 
                          
                          return (
                            <div key={phase.key} className="bg-gray-900 p-4 rounded shadow flex flex-col">
                              <div className="flex justify-between items-center mb-3">
                                 <h3 className="text-lg font-bold text-white">{phase.label}</h3>
                                 {phase.key === 'next' && projectData.preview_deployment_url && (
                                   <Link 
                                      href={projectData.preview_deployment_url} 
                                      target="_blank" 
                                      rel="noopener noreferrer" 
                                      className="text-sm text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                                   >
                                      View Preview <FaExternalLinkAlt />
                                   </Link>
                                 )}
                                 {phase.key === 'roadmap' && notionUrl && (
                                   <Link href={`/projects/${slug}/roadmap`} passHref legacyBehavior>
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

                              <div className="mb-4 aspect-video bg-gray-800 rounded flex items-center justify-center text-gray-500 overflow-hidden border border-gray-700">
                                {phase.key === 'next' ? (
                                  projectData.preview_deployment_url ? (
                                    <iframe
                                      src={projectData.preview_deployment_url}
                                      title={`${phase.label} Preview for ${slug}`}
                                      style={{ 
                                        width: '100%', 
                                        height: '100%', 
                                        border: 'none' 
                                      }}
                                      loading="lazy"
                                      sandbox="allow-scripts allow-same-origin"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800">
                                      <p className="text-gray-400 italic text-center">
                                        Preview URL not set
                                        <br />
                                        <span className="text-xs">(Set via Admin Panel)</span>
                                      </p>
                                    </div>
                                  )
                                ) : (
                                <span className="text-sm italic">TBD</span>
                                )}
                              </div>
                    
                              <div className="my-4 pt-4 border-t border-gray-700">
                                <h4 className="text-md font-semibold mb-2 text-white">Request Feature for {phase.label}</h4>
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
                                      disabled={loading}
                                      className="bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-3 rounded text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      {loading ? '...' : 'Request'}
                                    </button>
                                  </div>
                                </form>
                              </div>
                              
                              <div className="flex-grow">
                                {timeline.filter(t => t.phase === phase.key && t.is_summary).map(t => (
                                  <div key={`${t.id}-summary`} className="mb-3 pb-3 border-b border-gray-700 last:border-b-0 last:pb-0 last:mb-0">
                                    <h4 className="text-md font-semibold text-cyan-300 mb-1">{t.title}</h4>
                                    {t.description && <p className="text-sm text-gray-400 italic">{t.description}</p>}
                                  </div>
                                ))}
                                
                                <ul className="list-disc pl-4 space-y-1">
                                  {(() => {
                                    const regularTimeline = timeline.filter(t => t.phase === phase.key && !t.is_summary);
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
          </>
        )}
      </main>
    </div>
  );
}
