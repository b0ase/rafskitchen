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
  description: string;
  sort_order: number;
}

interface Feature {
  id: string;
  feature: string;
  priority: string;
  est_cost: number | null;
  status: string;
  approved: boolean;
}

interface Feedback {
  id: string;
  email: string;
  message: string;
  created_at: string;
}

// Added interface for enhancement proposals
interface EnhancementProposal {
  id: string;
  title: string;
  description: string | null;
  type: 'concept_overview' | 'feature_example' | 'purpose_statement' | null;
  sort_order: number;
  is_approved: boolean;
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

// Renamed component to match file convention (Page)
// Added params prop for Next.js App Router
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
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Added state for enhancement proposals
  const [enhancementProposals, setEnhancementProposals] = useState<EnhancementProposal[]>([]);

  useEffect(() => {
    // --- DEBUG LOG: Check received slug ---
    console.log('Fetching data for slug:', projectSlug);
    // -------------------------------------
    if (!projectSlug) {
        setError("Project slug is missing.");
        setLoading(false);
        return;
    }

    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        // --- DEBUG LOG: Log before the fetch ---
        console.log(`Attempting to fetch client with slug: ${projectSlug}`);
        // --------------------------------------
        const { data: coreData, error: coreError } = await supabase
          .from('clients')
          .select('*')
          .eq('slug', projectSlug)
          .single();

        // --- DEBUG LOG: Log the direct result from Supabase ---
        console.log('Supabase core fetch result:', { coreData, coreError });
        // ------------------------------------------------------

        if (coreError || !coreData) {
          console.error('Condition (coreError || !coreData) is TRUE. Setting error.');
          setError('Could not load project details.');
          setLoading(false);
          return;
        }
        console.log('Condition (coreError || !coreData) is FALSE. Proceeding...');
        setProjectData(coreData);

        const [treatmentsRes, timelineRes, featuresRes, feedbackRes, proposalsRes] = await Promise.all([
          supabase.from('project_treatments').select('*').eq('project_slug', projectSlug).order('sort_order', { ascending: true }),
          supabase.from('project_timelines').select('*').eq('project_slug', projectSlug).order('sort_order', { ascending: true }),
          supabase.from('project_features').select('*').eq('project_slug', projectSlug).order('priority', { ascending: true }),
          supabase.from('project_feedback').select('*').eq('project_slug', projectSlug).order('created_at', { ascending: false }),
          // Fetch enhancement proposals
          supabase.from('project_enhancement_proposals').select('*').eq('project_slug', projectSlug).order('sort_order', { ascending: true })
        ]);

        setTreatments(treatmentsRes.data || []);
        setTimeline(timelineRes.data || []);
        setFeatures(featuresRes.data || []);
        setFeedback(feedbackRes.data || []);
        // Set enhancement proposals state
        setEnhancementProposals(proposalsRes.data || []);

      } catch (err) {
        console.error('Unexpected error in fetchData try block:', err);
        setError('An unexpected error occurred while loading project data.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [projectSlug]);

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

  const handleUpdateProject = async (updatedData: Partial<ProjectData>) => {
    if (!projectData) return;
    setLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase
        .from('clients')
        .update(updatedData)
        .eq('id', projectData.id);

      if (updateError) {
        console.error('Error updating project:', updateError);
        setError(`Failed to save changes: ${updateError.message}`);
      } else {
        setProjectData(prev => prev ? { ...prev, ...updatedData } : null);
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
          {projectData?.preview_url && (
            <Link href={projectData.preview_url} passHref legacyBehavior>
              <a 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition duration-200 shadow"
              >
                <FaExternalLinkAlt /> View Live Preview
              </a>
             </Link>
          )}
          
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

          {!isEditing && (
              <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200 shadow"
              >
                  Edit Project Details
              </button>
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
          {/* Ensure ONLY the dynamic project name/desc is first */}
          <section className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">{projectData.project_name || projectSlug}</h1>
            <p className="text-lg text-gray-300 mb-6">{projectData.project_description || 'No description provided.'}</p>
          </section>
  
          {/* Followed by dynamic enhancements */}
          {/* --- Dynamic Potential Platform Enhancements Section --- */}
          {enhancementProposals.length > 0 && (
            <section className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Potential Platform Enhancements</h2>
              <div className="space-y-4">
                {enhancementProposals.map(proposal => {
                  // Determine heading level/style based on type
                  const TitleComponent = proposal.type === 'concept_overview' ? 'h3' : 'h4';
                  const titleClass = proposal.type === 'concept_overview'
                    ? "text-xl font-bold text-white"
                    : "text-lg font-semibold text-white";

                  return (
                    <div key={proposal.id}>
                      <TitleComponent className={`${titleClass} mb-1`}>
                        {proposal.title}
                        {proposal.is_approved && <span className="ml-2 text-green-400" title="Approved">✅</span>}
                      </TitleComponent>
                      {proposal.description && (
                        // Use list for feature examples for better structure if needed, otherwise paragraph
                        proposal.type === 'feature_example' ? (
                           <ul className="list-disc pl-5 text-gray-300"><li>{proposal.description}</li></ul>
                        ) : (
                           <p className="text-gray-300">{proposal.description}</p>
                        )

                      )}
                       {proposal.type === 'purpose_statement' && <p className="mt-1 text-sm text-gray-400 italic">{proposal.description}</p>}
                    </div>
                  );
                })}
              </div>
            </section>
          )}
          {/* --- End Dynamic Section --- */}

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
                {phases.map(phase => (
                  <div key={phase.key} className="bg-gray-900 p-4 rounded shadow">
                    <h3 className="text-lg font-bold mb-2 text-white">{phase.label}</h3>
                    <ul className="list-disc pl-4 space-y-1">
                      {(() => {
                        const phaseTimeline = timeline.filter(t => t.phase === phase.key);
                        if (phaseTimeline.length === 0) {
                           return <li className="text-gray-500 italic">No items yet.</li>;
                        }
                        return phaseTimeline.map(t => (
                          <li key={t.id} className="text-gray-300">
                            <strong>{t.title}</strong>
                            {t.description && <span className="ml-1 text-gray-400"> - {t.description}</span>}
                          </li>
                        ));
                      })()}
                    </ul>
                  </div>
                ))}
              </div>
          </section>

          <section className="mb-8" key="features-section">
            <h2 className="text-2xl font-semibold mb-4 text-cyan-400">Feature & Budget Collaboration</h2>
            <div className="overflow-x-auto bg-gray-900 p-4 rounded shadow">
              <table className="w-full text-left mb-4">
                <thead className="border-b border-gray-700">
                  <tr>
                    <th className="py-2 px-3 text-gray-400">Feature</th>
                    <th className="py-2 px-3 text-gray-400">Priority</th>
                    <th className="py-2 px-3 text-gray-400">Est. Cost</th>
                    <th className="py-2 px-3 text-gray-400">Status</th>
                    <th className="py-2 px-3 text-gray-400">Approved</th>
                  </tr>
                </thead>
                <tbody>
                  {features.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-gray-500 italic py-2 px-3">No features yet.</td>
                    </tr>
                  ) : (
                    features.map(f => (
                      <tr key={f.id} className="border-b border-gray-800 hover:bg-gray-800">
                        <td className="py-2 px-3 text-gray-300">{f.feature}</td>
                        <td className="py-2 px-3 text-gray-300">{f.priority}</td>
                        <td className="py-2 px-3 text-gray-300">{f.est_cost ? `£${f.est_cost}` : '-'}</td>
                        <td className="py-2 px-3 text-gray-300">{f.status}</td>
                        <td className="py-2 px-3 text-center">{f.approved ? '✅' : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
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