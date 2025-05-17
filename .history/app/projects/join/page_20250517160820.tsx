'use client';

import React, { useEffect, useState } from 'react';
import { FaProjectDiagram, FaUserPlus, FaQuestionCircle, FaUsers } from 'react-icons/fa';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Use singleton
import { User, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '@/lib/database.types'; // Assuming this is the correct path to your generated types

// Interface for project details (from clients table)
interface ProjectDetails {
  id: string;
  name: string;
  description: string | null;
  // user_id: string; // Original creator
  profiles: { // To fetch creator's profile
    display_name: string | null;
    avatar_url?: string | null;
  } | null;
  // Add other relevant fields like icon or color if they exist on clients table
}

export default function JoinProjectPage() {
  const supabase: SupabaseClient<Database> = getSupabaseBrowserClient();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [projects, setProjects] = useState<ProjectDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [joiningProjectId, setJoiningProjectId] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joinSuccess, setJoinSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchCurrentUserAndProjects = async () => {
      setLoading(true);
      setError(null);
      setJoinError(null);
      setJoinSuccess(null);

      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);

      if (!user) {
        setError('You must be logged in to view or join projects.');
        setLoading(false);
        setProjects([]);
        return;
      }

      // 1. Get IDs of projects the user is already a member of
      const { data: memberships, error: membershipError } = await supabase
        .from('user_project_memberships')
        .select('project_id')
        .eq('user_id', user.id);

      if (membershipError) {
        console.error('Error fetching existing project memberships:', membershipError);
        setError('Could not verify your current projects. Please try again.');
        setLoading(false);
        return;
      }
      const joinedProjectIds = memberships?.map(m => m.project_id) || [];

      // 2. Fetch all projects, joining with creator's profile from 'profiles' table
      // Assuming clients.user_id is the FK to profiles.id for the creator
      const { data: allProjectsData, error: fetchError } = await supabase
        .from('clients') // This is our 'projects' table
        .select(`
          id,
          name,
          project_brief, 
          user_id, 
          profiles:user_id (display_name, avatar_url)
        `)
        // Add any filters here if projects need to be explicitly marked as "joinable"
        // For now, fetch all and filter out joined ones client-side
        .order('name', { ascending: true });

      if (fetchError) {
        console.error('Error fetching projects:', fetchError);
        // Check RLS policies on 'clients' and 'profiles' if this fails
        setError('Could not load available projects. Please ensure RLS policies on "clients" and "profiles" allow reads.');
        setProjects([]);
      } else if (allProjectsData) {
        const availableProjects = allProjectsData
          .filter(p => !joinedProjectIds.includes(p.id))
          .map(p => ({
            id: p.id,
            name: p.name,
            description: p.project_brief, // Assuming project_brief is the description
            // user_id: p.user_id, // Creator's ID
            profiles: (p.profiles && typeof p.profiles === 'object' && !Array.isArray(p.profiles)) 
                        ? p.profiles as ProjectDetails['profiles'] 
                        : null,
          }));
        setProjects(availableProjects);
      }
      setLoading(false);
    };

    fetchCurrentUserAndProjects();
  }, [supabase]);

  const handleJoinProject = async (projectId: string, projectName: string) => {
    if (!currentUser) {
      setJoinError('You must be logged in to join a project.');
      return;
    }
    setJoiningProjectId(projectId);
    setJoinError(null);
    setJoinSuccess(null);

    const { error: insertError } = await supabase
      .from('user_project_memberships')
      .insert({ project_id: projectId, user_id: currentUser.id, role: 'member' }); // Default role 'member'

    if (insertError) {
      console.error(`Error joining project ${projectName} (ID: ${projectId}):`, insertError);
      if (insertError.code === '23505') { // Unique violation
        setJoinError(`You are already a member of ${projectName}.`);
      } else {
        setJoinError(`Failed to join ${projectName}. ${insertError.message}`);
      }
    } else {
      setJoinSuccess(`Successfully joined ${projectName}! It will now appear in "My Projects".`);
      // Refresh the list of available projects or disable the button for the joined project
      setProjects(prev => prev.filter(p => p.id !== projectId));
    }
    setJoiningProjectId(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-sky-500 mb-4"></div>
        <p className="text-xl text-sky-300">Loading Available Projects...</p>
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
      <header className="text-center mb-16">
        <FaProjectDiagram className="mx-auto text-6xl text-sky-500 mb-6" />
        <h1 className="text-5xl font-extrabold text-white tracking-tight">
          Discover & Join <span className="text-sky-400">Projects!</span>
        </h1>
        <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
          Find exciting projects and collaborate with creators. Click join to become a part of their journey.
        </p>
        {joinError && <p className="text-center text-red-400 mt-4 p-2 bg-red-900/30 rounded-md">{joinError}</p>}
        {joinSuccess && <p className="text-center text-green-400 mt-4 p-2 bg-green-900/30 rounded-md">{joinSuccess}</p>}
      </header>

      {projects.length === 0 && !loading && (
         <div className="text-center">
            <FaQuestionCircle className="mx-auto text-5xl text-gray-500 mb-4" />
            <p className="text-xl text-gray-400">No new projects available to join at the moment, or you've joined them all!</p>
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {projects.map((project) => (
          <div 
            key={project.id} 
            className="bg-slate-800 rounded-xl shadow-2xl p-8 flex flex-col justify-between border-2 border-slate-700 hover:border-sky-500 transition-all duration-300 ease-in-out hover:shadow-sky-500/50"
          >
            <div>
              {/* You might want an icon for projects, similar to teams */}
              <h2 className="text-3xl font-bold mb-2 text-sky-300">{project.name}</h2>
              {project.profiles?.display_name && (
                  <div className="mb-3 text-sm flex items-center text-gray-400">
                    <img 
                      src={project.profiles.avatar_url || 'https://via.placeholder.com/150/000000/FFFFFF/?text=C'} 
                      alt={project.profiles.display_name || 'Creator'} 
                      className="w-6 h-6 rounded-full mr-2 object-cover border border-gray-600"
                      crossOrigin="anonymous"
                    />
                    <span>Created by: {project.profiles.display_name}</span>
                  </div>
                )}
              <p className="text-md text-gray-300 opacity-90 min-h-[60px] mb-6">{project.description || 'No description available.'}</p>
            </div>
            <button
              onClick={() => handleJoinProject(project.id, project.name)}
              disabled={joiningProjectId === project.id}
              className={`w-full mt-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-150
                          ${joiningProjectId === project.id ? 'bg-gray-600 text-gray-400 cursor-not-allowed' : 'bg-sky-600 hover:bg-sky-500 text-white focus:ring-sky-400'}`}
            >
              {joiningProjectId === project.id ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                  Joining...
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2 -ml-1 h-5 w-5" />
                  Join Project
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <footer className="text-center mt-20 text-gray-500">
        <p>&copy; {new Date().getFullYear()} b0ase.com - Find your next collaboration.</p>
      </footer>
    </div>
  );
} 