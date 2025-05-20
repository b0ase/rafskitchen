'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaRocket, FaSave, FaSpinner } from 'react-icons/fa';

// Interface for the form data, can be expanded
interface NewProjectData {
  name: string; // Will be used for "Project Idea"
  project_brief: string; // Will be "What is your big idea?"
  what_to_build: string; // New field
  desired_domain_name: string; // New field
  website_url: string;
  logo_url: string;
  requested_budget: string | number; // Label will change
  project_type: string; // Changed from project_types: string[]
  socials: string;
  github_links: string;
  inspiration_links: string;
  how_heard: string;
}

// Interface for data coming from localStorage (subset of ClientFormData)
interface PendingProjectData {
  name?: string;
  project_brief?: string;
  website?: string;
  logo_url?: string;
  requested_budget?: string | number;
  project_types?: string[]; // Keep as array here if old localStorage data might exist
  socials?: string;
  github_links?: string;
  inspiration_links?: string;
  how_heard?: string;
}


export default function NewProjectPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<NewProjectData>({
    name: '', // Project Idea
    project_brief: '', // What is your big idea?
    what_to_build: '', // New
    desired_domain_name: '', // New
    website_url: '',
    logo_url: '',
    requested_budget: '',
    project_type: '', // Changed
    socials: '',
    github_links: '',
    inspiration_links: '',
    how_heard: '',
  });
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoadingUser(true);
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser) {
        setUser(authUser);
      } else {
        // If no user, redirect to login, maybe with a message or return path
        router.push('/login?message=Please login to create a new project&next=/projects/new');
        return;
      }
      setLoadingUser(false);
    };

    fetchUser();
  }, [supabase, router]);

  useEffect(() => {
    if (user) {
      try {
        const pendingDataString = localStorage.getItem('pendingProjectData');
        if (pendingDataString) {
          const pendingData: PendingProjectData = JSON.parse(pendingDataString);
          setForm(prevForm => ({
            ...prevForm,
            name: pendingData.name || prevForm.name,
            project_brief: pendingData.project_brief || prevForm.project_brief,
            website_url: pendingData.website || prevForm.website_url,
            logo_url: pendingData.logo_url || prevForm.logo_url,
            requested_budget: pendingData.requested_budget || prevForm.requested_budget,
            project_type: (pendingData.project_types && pendingData.project_types.length > 0) ? pendingData.project_types[0] : prevForm.project_type,
            socials: pendingData.socials || prevForm.socials,
            github_links: pendingData.github_links || prevForm.github_links,
            inspiration_links: pendingData.inspiration_links || prevForm.inspiration_links,
            how_heard: pendingData.how_heard || prevForm.how_heard,
          }));
        }
      } catch (e) {
        console.error("Error reading pending project data from localStorage:", e);
        setError("Could not load pre-filled project data. Please enter details manually.");
      }
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-') // Replace spaces and non-word chars with a single hyphen
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a project.');
      return;
    }
    if (!form.name.trim()) {
      setError('Project name is required.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    const projectSlug = generateSlug(form.name);

    const projectDataToSave = {
      user_id: user.id,
      name: form.name.trim(),
      project_slug: projectSlug,
      project_brief: form.project_brief.trim() || null,
      what_to_build: form.what_to_build.trim() || null,
      desired_domain_name: form.desired_domain_name.trim() || null,
      website_url: form.website_url.trim() || null,
      logo_url: form.logo_url.trim() || null,
      requested_budget: form.requested_budget ? Number(form.requested_budget) : null,
      project_type: form.project_type.trim() || null,
      status: 'pending_setup',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      social_links: form.socials.trim() ? { links: form.socials.split('\n') } : null,
      github_repository: form.github_links.trim() || null,
      inspiration_links: form.inspiration_links.trim() ? { links: form.inspiration_links.split('\n') } : null,
      how_heard: form.how_heard.trim() || null,
    };

    const { data, error: insertError } = await supabase
      .from('clients') // Assuming your projects table is named 'clients'
      .insert(projectDataToSave)
      .select()
      .single();

    if (insertError) {
      console.error('Error creating project:', insertError);
      setError(`Failed to create project: ${insertError.message}. Ensure project name/slug isn\'t already taken for your account.`);
      setSaving(false);
    } else if (data) {
      setSuccessMessage('Project created successfully! Redirecting...');
      localStorage.removeItem('pendingProjectData'); // Clear data on success
      router.push(`/myprojects/${data.project_slug}`); // Or to a general projects list
      setSaving(false);
    }
  };

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-300 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-sky-500 mb-4" />
        <p className="text-xl">Loading user information...</p>
      </div>
    );
  }
  
  // Renamed for clarity
  const projectTypeOptions = [
    "Website", "Mobile App", "E-Commerce Store", "SaaS Platform", "API Development",
    "Brand Design", "UI/UX", "Video", "Motion Graphics", "3D Design",
    "AI/ML", "Blockchain", "Web3", "Consulting", "DevOps", "Other Idea"
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 py-12">
      {/* Sticky Create Project Button is now inside the main content container */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="bg-gray-900 shadow-2xl rounded-lg p-6 sm:p-8 md:p-10 border border-gray-700/50 relative"> {/* Added relative positioning here */}
          <div className="absolute top-6 right-6 z-10" style={{ position: 'sticky', top: '1.5rem' }}> {/* Adjust top and right as needed for padding */}
            <button
              type="button"
              onClick={() => (document.getElementById('project-creation-form') as HTMLFormElement)?.requestSubmit()}
              disabled={saving || loadingUser || !user || !form.name}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg"
            >
              {saving ? <FaSpinner className="animate-spin mr-2.5 h-5 w-5" /> : <FaSave className="mr-2.5 h-5 w-5" />}
              {saving ? 'Creating Idea...' : 'Create Idea'}
            </button>
          </div>

          <div className="flex justify-between items-start mb-10"> {/* Changed items-center to items-start */}
            <div className="text-left">
              <FaRocket className="text-5xl text-sky-500 mb-4" />
              <h1 className="text-4xl font-bold text-white">Capture Your Project Idea</h1>
              <p className="text-lg text-gray-400 mt-2">
                Let's get the details down for your brilliant concept.
              </p>
            </div>
            <div>
              <button
                type="button"
                onClick={() => alert('Connect GitHub Repo functionality coming soon!')}
                className="inline-flex items-center px-4 py-2 border border-gray-600 text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 transition-colors"
              >
                <svg className="w-5 h-5 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M10 0C4.477 0 0 4.477 0 10c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.483 0-.237-.009-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.026 2.747-1.026.546 1.378.202 2.398.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.338 4.695-4.566 4.942.359.308.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0020 10c0-5.523-4.477-10-10-10z" clipRule="evenodd"></path></svg>
                Connect GitHub Repo
              </button>
            </div>
          </div>

          {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-md mb-6 text-sm shadow">{error}</p>}
          {successMessage && !error && <p className="text-green-400 bg-green-900/30 p-3 rounded-md mb-6 text-sm shadow">{successMessage}</p>}

          <form onSubmit={handleSubmit} id="project-creation-form" className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">Project Idea <span className="text-red-400">*</span></label>
              <input
                type="text" name="name" id="name" required value={form.name} onChange={handleChange}
                placeholder="e.g., An AI for custom meal plans, A platform for local artists"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label htmlFor="project_brief" className="block text-sm font-medium text-gray-300 mb-1.5">What is your big idea? (Briefly describe)</label>
              <textarea
                name="project_brief" id="project_brief" value={form.project_brief} onChange={handleChange}
                rows={3} placeholder="e.g., A mobile app that helps users find and book local dog walkers based on real-time availability and reviews."
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            <div>
              <label htmlFor="what_to_build" className="block text-sm font-medium text-gray-300 mb-1.5">What would you like to build? (More details)</label>
              <textarea
                name="what_to_build" id="what_to_build" value={form.what_to_build} onChange={handleChange}
                rows={5} placeholder="Describe the core features, target users, and the problem it solves in more detail. What makes it unique?"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label htmlFor="desired_domain_name" className="block text-sm font-medium text-gray-300 mb-1.5">What is your desired Domain Name? (Optional)</label>
              <input
                type="text" name="desired_domain_name" id="desired_domain_name" value={form.desired_domain_name} onChange={handleChange}
                placeholder="e.g., myawesomeidea.com, localartconnect.app"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label htmlFor="project_type" className="block text-sm font-medium text-gray-300 mb-1.5">Project Type:</label>
              <select
                name="project_type"
                id="project_type"
                value={form.project_type}
                onChange={handleChange}
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              >
                <option value="">Select a type...</option>
                {projectTypeOptions.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="website_url" className="block text-sm font-medium text-gray-300 mb-1.5">Current Website URL (if any)</label>
              <input
                type="url" name="website_url" id="website_url" value={form.website_url} onChange={handleChange}
                placeholder="https://example.com"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            <div>
              <label htmlFor="logo_url" className="block text-sm font-medium text-gray-300 mb-1.5">Logo URL (if you have one hosted)</label>
              <input
                type="url" name="logo_url" id="logo_url" value={form.logo_url} onChange={handleChange}
                placeholder="https://example.com/logo.png"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
              {form.logo_url && <img src={form.logo_url} alt="Logo Preview" className="mt-3 h-16 w-auto object-contain bg-gray-700 p-1 rounded shadow" />}
            </div>

            <div>
              <label htmlFor="requested_budget" className="block text-sm font-medium text-gray-300 mb-1.5">How much do you want to raise to develop your idea? (Optional)</label>
              <input
                type="number" name="requested_budget" id="requested_budget" value={form.requested_budget} onChange={handleChange}
                placeholder="e.g., 10000 (numeric value, e.g., USD)"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            <div className="space-y-4">
              <h3 className="text-md font-medium text-gray-300 mb-2">Additional Information <span className="text-xs text-gray-500">(From your initial request, edit as needed)</span></h3>
              <div>
                <label htmlFor="socials" className="block text-sm font-medium text-gray-300 mb-1.5">Social Media Links (one per line)</label>
                <textarea name="socials" id="socials" value={form.socials} onChange={handleChange} rows={3} placeholder="e.g., https://twitter.com/yourprofile\nhttps://linkedin.com/in/yourprofile" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
              </div>
              <div>
                <label htmlFor="github_links" className="block text-sm font-medium text-gray-300 mb-1.5">GitHub Repository or Code Links (one per line)</label>
                <textarea name="github_links" id="github_links" value={form.github_links} onChange={handleChange} rows={3} placeholder="e.g., https://github.com/yourusername/yourproject" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
              </div>
              <div>
                <label htmlFor="inspiration_links" className="block text-sm font-medium text-gray-300 mb-1.5">Inspiration Links (sites, apps, designs - one per line)</label>
                <textarea name="inspiration_links" id="inspiration_links" value={form.inspiration_links} onChange={handleChange} rows={3} placeholder="e.g., https://inspiration1.com\nhttps://inspiration2.com" className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500" />
              </div>
               <div>
                <label htmlFor="how_heard" className="block text-sm font-medium text-gray-300 mb-1.5">How did you hear about us? (Optional)</label>
                <input
                  type="text" name="how_heard" id="how_heard" value={form.how_heard} onChange={handleChange}
                  placeholder="e.g., Google Search, Friend, Social Media"
                  className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-700">
              <p className="text-sm text-gray-500 text-right">Click "Create Idea" at the top right to save.</p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 