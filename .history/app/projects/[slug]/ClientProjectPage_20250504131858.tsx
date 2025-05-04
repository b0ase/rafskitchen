'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import ClientSignupForm from '@/app/components/ClientSignupForm';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
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
}

export default function ClientProjectPage({ projectSlug, notionUrl }: { projectSlug: string, notionUrl?: string }) {
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

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const { data: coreData, error: coreError } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', projectSlug)
          .single();

        if (coreError || !coreData) {
          console.error('Error fetching core project data:', coreError);
          setError('Could not load project details.');
          setLoading(false);
          return;
        }
        setProjectData(coreData);

        const [treatmentsRes, timelineRes, featuresRes, feedbackRes] = await Promise.all([
          supabase.from('project_treatments').select('*').eq('project_slug', projectSlug).order('sort_order', { ascending: true }),
          supabase.from('project_timelines').select('*').eq('project_slug', projectSlug).order('sort_order', { ascending: true }),
          supabase.from('project_features').select('*').eq('project_slug', projectSlug).order('priority', { ascending: true }),
          supabase.from('project_feedback').select('*').eq('project_slug', projectSlug).order('created_at', { ascending: false })
        ]);

        setTreatments(treatmentsRes.data || []);
        setTimeline(timelineRes.data || []);
        setFeatures(featuresRes.data || []);
        setFeedback(feedbackRes.data || []);

      } catch (err) {
        console.error('Unexpected error fetching data:', err);
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
        .from('projects')
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
    <div className="w-full px-4 py-8">
      {!isEditing && (
          <div className="mb-6 text-right">
              <button 
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition duration-200"
              >
                  Edit Project Details
              </button>
          </div>
      )}

      {isEditing ? (
        <section className="mb-8 p-6 bg-gray-800 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6 text-white">Edit Project Details</h2>
          <ClientSignupForm 
             initialData={projectData} 
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
          {['current', 'next', 'ultimate'].map(phase => {
            const items = treatments.filter(t => t.phase === phase);
            if (items.length === 0) return null;
            return (
              <section className="mb-8" key={phase}>
                <h2 className="text-2xl font-semibold mb-4">{phaseLabels[phase]}</h2>
                {items.map(item => (
                  <div key={item.id} className="mb-2">
                    {item.title && <h3 className="text-lg font-bold mb-1">{item.title}</h3>}
                    <p className="text-gray-600 mb-2">{item.description}</p>
                  </div>
                ))}
              </section>
            );
          })}

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Development Timeline</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {phases.map(phase => (
                <div key={phase.key} className="bg-gray-900 p-4 rounded shadow">
                  <h3 className="text-lg font-bold mb-2">{phase.label}</h3>
                  <ul className="list-disc pl-4 space-y-1">
                    {timeline.filter(t => t.phase === phase.key).length === 0 && (
                      <li className="text-gray-500 italic">No items yet.</li>
                    )}
                    {timeline.filter(t => t.phase === phase.key).map(t => (
                      <li key={t.id}>
                        <strong>{t.title}</strong>
                        {t.description && <span className="ml-1 text-gray-400">{t.description}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Feature & Budget Collaboration</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left mb-4">
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Priority</th>
                    <th>Est. Cost</th>
                    <th>Status</th>
                    <th>Approved</th>
                  </tr>
                </thead>
                <tbody>
                  {features.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-gray-500 italic">No features yet.</td>
                    </tr>
                  )}
                  {features.map(f => (
                    <tr key={f.id}>
                      <td>{f.feature}</td>
                      <td>{f.priority}</td>
                      <td>{f.est_cost ? `£${f.est_cost}` : '-'}</td>
                      <td>{f.status}</td>
                      <td>{f.approved ? '✅' : ''}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Requirements & Feedback</h2>
            <form onSubmit={handleFeedbackSubmit} className="flex flex-col md:flex-row gap-3 mb-4">
              <input
                type="email"
                placeholder="Your Email"
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded w-full md:w-1/3"
                value={feedbackForm.email}
                onChange={e => setFeedbackForm(f => ({ ...f, email: e.target.value }))}
                required
              />
              <input
                type="text"
                placeholder="Your Feedback or Requirement"
                className="px-3 py-2 bg-gray-800 border border-gray-700 rounded w-full md:w-2/3"
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
            <div>
              <h3 className="text-lg font-semibold mb-2">Recent Feedback</h3>
              <ul className="space-y-2">
                {feedback.length === 0 && <li className="text-gray-500 italic">No feedback yet.</li>}
                {feedback.map(fb => (
                  <li key={fb.id} className="bg-gray-800 p-2 rounded">
                    <span className="font-bold">{fb.email}:</span> {fb.message}
                    <span className="ml-2 text-xs text-gray-500">{new Date(fb.created_at).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {notionUrl && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Project Docs & Collaboration (Notion)</h2>
              <iframe
                src={notionUrl}
                style={{ width: '100%', height: 600, border: 'none', borderRadius: 8 }}
                allowFullScreen
              />
            </section>
          )}
        </>
      )}
    </div>
  );
}
