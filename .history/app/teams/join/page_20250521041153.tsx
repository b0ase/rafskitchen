'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaUsers, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaUserPlus, FaQuestionCircle } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Helper to map icon names to components
const iconMap: { [key: string]: React.ElementType } = {
  FaDatabase,
  FaPalette,
  FaBolt,
  FaCloud,
  FaLightbulb,
  FaBrain,
  FaUsers, // In case you use it for a team icon
};

// --- UPDATED Interface to represent Joinable Projects from the 'clients' table ---
interface JoinableProject {
  id: string;
  name: string; // Project/Client Name
  slug: string | null;
  project_category: string | null; // Can be used for a brief description or icon hint
  // Add any other fields from the clients table you want to display
}

// interface ColorScheme {
//   bgColor: string;
//   textColor: string;
//   borderColor: string;
// }

// interface Team {
//   id: string;
//   name: string;
//   slug: string | null;
//   description: string;
//   icon_name: string | null;
//   color_scheme: ColorScheme | null;
// }
// --- END UPDATED Interface ---

export default function JoinTeamPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  // --- UPDATED State to hold Joinable Projects ---
  const [joinableProjects, setJoinableProjects] = useState<JoinableProject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // --- UPDATED State for Joining Projects ---
  const [joiningProjectId, setJoiningProjectId] = useState<string | null>(null); // For loading state on join button
  const [joinError, setJoinError] = useState<string | null>(null); // For specific join errors
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null); // For success messages
  // --- END UPDATED State ---

  useEffect(() => {
    // --- UPDATED Function to Fetch Joinable Projects ---
    const fetchJoinableProjects = async () => {
      setLoading(true);
      setError(null);
      setJoinError(null); // Clear join errors on fetch
      setJoinSuccess(null); // Clear join success on fetch
      // Fetch data from the 'clients' table
      const { data, error: fetchError } = await supabase
        .from('clients')
        .select('id, name, slug, project_category') // Select relevant project fields
        // Add any filters here if you only want to show specific projects (e.g., not completed)
        .order('name', { ascending: true }); 

      if (fetchError) {
        console.error('Error fetching joinable projects:', fetchError);
        setError('Could not load projects. Please try again later.');
        setJoinableProjects([]);
      } else if (data) {
        // Data from 'clients' table should directly match JoinableProject interface
        setJoinableProjects(data as JoinableProject[]);
      }
      setLoading(false);
    };
    // --- END UPDATED Function ---

    fetchJoinableProjects(); // Call the updated fetch function
  }, [supabase]);

  // --- UPDATED Function to Handle Joining a Project ---
  const handleJoinProject = async (projectId: string, projectName: string, projectSlug: string | null) => {
    setJoiningProjectId(projectId);
    setJoinError(null);
    setJoinSuccess(null);

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error('Error fetching user or no user logged in:', userError);
      setJoinError('You must be logged in to join a project.');
      setJoiningProjectId(null);
      return;
    }

    // Insert a record into the project_users table
    const { error: insertError } = await supabase
      .from('project_users')
      .insert({
        project_id: projectId,
        user_id: user.id,
        role: 'collaborator', // Default role when joining
      });

    if (insertError) {
      console.error(`Error joining project ${projectName} (ID: ${projectId}):`, insertError);
      if (insertError.code === '23505') { // Unique violation
        setJoinError(`You are already a member of ${projectName} or have a pending request.`);
      } else {
        setJoinError(`Failed to join ${projectName}. Please try again. ${insertError.message}`);
      }
    } else {
      // Successfully joined, now redirect to the project page
      setJoinSuccess(`Successfully joined project ${projectName}!`);
      // Use project slug or ID for the redirect URL
      router.push(`/projects/${projectSlug || projectId}`);
      // Note: The success message might be briefly visible before redirect.
      // Consider showing a confirmation modal instead of redirecting immediately if preferred.
      return; // Important to prevent further state updates on an unmounting component
    }
    setJoiningProjectId(null);
  };
  // --- END UPDATED Function ---

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500 mb-4"></div>
        <p className="text-xl text-sky-300">Loading Awesome Teams...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center px-4 text-center">
        <FaQuestionCircle className="text-6xl text-red-500 mb-6" />
        <h2 className="text-3xl font-semibold text-red-400 mb-4">Oops! Something went wrong.</h2>
        <p className="text-xl text-gray-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-12">
        <FaUsers className="mx-auto text-6xl text-sky-500 mb-6" />
        <h1 className="text-5xl font-extrabold text-white tracking-tight">
          Find Your <span className="text-sky-400">Squad!</span>
        </h1>
        <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
          Join one of our elite teams and start collaborating on amazing projects. 
          Each team has a unique focus and a vibrant community.
        </p>
        {/* Display Join Success/Error Messages */} 
        {joinError && <p className="text-center text-red-400 mt-6 p-3 bg-red-900/40 rounded-md shadow-lg text-base">{joinError}</p>}
        {joinSuccess && <p className="text-center text-green-400 mt-6 p-3 bg-green-900/40 rounded-md shadow-lg text-base">{joinSuccess}</p>}
      </header>

      {joinableProjects.length === 0 && !loading && !error && (
         <div className="text-center py-10">
            <FaQuestionCircle className="mx-auto text-5xl text-gray-500 mb-4" />
            <p className="text-xl text-gray-400">No projects available at the moment. Check back soon!</p>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* --- UPDATED Mapping over Joinable Projects --- */}
        {joinableProjects.map((project) => {
          // You can select an icon based on project_category or use a default
          const IconComponent = iconMap[project.project_category?.split(' ')[0] || 'FaQuestionCircle'] || FaQuestionCircle; // Simple icon selection
          
          // Use a consistent minimalistic styling (similar to the /team page)
          const bgColor = 'bg-black';
          const textColor = 'text-gray-100';
          const borderColor = 'border-gray-700';

          return (
            <div 
              key={project.id} 
              className={`rounded-md shadow-lg p-6 flex flex-col justify-between border transition-all duration-300 ease-in-out hover:shadow-sky-500/30 hover:scale-105 ${bgColor} ${borderColor}`}
            >
              <div>
                {/* Consider styling icon based on project type */}
                <IconComponent className={`text-4xl mb-4 ${textColor} opacity-80`} />
                <h2 className={`text-2xl font-bold mb-2 ${textColor}`}>{project.name}</h2> {/* Display project name */}
                {/* Display project category or a brief description field if available in clients table */}
                <p className={`text-md mb-6 ${textColor} opacity-90 min-h-[40px]`}>{project.project_category || 'No category specified'}</p>
              </div>
              {/* --- UPDATED Join Button --- */}
              <button
                onClick={() => handleJoinProject(project.id, project.name, project.slug)}
                disabled={joiningProjectId === project.id}
                className={`w-full mt-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-150
                            ${joiningProjectId === project.id 
                              ? 'bg-gray-500 text-gray-300 cursor-not-allowed' 
                              : 'bg-sky-600 text-white hover:bg-sky-700 focus:ring-sky-400' // Use a distinct color for the join button
                            }`}
              >
                {joiningProjectId === project.id ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-900 dark:border-white mr-2"></div>
                    Joining...
                  </>
                ) : (
                  <>
                    <FaUserPlus className="mr-2 -ml-1 h-5 w-5" />
                    Join {project.name}
                  </>
                )}
              </button>
              {/* --- END UPDATED Join Button --- */}
            </div>
          );
        })}
        {/* --- END UPDATED Mapping --- */}
      </div>

      <footer className="text-center mt-20 text-gray-500">
        <p>&copy; {new Date().getFullYear()} b0ase.com - Let\'s build something incredible together.</p>
      </footer>
    </div>
  );
} 