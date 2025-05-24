'use client';

import React, { useEffect, useState, useCallback } from 'react';
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

interface ManagedProject {
  id: string;
  name: string;
  // Add other relevant project fields if needed
}

interface TeamMember {
  user_id: string;
  role: string;
  email?: string; // From auth.users
  display_name?: string; // From profiles
  project_id?: string; // Added to identify the project for removal context
}

interface PlatformUser {
  id: string;
  display_name: string; // Or username, whatever is best for display
}

interface ProjectData {
  id: string;
  name: string; // Client name
  email: string; // Client email
  project_name: string; // Project name
  project_description: string | null; // Project description, allow null
  project_type: string[] | null; // Project types, allow null
  budget_tier: string | null;
  timeline_preference: string | null;
  required_integrations: string[] | null;
  design_style_preference: string | null;
  key_features: string | null;
  anything_else: string | null;
  slug: string; // Project slug
  github_repo_url: string | null; // Allow null
  preview_url: string | null; // Allow null
  website: string | null; // Project website, allow null
  preview_deployment_url: string | null; // Allow null
  user_id: string | null; // Creator user ID, allow null
  created_at: string; // Assuming created_at is included
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
  const [projectMembers, setProjectMembers] = useState<{ display_name: string | null }[]>([]);

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

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Check if the slug parameter looks like a UUID
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);

      let coreDataResult: { data: ProjectData | null; error: any | null };

      if (isUUID) {
        console.log(`Attempting to fetch client with ID inside fetchData: ${slug}`);
        coreDataResult = await supabase
          .from('clients')
          .select('*, user_id')
          .eq('id', slug)
          .maybeSingle();
      } else {
        console.log(`Attempting to fetch client with slug inside fetchData: ${slug}`);
        coreDataResult = await supabase
          .from('clients')
          .select('*, user_id')
          .eq('slug', slug)
          .maybeSingle();
      }

      const { data: coreData, error: coreError } = coreDataResult;

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

      const { data: membersData, error: membersError } = await supabase
        .from('project_users')
        .select('user_id')
        .eq('project_id', coreData.id);

      if (membersError) {
        console.error('Error fetching members for project', coreData.name, ':', membersError);
      }

      let projectMembers: { display_name: string | null }[] = [];
      if (membersData && membersData.length > 0) {
        const memberUserIds = membersData.map(member => member.user_id);
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('display_name, username')
          .in('id', memberUserIds);

        if (profilesError) {
          console.error('Error fetching member profiles:', profilesError);
        }
         
        if (profilesData) {
           projectMembers = profilesData.map(profile => ({ display_name: profile.display_name || profile.username || 'Unnamed Member' }));
        }
      }
       
      setProjectMembers(projectMembers);
      console.log('Fetched project members and updated state:', projectMembers);

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
      console.log('Finished fetching all data.');
    }
  }, [slug]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 p-4 md:p-8">
      <main className="container mx-auto px-4 py-12 md:py-16">
        {/* Project Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-purple-400 mb-3">{projectData.project_name}</h1>
          <p className="text-lg text-gray-400 mb-4">{projectData.project_description}</p>
          <div className="flex space-x-4">
            {projectData.github_repo_url && (
              <a href={projectData.github_repo_url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 flex items-center">
                <FaGithub className="mr-2" /> GitHub
              </a>
            )}
            {projectData.preview_deployment_url && (
              <a href={projectData.preview_deployment_url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 flex items-center">
                <FaExternalLinkAlt className="mr-2" /> Preview
              </a>
            )}
            {projectData.website && (
              <a href={projectData.website} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 flex items-center">
                <FaExternalLinkAlt className="mr-2" /> Live Site
              </a>
            )}
            {showManageMembersButton && (
                <Link href={`/myprojects/${slug}/manage-members`} className="text-purple-400 hover:text-purple-300 flex items-center">
                    <FaUsers className="mr-2" /> Manage Members
                </Link>
            )}
          </div>
        </header>

        {/* Placeholder for Chat Component */}
        {projectData && projectMembers.length > 0 ? (
          <div className="mb-8">
            {/* Replace with your actual Chat Component, passing project ID and members */}
            {/* <ChatComponent projectId={projectData.id} members={projectMembers} /> */}
            <div className="bg-gray-800 shadow rounded-lg p-6 text-center text-gray-400">
              Placeholder for Chat Component for Project: {projectData.name}
              <br/>
              Members fetched: {projectMembers.map(m => m.display_name).join(', ')}
            </div>
          </div>
        ) : projectData && !loading && (
           <div className="bg-gray-800 shadow rounded-lg p-6 text-center text-gray-500 mb-8">
             No members found for this project yet.
           </div>
        )}

        {isOwner && !isEditing && (
          <div className="mb-6">
            <button
              onClick={() => setIsEditing(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150"
            >
              Edit Project Details
            </button>
          </div>
        )}

        {isEditing && (
          <div className="mb-10 bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">Edit Project Details</h2>
            <ClientSignupForm
              initialData={{
                 name: projectData.name,
                 email: projectData.email,
                 project_brief: projectData.project_description ?? '',
                 project_types: projectData.project_type ?? [],
                 website: projectData.website ?? '',
                 phone: '',
                 logo_url: '',
                 requested_budget: projectData.budget_tier ?? '',
                 github_links: projectData.github_repo_url ?? '',
                 id: projectData.id,
                 slug: projectData.slug,
              }}
              onSave={handleUpdateProject}
              onCancel={() => setIsEditing(false)}
            />
          </div>
        )}

        {/* Notion Iframe if URL is present */}
        {notionUrl && (
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-purple-400 mb-6">Project Brief (Notion)</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={notionUrl}
                className="w-full h-[70vh] border-2 border-purple-500 rounded-lg"
                allowFullScreen
                title="Notion Document"
              ></iframe>
            </div>
          </section>
        )}
        
        {/* Treatments Section */}
        {treatments && treatments.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-purple-400 mb-6">Project Treatments</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(phaseLabels).map(([phaseKey, phaseLabel]) => {
                const phaseTreatments = treatments.filter(t => t.phase === phaseKey);
                if (phaseTreatments.length === 0) return null;
                return (
                  <div key={phaseKey} className="bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h3 className="text-xl font-semibold text-purple-300 mb-3">{phaseLabel}</h3>
                    {phaseTreatments.map(treatment => (
                      <div key={treatment.id} className="mb-3 last:mb-0">
                        <h4 className="font-semibold text-gray-100">{treatment.title}</h4>
                        <p className="text-sm text-gray-400">{treatment.description}</p>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Timeline Section */}
        {timeline && timeline.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-purple-400 mb-6">Project Timeline</h2>
            {phases.map(phase => {
              const entriesForPhase = timeline.filter(t => t.phase === phase.key && !t.is_summary);
              const summaryForPhase = timeline.find(t => t.phase === phase.key && t.is_summary);
              if (entriesForPhase.length === 0 && !summaryForPhase) return null;

              return (
                <div key={phase.key} className="mb-8 last:mb-0">
                  <h3 className="text-2xl font-semibold text-purple-300 mb-4">{phase.label}</h3>
                  {summaryForPhase && (
                    <div className="bg-gray-800 p-4 rounded-lg shadow-md mb-4">
                      <h4 className="text-lg font-semibold text-gray-100">{summaryForPhase.title}</h4>
                      {summaryForPhase.description && <p className="text-sm text-gray-400 mt-1">{summaryForPhase.description}</p>}
                    </div>
                  )}
                  <div className="space-y-4">
                    {entriesForPhase.map(entry => (
                      <div key={entry.id} className="bg-gray-800 p-4 rounded-lg shadow-md flex">
                        {entry.preview_image_url && (
                          <img src={entry.preview_image_url} alt={entry.title} className="w-24 h-24 object-cover rounded mr-4"/>
                        )}
                        <div>
                          <h4 className="text-lg font-semibold text-gray-100">{entry.title}</h4>
                          {entry.description && <p className="text-sm text-gray-400 mt-1">{entry.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {/* Features Section */}
        {features && features.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-semibold text-purple-400 mb-6">Features & Scope</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-gray-800 rounded-lg shadow-xl">
                <thead className="bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Feature</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Est. Cost</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Status</th>
                    {isOwner && <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Approved</th>}
                    {isOwner && <th className="px-6 py-3 text-left text-xs font-medium text-purple-300 uppercase tracking-wider">Completed</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {features.map(feature => (
                    <tr key={feature.id} className={`${feature.completed ? 'bg-green-900 opacity-70' : (feature.approved ? 'bg-gray-800' : 'bg-yellow-900 opacity-80')}`}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-100">{feature.feature}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{feature.priority}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {feature.est_cost != null ? `£${feature.est_cost}` : 'TBD'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{feature.status}</td>
                      {isOwner && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => handleToggleFeatureApproval(feature.id, feature.approved)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${feature.approved ? 'bg-green-500 text-green-900 hover:bg-green-600' : 'bg-red-500 text-red-900 hover:bg-red-600'}`}
                          >
                            {feature.approved ? 'Yes' : 'No'}
                          </button>
                        </td>
                      )}
                       {isOwner && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <button 
                            onClick={() => handleToggleFeatureCompleted(feature.id, feature.completed)}
                            className={`px-3 py-1 rounded-full text-xs font-semibold
                              ${feature.completed ? 'bg-blue-500 text-blue-900 hover:bg-blue-600' : 'bg-gray-600 text-gray-200 hover:bg-gray-500'}`}
                          >
                            {feature.completed ? 'Done' : 'Mark Done'}
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
        
        {/* New Feature Request Form (Owners only) */}
        {isOwner && (
           <section className="mb-12 bg-gray-800 p-6 rounded-lg shadow-xl">
            <h2 className="text-2xl font-semibold text-purple-400 mb-4">Request New Feature</h2>
            <form onSubmit={handleNewFeatureSubmit}>
              <div className="mb-4">
                <label htmlFor="featureName" className="block text-sm font-medium text-gray-300 mb-1">Feature Name:</label>
                <input
                  type="text"
                  id="featureName"
                  value={newFeatureForm.name}
                  onChange={(e) => setNewFeatureForm({ ...newFeatureForm, name: e.target.value })}
                  className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="featurePriority" className="block text-sm font-medium text-gray-300 mb-1">Priority:</label>
                <select
                  id="featurePriority"
                  value={newFeatureForm.priority}
                  onChange={(e) => setNewFeatureForm({ ...newFeatureForm, priority: e.target.value })}
                  className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 disabled:opacity-50">
                {loading ? 'Submitting...' : 'Request Feature'}
              </button>
              {newFeatureSuccess && <p className="text-green-400 mt-3">{newFeatureSuccess}</p>}
            </form>
          </section>
        )}


        {/* Feedback Section */}
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-purple-400 mb-6">Client Feedback</h2>
          <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8">
            <form onSubmit={handleFeedbackSubmit}>
              <div className="mb-4">
                <label htmlFor="feedbackEmail" className="block text-sm font-medium text-gray-300 mb-1">Your Email (Optional):</label>
                <input 
                  type="email" 
                  id="feedbackEmail" 
                  value={feedbackForm.email}
                  onChange={e => setFeedbackForm({...feedbackForm, email: e.target.value})}
                  className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="feedbackMessage" className="block text-sm font-medium text-gray-300 mb-1">Message:</label>
                <textarea 
                  id="feedbackMessage" 
                  rows={4}
                  value={feedbackForm.message}
                  onChange={e => setFeedbackForm({...feedbackForm, message: e.target.value})}
                  className="w-full bg-gray-700 border-gray-600 text-gray-200 rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-500"
                  required
                ></textarea>
              </div>
              <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-150">
                Submit Feedback
              </button>
              {feedbackSuccess && <p className="text-green-400 mt-3">{feedbackSuccess}</p>}
            </form>
          </div>

          {feedback.length > 0 ? (
            <div className="space-y-4">
              {feedback.map(item => (
                <div key={item.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                  <p className="text-gray-200">{item.message}</p>
                  <p className="text-xs text-gray-500 mt-2">
                    From: {item.email || 'Anonymous'} on {new Date(item.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No feedback yet for this project.</p>
          )}
        </section>
      </main>
    </div>  );
}
