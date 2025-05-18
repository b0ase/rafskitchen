'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';
import Link from 'next/link';
import { FaArrowLeft, FaPaperPlane, FaSpinner, FaUserCircle } from 'react-icons/fa';

interface TeamMessage {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { // Assuming you want to show display_name and avatar_url
    display_name: string | null;
    avatar_url: string | null;
  } | null;
}

interface TeamDetails {
  id: string;
  name: string;
  // Add other team details you might want to display
}

export default function TeamMessagesPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const params = useParams();
  const teamSlug = params.slug as string;

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [teamDetails, setTeamDetails] = useState<TeamDetails | null>(null);
  const [messages, setMessages] = useState<TeamMessage[]>([]);
  const [newMessageContent, setNewMessageContent] = useState('');
  const [loadingTeam, setLoadingTeam] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser(user);
      } else {
        router.push('/login?message=Please log in to view team messages.');
      }
    };
    fetchUser();
  }, [supabase, router]);

  const fetchTeamDetailsAndMessages = useCallback(async () => {
    if (!teamSlug || !currentUser) return;

    setLoadingTeam(true);
    setLoadingMessages(true);
    setError(null);

    try {
      // Fetch Team Details
      const { data: teamData, error: teamError } = await supabase
        .from('teams')
        .select('id, name') // Add other fields as needed
        .eq('slug', teamSlug)
        .single();

      if (teamError) throw new Error(`Failed to load team details: ${teamError.message}`);
      if (!teamData) throw new Error('Team not found.');
      setTeamDetails(teamData);
      setLoadingTeam(false);

      // Fetch Team Messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('team_messages')
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (display_name, avatar_url)
        `)
        .eq('team_id', teamData.id)
        .order('created_at', { ascending: true });

      if (messagesError) throw new Error(`Failed to load messages: ${messagesError.message}`);
      setMessages(messagesData || []);
      setLoadingMessages(false);
      
      // TODO: Implement "Mark as read" logic here
      // Update user_team_last_seen with the timestamp of the latest message if messages exist
      if (messagesData && messagesData.length > 0 && currentUser) {
        const latestMessageTimestamp = messagesData[messagesData.length - 1].created_at;
        const { error: updateSeenError } = await supabase
          .from('user_team_last_seen')
          .upsert({
            user_id: currentUser.id,
            team_id: teamData.id,
            last_seen_message_created_at: latestMessageTimestamp
          }, { onConflict: 'user_id,team_id' });

        if (updateSeenError) {
          console.warn('Failed to update last seen timestamp:', updateSeenError.message);
          // Non-critical error, proceed
        }
      }

    } catch (e: any) {
      console.error(e);
      setError(e.message);
      setLoadingTeam(false);
      setLoadingMessages(false);
    }
  }, [supabase, teamSlug, currentUser]);

  useEffect(() => {
    if (teamSlug && currentUser) {
      fetchTeamDetailsAndMessages();
    }
  }, [teamSlug, currentUser, fetchTeamDetailsAndMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageContent.trim() || !currentUser || !teamDetails) return;

    setSendingMessage(true);
    setError(null);

    try {
      const { data: newMessage, error: insertError } = await supabase
        .from('team_messages')
        .insert({
          team_id: teamDetails.id,
          user_id: currentUser.id,
          content: newMessageContent.trim()
        })
        .select(`
          id,
          content,
          created_at,
          user_id,
          profiles (display_name, avatar_url)
        `)
        .single();

      if (insertError) throw insertError;

      if (newMessage) {
        // @ts-ignore / Type assertion might be needed if TS complains about profiles
        setMessages(prevMessages => [...prevMessages, newMessage as TeamMessage]); 
      }
      setNewMessageContent('');
    } catch (e: any) {
      console.error('Error sending message:', e);
      setError(`Failed to send message: ${e.message}`);
    } finally {
      setSendingMessage(false);
    }
  };
  
  // Basic loading state
  if (loadingTeam || !currentUser) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <FaSpinner className="animate-spin text-4xl text-sky-500 mb-4" />
        <p>Loading team messages...</p>
      </div>
    );
  }

  if (error && !teamDetails) { // Critical error like team not found
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
        <p className="text-red-400 text-xl mb-4">Error: {error}</p>
        <Link href="/messages" className="text-sky-400 hover:underline">
          Back to My Messages
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white" >
      {/* Header */}
      <header className="bg-gray-800 p-4 shadow-md fixed top-16 left-0 right-0 z-10 ml-0 md:ml-64" style={{ height: 'auto' }}> {/* Adjust ml-64 if your sidebar width is different */}
        <div className="flex items-center">
          <Link href="/messages" className="text-sky-400 hover:text-sky-300 mr-4">
            <FaArrowLeft size={20} />
          </Link>
          <h1 className="text-xl font-semibold">
            {teamDetails ? teamDetails.name : 'Loading...'} Messages
          </h1>
        </div>
      </header>

      {/* Messages Area */}
      {/* Add approx 64px (header) + 64px (app header) to pt. Total pt-32 */}
      <main className="flex-grow overflow-y-auto p-4 pt-32 pb-28"> {/* Padding bottom for message input */}
        {loadingMessages && !messages.length && (
          <div className="flex justify-center items-center h-full">
            <FaSpinner className="animate-spin text-3xl text-sky-500" />
          </div>
        )}
        {!loadingMessages && messages.length === 0 && (
          <div className="text-center text-gray-500">
            No messages yet. Be the first to say something!
          </div>
        )}
        <div className="space-y-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.user_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
              <div className={`p-3 rounded-lg max-w-lg ${msg.user_id === currentUser?.id ? 'bg-sky-600 text-white' : 'bg-gray-700 text-gray-200'}`}>
                <div className="flex items-center mb-1">
                  {msg.profiles?.avatar_url ? (
                      <img src={msg.profiles.avatar_url} alt={msg.profiles.display_name || 'User'} className="w-6 h-6 rounded-full mr-2"/>
                  ) : (
                      <FaUserCircle className="w-6 h-6 rounded-full mr-2 text-gray-400" />
                  )}
                  <span className="text-xs font-medium">
                    {msg.user_id === currentUser?.id ? 'You' : msg.profiles?.display_name || 'User'}
                  </span>
                </div>
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs mt-1 opacity-70 text-right">
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}
        </div>
         {error && <p className="text-red-400 text-center mt-4">Error: {error}</p>}
      </main>

      {/* Message Input Area */}
      <footer className="bg-gray-800 p-3 border-t border-gray-700 fixed bottom-0 left-0 right-0 z-10 ml-0 md:ml-64"> {/* Adjust ml-64 if your sidebar width is different */}
        <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
          <input
            type="text"
            value={newMessageContent}
            onChange={(e) => setNewMessageContent(e.target.value)}
            placeholder="Type your message..."
            className="flex-grow p-2.5 bg-gray-700 border border-gray-600 rounded-lg text-gray-200 focus:ring-sky-500 focus:border-sky-500 focus:outline-none"
            disabled={!teamDetails || sendingMessage}
          />
          <button
            type="submit"
            disabled={!teamDetails || !newMessageContent.trim() || sendingMessage}
            className="p-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-lg disabled:opacity-50 transition-colors"
          >
            {sendingMessage ? <FaSpinner className="animate-spin h-5 w-5" /> : <FaPaperPlane size={20} />}
          </button>
        </form>
      </footer>
    </div>
  );
} 