'use client';

import React, { useEffect, useState, FormEvent, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs'; // Keep commented
import getSupabaseBrowserClient from '@/lib/supabase/client'; // USE THIS
import { User } from '@supabase/supabase-js'; // USE THIS for User type

import Link from 'next/link';
import { FaPaperPlane, FaSpinner, FaExclamationTriangle, FaUsers, FaCommentDots, FaArrowLeft, FaSignOutAlt } from 'react-icons/fa';
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

interface ProfileForMessage {
  display_name: string | null;
  avatar_url?: string | null;
}

interface Message {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: ProfileForMessage | null; // For sender's details
}

export default function TeamPage() {
  const supabase = getSupabaseBrowserClient(); // Corrected: Use singleton
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
  const [leavingTeam, setLeavingTeam] = useState<boolean>(false); 

  // Fetch current user
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUser(user);
      if (!user) {
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
    if (teamSlugOrId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        teamQuery = teamQuery.eq('id', teamSlugOrId);
    } else {
        teamQuery = teamQuery.eq('slug', teamSlugOrId);
    }
    const { data, error: teamError } = await teamQuery.single();

    if (teamError || !data) {
      console.error('Error fetching team details:', teamError);
      setError('Team not found or error loading details.');
      setTeamDetails(null);
    } else {
      const teamData = data as any; // Keep as any for now, ensure explicit mapping below
      setTeamDetails({
        id: teamData.id,
        name: teamData.name,
        description: teamData.description,
        slug: teamData.slug,
        color_scheme: teamData.color_scheme || { bgColor: 'bg-gray-700', textColor: 'text-gray-100', borderColor: 'border-gray-500' },
        icon_name: teamData.icon_name || 'FaUsers',
      });
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
    } else if (data) {
      // Ensure profiles is correctly typed as an object or null
      const typedMessages = data.map(m => ({
        ...m,
        profiles: m.profiles as ProfileForMessage | null 
      })) as Message[];
      setMessages(typedMessages);
    } else {
      setMessages([]);
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
          console.log('[Realtime] New message received:', payload.new);
          const newMessageRaw = payload.new as Omit<Message, 'profiles'>; 

          if (newMessageRaw.user_id) {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('display_name, avatar_url')
              .eq('id', newMessageRaw.user_id)
              .single();
            
            if (profileError) {
              console.error("[Realtime] Error fetching profile for new message:", profileError);
              setMessages(currentMessages => [...currentMessages, { ...newMessageRaw, profiles: null }]);
            } else if (profileData) { // Check if profileData is not null/undefined
              setMessages(currentMessages => [...currentMessages, { ...newMessageRaw, profiles: profileData as ProfileForMessage }]);
            } else {
              // Handle case where profileData is null but no error (e.g., profile not found but query was valid)
              console.warn("[Realtime] Profile not found for user_id:", newMessageRaw.user_id);
              setMessages(currentMessages => [...currentMessages, { ...newMessageRaw, profiles: null }]);
            }
          } else {
            console.warn("[Realtime] New message received without user_id:", newMessageRaw);
            setMessages(currentMessages => [...currentMessages, { ...newMessageRaw, profiles: null }]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, teamDetails?.id]);


  const handleLeaveTeam = async () => {
    if (!currentUser || !teamDetails) {
      setError('User or team details not loaded. Cannot leave team.');
      return;
    }

    const confirmed = window.confirm(`Are you sure you want to leave the team "${teamDetails.name}"?`);
    if (!confirmed) return;

    setLeavingTeam(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('user_team_memberships')
        .delete()
        .match({ user_id: currentUser.id, team_id: teamDetails.id });

      if (deleteError) {
        throw deleteError;
      }

      alert('Successfully left the team!'); 
      router.push('/profile'); 
    } catch (err: any) {
      console.error('Error leaving team:', err);
      setError(`Failed to leave team: ${err.message}`);
    } finally {
      setLeavingTeam(false);
    }
  };

  const handlePostMessage = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessageContent.trim() || !currentUser || !teamDetails?.id) {
      setError('Message cannot be empty, or user/team not properly loaded.');
      return;
    }
    setPostingMessage(true);
    setError(null);

    const { error: insertError } = await supabase.from('team_messages').insert({
      content: newMessageContent.trim(),
      user_id: currentUser.id,
      team_id: teamDetails.id,
    });

    if (insertError) {
      console.error('Error posting message:', insertError);
      setError(`Failed to post message: ${insertError.message}`);
    } else {
      setNewMessageContent(''); // Clear input after successful post
      // Realtime subscription should pick up the new message and add it with profile info
    }
    setPostingMessage(false);
  };

  if (loadingTeamDetails || !teamDetails) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
        <FaSpinner className="animate-spin text-4xl text-sky-500 mb-4" />
        <p className="text-xl">Loading team details...</p>
        {error && <p className="text-red-500 mt-4 bg-red-900/30 p-3 rounded-md">{error}</p>}
      </div>
    );
  }

  const IconComponent = iconMap[teamDetails.icon_name || 'FaUsers'] || FaUsers;
  // Use teamDetails.color_scheme for button text color, or default
  const buttonTextColor = teamDetails.color_scheme?.textColor || 'text-gray-100'; 
  const buttonBorderColor = teamDetails.color_scheme?.borderColor || 'border-gray-700';

  return (
    <div className={`min-h-screen ${teamDetails.color_scheme?.bgColor || 'bg-gray-800'} text-gray-200 flex flex-col`}>
      {/* Header */}
      <header className={`w-full p-4 md:p-6 shadow-lg sticky top-0 z-10 ${teamDetails.color_scheme?.bgColor || 'bg-gray-800'} border-b ${teamDetails.color_scheme?.borderColor || 'border-gray-700'}`}>
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/profile" className={`mr-4 p-2 rounded-full hover:bg-white/10 transition-colors ${teamDetails.color_scheme?.textColor || 'text-gray-100'}`}>
              <FaArrowLeft className="h-5 w-5" />
            </Link>
            <IconComponent className={`text-3xl md:text-4xl mr-3 ${teamDetails.color_scheme?.textColor || 'text-gray-100'}`} />
            <h1 className={`text-2xl md:text-3xl font-bold ${teamDetails.color_scheme?.textColor || 'text-gray-100'}`}>{teamDetails.name}</h1>
          </div>
          {currentUser && teamDetails && (
            <button
              onClick={handleLeaveTeam}
              disabled={leavingTeam}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors 
                          ${buttonTextColor} bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed border ${buttonBorderColor}`}
            >
              {leavingTeam ? (
                <FaSpinner className="animate-spin mr-2" />
              ) : (
                <FaSignOutAlt className="mr-2" />
              )}
              {leavingTeam ? 'Leaving...' : 'Leave Team'}
            </button>
          )}
        </div>
        {teamDetails.description && (
          <p className={`mt-2 text-sm text-center md:text-left md:pl-16 ${teamDetails.color_scheme?.textColor || 'text-gray-100'} opacity-80`}>{teamDetails.description}</p>
        )}
      </header>

      {/* Error Display */}
      {error && !loadingTeamDetails && !loadingMessages && (
        <div className="container mx-auto mt-4">
            <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-md relative shadow-lg" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline ml-2">{error}</span>
            </div>
        </div>
      )}

      {/* Chat Area */}
      <main className="flex-grow container mx-auto p-4 flex flex-col overflow-y-hidden">
        <div className="flex-grow overflow-y-auto space-y-4 pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
          {loadingMessages ? (
            <div className="flex justify-center items-center h-full">
              <FaSpinner className="animate-spin text-3xl text-sky-400" />
              <p className="ml-3 text-lg">Loading messages...</p>
            </div>
          ) : messages.length === 0 && !error ? (
            <div className="text-center py-10">
              <FaCommentDots className="mx-auto text-5xl text-gray-500 mb-4" />
              <p className="text-gray-400 text-lg">No messages yet. Be the first to say something!</p>
            </div>
          ) : (
            messages.map(message => (
              <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/60 shadow">
                <img 
                  src={message.profiles?.avatar_url || 'https://via.placeholder.com/150/000000/FFFFFF/?text=User'} 
                  alt={message.profiles?.display_name || 'User'} 
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-600"
                  crossOrigin="anonymous"
                />
                <div className="flex-1">
                  <div className="flex items-baseline space-x-2">
                    <span className="font-semibold text-sky-400 text-sm">
                      {message.profiles?.display_name || 'Unknown User'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">{message.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Message Input Form */}
      {!loadingTeamDetails && teamDetails && (
        <footer className={`w-full p-4 sticky bottom-0 ${teamDetails.color_scheme?.bgColor || 'bg-gray-800'} border-t ${teamDetails.color_scheme?.borderColor || 'border-gray-700'}`}>
          <form onSubmit={handlePostMessage} className="container mx-auto flex items-center space-x-3">
            <input
              type="text"
              value={newMessageContent}
              onChange={(e) => setNewMessageContent(e.target.value)}
              placeholder="Type your message..."
              className="flex-grow p-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm transition-colors"
              disabled={postingMessage || !currentUser}
            />
            <button 
              type="submit" 
              disabled={postingMessage || !currentUser || !newMessageContent.trim()}
              className={`px-6 py-3 rounded-lg font-semibold flex items-center justify-center shadow-md transition-colors 
                         ${teamDetails.color_scheme?.textColor || 'text-white'} 
                         ${postingMessage ? (teamDetails.color_scheme?.bgColor || 'bg-sky-700') : (teamDetails.color_scheme?.bgColor?.replace('bg-', 'hover:bg-') || 'hover:bg-sky-600')} 
                         ${(teamDetails.color_scheme?.bgColor || 'bg-sky-600')} 
                         border ${(teamDetails.color_scheme?.borderColor || 'border-sky-500')} 
                         disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {postingMessage ? (
                <FaSpinner className="animate-spin mr-2 h-5 w-5" /> 
              ) : (
                <FaPaperPlane className="mr-2 h-5 w-5" /> 
              )}
              {postingMessage ? 'Sending...' : 'Send'}
            </button>
          </form>
        </footer>
      )}
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