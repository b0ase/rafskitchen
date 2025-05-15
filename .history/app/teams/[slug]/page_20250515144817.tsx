'use client';

import React, { useEffect, useState, FormEvent, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs';
import Link from 'next/link';
import { FaPaperPlane, FaSpinner, FaExclamationTriangle, FaUsers, FaCommentDots, FaArrowLeft } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

// Re-using iconMap and ColorScheme if needed for team display, similar to other pages
const iconMap: { [key: string]: React.ElementType } = {
  FaDatabase: FaUsers, // Example, adjust if you have specific icons
  FaPalette: FaUsers,
  FaBolt: FaUsers,
  FaCloud: FaUsers,
  FaLightbulb: FaUsers,
  FaBrain: FaUsers,
  FaUsers: FaUsers,
  FaQuestionCircle: FaUsers,
};

interface ColorScheme {
  bgColor: string;
  textColor: string;
  borderColor: string;
}

interface TeamDetails {
  id: string;
  name: string;
  description?: string | null;
  icon_name?: string | null;
  color_scheme?: ColorScheme | null;
  slug?: string | null;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { display_name: string | null; avatar_url?: string | null; } | null; // For sender's details
}

export default function TeamPage() {
  const supabase = createClientComponentClient();
  const params = useParams();
  const router = useRouter();
  const teamSlugOrId = params.slug as string;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  
  const [loadingTeamDetails, setLoadingTeamDetails] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [postingMessage, setPostingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (!user) {
        // Optionally redirect if no user, though RLS should protect data
        // router.push('/login'); 
      }
    };
    getUser();
  }, [supabase, router]);

  // Fetch team details
  const fetchTeamDetails = useCallback(async () => {
    if (!teamSlugOrId) return;
    setLoadingTeamDetails(true);
    setError(null);
    
    let teamQuery = supabase.from('teams').select('*');
    // Check if it looks like a UUID (for ID-based fetching) or treat as slug
    if (teamSlugOrId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        teamQuery = teamQuery.eq('id', teamSlugOrId);
    } else {
        teamQuery = teamQuery.eq('slug', teamSlugOrId);
    }
    teamQuery = teamQuery.single();

    const { data, error: teamError } = await teamQuery;

    if (teamError || !data) {
      console.error('Error fetching team details:', teamError);
      setError('Team not found or error loading details.');
      setTeamDetails(null);
    } else {
      setTeamDetails({
        ...data,
        color_scheme: data.color_scheme || { bgColor: 'bg-gray-700', textColor: 'text-gray-100', borderColor: 'border-gray-500' },
        icon_name: data.icon_name || 'FaUsers',
      } as TeamDetails);
    }
    setLoadingTeamDetails(false);
  }, [supabase, teamSlugOrId]);

  // Fetch messages
  const fetchMessages = useCallback(async (teamId: string) => {
    if (!teamId) return;
    setLoadingMessages(true);

    const { data, error: messagesError } = await supabase
      .from('team_messages')
      .select(`
        id,
        content,
        created_at,
        user_id,
        profiles ( display_name, avatar_url )
      `)
      .eq('team_id', teamId)
      .order('created_at', { ascending: true });

    if (messagesError) {
      console.error('Error fetching messages:', messagesError);
      setError(prev => prev ? `${prev} | Failed to load messages.` : 'Failed to load messages.');
      setMessages([]);
    } else {
      setMessages(data as Message[]);
    }
    setLoadingMessages(false);
  }, [supabase]);
  
  useEffect(() => {
    fetchTeamDetails();
  }, [fetchTeamDetails]);

  useEffect(() => {
    if (teamDetails?.id) {
      fetchMessages(teamDetails.id);
    }
  }, [teamDetails, fetchMessages]);

  // Real-time subscription for new messages
  useEffect(() => {
    if (!teamDetails?.id) return;

    const channel = supabase
      .channel(`team-messages-${teamDetails.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'team_messages', filter: `team_id=eq.${teamDetails.id}` },
        async (payload) => {
          console.log('New message received via realtime:', payload.new);
          const { data: newMessageWithProfile, error: fetchError } = await supabase
            .from('team_messages')
            .select(`
              id,
              content,
              created_at,
              user_id,
              profiles ( display_name, avatar_url )
            `)
            .eq('id', (payload.new as Message).id)
            .single();
          
          if (fetchError) {
            console.error("Error fetching new message with profile:", fetchError);
          } else if (newMessageWithProfile) {
            setMessages(currentMessages => [...currentMessages, newMessageWithProfile as Message]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, teamDetails?.id]);


  const handlePostMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessageContent.trim() || !currentUser || !teamDetails?.id) {
      setError('Message cannot be empty, or user/team not properly loaded.');
      return;
    }
    setPostingMessage(true);
    setError(null);

    const { error: insertError } = await supabase
      .from('team_messages')
      .insert({
        team_id: teamDetails.id,
        user_id: currentUser.id,
        content: newMessageContent.trim(),
      });

    if (insertError) {
      console.error('Error posting message:', insertError);
      setError(`Failed to post message: ${insertError.message}`);
    } else {
      setNewMessageContent(''); // Clear input field on success
    }
    setPostingMessage(false);
  };
  
  if (loadingTeamDetails) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-300 flex flex-col items-center justify-center p-4">
        <FaSpinner className="animate-spin text-4xl text-sky-500 mb-3" />
        <p>Loading team details...</p>
      </div>
    );
  }

  if (error && !teamDetails) {
    return (
      <div className="min-h-screen bg-gray-950 text-gray-300 flex flex-col items-center justify-center p-4 text-center">
        <FaExclamationTriangle className="text-5xl text-red-500 mb-4" />
        <h2 className="text-2xl font-semibold text-red-400 mb-2">Error</h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <Link href="/teams/join" className="px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md text-white transition-colors">
          Find other teams
        </Link>
      </div>
    );
  }
  
  if (!teamDetails) {
      return (
          <div className="min-h-screen bg-gray-950 text-gray-300 flex flex-col items-center justify-center p-4">
              <FaExclamationTriangle className="text-5xl text-yellow-500 mb-4" />
              <p>Team not found.</p>
                <Link href="/myteam" className="mt-4 px-4 py-2 bg-sky-600 hover:bg-sky-500 rounded-md text-white transition-colors">
                    Back to My Team
                </Link>
          </div>
      );
  }

  const TeamIcon = iconMap[teamDetails.icon_name || 'FaUsers'] || FaUsers;
  const teamBgColor = teamDetails.color_scheme?.bgColor || 'bg-gray-800';
  const teamTextColor = teamDetails.color_scheme?.textColor || 'text-gray-100';

  return (
    <div className={`min-h-screen flex flex-col ${teamBgColor} ${teamTextColor}`}>
      <header className={`p-4 md:p-6 shadow-md border-b border-gray-700/50 sticky top-0 z-10 bg-opacity-80 backdrop-blur-md ${teamBgColor}`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/myteam" className="mr-4 p-2 rounded-full hover:bg-white/10 transition-colors">
              <FaArrowLeft className="h-5 w-5" />
            </Link>
            <TeamIcon className={`text-3xl md:text-4xl mr-3 opacity-90 ${teamTextColor}`} />
            <h1 className={`text-2xl md:text-3xl font-bold truncate ${teamTextColor}`}>{teamDetails.name}</h1>
          </div>
          {/* Future: Add members count or other actions here */}
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 flex flex-col">
        {error && <p className="bg-red-800/70 text-red-100 p-3 rounded-md mb-4 text-sm">Error: {error}</p>}
        
        <div className="flex-grow space-y-4 overflow-y-auto mb-4 pr-2 custom-scrollbar" style={{ maxHeight: 'calc(100vh - 200px)' }}> {/* Adjust maxHeight as needed */}
          {loadingMessages ? (
            <div className="flex justify-center items-center py-10">
              <FaSpinner className="animate-spin text-3xl text-sky-300" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center py-10 px-3 rounded-lg bg-black/20">
              <FaCommentDots className="text-5xl text-gray-500 mx-auto mb-4" />
              <p className="text-lg text-gray-400">No messages yet in <span className="font-semibold">{teamDetails.name}</span>.</p>
              <p className="text-sm text-gray-500">Be the first to start the conversation!</p>
            </div>
          ) : (
            messages.map(msg => (
              <div key={msg.id} className={`flex items-start space-x-3 p-3 rounded-lg shadow ${msg.user_id === currentUser?.id ? 'bg-sky-700/60 ml-auto' : 'bg-gray-700/60 mr-auto'} max-w-xl`}>
                {msg.profiles?.avatar_url ? (
                    <img src={msg.profiles.avatar_url} alt={msg.profiles.display_name || 'User'} className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {msg.profiles?.display_name?.substring(0,1) || 'U'}
                    </div>
                )}
                <div>
                  <div className="flex items-center space-x-2 mb-0.5">
                    <span className={`font-semibold text-sm ${teamTextColor}`}>{msg.profiles?.display_name || 'Unknown User'}</span>
                    <span className="text-xs text-gray-400">
                      {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className={`text-sm whitespace-pre-wrap ${teamTextColor} opacity-95`}>{msg.content}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handlePostMessage} className={`mt-auto sticky bottom-0 pb-2 bg-opacity-80 backdrop-blur-md ${teamBgColor}`}>
          <div className="flex items-center space-x-2 p-2 border-t border-gray-700/50 rounded-b-lg">
            <textarea
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              placeholder={currentUser ? `Message #${teamDetails.name}...` : 'Login to send a message'}
              className="flex-grow p-2.5 bg-gray-800/80 border border-gray-600 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-colors shadow-sm resize-none text-sm placeholder-gray-400 disabled:opacity-70"
              rows={2}
              disabled={!currentUser || postingMessage || loadingTeamDetails || !teamDetails}
            />
            <button
              type="submit"
              disabled={!currentUser || postingMessage || !newMessageContent.trim() || loadingTeamDetails || !teamDetails}
              className="p-3 bg-sky-600 hover:bg-sky-500 text-white rounded-md disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow hover:shadow-md"
              aria-label="Send message"
            >
              {postingMessage ? <FaSpinner className="animate-spin h-5 w-5" /> : <FaPaperPlane className="h-5 w-5" />}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

// Basic custom scrollbar styling (optional, can be moved to global CSS)
// Add a <style jsx global> tag if you prefer to scope it or handle it in globals.css
// For simplicity, just a note here. Use a real CSS solution for production.
/*
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background-color: rgba(128, 128, 128, 0.5); 
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background-color: rgba(128, 128, 128, 0.7);
}
*/