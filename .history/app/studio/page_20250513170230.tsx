'use client';

import React from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';

export default function StudioPage() {
  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSupabaseLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error logging out:', error.message);
      alert(`Error logging out: ${error.message}`);
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16 ml-64">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Studio</h1>
          <button 
            onClick={handleSupabaseLogout}
            className="px-4 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-md transition-colors shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-900"
          >
            Logout
          </button>
        </div>
        
        <div className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-lg">
          <p className="text-gray-300 mb-6">
            Welcome to your private Studio. This area is protected and requires authentication.
          </p>
          
          {/* Unified Links Section */}
          <div className="mt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {[
                { href: '/profile', title: 'My Profile', description: 'View and update your user profile details.' },
                { href: '/diary', title: 'Diary', description: 'Personal journal, daily notes, and reflections.' },
                { href: '/workinprogress', title: 'Work In Progress', description: 'Overview of current tasks, projects, and ongoing efforts.' },
                { href: '/gigs/calendar', title: 'Calendar', description: 'Visualize deadlines, learning sessions, and financial check-ins.' },
                { href: '/finances', title: 'Financial Overview', description: 'View income, expenses, and financial reports.' },
                { href: '/gigs', title: 'Gig Management', description: 'Track freelance projects, proposals, and client interactions.' },
                { href: '/gigs/research', title: 'Research', description: 'Explore Fiverr trends, popular gigs, pricing, and keywords.' },
                { href: '/gigs/strategy', title: 'Strategy', description: 'Define specific gig offerings, unique selling points, and target audiences.' },
                { href: '/gigs/action', title: 'Action Plan', description: 'Detailed steps to create and launch gigs for each platform/service.' },
                { href: '/gigs/learning-path', title: 'Learning Path', description: 'Follow a structured 3-month schedule to master each platform.' },
                { href: '/gigs/platforms', title: 'Platforms', description: 'Review key platforms, required expertise, and potential gig ideas.' },
                { href: '/gigs/work-path', title: 'Work Path', description: 'Manage your daily workflow and balance client work with skill development.' },
                { href: '/gigs/fiverr-explorer', title: 'Fiverr Explorer', description: 'Browse Fiverr categories and scrape gig data for research.' },
              ].map((item, index) => (
                <Link key={item.href} href={item.href} className={`block bg-gray-800 hover:bg-gray-700 p-6 border border-gray-700 shadow-md transition-colors group`}>
                  <h3 className={`text-xl font-semibold text-white mb-2 group-hover:text-gray-200`}>
                    {index + 1}. {item.title}
                  </h3>
                  <p className="text-gray-400 text-sm group-hover:text-gray-300">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <p className="text-gray-400 italic">Further studio-specific content can be added below.</p>
        </div>
      </main>
    </div>
  );
} 