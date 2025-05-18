'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import { FaUserCircle, FaEnvelope, FaIdBadge, FaArrowLeft, FaSpinner, FaSignature, FaInfoCircle, FaBriefcase, FaLightbulb, FaUsers } from 'react-icons/fa';
import { usePageHeader, PageContextType } from '@/components/MyCtx';

interface ViewedProfile {
  id: string;
  avatar_url: string | null;
  display_name: string | null;
  username: string | null;
  bio: string | null;
  oneliner: string | null;
}

interface Skill {
  id: string;
  name: string;
}


export default function UserProfilePage() {
  const supabase = createClientComponentClient();
  const params = useParams();
  const router = useRouter();
  const viewedUserId = params.userId as string;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [viewedProfile, setViewedProfile] = useState<ViewedProfile | null>(null);
  const [userSkills, setUserSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = useCallback(async () => {
    if (!viewedUserId) {
      setError('User ID not provided.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);

    const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
    if (authError || !authUser) {
      console.error('Auth error on profile view:', authError);
      router.push('/login?redirectedFrom=/profile/' + viewedUserId);
      return;
    }
    setCurrentUser(authUser);

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select(`
        id,
        avatar_url,
        display_name,
        username,
        bio,
        oneliner
      `)
      .eq('id', viewedUserId)
      .single();

    if (profileError || !profileData) {
      console.error('Error fetching viewed profile. Details:', {
        message: profileError?.message,
        details: profileError?.details,
        hint: profileError?.hint,
        code: profileError?.code,
        fullError: profileError
      });
      setError('Could not load user profile. The user may not exist or there was a data fetching issue. Check console for details.');
      setViewedProfile(null);
      setLoading(false);
      return;
    }
    
    // Fetch user's skills
    // Ensure the select query correctly references the foreign key relationship
    // If 'skills' is the related table and it has 'id' and 'name', and 'user_skills' links them
    const { data: skillsData, error: skillsError } = await supabase
      .from('user_skills')
      .select(`
        skills (id, name) 
      `)
      .eq('user_id', viewedUserId);

    if (skillsError) {
      console.error('Error fetching user skills. Details:', {
        message: skillsError?.message,
        details: skillsError?.details,
        hint: skillsError?.hint,
        code: skillsError?.code,
        fullError: skillsError
      });
      setUserSkills([]);
    } else {
      // If us.skills is an array of skill objects due to the join, we need to flatten it.
      // Also, filter out any null/undefined skills before accessing properties.
      const flattenedSkills = skillsData
        ?.flatMap(us => us.skills || [])
        .filter(skill => skill && typeof skill === 'object' && skill.id && skill.name) as Skill[] || [];
      setUserSkills(flattenedSkills);
    }
    
    setViewedProfile(profileData as ViewedProfile);
    setLoading(false);

  }, [viewedUserId, supabase, router]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-sky-500" />
        <p className="mt-3 text-lg">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center p-4">
        <div className="bg-red-900/30 border border-red-700 text-red-300 px-6 py-4 rounded-md text-center max-w-md">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
          <button onClick={() => router.back()} className="mt-4 inline-flex items-center bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">
            <FaArrowLeft className="mr-2" /> Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!viewedProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center p-4">
         <div className="text-center max-w-md">
            <FaUserCircle className="mx-auto text-6xl text-gray-600 mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">Profile Not Found</h2>
            <p className="text-gray-400 mb-6">The user profile could not be displayed.</p>
            <button onClick={() => router.back()} className="inline-flex items-center bg-sky-600 hover:bg-sky-500 text-white font-semibold py-2 px-4 rounded-md transition-colors">
              <FaArrowLeft className="mr-2" /> Go Back
            </button>
        </div>
      </div>
    );
  }
  
  const displayName = viewedProfile.display_name || viewedProfile.username || 'User';

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col pt-6 md:pt-10 pb-12">
      <main className="flex-grow container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-6">
            <button 
              onClick={() => router.back()} 
              className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors text-sm mb-4 group"
            >
              <FaArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-150" />
              Back
            </button>
          </div>

          <div className="bg-slate-800 shadow-2xl rounded-xl p-6 md:p-10 border border-slate-700">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 md:gap-8 mb-8">
              {viewedProfile.avatar_url ? (
                <img 
                  src={viewedProfile.avatar_url} 
                  alt={displayName} 
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-slate-700 ring-2 ring-sky-500" 
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-700 flex items-center justify-center border-4 border-slate-600 ring-2 ring-sky-500">
                  <FaUserCircle className="text-6xl md:text-7xl text-slate-500" />
                </div>
              )}
              <div className="text-center sm:text-left flex-grow">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{displayName}</h1>
                {viewedProfile.username && <p className="text-md text-sky-400 mb-1">@{viewedProfile.username}</p>}
                {viewedProfile.oneliner && <p className="text-lg text-gray-400 italic mb-3">&ldquo;{viewedProfile.oneliner}&rdquo;</p>}
              </div>
            </div>

            {viewedProfile.bio && (
              <div className="mb-8 p-4 bg-slate-850/50 rounded-lg border border-slate-700/70">
                <h2 className="text-xl font-semibold text-sky-300 mb-2 flex items-center"><FaInfoCircle className="mr-2 text-sky-400"/>Bio</h2>
                <p className="text-gray-300 whitespace-pre-wrap text-sm leading-relaxed">{viewedProfile.bio}</p>
              </div>
            )}

            {userSkills.length > 0 && (
              <div className="mb-6 p-4 bg-slate-850/50 rounded-lg border border-slate-700/70">
                <h2 className="text-xl font-semibold text-sky-300 mb-3 flex items-center"><FaLightbulb className="mr-2 text-yellow-400"/>Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {userSkills.map(skill => (
                    <span key={skill.id} className="bg-sky-600/80 text-white text-xs font-medium px-2.5 py-1 rounded-full shadow-sm">
                      {skill.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Placeholder for more sections like 'Projects Involved In', 'Recent Activity', etc. */}

          </div>
        </div>
      </main>
    </div>
  );
}