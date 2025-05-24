'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import { FaEnvelope, FaSpinner, FaUsers, FaQuestionCircle, FaComments, FaClock, FaReply, FaSearch, FaFilter } from 'react-icons/fa';

// Helper to map icon names to components (copied from other pages)
const iconMap: { [key: string]: React.ElementType } = {
  FaUsers,
  FaQuestionCircle,
  // Add other icons as needed from your project's iconMap
};

interface ColorScheme {
  bgColor: string;
  textColor: string;
  borderColor: string;
}

interface UserTeam {
  id: string;
  name: string;
  slug: string | null;
  icon_name: string | null;
  color_scheme: ColorScheme | null;
  last_message_preview?: string | null;
  unread_count: number;
  last_activity?: string;
}

interface DirectThread {
  id: string;
  display_name: string | null;
  avatar_url?: string | null;
  unread_count: number;
  last_message?: string;
  last_activity?: string;
  is_online?: boolean;
}

// Demo data for realistic conversations
const demoDirectThreads: DirectThread[] = [
  {
    id: 'demo-user-1',
    display_name: 'Alex Thompson',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
    unread_count: 3,
    last_message: 'Hey Raf, I reviewed the latest mockups for the restaurant app. Love the new order flow!',
    last_activity: '2 minutes ago',
    is_online: true
  },
  {
    id: 'demo-user-2',
    display_name: 'Sarah Chen',
    avatar_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face',
    unread_count: 0,
    last_message: 'Perfect! The AI kitchen assistant prototype is working beautifully. Ready for testing.',
    last_activity: '1 hour ago',
    is_online: false
  },
  {
    id: 'demo-user-3',
    display_name: 'Michael Rodriguez',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
    unread_count: 1,
    last_message: 'The food delivery platform integration is complete. Can we schedule a demo?',
    last_activity: '3 hours ago',
    is_online: true
  },
  {
    id: 'demo-user-4',
    display_name: 'Emily Johnson',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
    unread_count: 0,
    last_message: 'Thanks for the feedback on the nutrition tracker API. I\'ll implement those changes.',
    last_activity: '1 day ago',
    is_online: false
  }
];

const demoTeams: UserTeam[] = [
  {
    id: 'demo-team-1',
    name: 'RafsKitchen Core Team',
    slug: 'rafskitchen-core',
    icon_name: 'FaUsers',
    color_scheme: { bgColor: 'bg-cyan-50', textColor: 'text-cyan-800', borderColor: 'border-cyan-200' },
    last_message_preview: 'Planning the next sprint for the culinary AI features',
    unread_count: 5,
    last_activity: '15 minutes ago'
  },
  {
    id: 'demo-team-2',
    name: 'Restaurant Partners',
    slug: 'restaurant-partners',
    icon_name: 'FaUsers',
    color_scheme: { bgColor: 'bg-green-50', textColor: 'text-green-800', borderColor: 'border-green-200' },
    last_message_preview: 'New partnership opportunities in the food tech space',
    unread_count: 2,
    last_activity: '45 minutes ago'
  },
  {
    id: 'demo-team-3',
    name: 'Tech Innovation Hub',
    slug: 'tech-innovation',
    icon_name: 'FaUsers',
    color_scheme: { bgColor: 'bg-purple-50', textColor: 'text-purple-800', borderColor: 'border-purple-200' },
    last_message_preview: 'Discussing blockchain integration for supply chain tracking',
    unread_count: 0,
    last_activity: '2 hours ago'
  }
];

