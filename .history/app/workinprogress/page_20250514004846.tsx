'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { User } from '@supabase/supabase-js';
import { FaTrash } from 'react-icons/fa';

// Define the types for our tasks
// BlueprintTask is no longer needed as these items are now in the database
// interface BlueprintTask {
//   id: string;
//   text: string;
//   status: string;
// }

interface DatabaseTask {
  id: string; // UUID from Supabase
  created_at: string;
  text: string;
  status: string;
  project_scope: string;
  notes?: string | null;
  due_date?: string | null;
  order_val?: number | null;
}

// ADD: Define possible task statuses for the dropdown
const TASK_STATUSES = ['TO_DO', 'IN_PROGRESS', 'DONE', 'PARTIAL', 'ISSUE', 'PLANNED', 'ON_HOLD', 'CANCELLED'];

export default function WorkInProgressPage() {
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);

  // REMOVE: Existing hardcoded blueprint-derived items
  // const boaseActionItems: BlueprintTask[] = [
  //   { id: 'bp_nav', text: 'Finalize Main Navigation (Header/Footer content & structure)', status: 'PARTIAL' },
  //   { id: 'bp_studio_color', text: 'Resolve Studio Links Color Issue (Tailwind JIT)', status: 'ISSUE' },
  //   { id: 'bp_fin_overview', text: 'Complete Financial Overview Page (replace dummy data, full Open Banking)', status: 'PARTIAL' },
  //   { id: 'bp_google_auth', text: 'Implement General Google Authentication', status: 'TO_DO' },
  //   { id: 'bp_sheets_api', text: 'Integrate Google Sheets API for Finances', status: 'TO_DO' },
  //   { id: 'bp_schedule_modal', text: 'Develop Editable Daily Schedule Modal for Work Path', status: 'TO_DO' },
  //   { id: 'bp_gigs_calendar', text: 'Build Gigs Calendar Page functionality', status: 'PLANNED' },
  //   { id: 'bp_fiverr_explorer', text: 'Develop Fiverr Explorer Page functionality', status: 'PLANNED' },
  // ];

  // REMOVE: Existing hardcoded other action items
  // const otherActionItems = [
  //   { id: 'o1', text: 'NinjaPunkGirls.com - Complete character design for Void', status: 'IN_PROGRESS' },
  //   { id: 'o2', text: 'Miss Void Website - Finalize homepage copy', status: 'TO_DO' },
  //   { id: 'o3', text: 'Client X - Send revised proposal', status: 'DONE' },
  // ];

  const [databaseBoaseTasks, setDatabaseBoaseTasks] = useState<DatabaseTask[]>([]);
  const [newBoaseTaskText, setNewBoaseTaskText] = useState('');
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [errorLoadingTasks, setErrorLoadingTasks] = useState<string | null>(null);
  const [errorAddingTask, setErrorAddingTask] = useState<string | null>(null);
  const [errorDeletingTask, setErrorDeletingTask] = useState<string | null>(null);
  const [errorUpdatingTask, setErrorUpdatingTask] = useState<string | null>(null); // ADD: State for update errors

  // ADD: State for "Other" tasks from the database
  const [databaseOtherTasks, setDatabaseOtherTasks] = useState<DatabaseTask[]>([]);
  const [isLoadingOtherTasks, setIsLoadingOtherTasks] = useState(true);
  const [errorLoadingOtherTasks, setErrorLoadingOtherTasks] = useState<string | null>(null);
  // We can add a newOtherTaskText for the "Other" section later if needed

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
      }
    };
    getCurrentUser();
  }, [supabase]);

  const fetchBoaseTasks = async (userId: string) => {
    if (!userId) {
      return;
    }
    setIsLoadingTasks(true);
    setErrorLoadingTasks(null);
    try {
      const { data, error } = await supabase
        .from('b0ase_tasks')
        .select('*')
        .eq('project_scope', 'b0ase.com') // Fetches tasks for b0ase.com scope
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching b0ase tasks:', error);
        setErrorLoadingTasks(`Failed to load b0ase.com tasks: ${error.message}`);
        setDatabaseBoaseTasks([]);
      } else {
        setDatabaseBoaseTasks(data || []);
      }
    } catch (e: any) {
      console.error('Unexpected error fetching b0ase tasks:', e);
      setErrorLoadingTasks(`An unexpected error occurred: ${e.message}`);
      setDatabaseBoaseTasks([]);
    } finally {
      setIsLoadingTasks(false);
    }
  };

  // ADD: Function to fetch "Other" tasks
  const fetchOtherTasks = async (userId: string) => {
    if (!userId) {
      return;
    }
    setIsLoadingOtherTasks(true);
    setErrorLoadingOtherTasks(null);
    try {
      const { data, error } = await supabase
        .from('b0ase_tasks')
        .select('*')
        .eq('project_scope', 'general_other_tasks') // Fetches tasks for general_other_tasks scope
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching other tasks:', error);
        setErrorLoadingOtherTasks(`Failed to load other tasks: ${error.message}`);
        setDatabaseOtherTasks([]);
      } else {
        setDatabaseOtherTasks(data || []);
      }
    } catch (e: any) {
      console.error('Unexpected error fetching other tasks:', e);
      setErrorLoadingOtherTasks(`An unexpected error occurred: ${e.message}`);
      setDatabaseOtherTasks([]);
    } finally {
      setIsLoadingOtherTasks(false);
    }
  };


  useEffect(() => {
    if (user) {
      console.log('[WorkInProgressPage] Fetching b0ase.com tasks for user ID:', user.id);
      fetchBoaseTasks(user.id);
      console.log('[WorkInProgressPage] Fetching other tasks for user ID:', user.id); // ADDED
      fetchOtherTasks(user.id); // ADDED
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleAddBoaseTask = async (e: FormEvent) => {
    e.preventDefault();
    if (!newBoaseTaskText.trim() || !user) {
      return;
    }
    console.log('[WorkInProgressPage] Adding b0ase.com task for user ID:', user.id);
    setErrorAddingTask(null);

    try {
      const { data, error } = await supabase
        .from('b0ase_tasks')
        .insert([{ 
          text: newBoaseTaskText.trim(), 
          status: 'TO_DO', 
          project_scope: 'b0ase.com', // This form adds to b0ase.com scope
          user_id: user.id
        }])
        .select();

      if (error) {
        console.error('Error adding b0ase task:', error);
        setErrorAddingTask(`Failed to add task: ${error.message}`);
      } else {
        setNewBoaseTaskText('');
        if (data) {
          setDatabaseBoaseTasks(prevTasks => [data[0] as DatabaseTask, ...prevTasks]);
        } else {
          fetchBoaseTasks(user.id); 
        }
      }
    } catch (e: any) {
      console.error('Unexpected error adding b0ase task:', e);
      setErrorAddingTask(`An unexpected error occurred: ${e.message}`);
    }
  };

  // ADD: Function to handle deleting a task
  const handleDeleteTask = async (taskId: string, taskScope: 'b0ase.com' | 'general_other_tasks') => {
    if (!user) {
      setErrorDeletingTask('User not authenticated.');
      return;
    }
    setErrorDeletingTask(null);

    // Optimistic update: Remove task from UI immediately
    if (taskScope === 'b0ase.com') {
      setDatabaseBoaseTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    } else if (taskScope === 'general_other_tasks') {
      setDatabaseOtherTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    }

    try {
      const { error } = await supabase
        .from('b0ase_tasks')
        .delete()
        .eq('id', taskId)
        .eq('user_id', user.id); // Ensure user can only delete their own task (RLS also enforces this)

      if (error) {
        console.error('Error deleting task:', error);
        setErrorDeletingTask(`Failed to delete task: ${error.message}`);
        // Revert optimistic update if delete failed
        if (user) { // Check user again to satisfy TypeScript inside this block
            if (taskScope === 'b0ase.com') fetchBoaseTasks(user.id);
            if (taskScope === 'general_other_tasks') fetchOtherTasks(user.id);
        }
      } else {
        console.log(`Task ${taskId} deleted successfully from scope ${taskScope}`);
        // UI already updated optimistically
      }
    } catch (e: any) {
      console.error('Unexpected error deleting task:', e);
      setErrorDeletingTask(`An unexpected error occurred: ${e.message}`);
      // Revert optimistic update if delete failed
      if (user) { // Check user again
        if (taskScope === 'b0ase.com') fetchBoaseTasks(user.id);
        if (taskScope === 'general_other_tasks') fetchOtherTasks(user.id);
      }
    }
  };

  // ADD: Function to handle updating a task's status
  const handleStatusChange = async (taskId: string, newStatus: string, taskScope: 'b0ase.com' | 'general_other_tasks') => {
    if (!user) {
      setErrorUpdatingTask('User not authenticated.');
      return;
    }
    setErrorUpdatingTask(null);

    // Optimistic UI update
    const updateTaskInState = (prevTasks: DatabaseTask[]) => 
      prevTasks.map(task => task.id === taskId ? { ...task, status: newStatus } : task);

    if (taskScope === 'b0ase.com') {
      setDatabaseBoaseTasks(updateTaskInState);
    } else if (taskScope === 'general_other_tasks') {
      setDatabaseOtherTasks(updateTaskInState);
    }

    try {
      const { error } = await supabase
        .from('b0ase_tasks')
        .update({ status: newStatus, updated_at: new Date().toISOString() }) // Also update updated_at
        .eq('id', taskId)
        .eq('user_id', user.id); // Ensure user can only update their own task (RLS also enforces this)

      if (error) {
        console.error('Error updating task status:', error);
        setErrorUpdatingTask(`Failed to update status: ${error.message}`);
        // Revert optimistic update if failed
        if (user) { // Check user again
          if (taskScope === 'b0ase.com') fetchBoaseTasks(user.id);
          if (taskScope === 'general_other_tasks') fetchOtherTasks(user.id);
        }
      } else {
        console.log(`Task ${taskId} status updated to ${newStatus} in scope ${taskScope}`);
        // UI already updated optimistically
      }
    } catch (e: any) {
      console.error('Unexpected error updating task status:', e);
      setErrorUpdatingTask(`An unexpected error occurred: ${e.message}`);
       // Revert optimistic update if failed
       if (user) { // Check user again
        if (taskScope === 'b0ase.com') fetchBoaseTasks(user.id);
        if (taskScope === 'general_other_tasks') fetchOtherTasks(user.id);
      }
    }
  };

  // We would need a new handleAddOtherTask function if the "Add Other Task" button
  // is to be made functional. For now, it's just a placeholder.

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* B0ase.com Action List */}
          <section className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-xl flex flex-col">
            <Link 
              href="/b0aseblueprint" 
              className="block bg-gray-800 hover:bg-gray-700 p-6 border border-gray-700 shadow-md transition-colors group text-center mb-6"
            >
              <h2 className={`text-2xl font-semibold text-purple-400 group-hover:text-purple-300`}>
                b0ase.com Tasks
              </h2>
            </Link>
            <div className="space-y-3 flex-grow">
              {/* REMOVE rendering of boaseActionItems (hardcoded list) */}
              {/* {boaseActionItems.length > 0 ? (
                boaseActionItems.map(item => (
                  <div key={item.id} className="p-4 bg-gray-850 border border-gray-750 rounded-md shadow-sm">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-300">{item.text}</p>
                      <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(item.status)}`}>
                        {item.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic text-center py-4">No b0ase.com blueprint tasks currently listed.</p>
              )} */}

              {/* Divider and heading for Database tasks */}
              {/* This logic can be simplified as we are always showing database tasks now */}
              {/* { (isLoadingTasks || databaseBoaseTasks.length > 0 || errorLoadingTasks) && <hr className="my-6 border-gray-700" /> } */}
              
              {isLoadingTasks && <p className="text-gray-400 text-center">Loading your b0ase.com tasks...</p>}
              {errorLoadingTasks && <p className="text-red-400 text-center">{errorLoadingTasks}</p>}
              {errorDeletingTask && <p className="text-red-400 text-center py-2">{errorDeletingTask}</p>}
              {errorUpdatingTask && <p className="text-red-400 text-center py-2">{errorUpdatingTask}</p>} {/* ADD: Display update error */}

              {!isLoadingTasks && !errorLoadingTasks && databaseBoaseTasks.length > 0 && (
                <>
                  {/* <h3 className="text-lg font-semibold text-gray-200 mb-3">My Added b0ase.com Tasks:</h3> */}
                  {databaseBoaseTasks.map(item => (
                    <div key={item.id} className="p-4 bg-gray-800 border border-gray-700 rounded-md shadow-sm">
                      <div className="flex justify-between items-center">
                        <p className="text-gray-300 flex-grow mr-2">{item.text}</p>
                        <div className="flex items-center">
                          {/* REPLACE static status span with a select dropdown */}
                          <select 
                            value={item.status}
                            onChange={(e) => handleStatusChange(item.id, e.target.value, 'b0ase.com')}
                            className={`px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(item.status)} border-none mr-3 focus:ring-1 focus:ring-purple-500 bg-opacity-50`}
                            style={{ backgroundColor: 'transparent' }} // To allow getStatusColor to show through better, or use specific bg classes
                          >
                            {TASK_STATUSES.map(status => (
                              <option key={status} value={status} className="bg-gray-800 text-gray-300">
                                {status.replace('_', ' ')}
                              </option>
                            ))}
                          </select>
                          <button 
                            onClick={() => handleDeleteTask(item.id, 'b0ase.com')}
                            className="text-red-500 hover:text-red-400 transition-colors p-1"
                            aria-label="Delete task"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
              {!isLoadingTasks && !errorLoadingTasks && databaseBoaseTasks.length === 0 && (
                 <p className="text-gray-500 italic text-center py-4">No b0ase.com tasks added yet for your account.</p>
              )}
            </div>
            
            <form onSubmit={handleAddBoaseTask} className="mt-6">
              <input
                type="text"
                value={newBoaseTaskText}
                onChange={(e) => setNewBoaseTaskText(e.target.value)}
                placeholder="Add a new b0ase.com task..."
                className="w-full bg-gray-800 border border-gray-700 text-gray-300 placeholder-gray-500 px-4 py-2 rounded-md focus:ring-purple-500 focus:border-purple-500"
              />
              {errorAddingTask && <p className="text-red-400 text-xs mt-1">{errorAddingTask}</p>}
              <button 
                type="submit"
                className="mt-3 w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50"
                disabled={!newBoaseTaskText.trim()}
              >
                Add b0ase.com Task
              </button>
            </form>
          </section>

          {/* Other Action List */}
          <section className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-xl flex flex-col">
            <div 
              className="block bg-gray-800 p-6 border border-gray-700 shadow-md text-center mb-6"
            >
              <h2 className={`text-2xl font-semibold text-teal-400`}>
                Other Tasks
              </h2>
            </div>
            <div className="space-y-3 flex-grow">
              {/* MODIFY to display databaseOtherTasks */}
              {isLoadingOtherTasks && <p className="text-gray-400 text-center">Loading your other tasks...</p>}
              {errorLoadingOtherTasks && <p className="text-red-400 text-center">{errorLoadingOtherTasks}</p>}
              {errorDeletingTask && <p className="text-red-400 text-center py-2">{errorDeletingTask}</p>}
              {errorUpdatingTask && <p className="text-red-400 text-center py-2">{errorUpdatingTask}</p>} {/* ADD: Display update error */}

              {!isLoadingOtherTasks && !errorLoadingOtherTasks && databaseOtherTasks.length > 0 ? (
                databaseOtherTasks.map(item => (
                  <div key={item.id} className="p-4 bg-gray-850 border border-gray-750 rounded-md shadow-sm">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-300 flex-grow mr-2">{item.text}</p>
                      <div className="flex items-center">
                        {/* REPLACE static status span with a select dropdown */}
                        <select 
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value, 'general_other_tasks')}
                          className={`px-2 py-1 text-xs font-medium rounded-md ${getStatusColor(item.status)} border-none mr-3 focus:ring-1 focus:ring-teal-500 bg-opacity-50`}
                          style={{ backgroundColor: 'transparent' }} // To allow getStatusColor to show through better, or use specific bg classes
                        >
                          {TASK_STATUSES.map(status => (
                            <option key={status} value={status} className="bg-gray-800 text-gray-300">
                              {status.replace('_', ' ')}
                            </option>
                          ))}
                        </select>
                        <button 
                          onClick={() => handleDeleteTask(item.id, 'general_other_tasks')}
                          className="text-red-500 hover:text-red-400 transition-colors p-1"
                          aria-label="Delete other task"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                !isLoadingOtherTasks && !errorLoadingOtherTasks && <p className="text-gray-500 italic text-center py-4">No other tasks currently listed for your account.</p>
              )}
            </div>
            <button className="mt-6 w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Add Other Task
            </button>
          </section>
        </div>
      </main>
    </div>
  );
} 