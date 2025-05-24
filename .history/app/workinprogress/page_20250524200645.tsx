'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import getSupabaseBrowserClient from '@/lib/supabase/client'; // Adjust path if needed
import { User } from '@supabase/supabase-js';
import { FaTrash, FaCalendarAlt } from 'react-icons/fa';

// NEW: Import EventForm and its related types if needed for props
import EventForm from '../gigs/calendar/components/EventForm';
// We'll need the categories from the calendar or define a default set here
// For now, let's use the same categories as in CalendarPage for consistency
const CALENDAR_CATEGORIES = [
    { id: 'all', name: 'All Events', color: 'bg-gray-500' }, // Not typically used for new events
    { id: 'client', name: 'Client Work', color: 'bg-blue-500' },
    { id: 'learning', name: 'Learning Path', color: 'bg-green-500' },
    { id: 'financial', name: 'Financial Tasks', color: 'bg-yellow-500' },
    { id: 'admin', name: 'Admin Tasks', color: 'bg-purple-500' },
    { id: 'milestone', name: 'Milestones', color: 'bg-red-500' },
    { id: 'habit', name: 'Habit Management', color: 'bg-orange-500' },
    { id: 'wip_task', name: 'WIP Task', color: 'bg-teal-500' } // Example new category
];

// Define the types for our tasks
interface DatabaseTask {
  id: string; // UUID from Supabase
  created_at: string;
  text: string;
  status: string;
  project_scope_id: string | null; // UUID linking to project_scopes table, can be null if no scope assigned
  notes?: string | null;
  due_date?: string | null;
  order_val?: number | null;
  updated_at?: string | null; // From previous change for status update
}

// ADD: Define type for project scopes
interface ProjectScope {
  id: string; // UUID from Supabase
  name: string; // This should ideally match the client project name
  user_id: string | null; // Changed to nullable to match Supabase data
  description?: string | null;
  scope_type?: string | null;
}

// NEW: Define type for My Projects (from clients table)
interface MyProject {
  id: string; // clients.id
  name: string; // clients.name
}

// NEW: Define type for the combined dropdown options
interface ScopeOption {
  label: string; // Project name (clients.name)
  value: string; // Project scope ID (project_scopes.id)
}

// ADD: Define possible task statuses for the dropdown
const TASK_STATUSES = ['TO_DO', 'IN_PROGRESS', 'DONE', 'PARTIAL', 'ISSUE', 'PLANNED', 'ON_HOLD', 'CANCELLED'];

