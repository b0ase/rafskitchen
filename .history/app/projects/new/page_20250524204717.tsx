'use client';

import React, { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaRocket, FaSave, FaSpinner, FaGithub, FaTwitter, FaTiktok, FaInstagram, FaDiscord, FaTelegramPlane, FaFacebook, FaLinkedin, FaUsers, FaCoins, FaUserSecret, FaGlobe } from 'react-icons/fa';
import Image from 'next/image';

// Interface for the form data
interface NewProjectData {
  name: string; // Project Idea
  project_brief: string; // What is your big idea?
  what_to_build: string;
  desired_domain_name: string;
  website_url: string;
  logo_url: string;
  requested_budget: string | number;
  project_type: string;
  socialLinks: { [key: string]: string }; // New: For all social media links
  inspiration_links: string;
  how_heard: string;
  addProjectTeam: boolean; // New
  addProjectToken: boolean; // New
  addProjectAgent: boolean; // New: For creating an agent
  addProjectWebsite: boolean; // New: For creating a website
}

// Interface for data from localStorage
interface PendingProjectData {
  name?: string;
  project_brief?: string;
  website?: string;
  logo_url?: string;
  requested_budget?: string | number;
  project_types?: string[]; // Kept for backward compatibility with old localStorage
  socials?: string; // Kept for backward compatibility
  github_links?: string; // Kept for backward compatibility
  inspiration_links?: string;
  how_heard?: string;
}

const socialPlatforms = [
  { name: 'GitHub', key: 'github', icon: FaGithub, placeholder: 'https://github.com/yourproject' },
  { name: 'Twitter', key: 'x', icon: FaTwitter, placeholder: 'https://x.com/yourprofile' },
  { name: 'TikTok', key: 'tiktok', icon: FaTiktok, placeholder: 'https://tiktok.com/@yourprofile' },
  { name: 'Instagram', key: 'instagram', icon: FaInstagram, placeholder: 'https://instagram.com/yourprofile' },
  { name: 'Discord', key: 'discord', icon: FaDiscord, placeholder: 'https://discord.gg/yourserver or YourName#1234' },
  { name: 'Telegram', key: 'telegram', icon: FaTelegramPlane, placeholder: 'https://t.me/yourchannel or @yourusername' },
  { name: 'Facebook', key: 'facebook', icon: FaFacebook, placeholder: 'https://facebook.com/yourpage' },
  { name: 'LinkedIn', key: 'linkedin', icon: FaLinkedin, placeholder: 'https://linkedin.com/in/yourprofile' }
];

