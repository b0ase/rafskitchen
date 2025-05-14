'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaArrowLeft, FaSave, FaTimesCircle, FaSpinner, FaEdit, FaProjectDiagram } from 'react-icons/fa';

// Interface matching the one in MyProjectsPage (ideally share this)
interface ClientProject {
  id: string;
  name: string;
  project_slug: string;
  status: string | null; // Keep for potential display, though badge1 is primary
  project_brief?: string | null;
  badge1?: string | null;
  badge2?: string | null;
  badge3?: string | null;
  badge4?: string | null;
  badge5?: string | null;
  is_featured?: boolean;
  created_at?: string; // For display
  user_id?: string; // For authorization checks
}

// Badge options (ideally share these)
const badge1Options = ['Pending_setup', 'Planning', 'In Development', 'Live', 'Maintenance', 'On Hold', 'Archived', 'Needs Review', 'Completed', 'Requires Update'];
const badge2Options = ['SaaS', 'Mobile App', 'Website', 'E-commerce', 'AI/ML', 'Consulting', 'Internal Tool', 'Web3/Blockchain', 'Creative Services', 'Platform', 'Service'];
const badge3Options = ['High Priority', 'Medium Priority', 'Low Priority', 'Needs Feedback', 'Client Approved', 'Phase 1', 'Phase 2', 'Experimental', 'Showcase Ready', 'Internal'];

// Badge styling functions (ideally share these)
const getBadgeStyle = (badgeValue: string | null): string => {
  let baseStyle = "text-xs font-semibold rounded-md p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border";
  switch (badgeValue?.toLowerCase()) {
    case 'pending_setup': return `${baseStyle} bg-yellow-700 text-yellow-200 border-yellow-600`;
    case 'planning': return `${baseStyle} bg-indigo-700 text-indigo-200 border-indigo-600`;
    case 'in development': return `${baseStyle} bg-sky-700 text-sky-200 border-sky-600`;
    case 'live': return `${baseStyle} bg-green-700 text-green-200 border-green-600`;
    default: return `${baseStyle} bg-gray-800 text-gray-300 border-gray-700`;
  }
};
const getBadge2Style = (badgeValue: string | null): string => {
  let baseStyle = "text-xs font-semibold rounded-md p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border";
  switch (badgeValue?.toLowerCase()) {
    case 'saas': return `${baseStyle} bg-purple-700 text-purple-200 border-purple-600`;
    case 'mobile app': return `${baseStyle} bg-pink-700 text-pink-200 border-pink-600`;
    case 'website': return `${baseStyle} bg-cyan-600 text-cyan-100 border-cyan-500`;
    default: return `${baseStyle} bg-gray-800 text-gray-300 border-gray-700`;
  }
};
const getBadge3Style = (badgeValue: string | null): string => {
  let baseStyle = "text-xs font-semibold rounded-md p-1.5 appearance-none min-w-[100px] focus:ring-sky-500 focus:border-sky-500 border";
  switch (badgeValue?.toLowerCase()) {
    case 'high priority': return `${baseStyle} bg-red-700 text-red-200 border-red-600`;
    case 'medium priority': return `${baseStyle} bg-amber-600 text-amber-100 border-amber-500`;
    case 'low priority': return `${baseStyle} bg-emerald-700 text-emerald-200 border-emerald-600`;
    default: return `${baseStyle} bg-gray-800 text-gray-300 border-gray-700`;
  }
};


