'use client';

import React, { useEffect, useState, FormEvent, useCallback, useRef } from 'react';
import { useParams, useRouter, usePathname } from 'next/navigation';
// import { createClientComponentClient, User } from '@supabase/auth-helpers-nextjs'; // Keep commented
import getSupabaseBrowserClient from '@/lib/supabase/client'; // USE THIS
import { User } from '@supabase/supabase-js'; // USE THIS for User type
import { usePageHeader, PageContextType } from '@/app/components/MyCtx'; // Added import

import Link from 'next/link';
import { FaPaperPlane, FaSpinner, FaExclamationTriangle, FaUsers, FaCommentDots, FaArrowLeft, FaSignOutAlt, FaTrashAlt, FaSyncAlt, FaInfoCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa';
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
  const pathname = usePathname(); // Get pathname from the hook
  const teamSlugOrId = params?.slug as string | undefined; // Allow undefined initially
  const { setPageContext } = usePageHeader(); // Added hook usage

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
  const [showMembersDropdown, setShowMembersDropdown] = useState<boolean>(false); // New state for members dropdown

  const messagesEndRef = useRef<HTMLDivElement | null>(null); // Ref for scrolling
  const currentTeamIdRef = useRef<string | null>(null); // Ref to track current team ID for resetting flags

  // Refs for managing message loading state
  const initialMessagesLoadStarted = useRef(false);
  const initialMessagesLoadCompleted = useRef(false);

  // Scroll to bottom utility
  const scrollToBottom = useCallback(() => {
    console.log('[Scroll] Attempting to scroll. messagesEndRef.current:', messagesEndRef.current);
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
      console.log('[Scroll] scrollIntoView({ behavior: "smooth" }) called on:', messagesEndRef.current);
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
    if (!teamSlugOrId || !currentUser?.id) { // Ensure teamSlugOrId is not undefined/null here
      if (!teamSlugOrId) setError("Team identifier is missing from URL.");
      // Optionally, don't proceed if currentUser.id is missing yet, or handle appropriately
      setLoadingTeamDetails(false);
      return;
    }
    setLoadingTeamDetails(true);
    setError(null);
    
    let teamQuery = supabase.from('teams').select('*');
    // Check if teamSlugOrId is a UUID (potential ID) or a slug string
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
      setPageContext({
        title: "Error",
        href: pathname || '/', // Provide a fallback for href
        icon: FaExclamationTriangle
      });
      return;
    }
    
    const typedTeamData = teamData as any; // Assuming structure, consider defining a more precise type
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
      created_by: typedTeamData.created_by,
      creator_display_name: creatorDisplayName, // This was defined earlier in the function
      color_scheme: typedTeamData.color_scheme, // Keep as is, handle null/undefined in JSX
      icon_name: typedTeamData.icon_name || 'FaUsers',
    });

    const teamIcon = iconMap[typedTeamData.icon_name || 'FaUsers'] || FaUsers;
    setPageContext({
      title: typedTeamData.name,
      href: `/teams/${typedTeamData.slug || typedTeamData.id}`,
      icon: teamIcon
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
  }, [supabase, teamSlugOrId, currentUser?.id, setPageContext, pathname]);
  
  useEffect(() => {
    if (params && params.slug && currentUser?.id) { // Check params and params.slug here
      fetchTeamDetailsAndRole();
    }
    // If teamSlugOrId is not available yet (e.g. params not populated), this effect will re-run when it is.
  }, [params, currentUser?.id, fetchTeamDetailsAndRole]); // Add params to dependency array

  const fetchTeamMembers = useCallback(async (teamId: string) => {
    if (!teamId) return;
    setLoadingMembers(true);
    try {
      // @ts-ignore: custom RPC not present in generated types
      const { data: membersData, error: rpcError } = await (supabase as any).rpc(
        'get_team_members_with_profiles',
        { p_team_id: teamId }
      ) as { data: any[] | null; error: any };

      if (rpcError) {
        console.error('Error calling get_team_members_with_profiles RPC:', rpcError);
        throw rpcError;
      }

      // The RPC function returns an array of objects with id, displayName, and avatarUrl
      // Ensure the structure matches the TeamMember interface
      const members = membersData?.map(member => ({
        id: member.id, // Assuming RPC returns 'id'
        displayName: member.displayName, // Assuming RPC returns 'displayName'
        avatarUrl: member.avatarUrl, // Assuming RPC returns 'avatarUrl'
      })) || [];
      
      setTeamMembers(members as TeamMember[]); // Cast if confident in RPC return structure

    } catch (e: any) {
      console.error('Error fetching team members via RPC:', e);
      setTeamMembers([]); // Clear members on error
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

        let currentProfilesCache: Record<string, ProfileForMessage> = {};
        setProfilesCache(prev => { // Access current profilesCache to be used locally
            currentProfilesCache = prev;
            return prev; // No change to state here, just reading
        });

        if (messagesData && messagesData.length > 0) {
            const userIds = [...new Set(messagesData.map(m => m.user_id).filter(id => id && !currentProfilesCache[id]))]; // Only fetch profiles not already in cache
            let newProfilesForThisFetch: Record<string, ProfileForMessage> = {};

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
                            newProfilesForThisFetch[p.id] = { display_name: p.display_name, avatar_url: p.avatar_url };
                        }
                    });
                    setProfilesCache(prevCache => ({ ...prevCache, ...newProfilesForThisFetch }));
                }
            }
            const messagesWithProfiles = messagesData.map(message => {
                const profile = newProfilesForThisFetch[message.user_id] || currentProfilesCache[message.user_id] || null;
                return {
                    ...message,
                    profiles: profile,
                };
            });
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
  }, [supabase]); // Only supabase as dependency, teamId is passed as argument.
  
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
  }, [teamDetails?.id, fetchMessages]);

  // Real-time subscription for new messages
  useEffect(() => {
    console.log('[Realtime Effect] Hook triggered. teamDetails?.id:', teamDetails?.id);
    if (!teamDetails?.id) {
      console.log('[Realtime Effect] Aborting: teamDetails.id is missing.');
      return;
    }
    const currentTeamId = teamDetails.id; // Capture teamId to use in cleanup
    console.log(`[Realtime] Setting up subscription for team: ${currentTeamId}`);

    const channel = supabase
      .channel(`team-messages-${currentTeamId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'team_messages', filter: `team_id=eq.${currentTeamId}` },
        async (payload) => {
          console.log('[Realtime] New message received (raw payload):', payload.new);
          const newMessageRaw = payload.new as Omit<Message, 'profiles'> & { user_id: string; id: string; content: string; created_at: string; team_id: string; };

          if (!newMessageRaw || !newMessageRaw.id || !newMessageRaw.user_id) {
            console.error('[Realtime] Received incomplete message payload:', newMessageRaw);
            return;
          }

          let senderProfile: ProfileForMessage | null = null;

          // Access profilesCache using the functional update form of setProfilesCache to ensure we get the latest value
          // and to avoid adding profilesCache to the useEffect dependency array.
          let profileWasInCache = false;
          setProfilesCache(prevCache => {
            if (prevCache[newMessageRaw.user_id]) {
              senderProfile = prevCache[newMessageRaw.user_id];
              profileWasInCache = true;
              console.log('[Realtime] Profile found in cache for user (realtime):', newMessageRaw.user_id);
            }
            return prevCache; // Return previous cache, no update here, just reading
          });

          if (!profileWasInCache && newMessageRaw.user_id) {
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

          const newMessage: Message = {
            id: newMessageRaw.id,
            content: newMessageRaw.content,
            created_at: newMessageRaw.created_at,
            user_id: newMessageRaw.user_id,
            team_id: newMessageRaw.team_id, // Ensured team_id from raw payload
            profiles: senderProfile,
          };
          console.log('[Realtime] Processed new message:', newMessage);

          setMessages((prevMessages) => {
            const messageExists = prevMessages.find(m => m.id === newMessage.id);
            if (messageExists) {
              console.log('[Realtime] Message already exists, updating:', newMessage.id);
              // Replace existing message if it was updated (e.g., profile loaded later), or keep existing if content is identical
              return prevMessages.map(m => m.id === newMessage.id ? newMessage : m);
            } else {
              console.log('[Realtime] Adding new message:', newMessage.id);
              return [...prevMessages, newMessage];
            }
          });
        }
      )
      .subscribe((status, err) => {
        console.log(`[Realtime] Subscription status: ${status}`, err || '');
        if (status === 'SUBSCRIBED') {
          console.log(`[Realtime] Successfully subscribed to team-messages-${currentTeamId}`);
        }
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            console.error(`[Realtime] Subscription error/closed: ${status}`, err);
        }
      });

    return () => {
      console.log(`[Realtime] Cleaning up subscription for team: ${currentTeamId}`);
      // Use the captured currentTeamId for removeChannel to ensure correct channel is removed
      // supabase.removeChannel(channel) is the correct way if 'channel' object is stable in this closure.
      // Alternatively, if channel objects could be recreated if supabase client itself changed (unlikely for this setup),
      // explicitly removing by name could be an option, but removeChannel(channel) is standard.
      supabase.removeChannel(channel);
    };
  }, [teamDetails?.id, supabase]); // Dependencies are now teamDetails.id and supabase.

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
      // Automatically refresh the message list after sending to guarantee sync
      if (teamDetails?.id) {
        console.log('[PostMessage] Triggering fetchMessages after post.');
        await fetchMessages(teamDetails.id, true);
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
    let headerBgColor = 'bg-gray-800 dark:bg-gray-900';
    let headerBorderColor = 'border-gray-700 dark:border-gray-800';
    let baseBgColor = 'bg-gray-800 dark:bg-gray-900';
    // Check if teamDetails and teamDetails.color_scheme are available
    const hasTeamColor = teamDetails && teamDetails.color_scheme;

    if (hasTeamColor) { // No need to check teamDetails.color_scheme again, hasTeamColor covers it
        headerBgColor = teamDetails.color_scheme.bgColor || 'bg-gray-800 dark:bg-gray-900';
        headerBorderColor = teamDetails.color_scheme.borderColor || 'border-gray-700 dark:border-gray-800';
        baseBgColor = teamDetails.color_scheme.bgColor || 'bg-gray-800 dark:bg-gray-900';
    }
    
    return (
      <div 
        className={`flex-1 flex flex-col h-full p-2 md:p-4 text-white ${baseBgColor} ${hasTeamColor ? '' : 'bg-gradient-to-br from-gray-800 to-gray-950'}`}
      >
        <header 
          className={`pt-3 pb-6 px-3 border-b flex items-center justify-between space-x-3 min-h-[70px] sticky top-0 z-10 ${headerBgColor} bg-opacity-80 backdrop-blur-md ${headerBorderColor}`}
        >
            <button onClick={() => router.back()} className="p-2 rounded-md hover:bg-white/10 transition-colors">
              <FaArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold truncate" title={teamDetails?.name || "Loading team..."}>
                    {teamDetails?.name || "Loading team..."}
                </h1>
                {teamDetails?.creator_display_name && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 truncate" title={`Created by ${teamDetails.creator_display_name}`}>
                        Created by {teamDetails.creator_display_name}
                    </p>
                )}
            </div>
            {currentUser && teamDetails && (
                <div className="flex items-center space-x-2">
                     {(currentUserRole === 'owner' || currentUserRole === 'admin' || (currentUser?.email === SUPER_ADMIN_EMAIL && teamDetails.created_by === currentUser?.id)) && teamDetails.id && (
                        <button 
                            onClick={handleDeleteTeam} 
                            disabled={deletingTeam}
                            className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 flex items-center text-xs"
                        >
                            {deletingTeam ? <FaSpinner className="animate-spin mr-1" /> : <FaTrashAlt className="mr-1" />} Delete Team
                        </button>
                    )}
                    {!(currentUserRole === 'owner' || currentUserRole === 'admin' || (currentUser?.email === SUPER_ADMIN_EMAIL && teamDetails.created_by === currentUser?.id)) && teamDetails.id && (
                        <button 
                            onClick={handleLeaveTeam} 
                            disabled={leavingTeam}
                            className="p-2 rounded-md bg-yellow-600 hover:bg-yellow-700 text-white transition-colors disabled:opacity-50 flex items-center text-xs"
                        >
                            {leavingTeam ? <FaSpinner className="animate-spin mr-1" /> : <FaSignOutAlt className="mr-1" />} Leave Team
                        </button>
                    )}
                </div>
            )}
        </header>
        <div className="flex-1 flex justify-center items-center">
          {error ? (
            <div className="text-center text-red-400">
              <FaExclamationTriangle className="mx-auto text-3xl mb-2" />
              <p>{error || 'An error occurred.'}</p>
            </div>
          ) : (
            <div className="text-center">
              <FaSpinner className="animate-spin text-3xl mx-auto mb-2 text-sky-400" />
              <p className="text-gray-300 dark:text-gray-400">Loading team details...</p>
            </div>
          )}
        </div>
      </div>
    );
  } else {
    const currentColorScheme = teamDetails.color_scheme || { bgColor: 'bg-gray-800 dark:bg-gray-900', textColor: 'text-white', borderColor: 'border-gray-700 dark:border-gray-800' };
    const headerBgColor = currentColorScheme.bgColor;
    const headerBorderColor = currentColorScheme.borderColor;
    const baseBgColor = currentColorScheme.bgColor;
    const buttonBgColor = currentColorScheme.bgColor.replace('bg-', 'hover:bg-');
    const buttonTextColor = currentColorScheme.textColor;
    const buttonBorderColor = currentColorScheme.borderColor;
    const IconComponent = iconMap[teamDetails.icon_name || 'FaUsers'] || FaUsers;

    return (
      <div className={`flex flex-col h-screen text-white ${baseBgColor} ${!teamDetails.color_scheme ? 'bg-gradient-to-br from-gray-800 to-gray-950' : ''}`}>
        <header className={`pt-3 pb-4 px-4 border-b flex items-center justify-between space-x-3 min-h-[70px] sticky top-0 z-20 ${headerBgColor} bg-opacity-90 backdrop-blur-md ${headerBorderColor}`}>
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-white/10 transition-colors">
            <FaArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold truncate" title={teamDetails.name}>
              <IconComponent className="inline mr-2 h-5 w-5 align-middle" />
              {teamDetails.name}
            </h1>
            {teamDetails.creator_display_name && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate" title={`Created by ${teamDetails.creator_display_name}`}>
                Created by {teamDetails.creator_display_name}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <button
                onClick={() => fetchMessages(teamDetails.id, true)}
                disabled={refreshingMessages || loadingMessages}
                title="Refresh Messages"
                className={`p-2 rounded-md flex items-center transition-colors ${buttonTextColor} hover:bg-white/10 disabled:opacity-50`}
            >
                {refreshingMessages ? <FaSpinner className="animate-spin h-5 w-5" /> : <FaSyncAlt className="h-5 w-5" />}
            </button>
            {currentUser && (currentUserRole === 'owner' || currentUserRole === 'admin' || (currentUser.email === SUPER_ADMIN_EMAIL && teamDetails.created_by === currentUser.id)) ? (
                <button 
                  onClick={handleDeleteTeam} 
                  disabled={deletingTeam}
                  className="p-2 rounded-md bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 flex items-center text-xs font-medium"
                >
                  {deletingTeam ? <FaSpinner className="animate-spin mr-1.5" /> : <FaTrashAlt className="mr-1.5" />} Delete
                </button>
              ) : (
                <button 
                  onClick={handleLeaveTeam} 
                  disabled={leavingTeam}
                  className="p-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-black transition-colors disabled:opacity-50 flex items-center text-xs font-medium"
                >
                  {leavingTeam ? <FaSpinner className="animate-spin mr-1.5" /> : <FaSignOutAlt className="mr-1.5" />} Leave
                </button>
              )}
          </div>
        </header>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden">
            <main className="flex-grow p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
              {loadingMessages && initialMessagesLoadCompleted.current === false ? (
                <div className="flex-1 flex flex-col justify-center items-center p-4">
                  <FaSpinner className="animate-spin text-3xl text-sky-400 mb-3" />
                  <p className="text-gray-300 dark:text-gray-400">Loading messages...</p>
                </div>
              ) : error && !loadingMessages ? (
                <div className="flex-1 flex flex-col justify-center items-center p-4 text-red-400">
                  <FaExclamationTriangle className="text-3xl mb-3" />
                  <p>{error}</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex flex-col justify-center items-center p-4 text-center">
                  <FaCommentDots className="text-4xl text-gray-500 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-300 mb-2">No messages yet.</h3>
                  <p className="text-gray-400 dark:text-gray-500">Be the first to say something!</p>
                  <div className="mt-6 p-3 bg-sky-800/30 border border-sky-700 rounded-lg text-xs text-sky-300 max-w-md mx-auto">
                    <FaInfoCircle className="inline mr-1.5 mb-0.5" />
                    Real-time updates are active. 
                    If you suspect missing messages, you can use the <FaSyncAlt className="inline mx-0.5" /> button to manually refresh.
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.user_id === currentUser?.id ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs lg:max-w-md p-3 rounded-xl shadow-md ${msg.user_id === currentUser?.id ? `${currentColorScheme.bgColor.replace('bg-','dark:bg-').replace('gray-800','sky-700')} text-white` : 'bg-gray-700 dark:bg-gray-700 text-gray-200 dark:text-gray-100'}`}>
                        <div className="flex items-center mb-1">
                          {msg.profiles?.avatar_url && (
                            <img 
                              src={msg.profiles.avatar_url} 
                              alt={msg.profiles.display_name || 'User'} 
                              className="w-6 h-6 rounded-full mr-2 border border-gray-500"
                              crossOrigin="anonymous"
                            />
                          )}
                          <span className="text-xs font-semibold opacity-80">
                            {msg.user_id === currentUser?.id ? 'You' : msg.profiles?.display_name || 'Guest'}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                        <div className="text-xs opacity-60 mt-1.5 text-right flex items-center justify-end">
                          {formatDistanceToNow(new Date(msg.created_at), { addSuffix: true })}
                          {msg.user_id === currentUser?.id && (
                            <button 
                              onClick={() => handleDeleteMessage(msg.id)} 
                              disabled={deletingMessageId === msg.id}
                              className="ml-2 text-red-400 hover:text-red-300 disabled:opacity-50"
                              title="Delete message"
                            >
                              {deletingMessageId === msg.id ? <FaSpinner className="animate-spin h-3 w-3" /> : <FaTrashAlt className="h-3 w-3" />}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </main>
            <footer className={`w-full p-3 md:p-4 sticky bottom-0 ${headerBgColor} border-t ${headerBorderColor} bg-opacity-90 backdrop-blur-md`}>
              <form onSubmit={handlePostMessage} className="flex items-center space-x-2 md:space-x-3">
                <input
                  type="text"
                  value={newMessageContent}
                  onChange={(e) => setNewMessageContent(e.target.value)}
                  placeholder="Type your message..."
                  className={`flex-grow p-3 bg-gray-700 dark:bg-gray-800 border border-gray-600 dark:border-gray-700 rounded-lg text-gray-100 focus:outline-none focus:ring-2 ${currentColorScheme.borderColor.replace('border-','focus:ring-').replace('gray','sky')} ${currentColorScheme.borderColor.replace('border-','focus:border-').replace('gray','sky')} shadow-sm transition-colors placeholder-gray-400 dark:placeholder-gray-500`}
                  disabled={postingMessage || !currentUser}
                />
                <button 
                  type="submit" 
                  disabled={postingMessage || !currentUser || !newMessageContent.trim()}
                  className={`px-4 py-3 rounded-lg font-semibold flex items-center justify-center shadow-md transition-colors 
                             ${buttonTextColor} 
                             ${postingMessage ? currentColorScheme.bgColor : buttonBgColor} 
                             ${currentColorScheme.bgColor} 
                             border ${buttonBorderColor} 
                             disabled:opacity-60 disabled:cursor-not-allowed`}
                >
                  {postingMessage ? (
                    <FaSpinner className="animate-spin mr-0 md:mr-2 h-5 w-5" /> 
                  ) : (
                    <FaPaperPlane className="mr-0 md:mr-2 h-5 w-5" /> 
                  )}
                  <span className="hidden md:inline">{postingMessage ? 'Sending...' : 'Send'}</span>
                </button>
              </form>
            </footer>
          </div>

          <aside className={`w-full md:w-72 lg:w-80 p-3 md:p-4 ${headerBgColor} border-t md:border-t-0 md:border-l ${headerBorderColor} flex flex-col bg-opacity-90 backdrop-blur-md`}>
            <div className="flex justify-between items-center mb-3 md:mb-4">
              <h2 className="text-lg font-semibold text-white">Members ({teamMembers.length})</h2>
              <button 
                onClick={() => setShowMembersDropdown(!showMembersDropdown)}
                className="md:hidden text-gray-300 hover:text-white p-1.5 rounded-md hover:bg-white/10"
                aria-expanded={showMembersDropdown}
                aria-controls="members-list-mobile"
              >
                {showMembersDropdown ? <FaChevronUp size={18} /> : <FaChevronDown size={18} />}
              </button>
            </div>
            
            <div id="members-list-mobile" className={`md:hidden ${showMembersDropdown ? 'block' : 'hidden'} overflow-y-auto flex-grow mb-2 scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent`}>
              {loadingMembers ? (
                <div className="flex justify-center items-center py-4"><FaSpinner className="animate-spin text-2xl text-gray-400" /></div>
              ) : teamMembers.length > 0 ? (
                <ul className="space-y-1.5">
                  {teamMembers.map((member) => (
                    <li key={member.id} className={`flex items-center space-x-3 p-2.5 ${currentColorScheme.bgColor.replace('bg-','dark:bg-').replace('gray-800','gray-750')} hover:brightness-110 rounded-lg transition-colors`}>
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.displayName} className="w-8 h-8 rounded-full border-2 border-gray-500 dark:border-gray-600" crossOrigin="anonymous" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-600 dark:bg-gray-700 flex items-center justify-center text-white font-semibold text-sm border-2 border-gray-500">
                          {member.displayName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-xs text-gray-100 dark:text-gray-200 truncate font-medium">{member.displayName}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 text-xs text-center py-3">No members found.</p>
              )}
            </div>

            <div className="hidden md:block overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-gray-600/50 scrollbar-track-transparent">
              {loadingMembers ? (
                <div className="flex justify-center items-center pt-5"><FaSpinner className="animate-spin text-2xl text-gray-400" /></div>
              ) : teamMembers.length > 0 ? (
                <ul className="space-y-1.5">
                  {teamMembers.map((member) => (
                    <li key={member.id} className={`flex items-center space-x-3 p-2.5 ${currentColorScheme.bgColor.replace('bg-','dark:bg-').replace('gray-800','gray-750')} hover:brightness-110 rounded-lg transition-colors`}>
                      {member.avatarUrl ? (
                        <img src={member.avatarUrl} alt={member.displayName} className="w-9 h-9 rounded-full border-2 border-gray-500 dark:border-gray-600" crossOrigin="anonymous"/>
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gray-600 dark:bg-gray-700 flex items-center justify-center text-white font-semibold text-md border-2 border-gray-500">
                          {member.displayName?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="text-sm text-gray-100 dark:text-gray-200 truncate font-medium">{member.displayName}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 dark:text-gray-500 text-sm text-center pt-5">No members found.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    );
  }
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