export default function NewProjectPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [form, setForm] = useState<NewProjectData>({
    name: '',
    project_brief: '',
    what_to_build: '',
    desired_domain_name: '',
    website_url: '',
    logo_url: '',
    requested_budget: '',
    project_type: '',
    socialLinks: {}, // Initialized
    inspiration_links: '',
    how_heard: '',
    addProjectTeam: true, // Changed to true
    addProjectToken: true, // Changed to true
    addProjectAgent: true, // New: Default to true
    addProjectWebsite: true, // New: Default to true
  });
  const [visibleSocialInputs, setVisibleSocialInputs] = useState<{ [key: string]: boolean }>({});
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
          const initialSocialLinks: { [key: string]: string } = {};
          // Basic migration from old fields if they exist
          if (pendingData.github_links) initialSocialLinks.github = pendingData.github_links.split('\n')[0]; // Take first if multiple
          // Potentially add more migration from old 'socials' if structured
          
          setForm(prevForm => ({
            ...prevForm,
            name: pendingData.name || prevForm.name,
            project_brief: pendingData.project_brief || prevForm.project_brief,
            website_url: pendingData.website || prevForm.website_url,
            logo_url: pendingData.logo_url || prevForm.logo_url,
            requested_budget: pendingData.requested_budget || prevForm.requested_budget,
            project_type: (pendingData.project_types && pendingData.project_types.length > 0) ? pendingData.project_types[0] : prevForm.project_type,
            socialLinks: initialSocialLinks, // Populate from potentially old fields
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
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setForm(prev => ({ ...prev, [name]: checked }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSocialLinkChange = (platformKey: string, value: string) => {
    setForm(prevForm => ({
      ...prevForm,
      socialLinks: {
        ...prevForm.socialLinks,
        [platformKey]: value,
      },
    }));
  };

  const toggleSocialInput = (platformKey: string) => {
    setVisibleSocialInputs(prev => ({ ...prev, [platformKey]: !prev[platformKey] }));
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // remove non-word [a-zA-Z0-9_], non-whitespace, non-hyphen characters
      .replace(/\s+/g, '-') // Gg.
      .replace(/--+/g, '-') // replace multiple hyphens with a single hyphen
      .replace(/^-+|-+$/g, ''); // remove leading/trailing hyphens
  };

  const generateTicker = (projectName: string): string => {
    const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'of', 'to', 'in', 'on', 'for', 'with']);
    const words = projectName.toLowerCase().split(/\s+/).filter(word => word.length > 0 && !commonWords.has(word));
    let ticker = '';
    if (words.length === 0 && projectName.length > 0) { // Handle empty after filter or single non-word string
        ticker = projectName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5);
    } else if (words.length === 1) {
        ticker = words[0].replace(/[^a-zA-Z0-9]/g, '').substring(0, 5);
    } else {
        for (const word of words) {
            if (ticker.length < 5 && word.length > 0) {
                ticker += word.charAt(0);
            }
            if (ticker.length === 5) break;
        }
        // If not enough from first letters, take from start of first significant word
        if (ticker.length < 5 && words.length > 0) {
            ticker = (ticker + words[0].substring(1)).replace(/[^a-zA-Z0-9]/g, '');
            ticker = ticker.substring(0,5);
        }
    }
    // Pad if shorter than 5 chars, then uppercase and prefix with $
    return '$' + ticker.padEnd(5, 'X').substring(0,5).toUpperCase();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to create a project.');
      return;
    }
    if (!form.name.trim()) {
      setError('Project Idea name is required.');
      return;
    }

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const response = await fetch('/api/projects/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form), // Send the whole form state
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || result.details || 'Failed to create project. Please try again.');
      }

      setSuccessMessage(result.message || 'Project created successfully!');
      // Clear the form or specific fields if needed
      // localStorage.removeItem('pendingProjectData'); // Optional: clear local storage on success
      
      // Redirect to the new project page or a success page
      if (result.project && result.project.slug) {
        router.push(`/projects/${result.project.slug}`);
      } else {
        // Fallback if slug isn't returned, though it should be
        router.push('/projects'); 
      }

    } catch (submissionError: any) {
      console.error('Submission error:', submissionError);
      setError(submissionError.message || 'An unexpected error occurred during submission.');
    } finally {
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
  
  const projectTypeOptions = [
    "Website", "Mobile App", "E-Commerce Store", "SaaS Platform", "API Development",
    "Brand Design", "UI/UX", "Video", "Motion Graphics", "3D Design",
    "AI/ML", "Blockchain", "Web3", "Consulting", "DevOps", "Other Idea"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 py-12">
      {/* Create Idea Button - REMOVED from fixed viewport position */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="bg-gray-900 shadow-2xl rounded-lg p-6 sm:p-8 md:p-10 border border-gray-700/50 relative">
          
          {/* Header section with title and sticky button */}
          <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
            <div className="text-left w-full md:w-3/4">
              <FaRocket className="text-5xl text-sky-500 mb-4" />
              <h1 className="text-4xl font-bold text-white mb-4">Start a Project</h1>
              <div className="space-y-3 text-gray-400">
                <p className="text-lg">
                  Kickstart your venture here. Launch a project, form a team with integrated chat, and issue a token.
                </p>
                <p className="text-lg">
                  Team contributions are rewarded with tokens, which can represent direct equity and potentially convert to shares if your project incorporates.
                </p>
                <p className="text-lg">
                  What's your vision? What will you build? Let's begin!
                </p>
              </div>
            </div>
            {/* Sticky Create Idea Button Wrapper - ADDED BACK HERE */}
            <div className="z-20 self-start md:ml-4 flex-shrink-0 md:sticky" style={{ top: '1.5rem' }}> 
              <button
                type="button"
                onClick={() => (document.getElementById('project-creation-form') as HTMLFormElement)?.requestSubmit()}
                disabled={saving || loadingUser || !user || !form.name}
                className="w-full md:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-150 shadow-md hover:shadow-lg"
              >
                {saving ? <FaSpinner className="animate-spin mr-2.5 h-5 w-5" /> : <FaSave className="mr-2.5 h-5 w-5" />}
                {saving ? 'Creating Idea...' : 'Create Project'}
              </button>
            </div>
          </div>
          
          {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-md mb-6 text-sm shadow">{error}</p>}
          {successMessage && !error && <p className="text-green-400 bg-green-900/30 p-3 rounded-md mb-6 text-sm shadow">{successMessage}</p>}

          <form onSubmit={handleSubmit} id="project-creation-form">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-8 gap-y-8">
              {/* Left Column: Main project details */}
              <div className="lg:col-span-2 space-y-8">
                {/* Moved Team and Token Options Section here */}
                <div className="pb-4 border-b border-gray-800">
                  {/* Flex container for side-by-side layout */}
                  <div className="flex flex-wrap items-start gap-x-6 gap-y-4"> 
                    {/* Team Checkbox */}
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="addProjectTeam"
                          name="addProjectTeam"
                          type="checkbox"
                          checked={form.addProjectTeam}
                          onChange={handleChange}
                          className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-600 bg-gray-800 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="addProjectTeam" className="font-medium text-gray-300 flex items-center">
                          <FaUsers className="w-5 h-5 mr-2 text-sky-400" /> Create a Team for this Project
                        </label>
                      </div>
                    </div>
                    {/* Token Checkbox */}
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="addProjectToken"
                          name="addProjectToken"
                          type="checkbox"
                          checked={form.addProjectToken}
                          onChange={handleChange}
                          className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-600 bg-gray-800 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="addProjectToken" className="font-medium text-gray-300 flex items-center">
                          <FaCoins className="w-5 h-5 mr-2 text-yellow-400" /> Create a Token for this Project
                        </label>
                      </div>
                    </div>
                    {/* Agent Checkbox - NEW */}
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="addProjectAgent"
                          name="addProjectAgent"
                          type="checkbox"
                          checked={form.addProjectAgent}
                          onChange={handleChange}
                          className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-600 bg-gray-800 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="addProjectAgent" className="font-medium text-gray-300 flex items-center">
                          <FaUserSecret className="w-5 h-5 mr-2 text-indigo-400" /> Create an Agent for this Project
                        </label>
                      </div>
                    </div>
                    {/* Website Checkbox - NEW */}
                    <div className="relative flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="addProjectWebsite"
                          name="addProjectWebsite"
                          type="checkbox"
                          checked={form.addProjectWebsite}
                          onChange={handleChange}
                          className="focus:ring-sky-500 h-4 w-4 text-sky-600 border-gray-600 bg-gray-800 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="addProjectWebsite" className="font-medium text-gray-300 flex items-center">
                          <FaGlobe className="w-5 h-5 mr-2 text-green-400" /> Create a Website for this Project
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">Project Name/Idea <span className="text-red-400">*</span></label>
                  <input
                    type="text" name="name" id="name" required value={form.name} onChange={handleChange}
                    placeholder="e.g., An AI for custom meal plans, A platform for local artists"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label htmlFor="project_brief" className="block text-sm font-medium text-gray-300 mb-1.5">Describe your big idea: What is it, and what problem does it solve?</label>
                  <textarea
                    name="project_brief" id="project_brief" value={form.project_brief} onChange={handleChange}
                    rows={3} placeholder="e.g., A mobile app that helps users find and book local dog walkers..."
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label htmlFor="what_to_build" className="block text-sm font-medium text-gray-300 mb-1.5">What would you like to build? (More details)</label>
                  <textarea
                    name="what_to_build" id="what_to_build" value={form.what_to_build} onChange={handleChange}
                    rows={5} placeholder="Describe the core features, target users, and the problem it solves..."
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label htmlFor="desired_domain_name" className="block text-sm font-medium text-gray-300 mb-1.5">What is your desired Domain Name? (Optional)</label>
                  <input
                    type="text" name="desired_domain_name" id="desired_domain_name" value={form.desired_domain_name} onChange={handleChange}
                    placeholder="e.g., myawesomeidea.com"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div>
                  <label htmlFor="project_type" className="block text-sm font-medium text-gray-300 mb-1.5">Project Type:</label>
                  <select
                    name="project_type" id="project_type" value={form.project_type} onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  >
                    <option value="">Select a type...</option>
                    {projectTypeOptions.map(type => (<option key={type} value={type}>{type}</option>))}
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
                  {form.logo_url && 
                    <Image 
                      src={form.logo_url} 
                      alt="Logo Preview" 
                      className="mt-3 h-16 w-auto max-w-full object-contain bg-gray-700 p-1 rounded shadow"
                      width={64}
                      height={64}
                    />
                  }
                </div>
                <div>
                  <label htmlFor="requested_budget" className="block text-sm font-medium text-gray-300 mb-1.5">What's your estimated budget to bring this idea to life? (Optional - helps gauge project scale)</label>
                  <input
                    type="number" name="requested_budget" id="requested_budget" value={form.requested_budget} onChange={handleChange}
                    placeholder="e.g., 10000 (numeric value, e.g., USD)"
                    className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                  />
                </div>
                <div className="space-y-4 pt-4 border-t border-gray-800">
                  <h3 className="text-md font-medium text-gray-300">Additional Information</h3>
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
              </div>

              {/* Right Column: Socials and Extras */}
              <div className="lg:col-span-1 space-y-8">
                <div className="space-y-4 pb-4 border-b border-gray-800">
                  <h3 className="text-md font-medium text-gray-300">Connect Social Profiles</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {socialPlatforms.map((platform) => (
                      <div key={platform.key}>
                        <button
                          type="button"
                          onClick={() => toggleSocialInput(platform.key)}
                          className={`w-full inline-flex items-center justify-center px-4 py-2 border text-sm font-medium rounded-md transition-colors
                            ${visibleSocialInputs[platform.key] 
                              ? 'bg-sky-700 text-white border-sky-700' 
                              : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600'}`}
                        >
                          {platform.key === 'x' ? (
                            <span className="mr-2 text-lg font-bold">X</span>
                          ) : (
                            <platform.icon className="w-5 h-5 mr-2" />
                          )}
                          {platform.name}
                        </button>
                        {visibleSocialInputs[platform.key] && (
                          <input
                            type="text"
                            name={`socialLinks.${platform.key}`}
                            value={form.socialLinks[platform.key] || ''}
                            onChange={(e) => handleSocialLinkChange(platform.key, e.target.value)}
                            placeholder={platform.placeholder}
                            className="mt-2 w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
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