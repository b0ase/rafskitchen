"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaStar, FaUserCircle, FaPlusCircle, FaSpinner, FaExclamationTriangle, FaBriefcase, FaCalendarAlt, FaDollarSign, FaChartLine, FaUsers, FaRocket } from 'react-icons/fa';
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
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300">
      <Link href={gig.id.startsWith('static-') ? '#' : `/gigs/${gig.id}`} passHref> 
        <div className="block cursor-pointer">
          <div className="w-full h-48 bg-gray-200 relative">
            <Image 
              src={gigImageSrc} 
              alt={gig.title} 
              layout="fill" 
              objectFit="cover" 
              className="w-full h-full"
            /> 
          </div>
          <div className="p-4">
            <h3 className="text-lg font-semibold text-black mb-2 truncate" title={gig.title}>
              {gig.title}
            </h3>
            <div className="flex items-center mb-3 text-sm text-gray-600">
              <Image src={userAvatarUrl} alt={userDisplayName} width={24} height={24} className="rounded-full mr-2" />
              <span>{userDisplayName}</span>
            </div>
            
            {gig.category && (
              <p className="text-xs text-gray-500 mb-1">
                Category: <span className="text-cyan-600">{gig.category}{gig.sub_category ? ` > ${gig.sub_category}` : ''}</span>
              </p>
            )}

            <div className="flex justify-between items-center mt-3">
              <span className="text-lg font-bold text-cyan-600">{budgetDisplay}</span>
              {gig.status && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  gig.status === 'open' ? 'bg-green-100 text-green-800' :
                  gig.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
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
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-600">//</span> Gigs & Freelance</h1>
        <p className="text-xl text-gray-700 max-w-4xl">
          Manage your freelance projects, track earnings, and schedule client work across multiple platforms.
        </p>
      </header>

      {/* Quick Actions */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/gigs/calendar"
            className="bg-white p-6 border border-gray-200 shadow-lg rounded-lg hover:border-gray-300 transition-all"
          >
            <div className="flex items-center mb-4">
              <FaCalendarAlt className="text-cyan-600 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Calendar</h3>
            </div>
            <p className="text-gray-600 mb-4">View and manage your project deadlines, client meetings, and scheduled tasks.</p>
            <div className="flex items-center text-cyan-600 text-sm font-medium">
              Open Calendar
            </div>
          </Link>

          <div className="bg-white p-6 border border-gray-200 shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
              <FaBriefcase className="text-gray-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-700">Active Projects</h3>
            </div>
            <p className="text-gray-600 mb-4">Track progress on your current freelance projects and deliverables.</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
              <FaDollarSign className="text-gray-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-700">Earnings Tracker</h3>
            </div>
            <p className="text-gray-600 mb-4">Monitor your income across different platforms and projects.</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </section>

      {/* Platform Integration */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-50 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Platform Integration</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Fiverr</h3>
            <p className="text-gray-600 mb-4">Connect your Fiverr account to sync orders and track performance</p>
            <div className="text-gray-500 text-sm">
              Integration Coming Soon
            </div>
          </div>

          <div className="p-6 border-l-2 border-gray-300">
            <h3 className="font-bold text-xl mb-2 text-gray-700">Upwork</h3>
            <p className="text-gray-600 mb-4">Sync your Upwork contracts and time tracking</p>
            <div className="text-gray-500 text-sm">
              Integration Coming Soon
            </div>
          </div>

          <div className="p-6 border-l-2 border-gray-300">
            <h3 className="font-bold text-xl mb-2 text-gray-700">Freelancer.com</h3>
            <p className="text-gray-600 mb-4">Manage your Freelancer.com projects and milestones</p>
            <div className="text-gray-500 text-sm">
              Integration Coming Soon
            </div>
          </div>

          <div className="p-6 border-l-2 border-gray-300">
            <h3 className="font-bold text-xl mb-2 text-gray-700">Direct Clients</h3>
            <p className="text-gray-600 mb-4">Track projects from your direct client relationships</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Overview */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Performance Analytics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <FaChartLine className="text-cyan-600 text-3xl mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Monthly Revenue</h3>
            <p className="text-2xl font-bold text-gray-900">$12,450</p>
            <p className="text-sm text-gray-500">This Month</p>
            <div className="mt-2">
              <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                +23% from last month
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <FaBriefcase className="text-cyan-600 text-3xl mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Active Projects</h3>
            <p className="text-2xl font-bold text-gray-900">8</p>
            <p className="text-sm text-gray-500">In Progress</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-cyan-600 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">6 of 8 on track</p>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <FaUsers className="text-cyan-600 text-3xl mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Clients</h3>
            <p className="text-2xl font-bold text-gray-900">24</p>
            <p className="text-sm text-gray-500">Total</p>
            <div className="mt-2">
              <span className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                5 new this month
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6 text-center">
            <FaRocket className="text-cyan-600 text-3xl mx-auto mb-4" />
            <h3 className="font-bold text-lg mb-2">Completion Rate</h3>
            <p className="text-2xl font-bold text-gray-900">94%</p>
            <p className="text-sm text-gray-500">Success Rate</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">Excellent performance</p>
          </div>
        </div>

        {/* Additional Analytics Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h4 className="font-semibold text-lg mb-4 text-cyan-600">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Restaurant POS Integration</span>
                <span className="text-green-600 font-medium">Completed</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">AI Kitchen Assistant MVP</span>
                <span className="text-blue-600 font-medium">In Progress</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Food Delivery App Design</span>
                <span className="text-yellow-600 font-medium">Review</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Blockchain Supply Chain</span>
                <span className="text-purple-600 font-medium">Planning</span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h4 className="font-semibold text-lg mb-4 text-cyan-600">Earnings Breakdown</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Development Projects</span>
                <span className="font-medium">$8,200</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">UI/UX Design</span>
                <span className="font-medium">$2,800</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Consulting</span>
                <span className="font-medium">$1,450</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex items-center justify-between text-sm font-semibold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-cyan-600">$12,450</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h4 className="font-semibold text-lg mb-4 text-cyan-600">Upcoming Deadlines</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Mobile App Testing</span>
                <span className="text-red-600 font-medium">2 days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">API Documentation</span>
                <span className="text-yellow-600 font-medium">5 days</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Client Presentation</span>
                <span className="text-green-600 font-medium">1 week</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">Security Audit</span>
                <span className="text-gray-600 font-medium">2 weeks</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      <section className="px-4 md:px-8 py-16 text-center mb-12">
        <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Demo Mode</h3>
          <p className="text-yellow-700 mb-4">
            You're viewing a demo version of the gigs dashboard. In the full version, you would have access to:
          </p>
          <ul className="text-yellow-700 text-sm space-y-1 mb-4">
            <li>• Real-time project tracking and milestone management</li>
            <li>• Integrated earnings and invoice tracking</li>
            <li>• Platform API integrations for automatic sync</li>
            <li>• Advanced analytics and performance metrics</li>
            <li>• Client communication and file sharing</li>
          </ul>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
} 