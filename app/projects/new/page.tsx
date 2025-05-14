'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaRocket, FaSave, FaSpinner } from 'react-icons/fa';

// Interface for the form data, can be expanded
interface NewProjectData {
  name: string;
  project_brief: string;
  website_url: string; // From signup form's 'website'
  logo_url: string;
  requested_budget: string | number;
  project_types: string[];
  // Add other fields as necessary from ClientFormData or specific to new projects
  socials: string;
  github_links: string;
  inspiration_links: string;
  how_heard: string;
}

// Interface for data coming from localStorage (subset of ClientFormData)
interface PendingProjectData {
  name?: string;
  project_brief?: string;
  website?: string; // Note: field name difference from ClientSignupForm
  logo_url?: string;
  requested_budget?: string | number;
  project_types?: string[];
  socials?: string;
  github_links?: string;
  inspiration_links?: string;
  how_heard?: string;
  // email and phone are not directly used here as project owner is the current user
}


export default function NewProjectPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<NewProjectData>({
    name: '',
    project_brief: '',
    website_url: '',
    logo_url: '',
    requested_budget: '',
    project_types: [],
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
    // This effect runs once after user is loaded (or if no user, it won't run meaningfully)
    if (user) {
      try {
        const pendingDataString = localStorage.getItem('pendingProjectData');
        if (pendingDataString) {
          const pendingData: PendingProjectData = JSON.parse(pendingDataString);
          setForm(prevForm => ({
            ...prevForm,
            name: pendingData.name || prevForm.name,
            project_brief: pendingData.project_brief || prevForm.project_brief,
            website_url: pendingData.website || prevForm.website_url, // map `website` to `website_url`
            logo_url: pendingData.logo_url || prevForm.logo_url,
            requested_budget: pendingData.requested_budget || prevForm.requested_budget,
            project_types: pendingData.project_types || prevForm.project_types,
            socials: pendingData.socials || prevForm.socials,
            github_links: pendingData.github_links || prevForm.github_links,
            inspiration_links: pendingData.inspiration_links || prevForm.inspiration_links,
            how_heard: pendingData.how_heard || prevForm.how_heard,
          }));
          // Optional: Clear it immediately after reading if desired,
          // or wait until successful project submission.
          // localStorage.removeItem('pendingProjectData'); 
        }
      } catch (e) {
        console.error("Error reading pending project data from localStorage:", e);
        setError("Could not load pre-filled project data. Please enter details manually.");
      }
    }
  }, [user]); // Depend on user to ensure it runs after user is fetched

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectTypeToggle = (type: string) => {
    setForm(prev => ({
      ...prev,
      project_types: prev.project_types.includes(type)
        ? prev.project_types.filter(t => t !== type)
        : [...prev.project_types, type],
    }));
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
      website_url: form.website_url.trim() || null,
      logo_url: form.logo_url.trim() || null,
      requested_budget: form.requested_budget ? Number(form.requested_budget) : null,
      project_types: form.project_types.length > 0 ? form.project_types : null,
      status: 'pending_setup', // Default status for new projects
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Map other form fields to client table columns
      social_links: form.socials.trim() ? { links: form.socials.split('\n') } : null, // Example: store as JSON
      github_repository: form.github_links.trim() || null, // Assuming single repo link for now
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
      // Reset form if staying on page, or prepare for redirect
      // setForm({ name: '', project_brief: '', ... }); 
      router.push(`/myprojects/${data.project_slug}`); // Or to a general projects list
      // setTimeout(() => router.push(`/myprojects/${data.project_slug}`), 2000);
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
  
  // Placeholder for project types - ideally fetched or configured
  const availableProjectTypes = [
    "Website", "Mobile App", "E-Commerce Store", "SaaS Platform", "API Development",
    "Brand Design", "UI/UX", "Video", "Motion Graphics", "3D Design",
    "AI/ML", "Blockchain", "Web3", "Consulting", "DevOps"
  ];


  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <div className="bg-gray-900 shadow-2xl rounded-lg p-6 sm:p-8 md:p-10 border border-gray-700/50">
          <div className="text-center mb-10">
            <FaRocket className="text-5xl text-sky-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-white">Start Your New Project</h1>
            <p className="text-lg text-gray-400 mt-2">
              Let's get the details down for your brilliant idea.
            </p>
          </div>

          {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-md mb-6 text-sm shadow">{error}</p>}
          {successMessage && !error && <p className="text-green-400 bg-green-900/30 p-3 rounded-md mb-6 text-sm shadow">{successMessage}</p>}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">Project Name <span className="text-red-400">*</span></label>
              <input
                type="text" name="name" id="name" required value={form.name} onChange={handleChange}
                placeholder="e.g., My Awesome App, Revolutionary Platform"
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>

            <div>
              <label htmlFor="project_brief" className="block text-sm font-medium text-gray-300 mb-1.5">Project Brief / Description</label>
              <textarea
                name="project_brief" id="project_brief" value={form.project_brief} onChange={handleChange}
                rows={5} placeholder="Describe your project: its purpose, target audience, key features, and goals."
                className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
              />
            </div>
            
            <div>
              <h3 className="text-md font-medium text-gray-300 mb-2">Project Types <span className="text-xs text-gray-500">(Select all that apply)</span></h3>
              <div className="flex flex-wrap gap-2 items-center">
                {availableProjectTypes.map(type => (
                  <button
                    key={type} type="button" onClick={() => handleProjectTypeToggle(type)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      form.project_types.includes(type)
                        ? 'bg-sky-600 text-white font-semibold'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
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
              <label htmlFor="requested_budget" className="block text-sm font-medium text-gray-300 mb-1.5">Requested Budget (Optional)</label>
              <input
                type="number" name="requested_budget" id="requested_budget" value={form.requested_budget} onChange={handleChange}
                placeholder="e.g., 5000 (numeric value)"
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
              <button
                type="submit"
                disabled={saving || loadingUser || !user || !form.name}
                className="w-full sm:w-auto float-right inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg"
              >
                {saving ? <FaSpinner className="animate-spin mr-2.5 h-5 w-5" /> : <FaSave className="mr-2.5 h-5 w-5" />}
                {saving ? 'Creating Project...' : 'Create Project'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 