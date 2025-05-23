"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaUserCircle, FaPlusCircle, FaSpinner, FaExclamationTriangle, FaBriefcase } from 'react-icons/fa';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Adjust path if needed
import { User } from '@supabase/supabase-js';
import { gigData as staticGigsData } from './gigData'; // Import static gig data

// New Gig Interface based on Supabase table
interface Gig {
  id: string;
  user_id?: string | null; // Made optional as static gigs won't have a real user_id from DB
  title: string;
  description: string;
  category?: string | null;
  sub_category?: string | null;
  skills_required?: string[] | null; // Keep as string array, will process static data
  budget_type?: 'fixed' | 'hourly' | 'negotiable' | null;
  budget_amount_min?: number | null; // Will parse from string for static data
  budget_amount_max?: number | null; // Will parse from string for static data
  currency?: string | null;
  status?: 'draft' | 'open' | 'in_progress' | 'completed' | 'closed' | 'cancelled' | null;
  is_published?: boolean | null;
  location_preference?: 'remote' | 'on_site' | 'hybrid' | null;
  tags?: string[] | null; // Keep as string array, will process static data
  deadline?: string | null; // TIMESTAMPTZ will be string
  created_at?: string | null;
  updated_at?: string | null;
  thumbnailUrl?: string | null; // Added for gig images
  profiles?: {
    display_name?: string | null;
    avatar_url?: string | null;
  } | null;
}

// Helper to transform static gig data to Gig interface
const transformStaticGig = (staticGig: any, index: number): Gig => {
  const gigId = `static-${index}`;
  return {
    id: gigId,
    user_id: '@BOASE', // Assign a placeholder or specific ID for @BOASE
    title: staticGig.title,
    description: staticGig.description,
    category: staticGig.category || null,
    sub_category: staticGig.sub_category || null,
    skills_required: staticGig.skills_required ? staticGig.skills_required.split(',').map((s: string) => s.trim()) : null,
    budget_type: staticGig.budget_type || 'negotiable',
    budget_amount_min: staticGig.budget_amount_min ? parseFloat(staticGig.budget_amount_min) : null,
    budget_amount_max: staticGig.budget_amount_max ? parseFloat(staticGig.budget_amount_max) : null,
    currency: staticGig.currency || 'USD',
    status: staticGig.is_published ? 'open' : 'draft',
    is_published: staticGig.is_published !== undefined ? staticGig.is_published : true, // Default to published
    location_preference: staticGig.location_preference || 'remote',
    tags: staticGig.tags ? staticGig.tags.split(',').map((t: string) => t.trim()) : null,
    deadline: staticGig.deadline || null,
    created_at: new Date().toISOString(), // Set a created_at for sorting/display
    updated_at: new Date().toISOString(),
    thumbnailUrl: `https://picsum.photos/seed/${gigId}/600/400`, // Generate Picsum URL
    profiles: {
      display_name: '@BOASE',
      // You can use a default @BOASE avatar or leave it to the GigCard default
      avatar_url: 'https://klaputzxeqgypphzdxpr.supabase.co/storage/v1/object/public/avatars/public/user_icon.png' // Placeholder
    }
  };
};

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

  const userDisplayName = gig.profiles?.display_name || (gig.user_id === '@BOASE' ? '@BOASE' : 'Unknown User');
  const userAvatarUrl = gig.profiles?.avatar_url || 'https://klaputzxeqgypphzdxpr.supabase.co/storage/v1/object/public/avatars/public/user_icon.png';
  const gigImageSrc = gig.thumbnailUrl || `https://picsum.photos/seed/${gig.id}/600/400`;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-sky-500/30 hover:border-sky-600">
      <Link href={gig.id.startsWith('static-') ? '#' : `/gigs/${gig.id}`} passHref> 
        <div className="block cursor-pointer">
          <div className="w-full h-48 bg-gray-700 relative">
            <Image 
              src={gigImageSrc} 
              alt={gig.title} 
              layout="fill" 
              objectFit="cover" 
              className="w-full h-full"
            /> 
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

  // Prepare static gigs once
  const transformedStaticGigs = React.useMemo(() => staticGigsData.map(transformStaticGig), []);

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
          thumbnailUrl, 
          profiles (
            display_name,
            avatar_url
          )
        `)
        .order('created_at', { ascending: false });

      if (currentUser) {
        query = query.or(`is_published.eq.true,and(user_id.eq.${currentUser.id},is_published.eq.false)`);
      } else {
        query = query.eq('is_published', true);
      }
      
      const { data: supabaseGigsData, error: fetchError } = await query;

      if (fetchError) {
        console.error("Error fetching gigs:", fetchError);
        setError(fetchError.message);
        setGigs(transformedStaticGigs);
      } else if (supabaseGigsData) {
        const processedSupabaseGigs = (supabaseGigsData as any[]).map(item => {
          // Explicitly construct the Gig object, providing defaults
          const gig: Gig = {
            id: String(item?.id || `fallback-${Math.random()}`),
            user_id: item?.user_id || null,
            title: item?.title || 'Untitled Gig',
            description: item?.description || 'No description available.',
            category: item?.category || null,
            sub_category: item?.sub_category || null,
            skills_required: Array.isArray(item?.skills_required) ? item.skills_required : [],
            budget_type: item?.budget_type || 'negotiable',
            budget_amount_min: typeof item?.budget_amount_min === 'number' ? item.budget_amount_min : null,
            budget_amount_max: typeof item?.budget_amount_max === 'number' ? item.budget_amount_max : null,
            currency: item?.currency || 'USD',
            status: item?.status || 'draft',
            is_published: typeof item?.is_published === 'boolean' ? item.is_published : false,
            location_preference: item?.location_preference || 'remote',
            tags: Array.isArray(item?.tags) ? item.tags : [],
            deadline: item?.deadline || null,
            created_at: item?.created_at || new Date().toISOString(),
            updated_at: item?.updated_at || new Date().toISOString(),
            thumbnailUrl: item?.thumbnailUrl || null,
            profiles: (item?.profiles && typeof item.profiles === 'object') ? item.profiles : null,
          };
          return gig;
        });
        setGigs([...transformedStaticGigs, ...processedSupabaseGigs]);
      } else {
        setGigs(transformedStaticGigs);
      }
      setLoading(false);
    };

    fetchGigs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase, currentUser, transformedStaticGigs]); // Add transformedStaticGigs to dependency array

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

        {error && gigs.length === transformedStaticGigs.length && (
          <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg relative mb-6 text-center" role="alert">
            <FaExclamationTriangle className="inline-block mr-2 text-2xl" />
            <strong className="font-bold">Error fetching dynamic gigs:</strong>
            <span className="block sm:inline ml-1">{error}. Displaying static content.</span>
          </div>
        )}

        {!loading && gigs.length === 0 && (
          <div className="text-center py-10">
            <FaBriefcase className="text-6xl text-gray-600 mb-4 mx-auto" />
            <p className="text-xl text-gray-400 mb-2">No gigs found.</p>
            <p className="text-gray-500">Be the first to post one or check back later!</p>
          </div>
        )}

        {/* Always render GigCards if gigs array has items (either static or dynamic or combined) */}
        {gigs.length > 0 && (
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