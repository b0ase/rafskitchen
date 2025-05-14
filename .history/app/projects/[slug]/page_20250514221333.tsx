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
  };

  return (
    <div>
      <h1>Test Project Page</h1>
      <p>Slug: {slug}</p>
    </div>
  );
}