export default function MessagesPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userTeams, setUserTeams] = useState<UserTeam[]>([]);
  const [directThreads, setDirectThreads] = useState<DirectThread[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'unread' | 'recent'>('all');

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
        // For demo purposes, use our demo data
        setDirectThreads(demoDirectThreads);
        setUserTeams(demoTeams);
        setLoading(false);
      } else {
        router.push('/login?message=Please log in to view your messages.');
      }
    };
    fetchUser();
  }, [supabase, router]);

  const fetchUserTeamsWithMessages = useCallback(async (userId: string) => {
    if (!userId) return;
    setLoading(true);
    setError(null);
    try {
      const { data: teamUserEntries, error: teamUserError } = await supabase
        .from('user_team_memberships')
        .select('team_id')
        .eq('user_id', userId);

      if (teamUserError) throw teamUserError;

      if (!teamUserEntries || teamUserEntries.length === 0) {
        setUserTeams(demoTeams); // Use demo data
        return;
      }

      // If real data exists, process it, otherwise fall back to demo
      setUserTeams(demoTeams);
    } catch (e: any) {
      console.error('Error fetching user teams for messages page:', e);
      setError(`Failed to load your teams: ${e.message}`);
      setUserTeams(demoTeams); // Fall back to demo data
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  const fetchDirectThreads = useCallback(async (userId: string) => {
    if (!userId) return;
    try {
      // For demo purposes, we'll use demo data
      setDirectThreads(demoDirectThreads);
    } catch (e: any) {
      console.error('Error fetching direct threads:', e);
      setError(`Failed to load direct messages: ${e.message}`);
      setDirectThreads(demoDirectThreads); // Fall back to demo data
    }
  }, [supabase]);

  // Filter functions
  const filteredDirectThreads = directThreads.filter(thread => {
    const matchesSearch = thread.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         thread.last_message?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filterType) {
      case 'unread':
        return thread.unread_count > 0;
      case 'recent':
        return thread.last_activity?.includes('minute') || thread.last_activity?.includes('hour');
      default:
        return true;
    }
  });

  const filteredTeams = userTeams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         team.last_message_preview?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    
    switch (filterType) {
      case 'unread':
        return team.unread_count > 0;
      case 'recent':
        return team.last_activity?.includes('minute') || team.last_activity?.includes('hour');
      default:
        return true;
    }
  });

  const getTimeColor = (activity: string | undefined) => {
    if (!activity) return 'text-gray-500';
    if (activity.includes('minute')) return 'text-green-600';
    if (activity.includes('hour')) return 'text-cyan-600';
    return 'text-gray-500';
  };

  if (loading || !currentUser) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-cyan-600 mb-4" />
        <p className="text-xl text-gray-700">Loading your messages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-black p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <FaComments className="text-3xl text-cyan-600 mr-3" />
          <h1 className="text-3xl font-bold text-black">My Messages</h1>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'unread' | 'recent')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
          >
            <option value="all">All Messages</option>
            <option value="unread">Unread Only</option>
            <option value="recent">Recent Activity</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:space-x-8">
        {/* Column 1: Direct Messages */}
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-black">Direct Messages</h2>
            <span className="text-sm text-gray-500">
              {filteredDirectThreads.length} conversation{filteredDirectThreads.length !== 1 ? 's' : ''}
            </span>
          </div>
          {filteredDirectThreads.length > 0 ? (
            <div className="space-y-4">
              {filteredDirectThreads.map(user => (
                <Link
                  key={user.id}
                  href={`/messages/${user.id}`}
                  className="block p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-md transition-all flex items-start space-x-4 shadow-lg"
                >
                  <div className="relative">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.display_name || 'User'} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <FaUsers className="w-12 h-12 text-gray-500 p-2 bg-gray-100 rounded-full" />
                    )}
                    {user.is_online && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-lg font-semibold text-black truncate">{user.display_name || 'Unknown User'}</span>
                      <div className="flex items-center space-x-2">
                        {user.last_activity && (
                          <span className={`text-xs ${getTimeColor(user.last_activity)}`}>
                            {user.last_activity}
                          </span>
                        )}
                        {user.unread_count > 0 && (
                          <span className="px-2 py-0.5 bg-cyan-600 text-white text-xs font-semibold rounded-full">
                            {user.unread_count}
                          </span>
                        )}
                      </div>
                    </div>
                    {user.last_message && (
                      <p className="text-sm text-gray-600 truncate">{user.last_message}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white border border-gray-200 rounded-lg shadow-lg">
              <FaEnvelope className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-gray-600">
                {searchQuery || filterType !== 'all' 
                  ? 'No conversations match your criteria.' 
                  : 'No direct messages.'}
              </p>
            </div>
          )}
        </div>

        {/* Column 2: Team Messages */}
        <div className="w-full md:w-1/2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold text-black">Team Messages</h2>
            <span className="text-sm text-gray-500">
              {filteredTeams.length} team{filteredTeams.length !== 1 ? 's' : ''}
            </span>
          </div>
          {filteredTeams.length > 0 ? (
            <div className="space-y-4">
              {filteredTeams.map((team) => {
                const IconComponent = iconMap[team.icon_name || 'FaQuestionCircle'] || FaQuestionCircle;
                const cardBgColor = team.color_scheme?.bgColor || 'bg-white';
                const cardTextColor = team.color_scheme?.textColor || 'text-black';
                const cardBorderColor = team.color_scheme?.borderColor || 'border-gray-200';

                return (
                  <Link
                    key={team.id}
                    href={team.slug ? `/teams/${team.slug}` : `/teams/${team.id}`}
                    className={`flex items-start p-4 rounded-lg border transition-all duration-300 ease-in-out hover:shadow-xl ${cardBgColor} ${cardTextColor} ${cardBorderColor} shadow-lg`}
                  >
                    <IconComponent className="text-3xl mr-4 shrink-0 mt-1" style={{ color: team.color_scheme?.textColor || 'inherit' }} />
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold truncate">{team.name}</h3>
                        <div className="flex items-center space-x-2">
                          {team.last_activity && (
                            <span className={`text-xs ${getTimeColor(team.last_activity)}`}>
                              {team.last_activity}
                            </span>
                          )}
                          {team.unread_count > 0 && (
                            <span className="px-2.5 py-1 bg-cyan-600 text-white text-xs font-bold rounded-full">
                              {team.unread_count}
                            </span>
                          )}
                        </div>
                      </div>
                      {team.last_message_preview && (
                        <p className="text-sm opacity-80 truncate">{team.last_message_preview}</p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
             <div className="text-center py-10 bg-white border border-gray-200 rounded-lg shadow-lg">
              <FaUsers className="mx-auto text-4xl text-gray-400 mb-3" />
              <p className="text-gray-600">
                {searchQuery || filterType !== 'all' 
                  ? 'No teams match your criteria.' 
                  : 'You are not part of any teams.'}
              </p>
               {!searchQuery && filterType === 'all' && (
                 <p className="text-gray-600 mt-2 text-sm">
                   <Link href="/teams/join" className="text-cyan-600 hover:underline">Join a team</Link> or 
                   <Link href="/teams/new" className="text-cyan-600 hover:underline ml-1">create a new one</Link> to start collaborating.
                 </p>
               )}
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-8 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-12 bg-cyan-50 border border-cyan-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-cyan-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/teams/new"
            className="flex items-center p-3 bg-white border border-cyan-200 rounded-lg hover:bg-cyan-50 transition-colors"
          >
            <FaUsers className="text-cyan-600 mr-3" />
            <span className="text-cyan-700 font-medium">Create New Team</span>
          </Link>
          <Link
            href="/projects/new"
            className="flex items-center p-3 bg-white border border-cyan-200 rounded-lg hover:bg-cyan-50 transition-colors"
          >
            <FaReply className="text-cyan-600 mr-3" />
            <span className="text-cyan-700 font-medium">Start New Project</span>
          </Link>
          <Link
            href="/profile"
            className="flex items-center p-3 bg-white border border-cyan-200 rounded-lg hover:bg-cyan-50 transition-colors"
          >
            <FaClock className="text-cyan-600 mr-3" />
            <span className="text-cyan-700 font-medium">Update Status</span>
          </Link>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="mt-12 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-yellow-800 mb-2">Demo Mode</h3>
        <p className="text-yellow-700">
          You're currently viewing a demo version of the RafsKitchen messages dashboard with sample conversations. 
          All functionality is simulated for demonstration purposes. In the full version, 
          you would be able to send and receive real messages, participate in team discussions, 
          and collaborate with other platform users in real-time.
        </p>
        <div className="mt-4">
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
} 