export default function ProjectDetailPage() {
  const supabase = createClientComponentClient();
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [user, setUser] = useState<User | null>(null);
  const [project, setProject] = useState<ClientProject | null>(null);
  const [editableName, setEditableName] = useState('');
  const [editableBrief, setEditableBrief] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBrief, setIsEditingBrief] = useState(false);
  
  const [loading, setLoading] = useState(true);
  const [updatingField, setUpdatingField] = useState<string | null>(null); // Tracks which specific field/badge is updating
  const [error, setError] = useState<string | null>(null);

  const fetchProjectDetails = useCallback(async () => {
    if (!slug) return;
    setLoading(true);
    setError(null);

    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      setError('You must be logged in to view this page.');
      setLoading(false);
      // Optionally redirect to login: router.push('/login');
      return;
    }
    setUser(authUser);

    const { data, error: projectError } = await supabase
      .from('clients')
      .select('*') // Fetch all columns for now
      .eq('project_slug', slug)
      .eq('user_id', authUser.id) // Ensure user owns this project
      .single();

    if (projectError || !data) {
      console.error('Error fetching project:', projectError);
      setError('Could not load project details or project not found.');
      setProject(null);
    } else {
      setProject(data as ClientProject);
      setEditableName(data.name || '');
      setEditableBrief(data.project_brief || '');
    }
    setLoading(false);
  }, [slug, supabase, router]);

  useEffect(() => {
    fetchProjectDetails();
  }, [fetchProjectDetails]);

  const handleUpdateProjectField = async (field: keyof ClientProject, value: any, fieldNameForLoading: string) => {
    if (!project || !user) return;
    setUpdatingField(fieldNameForLoading);
    setError(null);

    const { error: updateError } = await supabase
      .from('clients')
      .update({ [field]: value, updated_at: new Date().toISOString() })
      .eq('id', project.id)
      .eq('user_id', user.id);

    if (updateError) {
      console.error(`Error updating ${field}:`, updateError);
      setError(`Failed to update ${field}. ${updateError.message}`);
    } else {
      setProject(prev => prev ? { ...prev, [field]: value } : null);
      if (field === 'name') setEditableName(value);
      if (field === 'project_brief') setEditableBrief(value);
    }
    setUpdatingField(null);
    return !updateError;
  };

  const handleSaveName = async () => {
    const success = await handleUpdateProjectField('name', editableName, 'name');
    if (success) setIsEditingName(false);
  };

  const handleSaveBrief = async () => {
    const success = await handleUpdateProjectField('project_brief', editableBrief, 'brief');
    if (success) setIsEditingBrief(false);
  };
  
  const handleBadgeChange = async (badgeKey: 'badge1' | 'badge2' | 'badge3' | 'badge4' | 'badge5', newValue: string | null) => {
    if (!project || !user) return;
    const valueToSet = newValue === '' ? null : newValue;
    const success = await handleUpdateProjectField(badgeKey, valueToSet, badgeKey);
    // UI updates via setProject in handleUpdateProjectField
  };

  const handleIsFeaturedToggle = async (currentIsFeatured: boolean) => {
    if (!project || !user) return;
    const success = await handleUpdateProjectField('is_featured', !currentIsFeatured, 'is_featured');
    // UI updates via setProject
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-sky-500" />
        <p className="text-xl mt-4">Loading project details...</p>
      </div>
    );
  }

  if (error && !project) { // Show full page error if project couldn't load
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center p-6">
        <FaTimesCircle className="text-5xl text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-white mb-2">Error Loading Project</h2>
        <p className="text-red-400 text-center mb-6">{error}</p>
        <Link href="/myprojects" legacyBehavior>
          <a className="inline-flex items-center bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to My Projects
          </a>
        </Link>
      </div>
    );
  }
  
  if (!project) { // Fallback if no project and no specific error, or user not authorized
     return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center p-6">
        <FaTimesCircle className="text-5xl text-yellow-500 mb-4" />
        <h2 className="text-2xl font-semibold text-white mb-2">Project Not Found</h2>
        <p className="text-yellow-300 text-center mb-6">The project you are looking for does not exist or you may not have permission to view it.</p>
        <Link href="/myprojects" legacyBehavior>
          <a className="inline-flex items-center bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to My Projects
          </a>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <Link href="/myprojects" legacyBehavior>
            <a className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors group">
              <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to My Projects
            </a>
          </Link>
        </div>

        {/* Project Header */}
        <div className="bg-slate-800 shadow-xl rounded-lg p-6 md:p-8 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
            {isEditingName ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input 
                  type="text"
                  value={editableName}
                  onChange={(e) => setEditableName(e.target.value)}
                  className="bg-slate-700 text-2xl font-semibold text-white p-2 rounded-md border border-slate-600 focus:ring-sky-500 focus:border-sky-500 flex-grow"
                  autoFocus
                />
                <button onClick={handleSaveName} disabled={updatingField === 'name'} className="p-2 bg-green-600 hover:bg-green-500 rounded-md text-white disabled:opacity-50">
                  {updatingField === 'name' ? <FaSpinner className="animate-spin" /> : <FaSave />}
                </button>
                <button onClick={() => { setIsEditingName(false); setEditableName(project.name); }} className="p-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white">
                  <FaTimesCircle />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <FaProjectDiagram className="text-3xl text-sky-400" />
                <h1 className="text-3xl md:text-4xl font-bold text-white break-all">{project.name}</h1>
                <button onClick={() => setIsEditingName(true)} className="text-sky-400 hover:text-sky-300">
                  <FaEdit />
                </button>
              </div>
            )}
             {/* Display Original Status/Badge1 if needed or a primary badge display here */}
          </div>
          <p className="text-xs text-gray-500 mb-6">Project ID: {project.id}</p>

          {/* Badge Controls Section */}
          <div className="mt-2 mb-6 p-4 border border-slate-700 rounded-md bg-slate-850/30">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">Project Badges & Settings:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 items-center">
              {[1, 2, 3, 4, 5].map(num => {
                const badgeKey = `badge${num}` as 'badge1' | 'badge2' | 'badge3' | 'badge4' | 'badge5';
                const options = num === 1 ? badge1Options : num === 3 ? badge3Options : badge2Options;
                const styleGetter = num === 1 ? getBadgeStyle : num === 3 ? getBadge3Style : getBadge2Style;
                const value = project[badgeKey] || (num === 1 ? 'Pending_setup' : '');
                const placeholder = num === 1 && !project[badgeKey] ? '' : `Badge ${num}...`;
                
                return (
                  <div key={badgeKey} className="flex-shrink-0">
                    <label htmlFor={`${badgeKey}-detail`} className="sr-only">{`Badge ${num}`}</label>
                    <select 
                      id={`${badgeKey}-detail`}
                      value={value}
                      onChange={(e) => handleBadgeChange(badgeKey, e.target.value)}
                      disabled={!!updatingField}
                      className={styleGetter(value)}
                    >
                      {placeholder && <option value="">{placeholder}</option>}
                      {/* Ensure "Pending_setup" is an option for badge1 if value is empty and it's the default */}
                      {num === 1 && !project.badge1 && <option value="Pending_setup">Pending_setup</option>}
                      {options.map(opt => (
                        (num === 1 && opt === 'Pending_setup' && project.badge1) ? null : // Avoid duplicate "Pending_setup" if already selected
                        <option key={opt} value={opt} className="bg-gray-800 text-gray-300">{opt}</option>
                      ))}
                    </select>
                  </div>
                );
              })}
               <div className="flex items-center flex-shrink-0 sm:ml-0 pt-2 sm:pt-0 md:col-span-1 lg:col-span-1 xl:col-span-1 justify-self-start">
                <input 
                  type="checkbox" 
                  id={`featured-detail-${project.id}`} 
                  checked={project.is_featured || false} 
                  onChange={() => handleIsFeaturedToggle(project.is_featured || false)}
                  disabled={!!updatingField}
                  className="h-4 w-4 text-sky-600 bg-gray-700 border-gray-600 rounded focus:ring-sky-500 focus:ring-offset-gray-900 cursor-pointer"
                />
                <label htmlFor={`featured-detail-${project.id}`} className="ml-2 text-xs text-gray-400 cursor-pointer select-none whitespace-nowrap">
                  Showcase on Landing Page
                </label>
              </div>
            </div>
             {updatingField && <p className="text-xs text-sky-400 mt-2 flex items-center"><FaSpinner className="animate-spin mr-1.5" /> Updating {updatingField}...</p>}
          </div>


          {/* Project Brief Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-sky-300">Project Brief</h2>
              {!isEditingBrief && (
                <button onClick={() => setIsEditingBrief(true)} className="text-sm text-sky-400 hover:text-sky-300 flex items-center">
                  <FaEdit className="mr-1" /> Edit Brief
                </button>
              )}
            </div>
            {isEditingBrief ? (
              <div>
                <textarea
                  value={editableBrief}
                  onChange={(e) => setEditableBrief(e.target.value)}
                  rows={6}
                  className="w-full bg-slate-700 text-gray-300 p-3 rounded-md border border-slate-600 focus:ring-sky-500 focus:border-sky-500 text-sm"
                  autoFocus
                />
                <div className="mt-3 flex items-center gap-3">
                  <button onClick={handleSaveBrief} disabled={updatingField === 'brief'} className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2 px-3 rounded-md text-sm disabled:opacity-50 flex items-center">
                    {updatingField === 'brief' ? <FaSpinner className="animate-spin mr-1.5" /> : <FaSave className="mr-1.5" />} Save Brief
                  </button>
                  <button onClick={() => { setIsEditingBrief(false); setEditableBrief(project.project_brief || ''); }} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-3 rounded-md text-sm flex items-center">
                     <FaTimesCircle className="mr-1.5" /> Cancel
                  </button>
                </div>
              </div>
            ) : (
              project.project_brief ? (
                <div className="prose prose-sm prose-invert max-w-none text-gray-300 bg-slate-850/30 p-4 rounded-md border border-slate-700 whitespace-pre-wrap">
                  {project.project_brief}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic p-4 bg-slate-850/30 rounded-md border border-slate-700">No project brief available. Click 'Edit Brief' to add one.</p>
              )
            )}
          </div>

          {/* Other Details Section */}
          <div className="bg-slate-850/30 p-4 rounded-md border border-slate-700 mb-8">
            <h2 className="text-xl font-semibold text-sky-300 mb-3">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Slug: </span>
                <span className="text-gray-300">{project.project_slug}</span>
              </div>
              <div>
                <span className="text-gray-500">Created: </span>
                <span className="text-gray-300">{project.created_at ? new Date(project.created_at).toLocaleDateString() : 'N/A'}</span>
              </div>
            </div>
          </div>
          
          {error && <p className="text-red-400 bg-red-900/30 p-3 rounded-md mb-6 text-sm shadow">Error: {error}</p>}

          <div className="mt-10 text-center text-gray-500 text-sm">
            <p>More project-specific details, communication tools, and management features will go here.</p>
          </div>
        </div>
      </main>
    </div>
  );
} 