'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { FaTrash } from 'react-icons/fa';

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
  name: string;
  user_id: string;
  description?: string | null;
  scope_type?: string | null;
}

// ADD: Define possible task statuses for the dropdown
const TASK_STATUSES = ['TO_DO', 'IN_PROGRESS', 'DONE', 'PARTIAL', 'ISSUE', 'PLANNED', 'ON_HOLD', 'CANCELLED'];

export default function WorkInProgressPage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);

  // CONSOLIDATE: Single list for all tasks
  const [allUserTasks, setAllUserTasks] = useState<DatabaseTask[]>([]); 

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

  // ADD: State for the selected scope for new tasks (optional, for now new tasks get null scope_id)
  const [selectedScopeForNewTask, setSelectedScopeForNewTask] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
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

  useEffect(() => {
    if (user) {
      console.log('[WorkInProgressPage] Fetching all tasks for user ID:', user.id);
      fetchAllUserTasks(user.id);
      console.log('[WorkInProgressPage] Fetching project scopes for user ID:', user.id);
      fetchProjectScopes(user.id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

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
        return 'bg-yellow-700/30 text-yellow-300';
      case 'IN_PROGRESS':
        return 'bg-blue-700/30 text-blue-300';
      case 'DONE':
        return 'bg-green-700/30 text-green-300';
      case 'PARTIAL':
        return 'bg-orange-700/30 text-orange-300';
      case 'ISSUE':
        return 'bg-red-700/30 text-red-300';
      case 'PLANNED':
        return 'bg-purple-700/30 text-purple-300';
      default:
        return 'bg-gray-700/30 text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">Work In Progress Dashboard</h1>
        
        {/* ADD: Dropdown to select scope for new tasks - simplistic version for now */}
        <div className="mb-6 p-4 bg-gray-800 rounded-md">
          <label htmlFor="new-task-scope" className="block text-sm font-medium text-gray-300 mb-1">Default Scope for New Tasks:</label>
          <select 
            id="new-task-scope"
            value={selectedScopeForNewTask || ''} // Handle null state
            onChange={(e) => setSelectedScopeForNewTask(e.target.value || null)} // Set to null if "(None)" selected
            className="w-full bg-gray-700 border border-gray-600 text-gray-200 px-3 py-2 rounded-md focus:ring-purple-500 focus:border-purple-500 text-sm"
          >
            <option value="" className="bg-gray-800 text-gray-400">(None - No Specific Scope)</option>
            {isLoadingScopes && <option value="" disabled>Loading scopes...</option>}
            {projectScopes.map(scope => (
              <option key={scope.id} value={scope.id} className="bg-gray-800 text-gray-200">
                {scope.name}
              </option>
            ))}
          </select>
          {errorLoadingScopes && <p className="text-red-400 text-xs mt-1">{errorLoadingScopes}</p>}
        </div>

        {/* Single section for all tasks */}
        <section className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-xl flex flex-col">
          <h2 className={`text-2xl font-semibold text-purple-400 group-hover:text-purple-300 text-center mb-6`}>
            All My Tasks
          </h2>
          <div className="space-y-3 flex-grow">
            {isLoadingTasks && <p className="text-gray-400 text-center">Loading your tasks...</p>}
            {errorLoadingTasks && <p className="text-red-400 text-center">{errorLoadingTasks}</p>}
            {errorDeletingTask && <p className="text-red-400 text-center py-2">{errorDeletingTask}</p>}
            {errorUpdatingTask && <p className="text-red-400 text-center py-2">{errorUpdatingTask}</p>}

            {!isLoadingTasks && !errorLoadingTasks && allUserTasks.length > 0 && (
              allUserTasks.map(item => (
                <div key={item.id} className="p-4 bg-gray-800 border border-gray-700 rounded-md shadow-sm">
                  <div className="flex justify-between items-center gap-3">
                    <p className="text-gray-300 flex-grow">{item.text}</p>
                    <div className="flex items-center gap-2 flex-shrink-0"> 
                       {/* Project Scope Dropdown */}
                      <select 
                        value={item.project_scope_id || ''} // Handle null scope_id
                        onChange={(e) => handleProjectScopeChange(item.id, e.target.value || null)}
                        className={`px-2 py-1 text-xs font-medium rounded-md border-none focus:ring-1 focus:ring-indigo-500 bg-gray-700 hover:bg-gray-600 text-indigo-300 w-40 truncate`}
                        title={projectScopes.find(s => s.id === item.project_scope_id)?.name || "Assign Scope"}
                      >
                        <option value="" className="bg-gray-800 text-gray-400">(None)</option>
                        {isLoadingScopes && <option value="" disabled>Loading...</option>}
                        {projectScopes.map(scope => (
                          <option key={scope.id} value={scope.id} className="bg-gray-800 text-gray-200">
                            {scope.name}
                          </option>
                        ))}
                      </select>
                      
                      {/* Status Dropdown */}
                      <select 
                        value={item.status}
                        onChange={(e) => handleStatusChange(item.id, e.target.value)}
                        className={`px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(item.status)} border-none focus:ring-1 focus:ring-purple-500 bg-opacity-50 w-32 truncate`}
                        style={{ backgroundColor: 'transparent' }} 
                        title={item.status.replace('_',' ')}
                      >
                        {TASK_STATUSES.map(status => (
                          <option key={status} value={status} className="bg-gray-800 text-gray-300">
                            {status.replace('_', ' ')}
                          </option>
                        ))}
                      </select>
                      <button 
                        onClick={() => handleDeleteTask(item.id)}
                        className="text-red-500 hover:text-red-400 transition-colors p-1"
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
            <input
              type="text"
              value={newBoaseTaskText}
              onChange={(e) => setNewBoaseTaskText(e.target.value)}
              placeholder="Add a new task..."
              className="w-full bg-gray-800 border border-gray-700 text-gray-300 placeholder-gray-500 px-4 py-2 rounded-md focus:ring-purple-500 focus:border-purple-500"
            />
            {errorAddingTask && <p className="text-red-400 text-xs mt-1">{errorAddingTask}</p>}
            <button 
              type="submit"
              className="mt-3 w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
              disabled={!newBoaseTaskText.trim()}
            >
              Add Task
            </button>
          </form>
        </section>
      </main>
    </div>
  );
} 