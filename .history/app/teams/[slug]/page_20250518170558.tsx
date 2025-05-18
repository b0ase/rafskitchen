'use client';

import React, { useEffect, useState, FormEvent, useCallback, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
// import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs'; // Keep commented
import getSupabaseBrowserClient from '@/lib/supabase/client'; // USE THIS
import { User } from '@supabase/supabase-js'; // USE THIS for User type

import Link from 'next/link';
import { FaPaperPlane, FaSpinner, FaExclamationTriangle, FaUsers, FaCommentDots, FaArrowLeft, FaSignOutAlt, FaTrashAlt, FaSyncAlt, FaInfoCircle } from 'react-icons/fa';
import { formatDistanceToNow } from 'date-fns';

const SUPER_ADMIN_EMAIL = "richardwboase@gmail.com"; // Added Super Admin Email

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
  created_by?: string | null; // Added to store creator ID
  creator_display_name?: string | null; // Added to store creator display name
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
  team_id: string;
  profiles: ProfileForMessage | null; // For sender's details
}

interface TeamMember {
  id: string; // user_id
  displayName: string;
  avatarUrl: string | null;
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
  const [profilesCache, setProfilesCache] = useState<Record<string, ProfileForMessage>>({}); // New state for profiles cache
  
  const [loadingTeamDetails, setLoadingTeamDetails] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [postingMessage, setPostingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [leavingTeam, setLeavingTeam] = useState<boolean>(false); 
  const [refreshingMessages, setRefreshingMessages] = useState<boolean>(false); // New state for manual refresh
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null); // New state for deleting message
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null); // For team role
  const [deletingTeam, setDeletingTeam] = useState<boolean>(false); // For team deletion
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loadingMembers, setLoadingMembers] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling
  const currentTeamIdRef = useRef<string | null>(null); // Ref to track current team ID for resetting flags

  // Refs for managing message loading state
  const initialMessagesLoadStarted = useRef(false);
  const initialMessagesLoadCompleted = useRef(false);

  // Scroll to bottom utility
  const scrollToBottom = useCallback(() => {
    console.log('[Scroll] Attempting to scroll. messagesEndRef.current:', messagesEndRef.current);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "auto" });
      console.log('[Scroll] scrollIntoView({ behavior: "auto" }) called on:', messagesEndRef.current);
    } else {
      console.log('[Scroll] messagesEndRef.current is null, cannot scroll.');
    }
  }, []); // No dependencies, relies on the ref's current value

  // Effect to scroll when messages change (new message sent/received, or initial load)
  useEffect(() => {
    console.log('[Scroll Effect] Triggered. Messages count:', messages.length);
    if (messages.length > 0) {
      // Using a timeout to allow the DOM to update before scrolling
      const timerId = setTimeout(() => {
        console.log('[Scroll Effect] Executing scrollToBottom via setTimeout.');
        scrollToBottom();
      }, 100); // 100ms delay, adjust if needed
      return () => {
        console.log('[Scroll Effect] Cleanup: Clearing setTimeout for scroll.');
        clearTimeout(timerId);
      };
    }
  }, [messages, scrollToBottom]); // scrollToBottom is stable due to useCallback([])

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

  // Fetch team details and user role
  const fetchTeamDetailsAndRole = useCallback(async () => {
    if (!teamSlugOrId || !currentUser?.id) return;
    setLoadingTeamDetails(true);
    setError(null);
    
    // Fetch Team Details
    let teamQuery = supabase.from('teams').select('*');
    if (teamSlugOrId.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        teamQuery = teamQuery.eq('id', teamSlugOrId);
    } else {
        teamQuery = teamQuery.eq('slug', teamSlugOrId);
    }
    const { data: teamData, error: teamError } = await teamQuery.single();

    if (teamError || !teamData) {
      console.error('Error fetching team details:', teamError);
      setError('Team not found or error loading details.');
      setTeamDetails(null);
      setCurrentUserRole(null);
      setLoadingTeamDetails(false);
      return;
    }
    
    const typedTeamData = teamData as any;
    let creatorDisplayName: string | null = null;

    if (typedTeamData.created_by) {
      const { data: creatorProfile, error: creatorProfileError } = await supabase
        .from('profiles')
        .select('display_name, username')
        .eq('id', typedTeamData.created_by)
        .single();
      
      if (creatorProfileError) {
        console.warn(`Could not fetch creator profile for user ID ${typedTeamData.created_by}:`, creatorProfileError.message);
        creatorDisplayName = 'Unknown Creator';
      } else if (creatorProfile) {
        creatorDisplayName = creatorProfile.display_name || creatorProfile.username || 'Unnamed Creator';
      }
    }

    setTeamDetails({
      id: typedTeamData.id,
      name: typedTeamData.name,
      description: typedTeamData.description,
      slug: typedTeamData.slug,
      created_by: typedTeamData.created_by, // Store created_by ID
      creator_display_name: creatorDisplayName, // Store display name
      color_scheme: typedTeamData.color_scheme || { bgColor: 'bg-gray-700', textColor: 'text-gray-100', borderColor: 'border-gray-500' },
      icon_name: typedTeamData.icon_name || 'FaUsers',
    });

    // Fetch User Role in this Team
    const { data: roleData, error: roleError } = await supabase
      .from('user_team_memberships')
      .select('role')
      .eq('user_id', currentUser.id)
      .eq('team_id', typedTeamData.id)
      .single();

    if (roleError) {
      console.error('Error fetching user role in team:', roleError);
      // Not a critical error for displaying team, but impacts owner actions
      setCurrentUserRole(null); 
    } else if (roleData && 'role' in roleData) {
      setCurrentUserRole(roleData.role as string);
    } else {
      setCurrentUserRole(null); // Explicitly set to null if role not found
    }

    setLoadingTeamDetails(false);
  }, [supabase, teamSlugOrId, currentUser?.id]);
  
  useEffect(() => {
    // Now call fetchTeamDetailsAndRole instead of fetchTeamDetails
    if (currentUser?.id) { // Ensure currentUser is loaded before fetching details that depend on its ID
      fetchTeamDetailsAndRole();
    }
  }, [fetchTeamDetailsAndRole, currentUser?.id]);

  const fetchTeamMembers = useCallback(async (teamId: string) => {
    if (!teamId) return;
    setLoadingMembers(true);
    try {
      const { data: memberships, error: membershipsError } = await supabase
        .from('user_team_memberships')
        .select('user_id')
        .eq('team_id', teamId);

      if (membershipsError) throw membershipsError;

      if (!memberships || memberships.length === 0) {
        setTeamMembers([]);
        setLoadingMembers(false);
        return;
      }

      const userIds = memberships.map(m => m.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, username, avatar_url')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      const members = profilesData?.map(profile => ({
        id: profile.id,
        displayName: profile.display_name || profile.username || 'Unnamed User',
        avatarUrl: profile.avatar_url,
      })) || [];
      setTeamMembers(members);

    } catch (e: any) {
      console.error('Error fetching team members:', e);
      // Optionally set an error state for members
      setTeamMembers([]);
    } finally {
      setLoadingMembers(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (teamDetails?.id) {
      fetchTeamMembers(teamDetails.id);
    }
  }, [teamDetails?.id, fetchTeamMembers]);

  // Fetch messages
  const fetchMessages = useCallback(async (teamId: string, isManualRefresh: boolean = false) => {
    if (!teamId) return;
    const isThisCallAnInitialLoadAttempt = !initialMessagesLoadCompleted.current;

    console.log(`[FetchMessages] Called for teamId: ${teamId}, isManualRefresh: ${isManualRefresh}. Initial load completed status for this team: ${initialMessagesLoadCompleted.current}. Is this call an initial attempt: ${isThisCallAnInitialLoadAttempt}`);

    if (isManualRefresh) {
        setRefreshingMessages(true);
    } else {
        if (initialMessagesLoadStarted.current && isThisCallAnInitialLoadAttempt) {
            console.log("[FetchMessages] Initial load already started but not completed for this team. Skipping duplicate call.");
            return;
        }
        if (isThisCallAnInitialLoadAttempt) {
            console.log("[FetchMessages] This is an initial load attempt for this team. Setting setLoadingMessages(true).");
            setLoadingMessages(true);
            initialMessagesLoadStarted.current = true;
        } else {
            console.log("[FetchMessages] Initial load previously completed for this team. This is a background refresh. Not setting global loading spinner.");
        }
    }
    setError(null);

    try {
        const { data: messagesData, error: messagesError } = await supabase
            .from('team_messages')
            .select('id, content, created_at, user_id')
            .eq('team_id', teamId)
            .order('created_at', { ascending: true });

        if (messagesError) {
            console.error('Error fetching messages base data:', messagesError);
            throw messagesError;
        }

        if (messagesData && messagesData.length > 0) {
            const userIds = [...new Set(messagesData.map(m => m.user_id).filter(id => id))];
            let newProfiles: Record<string, ProfileForMessage> = {};
            if (userIds.length > 0) {
                const { data: profilesData, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, display_name, avatar_url')
                    .in('id', userIds);
                if (profilesError) {
                    console.error('Error fetching profiles in bulk:', profilesError);
                } else if (profilesData) {
                    profilesData.forEach(p => {
                        if (p.id) {
                            newProfiles[p.id] = { display_name: p.display_name, avatar_url: p.avatar_url };
                        }
                    });
                    setProfilesCache(prevCache => ({ ...prevCache, ...newProfiles }));
                }
            }
            const messagesWithProfiles = messagesData.map(message => ({
                ...message,
                profiles: newProfiles[message.user_id] || profilesCache[message.user_id] || null,
            }));
            console.log('[FetchMessages] Raw messagesData from Supabase:', JSON.stringify(messagesData));
            console.log('[FetchMessages] Processed messagesWithProfiles before setting state:', JSON.stringify(messagesWithProfiles));
            setMessages(messagesWithProfiles as Message[]);
        } else {
            console.log('[FetchMessages] No messagesData received from Supabase, or it was empty.');
            setMessages([]);
        }
        
        if (!isManualRefresh && isThisCallAnInitialLoadAttempt) {
            console.log("[FetchMessages] Initial load attempt completed successfully for this team. Setting initialMessagesLoadCompleted.current = true.");
            initialMessagesLoadCompleted.current = true;
        }
    } catch (e: any) {
        console.error('Error during fetchMessages execution:', e);
        setError(prev => prev ? `${prev} | Failed to load messages. ${e.message}` : `Failed to load messages. ${e.message}`);
        setMessages([]);
    } finally {
        if (isManualRefresh) {
            setRefreshingMessages(false);
        } else {
            setLoadingMessages(false);
            console.log(`[FetchMessages] Non-manual fetch finished. setLoadingMessages(false). Initial load completed status for this team: ${initialMessagesLoadCompleted.current}`);
        }
    }
  }, [supabase, profilesCache]);
  
  useEffect(() => {
    if (teamDetails?.id) {
      if (currentTeamIdRef.current !== teamDetails.id) {
          console.log(`[Team Effect] New team detected (or first load). Old: ${currentTeamIdRef.current}, New: ${teamDetails.id}. Resetting initial load flags for new team.`);
          initialMessagesLoadStarted.current = false;
          initialMessagesLoadCompleted.current = false;
          currentTeamIdRef.current = teamDetails.id;
      }
      fetchMessages(teamDetails.id);
    } else {
      setMessages([]);
      initialMessagesLoadStarted.current = false; 
      initialMessagesLoadCompleted.current = false;
      currentTeamIdRef.current = null;
      console.log("[Team Effect] No teamDetails.id. Cleared messages and reset initial load flags.");
    }
  }, [teamDetails, fetchMessages]);

  // Real-time subscription for new messages
  useEffect(() => {
    console.log('[Realtime Effect] Hook triggered. teamDetails?.id:', teamDetails?.id);
    if (!teamDetails?.id) {
      console.log('[Realtime Effect] Aborting: teamDetails.id is missing.');
      return;
    }
    console.log(`[Realtime] Setting up subscription for team: ${teamDetails.id}`);

    const channel = supabase
      .channel(`team-messages-${teamDetails.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'team_messages', filter: `team_id=eq.${teamDetails.id}` },
        async (payload) => {
          console.log('[Realtime] New message received (raw payload):', payload.new);
          const newMessageRaw = payload.new as Omit<Message, 'profiles'> & { user_id: string; id: string; content: string; created_at: string; team_id: string; };

          if (!newMessageRaw || !newMessageRaw.id || !newMessageRaw.user_id) {
            console.error('[Realtime] Received incomplete message payload:', newMessageRaw);
            return;
          }

          let senderProfile: ProfileForMessage | null = null;

          if (newMessageRaw.user_id) {
            if (profilesCache[newMessageRaw.user_id]) {
              senderProfile = profilesCache[newMessageRaw.user_id];
              console.log('[Realtime] Profile found in cache for user (realtime):', newMessageRaw.user_id);
            } else {
              console.log('[Realtime] Profile not in cache, fetching for user (realtime):', newMessageRaw.user_id);
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('display_name, avatar_url')
                .eq('id', newMessageRaw.user_id)
                .single();

              if (profileError) {
                console.error('[Realtime] Error fetching profile for new message (realtime):', profileError);
              } else if (profileData) {
                senderProfile = { display_name: profileData.display_name, avatar_url: profileData.avatar_url };
                setProfilesCache(prevCache => ({ ...prevCache, [newMessageRaw.user_id]: senderProfile as ProfileForMessage }));
                console.log('[Realtime] Profile fetched and cached for user (realtime):', newMessageRaw.user_id, senderProfile);
              } else {
                 console.log('[Realtime] No profile data returned for user (realtime):', newMessageRaw.user_id);
              }
            }
          }

          const newMessage: Message = {
            id: newMessageRaw.id,
            content: newMessageRaw.content,
            created_at: newMessageRaw.created_at,
            user_id: newMessageRaw.user_id,
            team_id: newMessageRaw.team_id,
            profiles: senderProfile,
          };
          console.log('[Realtime] Processed new message:', newMessage);

          setMessages((prevMessages) => {
            const messageExists = prevMessages.find(m => m.id === newMessage.id);
            if (messageExists) {
              console.log('[Realtime] Message already exists, updating:', newMessage.id);
              return prevMessages.map(m => m.id === newMessage.id ? newMessage : m);
            } else {
              console.log('[Realtime] Adding new message:', newMessage.id);
              return [...prevMessages, newMessage];
            }
          });
          // Scrolling is handled by the useEffect watching `messages`
        }
      )
      .subscribe((status, err) => {
        console.log(`[Realtime] Subscription status: ${status}`, err || '');
        if (status === 'SUBSCRIBED') {
          console.log(`[Realtime] Successfully subscribed to team-messages-${teamDetails.id}`);
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error(`[Realtime] Subscription error/closed: ${status}`, err)
            // Optionally, attempt to resubscribe or notify user
        }
      });

    return () => {
      console.log(`[Realtime] Cleaning up subscription for team: ${teamDetails.id}`);
      supabase.removeChannel(channel);
    };
  }, [teamDetails, supabase, profilesCache, fetchMessages]); // Added fetchMessages as it is called inside for new messages.

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
    if (!newMessageContent.trim() || !currentUser || !teamDetails) {
        console.log('[PostMessage] Aborted: Missing content, user, or teamDetails.');
        return;
    }

    setPostingMessage(true);
    const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`; // More unique temp ID
    const optimisticMessage: Message = {
      id: tempId,
      content: newMessageContent,
      created_at: new Date().toISOString(),
      user_id: currentUser.id,
      team_id: teamDetails.id,
      profiles: { // Use current user's data for optimistic update
        display_name: profilesCache[currentUser.id]?.display_name || currentUser.user_metadata?.display_name || currentUser.user_metadata?.full_name || currentUser.email || 'You',
        avatar_url: profilesCache[currentUser.id]?.avatar_url || currentUser.user_metadata?.avatar_url || null,
      },
    };

    console.log('[PostMessage] Posting optimistic message:', optimisticMessage);
    setMessages(prevMessages => [...prevMessages, optimisticMessage]);
    setNewMessageContent('');
    // Scrolling is handled by the useEffect watching `messages`

    try {
      const { data: newMessageData, error: postError } = await supabase
        .from('team_messages')
        .insert({
          content: newMessageContent,
          user_id: currentUser.id,
          team_id: teamDetails.id,
        })
        .select('id, created_at') // Select the real ID and created_at from the DB
        .single();

      if (postError) {
        console.error('Error posting message:', postError);
        setError(prev => prev ? `${prev} | Failed to send message.` : 'Failed to send message.');
        // Revert optimistic update
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempId));
        console.log('[PostMessage] Optimistic message reverted due to error:', tempId);
      } else if (newMessageData) {
        console.log('[PostMessage] Message posted successfully to DB:', newMessageData[0]);
        // Optional: Update optimistic message with real data if needed,
        // but real-time should handle this by replacing/updating.
        // Or trigger a fetch to ensure consistency if real-time is not fully trusted for this.
      }
    } catch (err) {
      console.error('Exception posting message:', err);
      setError(prev => prev ? `${prev} | Exception sending message.` : 'Exception sending message.');
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== tempId));
      console.log('[PostMessage] Optimistic message reverted due to exception:', tempId);
    } finally {
      setPostingMessage(false);
      console.log('[PostMessage] Finished.');
      // User request: refresh messages after send to ensure everything is up-to-date
      if (teamDetails?.id) {
          console.log('[PostMessage] Triggering fetchMessages after post.');
          await fetchMessages(teamDetails.id, true); // Ensure this is `await`ed
      }
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!currentUser) return;

    const confirmed = window.confirm("Are you sure you want to delete this message?");
    if (!confirmed) return;

    setDeletingMessageId(messageId);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('team_messages')
        .delete()
        .match({ id: messageId, user_id: currentUser.id }); // Ensure user can only delete their own

      if (deleteError) {
        throw deleteError;
      }

      // Optimistically remove the message from the UI
      setMessages(currentMessages => currentMessages.filter(msg => msg.id !== messageId));
      console.log('Message deleted successfully:', messageId);

    } catch (err: any) {
      console.error('Error deleting message:', err);
      setError(`Failed to delete message: ${err.message}`);
    } finally {
      setDeletingMessageId(null);
    }
  };

  const handleDeleteTeam = async () => {
    // Updated permission check to include Super Admin
    const isSuperAdmin = currentUser?.email === SUPER_ADMIN_EMAIL;
    const isOwner = currentUserRole === 'owner';

    if (!currentUser || !teamDetails) {
      setError('Required user or team details are missing.');
      return;
    }

    if (!isOwner && !isSuperAdmin) {
      setError('Only team owners or the site super admin can delete this team.');
      return;
    }

    const confirmed = window.confirm(`Are you absolutely sure you want to delete the team "${teamDetails.name}"? This action will delete all associated messages and memberships and cannot be undone.`);
    if (!confirmed) return;

    setDeletingTeam(true);
    setError(null);

    try {
      const { error: deleteError } = await supabase
        .from('teams')
        .delete()
        .match({ id: teamDetails.id });

      if (deleteError) {
        // Check for foreign key constraint violation if cascade delete isn't set up
        if (deleteError.message.includes('violates foreign key constraint')) {
          setError(
            `Failed to delete team: This team likely still has members or messages. ` +
            `Please ensure cascading deletes are set up correctly in the database, ` +
            `or remove them manually first. Original error: ${deleteError.message}`
          );
        } else {
          // For other errors, re-throw to be caught by the generic catch block
          throw deleteError; 
        }
      } else {
        // Verify deletion
        const { data: stillExists, error: verifyError } = await supabase
          .from('teams')
          .select('id')
          .eq('id', teamDetails.id)
          .maybeSingle(); // Use maybeSingle to not error if it's gone

        if (verifyError) {
          console.error('Error verifying team deletion:', verifyError);
          // Not necessarily a failure of deletion, but an issue checking.
          // Proceed with optimistic success, but log this.
          alert('Team deletion initiated, but verification step encountered an error. Please check manually.');
          router.push('/profile');
        } else if (stillExists) {
          console.error('Team deletion reported success, but team still found in database:', stillExists);
          setError('Failed to delete team. The team still exists in the database. This might be due to RLS policies or other database constraints.');
        } else {
          // Team is actually gone
          alert('Team deleted successfully!');
          router.push('/profile'); // Redirect after successful deletion
        }
      }
    } catch (err: any) {
      console.error('Error deleting team:', err);
      if (!error) { // Avoid overwriting specific FK error
        setError(`Failed to delete team: ${err.message}`);
      }
    } finally {
      setDeletingTeam(false);
    }
  };

  // Debug log before render
  console.log('[TeamPage Render State]', {
    loadingTeamDetails,
    loadingMessages,
    error,
    teamId: teamDetails?.id,
    messageCount: messages.length,
    initialMessagesLoadStarted: initialMessagesLoadStarted.current,
    initialMessagesLoadCompleted: initialMessagesLoadCompleted.current,
  });

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
            <div>
              <h1 className={`text-2xl md:text-3xl font-bold ${teamDetails.color_scheme?.textColor || 'text-gray-100'}`}>{teamDetails.name}</h1>
              {teamDetails.creator_display_name && (
                <p className={`text-xs mt-1 ${teamDetails.color_scheme?.textColor || 'text-gray-100'} opacity-70`}>
                  (Created by: {teamDetails.creator_display_name})
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => fetchMessages(teamDetails.id, true)}
              disabled={refreshingMessages || loadingMessages}
              title="Refresh Messages"
              className={`p-2 rounded-md flex items-center transition-colors 
                          ${teamDetails.color_scheme?.textColor || 'text-gray-100'} 
                          hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {refreshingMessages ? (
                <FaSpinner className="animate-spin h-5 w-5" />
              ) : (
                <FaSyncAlt className="h-5 w-5" />
              )}
            </button>
            {currentUser && teamDetails && (
              <button
                onClick={handleLeaveTeam}
                disabled={leavingTeam || deletingTeam} // Also disable if deleting team
                className={`px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors 
                            ${buttonTextColor} bg-yellow-600 hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed border ${buttonBorderColor}`}
              >
                {leavingTeam ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaSignOutAlt className="mr-2" />
                )}
                {leavingTeam ? 'Leaving...' : 'Leave Team'}
              </button>
            )}
            {(currentUserRole === 'owner' || currentUser?.email === SUPER_ADMIN_EMAIL) && (
              <button
                onClick={handleDeleteTeam}
                disabled={deletingTeam || leavingTeam}
                className={`px-4 py-2 text-sm font-medium rounded-md flex items-center transition-colors 
                            text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed border border-red-500`}
              >
                {deletingTeam ? (
                  <FaSpinner className="animate-spin mr-2" />
                ) : (
                  <FaTrashAlt className="mr-2" />
                )}
                {deletingTeam ? 'Deleting...' : 'Delete Team'}
              </button>
            )}
          </div>
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

      {/* Manual Refresh Notice - Placed directly inside main, before scrollable message list */}
      {!loadingTeamDetails && teamDetails && (
        <div className="mb-4 px-0 sm:px-0"> {/* Adjusted mb */}
            <div className="bg-sky-800/50 border border-sky-700 text-sky-300 px-4 py-2.5 rounded-md text-xs shadow">
                <FaInfoCircle className="inline mr-2 mb-0.5" /> 
                Real-time updates are active. If you suspect missing messages, you can also use the <FaSyncAlt className="inline mx-1" /> button to manually refresh.
            </div>
        </div>
      )}

      {/* Chat Area */}
      <main className="flex-grow container mx-auto p-4 flex flex-col overflow-y-hidden pt-28">
        <div 
          className="flex-grow overflow-y-auto space-y-4 pr-2 pb-20 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800"
        >
          {loadingMessages && !refreshingMessages ? ( // Show main loader only if not manually refreshing
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
            messages.map(message => {
              // Diagnostic log for messages that would show "Unknown User"
              if (!message.profiles?.display_name) {
                console.log('[Render] Message missing profile display_name:', 
                  {
                    messageId: message.id, 
                    userId: message.user_id, 
                    profileData: message.profiles, 
                    createdAt: message.created_at,
                    content: message.content?.substring(0, 30) // Log first 30 chars of content for context
                  }
                );
              }
              return (
                <div key={message.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-800/60 shadow">
                  <img 
                    src={message.profiles?.avatar_url && message.profiles.avatar_url.startsWith('http') ? message.profiles.avatar_url : 'https://via.placeholder.com/150/000000/FFFFFF/?text=U'} 
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
                      {currentUser && message.user_id === currentUser.id && (
                        <button 
                          onClick={() => handleDeleteMessage(message.id)}
                          disabled={deletingMessageId === message.id}
                          className="text-gray-500 hover:text-red-500 transition-colors p-1 rounded-full text-xs"
                          aria-label="Delete message"
                        >
                          {deletingMessageId === message.id ? <FaSpinner className="animate-spin" /> : <FaTrashAlt />}
                        </button>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} /> 
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