export default function WorkInProgressPage() {
  const supabase = getSupabaseBrowserClient();
  const [user, setUser] = useState<User | null>(null);

  // CONSOLIDATE: Single list for all tasks
  const [allUserTasks, setAllUserTasks] = useState<DatabaseTask[]>([]);

  // Demo data for realistic tasks
  const demoTasks: DatabaseTask[] = [
    {
      id: 'demo-task-1',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      text: 'Implement voice recognition API for AI kitchen assistant',
      status: 'IN_PROGRESS',
      project_scope_id: 'demo-scope-1',
      notes: 'Testing Google Speech-to-Text API integration',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      order_val: 1,
      updated_at: new Date().toISOString()
    },
    {
      id: 'demo-task-2',
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      text: 'Design UI mockups for restaurant POS integration',
      status: 'DONE',
      project_scope_id: 'demo-scope-2',
      notes: 'Completed wireframes and high-fidelity designs',
      due_date: null,
      order_val: 2,
      updated_at: new Date().toISOString()
    },
    {
      id: 'demo-task-3',
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
      text: 'Research blockchain solutions for supply chain tracking',
      status: 'TO_DO',
      project_scope_id: 'demo-scope-3',
      notes: null,
      due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      order_val: 3,
      updated_at: new Date().toISOString()
    },
    {
      id: 'demo-task-4',
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      text: 'Create user testing plan for mobile app features',
      status: 'PLANNED',
      project_scope_id: 'demo-scope-1',
      notes: 'Need to recruit 20 beta testers from restaurant industry',
      due_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      order_val: 4,
      updated_at: new Date().toISOString()
    },
    {
      id: 'demo-task-5',
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      text: 'Optimize database queries for real-time inventory updates',
      status: 'ISSUE',
      project_scope_id: 'demo-scope-2',
      notes: 'Performance degradation noticed during peak hours',
      due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      order_val: 5,
      updated_at: new Date().toISOString()
    },
    {
      id: 'demo-task-6',
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      text: 'Document API endpoints for third-party integrations',
      status: 'PARTIAL',
      project_scope_id: null,
      notes: 'Authentication and basic CRUD endpoints documented',
      due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      order_val: 6,
      updated_at: new Date().toISOString()
    }
  ];

  // Demo project scopes
  const demoProjectScopes: ProjectScope[] = [
    {
      id: 'demo-scope-1',
      name: 'RafsKitchen AI Assistant',
      user_id: 'raf-user-id',
      description: 'Smart kitchen assistant with voice recognition and recipe suggestions',
      scope_type: 'product_development'
    },
    {
      id: 'demo-scope-2',
      name: 'Restaurant POS Integration',
      user_id: 'raf-user-id',
      description: 'Integration platform for restaurant point-of-sale systems',
      scope_type: 'client_project'
    },
    {
      id: 'demo-scope-3',
      name: 'Supply Chain Blockchain',
      user_id: 'raf-user-id',
      description: 'Blockchain-based supply chain tracking for food industry',
      scope_type: 'research_development'
    }
  ];

  const [newBoaseTaskText, setNewBoaseTaskText] = useState('');
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [errorLoadingTasks, setErrorLoadingTasks] = useState<string | null>(null);
  const [errorAddingTask, setErrorAddingTask] = useState<string | null>(null);
  const [errorDeletingTask, setErrorDeletingTask] = useState<string | null>(null);
  const [errorUpdatingTask, setErrorUpdatingTask] = useState<string | null>(null);

  // ADD: State for project scopes
  const [projectScopes, setProjectScopes] = useState<ProjectScope[]>([]);
  const [isLoadingScopes, setIsLoadingScopes] = useState(true);
  const [errorLoadingScopes, setErrorLoadingScopes] = useState<string | null>(null);

  // NEW: State for My Projects
  const [myProjects, setMyProjects] = useState<MyProject[]>([]);
  const [isLoadingMyProjects, setIsLoadingMyProjects] = useState(true);
  const [errorLoadingMyProjects, setErrorLoadingMyProjects] = useState<string | null>(null);

  // NEW: State for combined scope dropdown options
  const [scopeDropdownOptions, setScopeDropdownOptions] = useState<ScopeOption[]>([]);

  // ADD: State for the selected scope for new tasks (optional, for now new tasks get null scope_id)
  const [selectedScopeForNewTask, setSelectedScopeForNewTask] = useState<string | null>(null);

  // NEW: State for scheduling modal
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [taskToSchedule, setTaskToSchedule] = useState<DatabaseTask | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      } else {
        // For demo purposes, set a demo user
        setUser({ id: 'raf-user-id', email: 'raf@rafskitchen' } as User);
      }
    };
    getCurrentUser();
  }, [supabase]);

  // CONSOLIDATE: Fetch all tasks for the user
  const fetchAllUserTasks = async (userId: string) => {
    if (!userId) return;
    setIsLoadingTasks(true);
    setErrorLoadingTasks(null);
    try {
      const { data, error } = await supabase
        .from('b0ase_tasks')
        .select('*') // Selects all columns, including new project_scope_id
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching all user tasks:', error);
        setErrorLoadingTasks(`Failed to load tasks: ${error.message}`);
        setAllUserTasks([]);
      } else {
        setAllUserTasks(data || []);
      }
    } catch (e: any) {
      console.error('Unexpected error fetching all user tasks:', e);
      setErrorLoadingTasks(`An unexpected error occurred: ${e.message}`);
      setAllUserTasks([]);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // ADD: Function to fetch project scopes for the user
  const fetchProjectScopes = async (userId: string) => {
    if (!userId) return;
    setIsLoadingScopes(true);
    setErrorLoadingScopes(null);
    try {
      const { data, error } = await supabase
        .from('project_scopes')
        .select('*')
        .eq('user_id', userId)
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching project scopes:', error);
        setErrorLoadingScopes(`Failed to load project scopes: ${error.message}`);
        setProjectScopes([]);
      } else {
        setProjectScopes(data || []);
      }
    } catch (e: any) {
      console.error('Unexpected error fetching project scopes:', e);
      setErrorLoadingScopes(`An unexpected error occurred: ${e.message}`);
      setProjectScopes([]);
    } finally {
      setIsLoadingScopes(false);
    }
  };

  // NEW: Function to fetch "My Projects" for the user
  const fetchMyProjects = async (userId: string) => {
    if (!userId) return;
    setIsLoadingMyProjects(true);
    setErrorLoadingMyProjects(null);
    try {
      const { data, error } = await supabase
        .from('clients')
        .select(`
          id,
          name,
          project_users!inner(user_id)
        `)
        .eq('project_users.user_id', userId)
        .order('name', { ascending: true });
      
      if (error) {
        console.error('Error fetching my projects:', error);
        setErrorLoadingMyProjects(`Failed to load my projects: ${error.message}`);
        setMyProjects([]);
      } else {
        setMyProjects(data as MyProject[] || []);
      }
    } catch (e: any) {
      console.error('Unexpected error fetching my projects:', e);
      setErrorLoadingMyProjects(`An unexpected error occurred: ${e.message}`);
      setMyProjects([]);
    } finally {
      setIsLoadingMyProjects(false);
    }
  };

  useEffect(() => {
    if (user) {
      console.log('[WorkInProgressPage] Fetching all tasks for user ID:', user.id);
      fetchAllUserTasks(user.id);
      console.log('[WorkInProgressPage] Fetching project scopes for user ID:', user.id);
      fetchProjectScopes(user.id);
      console.log('[WorkInProgressPage] Fetching my projects for user ID:', user.id);
      fetchMyProjects(user.id); // NEW: Call fetchMyProjects
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // NEW: useEffect to combine myProjects and projectScopes for the dropdown
  useEffect(() => {
    if (!user) { // Don't run if user is not yet available
      setScopeDropdownOptions([]);
      setSelectedScopeForNewTask(null);
      return;
    }

    console.log('[Debug] Recalculating scopeDropdownOptions for user:', user.id);
    console.log('[Debug] myProjects:', myProjects);
    console.log('[Debug] projectScopes:', projectScopes);

    const options: ScopeOption[] = [];
    const addedScopeValues = new Set<string>(); // To track added scope values (project_scope_id) to prevent duplicates

    // 1. Process myProjects (client projects) and find their corresponding project_scope_id
    if (myProjects.length > 0) {
      myProjects.forEach(project => {
        // Ensure we are only looking for scopes belonging to the current user
        const matchingScope = projectScopes.find(scope => scope.name === project.name && scope.user_id === user.id);
        if (matchingScope) {
          if (!addedScopeValues.has(matchingScope.id)) {
            console.log(`[Debug] Matched myProject '${project.name}' with projectScope '${matchingScope.name}' (ID: ${matchingScope.id})`);
            options.push({ label: project.name, value: matchingScope.id });
            addedScopeValues.add(matchingScope.id);
          }
        } else {
          console.log(`[Debug] No matching projectScope found for myProject '${project.name}'. It will not be added via this path.`);
        }
      });
    }

    // 2. Add other projectScopes that are for the current user and weren't already added via myProjects match
    if (projectScopes.length > 0) {
      projectScopes.forEach(scope => {
        if (scope.user_id === user.id && !addedScopeValues.has(scope.id)) {
          console.log(`[Debug] Adding user-specific non-client projectScope '${scope.name}' (ID: ${scope.id})`);
          options.push({ label: scope.name, value: scope.id });
          addedScopeValues.add(scope.id); // Should be redundant if first loop uses value, but good for safety
        }
      });
    }
    
    options.sort((a, b) => a.label.localeCompare(b.label));

    console.log('[Debug] Generated scopeDropdownOptions:', options);
    setScopeDropdownOptions(options);

    // Default selection logic
    if (options.length > 0) {
      if (selectedScopeForNewTask === null || !options.find(opt => opt.value === selectedScopeForNewTask)) {
        // If current selection is null or no longer valid, try to set a default
        const preferredDefault = options.find(opt => opt.label === "b0ase.com Platform") || options[0];
        if (preferredDefault) {
            console.log('[Debug] Setting/adjusting default selectedScopeForNewTask to:', preferredDefault.label, preferredDefault.value);
            setSelectedScopeForNewTask(preferredDefault.value);
        }
      }
    } else if (options.length === 0 && selectedScopeForNewTask !== null) {
        console.log('[Debug] No options available, clearing selectedScopeForNewTask.');
        setSelectedScopeForNewTask(null);
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [myProjects, projectScopes, user]); // Added user to dependencies

  // Separate useEffect for debugging all relevant states
  useEffect(() => {
    console.log('[State Snapshot] myProjects:', myProjects);
    console.log('[State Snapshot] projectScopes:', projectScopes);
    console.log('[State Snapshot] scopeDropdownOptions:', scopeDropdownOptions);
    console.log('[State Snapshot] selectedScopeForNewTask:', selectedScopeForNewTask);
  }, [myProjects, projectScopes, scopeDropdownOptions, selectedScopeForNewTask]);

  const handleAddBoaseTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newBoaseTaskText.trim() || !user) {
      return;
    }
    console.log('[WorkInProgressPage] Adding task for user ID:', user.id);
    setErrorAddingTask(null);

    try {
      const { data, error } = await supabase
        .from('b0ase_tasks')
        .insert([{ 
          text: newBoaseTaskText.trim(), 
          status: 'TO_DO', 
          project_scope_id: selectedScopeForNewTask, // Assign selected scope, or null if none selected
          user_id: user.id
        }])
        .select()
        .single(); // Assuming we want the single inserted record back for optimistic update

      if (error) {
        console.error('Error adding task:', error);
        setErrorAddingTask(`Failed to add task: ${error.message}`);
      } else {
        setNewBoaseTaskText('');
        if (data) {
          // Add to the consolidated list
          setAllUserTasks(prevTasks => [data as DatabaseTask, ...prevTasks]);
        } else {
          fetchAllUserTasks(user.id); 
        }
      }
    } catch (e: any) {
      console.error('Unexpected error adding task:', e);
      setErrorAddingTask(`An unexpected error occurred: ${e.message}`);
    }
  };

  const handleDeleteTask = async (taskId: string /*, taskScope: 'b0ase.com' | 'general_other_tasks' */) => {
    // taskScope is no longer needed as we have a single list
    if (!user) {
      setErrorDeletingTask('User not authenticated.');
      return;
    }
    setErrorDeletingTask(null);

    // Optimistic update from the consolidated list
    setAllUserTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    
    try {
      const { error } = await supabase
        .from('b0ase_tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error deleting task:', error);
        setErrorDeletingTask(`Failed to delete task: ${error.message}`);
        if (user) fetchAllUserTasks(user.id); // Revert by re-fetching all tasks
      } else {
        console.log(`Task ${taskId} deleted successfully.`);
      }
    } catch (e: any) {
      console.error('Unexpected error deleting task:', e);
      setErrorDeletingTask(`An unexpected error occurred: ${e.message}`);
      if (user) fetchAllUserTasks(user.id);
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string /*, taskScope: 'b0ase.com' | 'general_other_tasks' */) => {
    // taskScope is no longer needed
    if (!user) {
      setErrorUpdatingTask('User not authenticated.');
      return;
    }
    setErrorUpdatingTask(null);

    const updateTaskInState = (prevTasks: DatabaseTask[]) => 
      prevTasks.map(task => task.id === taskId ? { ...task, status: newStatus, updated_at: new Date().toISOString() } : task);
    
    setAllUserTasks(updateTaskInState);

    try {
      const { error } = await supabase
        .from('b0ase_tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating task status:', error);
        setErrorUpdatingTask(`Failed to update status: ${error.message}`);
        if (user) fetchAllUserTasks(user.id);
      } else {
        console.log(`Task ${taskId} status updated to ${newStatus}.`);
      }
    } catch (e: any) {
      console.error('Unexpected error updating task status:', e);
      setErrorUpdatingTask(`An unexpected error occurred: ${e.message}`);
       if (user) fetchAllUserTasks(user.id);
    }
  };

  // ADD: Function to handle updating a task's project scope
  const handleProjectScopeChange = async (taskId: string, newScopeId: string | null) => {
    if (!user) {
      setErrorUpdatingTask('User not authenticated.'); // Can reuse errorUpdatingTask or create a new one
      return;
    }
    setErrorUpdatingTask(null);

    const updateTaskInState = (prevTasks: DatabaseTask[]) => 
      prevTasks.map(task => task.id === taskId ? { ...task, project_scope_id: newScopeId, updated_at: new Date().toISOString() } : task);
    
    setAllUserTasks(updateTaskInState);

    try {
      const { error } = await supabase
        .from('b0ase_tasks')
        .update({ project_scope_id: newScopeId, updated_at: new Date().toISOString() })
        .eq('id', taskId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating task project scope:', error);
        setErrorUpdatingTask(`Failed to update project scope: ${error.message}`);
        if (user) fetchAllUserTasks(user.id);
      } else {
        console.log(`Task ${taskId} project scope updated to ${newScopeId}.`);
      }
    } catch (e: any) {
      console.error('Unexpected error updating task project scope:', e);
      setErrorUpdatingTask(`An unexpected error occurred: ${e.message}`);
      if (user) fetchAllUserTasks(user.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'TO_DO':
        return 'bg-yellow-100 text-yellow-800';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800';
      case 'DONE':
        return 'bg-green-100 text-green-800';
      case 'PARTIAL':
        return 'bg-orange-100 text-orange-800';
      case 'ISSUE':
        return 'bg-red-100 text-red-800';
      case 'PLANNED':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // NEW: Function to open scheduling modal
  const handleOpenScheduleModal = (task: DatabaseTask) => {
    setTaskToSchedule(task);
    setShowScheduleModal(true);
  };

  // NEW: Function to handle successful save from EventForm (via scheduling modal)
  const handleEventScheduled = (scheduledEventData: any) => {
    console.log('Task scheduled as calendar event:', scheduledEventData);
    setShowScheduleModal(false);
    setTaskToSchedule(null);
    // Optional: Update the task status in b0ase_tasks to 'PLANNED' or similar
    // if (taskToSchedule && user) {
    //   handleStatusChange(taskToSchedule.id, 'PLANNED');
    // }
    alert(`Task "${scheduledEventData.title}" scheduled on ${new Date(scheduledEventData.event_date).toLocaleDateString()}!`);
  };

  return (
    <div className="min-h-screen bg-white text-black flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-black mb-10 text-center">Work In Progress Dashboard</h1>
        
        {/* ADD: Dropdown to select scope for new tasks - simplistic version for now */}
        <div className="mb-6 p-4 bg-gray-50 border border-gray-200 rounded-md">
          <label htmlFor="new-task-scope" className="block text-sm font-medium text-gray-700 mb-1">Default Scope for New Tasks:</label>
          <select 
            id="new-task-scope"
            value={selectedScopeForNewTask || ''} // Handle null state
            onChange={(e) => setSelectedScopeForNewTask(e.target.value || null)} // Set to null if "(None)" selected
            className="w-full bg-white border border-gray-300 text-gray-900 px-3 py-2 rounded-md focus:ring-cyan-500 focus:border-cyan-500 text-sm"
            disabled={isLoadingScopes || isLoadingMyProjects || (scopeDropdownOptions.length === 0 && !isLoadingScopes && !isLoadingMyProjects) }
          >
            <option value="" className="bg-white text-gray-600">(None - No Specific Scope)</option>
            {(isLoadingScopes || isLoadingMyProjects) && <option value="" disabled>Loading projects...</option>}
            {!isLoadingScopes && !isLoadingMyProjects && scopeDropdownOptions.length === 0 && <option value="" disabled>No projects available</option>}
            {scopeDropdownOptions.map(option => (
              <option key={option.value} value={option.value} className="bg-white text-gray-900">
                {option.label}
              </option>
            ))}
          </select>
          {errorLoadingScopes && <p className="text-red-600 text-xs mt-1">{errorLoadingScopes}</p>}
          {errorLoadingMyProjects && <p className="text-red-600 text-xs mt-1">{errorLoadingMyProjects}</p>}
        </div>

        {/* Single section for all tasks */}
        <section className="bg-white p-6 md:p-8 border border-gray-200 shadow-xl flex flex-col">
          <h2 className={`text-2xl font-semibold text-cyan-600 group-hover:text-cyan-700 text-center mb-6`}>
            All My Tasks
          </h2>
          <div className="space-y-3 flex-grow">
            {isLoadingTasks && <p className="text-gray-600 text-center">Loading your tasks...</p>}
            {errorLoadingTasks && <p className="text-red-600 text-center">{errorLoadingTasks}</p>}
            {errorDeletingTask && <p className="text-red-600 text-center py-2">{errorDeletingTask}</p>}
            {errorUpdatingTask && <p className="text-red-600 text-center py-2">{errorUpdatingTask}</p>}

            {!isLoadingTasks && !errorLoadingTasks && allUserTasks.length > 0 && (
              allUserTasks.map(item => (
                <div key={item.id} className="p-4 bg-gray-50 border border-gray-200 rounded-md shadow-sm">
                  <div className="flex justify-between items-center gap-3">
                    <p className="text-gray-700 flex-grow break-all">{item.text}</p>
                    <div className="flex items-center gap-2 flex-shrink-0"> 
                       {/* Project Scope Dropdown */}
                      <select 
                        value={item.project_scope_id || ''} // Handle null scope_id
                        onChange={(e) => handleProjectScopeChange(item.id, e.target.value || null)}
                        className={`px-2 py-1 text-xs font-medium rounded-md border-none focus:ring-1 focus:ring-cyan-500 bg-white hover:bg-gray-50 text-cyan-700 w-40 truncate border border-gray-300`}
                        title={scopeDropdownOptions.find(s => s.value === item.project_scope_id)?.label || (item.project_scope_id === null || item.project_scope_id === '' ? '(None)' : 'Assign Scope')}
                        disabled={isLoadingScopes || isLoadingMyProjects || (scopeDropdownOptions.length === 0 && !isLoadingScopes && !isLoadingMyProjects) }
                      >
                        <option value="" className="bg-white text-gray-600">(None)</option>
                        {(isLoadingScopes || isLoadingMyProjects) && <option value="" disabled>Loading...</option>}
                        {!isLoadingScopes && !isLoadingMyProjects && scopeDropdownOptions.length === 0 && <option value="" disabled>No projects available</option>}
                        {scopeDropdownOptions.map(option => (
                          <option key={option.value} value={option.value} className="bg-white text-gray-900">
                            {option.label}
                          </option>
                        ))}
                      </select>
                      
                      {/* Status Dropdown */}
                      <select 
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(item.status)} border-none focus:ring-1 focus:ring-cyan-500 bg-opacity-50 w-32 truncate border border-gray-300`}
                        style={{ backgroundColor: 'transparent' }} 
                        title={item.status.replace('_',' ')}
                      >
                        {TASK_STATUSES.map(status => (
                          <option key={status} value={status} className="bg-white text-gray-700">
                            {status.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                      {/* NEW: Schedule to Calendar button */}
                      <button 
                        onClick={() => handleOpenScheduleModal(item)}
                        className="text-green-600 hover:text-green-700 transition-colors p-1"
                        aria-label="Schedule task to calendar"
                        title="Schedule to Calendar"
                      >
                        <FaCalendarAlt />
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(item.id)}
                        className="text-red-600 hover:text-red-700 transition-colors p-1"
                        aria-label="Delete task"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                </div>
              )) 
            )}
            {!isLoadingTasks && !errorLoadingTasks && allUserTasks.length === 0 && (
                <p className="text-gray-500 italic text-center py-4">No tasks added yet for your account.</p>
            )}
          </div>
          
          <form onSubmit={handleAddBoaseTask} className="mt-6">
            <div className="flex flex-col sm:flex-row gap-2 mb-2"> {/* Added this div from original unseen form structure */}
              <input
                type="text"
                value={newBoaseTaskText}
                onChange={(e) => setNewBoaseTaskText(e.target.value)}
                placeholder="Add a new task..." // Changed placeholder to be more generic
                className="flex-grow p-2 border border-gray-300 rounded-md shadow-sm focus:ring-cyan-500 focus:border-cyan-500 bg-white text-gray-900 placeholder-gray-500" // Copied classes from previous attempt
              />
              {/* This is the select that was correctly updated before, now just ensuring classes match */}
              <select 
                value={selectedScopeForNewTask || ''} 
                onChange={(e) => setSelectedScopeForNewTask(e.target.value || null)}
                className="p-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-900 focus:ring-cyan-500 focus:border-cyan-500" // Copied classes from previous attempt
                disabled={isLoadingScopes || isLoadingMyProjects || (scopeDropdownOptions.length === 0 && !isLoadingScopes && !isLoadingMyProjects) }
              >
                <option value="" disabled={scopeDropdownOptions.length > 0 && !!selectedScopeForNewTask }>(Select Project Scope)</option> 
                <option value="">(None - No Specific Scope)</option> {/* Added explicit None option here too */}
                {(isLoadingScopes || isLoadingMyProjects) ? (
                  <option value="" disabled>Loading projects...</option>
                ) : scopeDropdownOptions.length === 0 ? (
                  <option value="" disabled>No projects available</option>
                ) : (
                  scopeDropdownOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))
                )}
              </select>
              <button 
                type="submit" 
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-md shadow-sm disabled:opacity-50" // Copied classes from previous attempt
                disabled={!newBoaseTaskText.trim() || (!selectedScopeForNewTask && scopeDropdownOptions.length > 0 && selectedScopeForNewTask !== '')} // Ensure (None) is a valid selection for enabling button
              >
                Add Task
              </button>
            </div>
            {errorAddingTask && <p className="text-red-600 text-xs mt-1">{errorAddingTask}</p>} {/* Changed text-red-500 to text-red-400 */}
          </form>
        </section>

        {/* NEW: Scheduling Modal */}
        {showScheduleModal && taskToSchedule && user && (
          <div 
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowScheduleModal(false);
              setTaskToSchedule(null);
            }}
          >
            <div 
              className="bg-white rounded-lg max-w-xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl p-6 space-y-4 border border-gray-200"
              onClick={(e) => e.stopPropagation()} 
            >
              <h3 className="text-xl font-semibold text-black mb-2">Schedule Task to Calendar</h3>
              <p className="text-sm text-gray-600 mb-4">
                Scheduling task: <span className="font-medium text-gray-900">{taskToSchedule.text}</span>
              </p>
              <EventForm 
                date={new Date()} // Default to today, EventForm expects a Date for its initial display
                event={{ title: taskToSchedule.text, description: taskToSchedule.notes || '' }} // Pre-fill from task
                onSave={handleEventScheduled}
                onCancel={() => {
                  setShowScheduleModal(false);
                  setTaskToSchedule(null);
                }}
                categories={CALENDAR_CATEGORIES.filter(cat => cat.id !== 'all')} // Exclude 'All Events' as a choice
              />
            </div>
          </div>
        )}

      </main>
    </div>
  );
} 