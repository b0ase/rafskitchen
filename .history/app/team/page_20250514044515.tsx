'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaUsers, FaSpinner } from 'react-icons/fa';

export default function TeamPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      setLoadingUser(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
      } else {
        console.log('No user session found on team page, redirecting to login.');
        router.push('/login?redirectedFrom=/team');
      }
      setLoadingUser(false);
    };
    getUser();
  }, [supabase, router]);

  if (loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-sky-500" />
        <p className="ml-3 text-xl">Loading user data...</p>
      </div>
    );
  }

  if (!user && !loadingUser) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <p className="text-xl mb-4">You need to be logged in to view your team.</p>
        <Link href="/login?redirectedFrom=/team" className="text-sky-400 hover:text-sky-300">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white flex items-center">
            <FaUsers className="mr-3" /> My Team
          </h1>
          {/* Add button for inviting team members later */}
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">Team Members</h2>
          <div className="bg-gray-900 p-6 border border-gray-800 shadow-lg rounded-md">
            {/* Placeholder for team member list */}
            <p className="text-gray-500 italic">No team members yet. Invite members to collaborate on projects.</p>
            {/* TODO: Implement list of team members, roles, assigned projects etc. */}
            {/* TODO: Implement invite functionality */}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-6 border-b border-gray-700 pb-3">Team Permissions & Roles</h2>
          <div className="bg-gray-900 p-6 border border-gray-800 shadow-lg rounded-md">
            {/* Placeholder for permissions management */}
            <p className="text-gray-500 italic">Permissions management will be available here.</p>
            {/* TODO: Implement UI for defining roles and assigning permissions */}
          </div>
        </section>

      </main>
    </div>
  );
} 