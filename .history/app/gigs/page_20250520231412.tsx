"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaUserCircle, FaPlusCircle, FaSpinner, FaExclamationTriangle, FaBriefcase } from 'react-icons/fa';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Adjust path if needed
import { User } from '@supabase/supabase-js';

// New Gig Interface based on Supabase table
interface Gig {
  id: string;
  user_id: string;
  title: string;
  description: string;
  category?: string | null;
  sub_category?: string | null;
  skills_required?: string[] | null;
  budget_type?: 'fixed' | 'hourly' | 'negotiable' | null;
  budget_amount_min?: number | null;
  budget_amount_max?: number | null;
  currency?: string | null;
  status?: 'draft' | 'open' | 'in_progress' | 'completed' | 'closed' | 'cancelled' | null;
  is_published?: boolean | null;
  location_preference?: 'remote' | 'on_site' | 'hybrid' | null;
  tags?: string[] | null;
  deadline?: string | null; // TIMESTAMPTZ will be string
  created_at?: string | null;
  updated_at?: string | null;
  // Optional: Add user's display_name or avatar_url if we join with profiles table later
  profiles?: {
    display_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

const GigCard: React.FC<{ gig: Gig }> = ({ gig }) => {
  const displayCurrency = gig.currency || 'USD';
  let budgetDisplay = 'Negotiable';
  if (gig.budget_type === 'fixed' && gig.budget_amount_min) {
    budgetDisplay = `${displayCurrency}${gig.budget_amount_min}`;
  } else if (gig.budget_type === 'hourly' && gig.budget_amount_min) {
    budgetDisplay = `${displayCurrency}${gig.budget_amount_min}/hr`;
    if (gig.budget_amount_max) {
      budgetDisplay = `${displayCurrency}${gig.budget_amount_min}-${gig.budget_amount_max}/hr`;
    }
  } else if (gig.budget_amount_min) {
    budgetDisplay = `${displayCurrency}${gig.budget_amount_min}`;
    if (gig.budget_amount_max) {
      budgetDisplay += ` - ${displayCurrency}${gig.budget_amount_max}`;
    }
  }

  const userDisplayName = gig.profiles?.display_name || 'Unknown User';
  const userAvatarUrl = gig.profiles?.avatar_url || 'https://klaputzxeqgypphzdxpr.supabase.co/storage/v1/object/public/avatars/public/user_icon.png';

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-sky-500/30 hover:border-sky-600">
      <Link href={`/gigs/${gig.id}`} passHref> {/* Placeholder for future gig detail page */}
        <div className="block cursor-pointer">
          {/* Placeholder for thumbnail - will need to add image storage for gigs later */}
          <div className="w-full h-48 bg-gray-700 flex items-center justify-center text-gray-500">
            <FaBriefcase size={48} /> 
            {/* <Image src={gig.thumbnailUrl || `https://picsum.photos/seed/${gig.id}/600/400`} alt={gig.title} width={600} height={400} className="w-full h-full object-cover" /> */}
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-white mb-2 truncate" title={gig.title}>
              {gig.title}
            </h3>
            <div className="flex items-center mb-3 text-sm text-gray-400">
              <Image src={userAvatarUrl} alt={userDisplayName} width={24} height={24} className="rounded-full mr-2" />
              <span>{userDisplayName}</span>
            </div>
            
            {gig.category && (
              <p className="text-xs text-gray-500 mb-1">
                Category: <span className="text-sky-400">{gig.category}{gig.sub_category ? ` > ${gig.sub_category}` : ''}</span>
              </p>
            )}

            <div className="flex justify-between items-center mt-3">
              <span className="text-lg font-bold text-sky-400">{budgetDisplay}</span>
              {gig.status && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  gig.status === 'open' ? 'bg-green-600 text-green-100' :
                  gig.status === 'draft' ? 'bg-yellow-600 text-yellow-100' :
                  'bg-gray-600 text-gray-200'
                }`}>
                  {gig.status.charAt(0).toUpperCase() + gig.status.slice(1)}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default function GigsPage() {
  const supabase = getSupabaseBrowserClient();
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
    };
    fetchUser();
  }, [supabase]);

  useEffect(() => {
    const fetchGigs = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('gigs')
        .select(`
          *,
          profiles (
            display_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      // If a user is logged in, fetch their own gigs (published or not) OR any published gig.
      // If no user, fetch only published gigs.
      // This logic might need refinement based on desired "My Gigs" vs "Browse Gigs" views.
      // For now, let's show published gigs primarily, and user's own drafts.
      if (currentUser) {
        query = query.or(`is_published.eq.true,and(user_id.eq.${currentUser.id},is_published.eq.false)`);
      } else {
        query = query.eq('is_published', true);
      }
      
      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching gigs:", fetchError);
        setError(fetchError.message);
        setGigs([]);
      } else if (data) {
        setGigs(data as Gig[]);
      }
      setLoading(false);
    };

    fetchGigs();
  }, [supabase, currentUser]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white p-4 md:p-8">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0">
            Freelance Gigs
          </h1>
          <Link href="/gigs/create" passHref>
            <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center">
              <FaPlusCircle className="mr-2" /> Create New Gig
            </button>
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-10">
            <FaSpinner className="animate-spin text-4xl text-sky-500" />
            <p className="ml-3 text-lg">Loading Gigs...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
            <FaExclamationTriangle className="inline-block mr-2 text-2xl" />
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-1">{error}</span>
          </div>
        )}

        {!loading && !error && gigs.length === 0 && (
          <div className="text-center py-10">
            <FaBriefcase className="text-6xl text-gray-600 mb-4 mx-auto" />
            <p className="text-xl text-gray-400 mb-2">No gigs found.</p>
            <p className="text-gray-500">Be the first to post one or check back later!</p>
          </div>
        )}

        {!loading && !error && gigs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {gigs.map((gig) => (
              <GigCard key={gig.id} gig={gig} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 