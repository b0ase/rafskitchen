'use client';

import React, { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { FaPlusCircle, FaRegSquare, FaCheckSquare, FaTimes, FaTrash } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface ActionItem {
  id: string;
  diary_entry_id: string;
  user_id: string;
  created_at: string;
  text: string;
  is_completed: boolean;
  sent_to_wip_at: string | null;
  wip_task_id: string | null;
  order_val?: number | null;
}

interface DiaryEntry {
  id: string;
  user_id: string;
  created_at: string;
  entry_timestamp: string;
  title: string;
  summary: string;
  diary_action_items: ActionItem[];
}

export default function DiaryPage() {
  const supabase = createClientComponentClient();
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [isLoadingEntries, setIsLoadingEntries] = useState(true);
  const [errorLoadingEntries, setErrorLoadingEntries] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);

  const [showAddEntryModal, setShowAddEntryModal] = useState(false);
  const [newEntryTitle, setNewEntryTitle] = useState('');
  const [newEntrySummary, setNewEntrySummary] = useState('');
  const [newEntryActionItemTexts, setNewEntryActionItemTexts] = useState<string[]>(['']);
  const [isSubmittingEntry, setIsSubmittingEntry] = useState(false);

  useEffect(() => {
    setIsClient(true);
    fetchDiaryEntries();
  }, []);

  const fetchDiaryEntries = async () => {
    setIsLoadingEntries(true);
    setErrorLoadingEntries(null);
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData.session) {
        setErrorLoadingEntries('User not authenticated. Please log in.');
        setIsLoadingEntries(false);
        return;
      }

      const { data, error } = await supabase
        .from('diary_entries')
        .select(`
          id, user_id, created_at, entry_timestamp, title, summary,
          diary_action_items (*)
        `)
        .eq('user_id', sessionData.session.user.id)
        .order('entry_timestamp', { ascending: false })
        .order('created_at', { referencedTable: 'diary_action_items', ascending: true });

      if (error) {
        console.error('Error fetching diary entries:', error);
        setErrorLoadingEntries(`Failed to load diary entries: ${error.message}`);
        setEntries([]);
      } else {
        setEntries(data || []);
      }
    } catch (e: any) {
      console.error('Unexpected error fetching entries:', e);
      setErrorLoadingEntries(`An unexpected error occurred: ${e.message}`);
      setEntries([]);
    } finally {
      setIsLoadingEntries(false);
    }
  };

  const toggleActionItem = async (actionItemId: string) => {
    const entryIndex = entries.findIndex(entry => entry.diary_action_items.some(ai => ai.id === actionItemId));
    if (entryIndex === -1) return;

    const actionItemIndex = entries[entryIndex].diary_action_items.findIndex(ai => ai.id === actionItemId);
    if (actionItemIndex === -1) return;

    const currentItem = entries[entryIndex].diary_action_items[actionItemIndex];
    const newCompletedStatus = !currentItem.is_completed;

    const updatedEntries = entries.map(entry => ({
      ...entry,
      diary_action_items: entry.diary_action_items.map(ai => 
        ai.id === actionItemId ? { ...ai, is_completed: newCompletedStatus } : ai
      )
    }));
    setEntries(updatedEntries);

    const { error } = await supabase
      .from('diary_action_items')
      .update({ is_completed: newCompletedStatus })
      .eq('id', actionItemId);

    if (error) {
      console.error('Error updating action item:', error);
      setEntries(entries);
      alert(`Failed to update action item: ${error.message}`);
    }
  };

  const handleActionItemTextChange = (index: number, value: string) => {
    const updatedTexts = [...newEntryActionItemTexts];
    updatedTexts[index] = value;
    setNewEntryActionItemTexts(updatedTexts);
  };

  const addActionItemInput = () => {
    setNewEntryActionItemTexts([...newEntryActionItemTexts, '']);
  };

  const removeActionItemInput = (index: number) => {
    if (newEntryActionItemTexts.length > 1) {
      const updatedTexts = newEntryActionItemTexts.filter((_, i) => i !== index);
      setNewEntryActionItemTexts(updatedTexts);
    }
  };

  const handleAddEntryModalSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmittingEntry(true);

    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError || !sessionData.session) {
      alert('Authentication error. Please log in and try again.');
      setIsSubmittingEntry(false);
      return;
    }
    const userId = sessionData.session.user.id;

    try {
      const { data: diaryEntryData, error: diaryEntryError } = await supabase
        .from('diary_entries')
        .insert({
          title: newEntryTitle,
          summary: newEntrySummary,
          user_id: userId,
          entry_timestamp: new Date().toISOString(),
        })
        .select()
        .single();

      if (diaryEntryError) {
        throw diaryEntryError;
      }

      if (!diaryEntryData) {
        throw new Error('Failed to create diary entry, no data returned.');
      }

      const newDiaryEntryId = diaryEntryData.id;

      const validActionItemTexts = newEntryActionItemTexts.map(text => text.trim()).filter(text => text !== '');
      if (validActionItemTexts.length > 0) {
        const actionItemsToInsert = validActionItemTexts.map(text => ({
          diary_entry_id: newDiaryEntryId,
          user_id: userId,
          text: text,
          is_completed: false,
        }));

        const { error: actionItemsError } = await supabase
          .from('diary_action_items')
          .insert(actionItemsToInsert);

        if (actionItemsError) {
          console.error('Error inserting action items, main entry created but orphaned items might exist:', actionItemsError);
          throw new Error(`Main entry created, but failed to add action items: ${actionItemsError.message}`);
        }
      }

      setShowAddEntryModal(false);
      setNewEntryTitle('');
      setNewEntrySummary('');
      setNewEntryActionItemTexts(['']);
      fetchDiaryEntries();
      alert('Diary entry added successfully!');

    } catch (error: any) {
      console.error('Error adding diary entry:', error);
      alert(`Failed to add diary entry: ${error.message}`);
    } finally {
      setIsSubmittingEntry(false);
    }
  };

  const allActionItems = entries.reduce((acc, entry) => {
    if (entry.diary_action_items) {
      acc.push(...entry.diary_action_items);
    }
    return acc;
  }, [] as ActionItem[]);

  const outstandingActionItems = allActionItems.filter(item => !item.is_completed);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 flex justify-end items-center">
          <button 
            onClick={() => setShowAddEntryModal(true)}
            className="inline-flex items-center bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            <FaPlusCircle className="mr-2" />
            Add New Diary Entry
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">Diary</h1>

        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { href: '/workinprogress', title: 'Work In Progress', description: 'View and manage current tasks and project statuses.', bgColor: 'bg-purple-700/30', hoverBgColor: 'hover:bg-purple-600/40', borderColor: 'border-purple-600/50', titleColor: 'text-purple-300'},
            { href: '/gigs/calendar', title: 'Calendar', description: 'Check deadlines, scheduled learning, and important dates.', bgColor: 'bg-teal-700/30', hoverBgColor: 'hover:bg-teal-600/40', borderColor: 'border-teal-600/50', titleColor: 'text-teal-300'},
          ].map((card) => (
            <Link key={card.href} href={card.href} className={`block p-6 border shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 group ${card.bgColor} ${card.hoverBgColor} ${card.borderColor}`}>
              <h3 className={`text-xl font-semibold mb-2 group-hover:text-white ${card.titleColor}`}>{card.title}</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300">{card.description}</p>
            </Link>
          ))}
        </div>

        {isClient && outstandingActionItems.length > 0 && (
          <section className="mb-10 p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-amber-400 mb-4">Action Items Hotlist ({outstandingActionItems.length} outstanding)</h2>
            <ul className="space-y-2">
              {outstandingActionItems.map(item => (
                <li key={item.id} className="flex items-center text-gray-300">
                  {item.is_completed ? <FaCheckSquare className="mr-2 text-green-400" /> : <FaRegSquare className="mr-2 text-yellow-400" />}
                  {item.text}
                </li>
              ))}
            </ul>
          </section>
        )}

        {isLoadingEntries && <p className="text-center text-gray-400 py-8">Loading diary entries...</p>}
        {errorLoadingEntries && <p className="text-center text-red-400 py-8">{errorLoadingEntries}</p>}
        
        {!isLoadingEntries && !errorLoadingEntries && entries.length > 0 && (
          <div className="space-y-8">
            {entries.map(entry => (
              <article key={entry.id} className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-xl rounded-lg">
                <header className="pb-3 border-b border-gray-700">
                  <div className="mb-3">
                    <p className="text-lg font-medium text-gray-400">
                      {isClient ? new Date(entry.entry_timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Loading date...'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {isClient ? `${new Date(entry.entry_timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute:'2-digit' })} (${( (Date.now() - new Date(entry.entry_timestamp).getTime()) / (1000 * 60 * 60) ).toFixed(1)} hours ago)` : 'Loading time...'}
                    </p>
                  </div>
                  <h2 className="text-2xl font-semibold text-sky-400">{entry.title}</h2>
                </header>
                <div className="prose prose-sm prose-invert max-w-none text-gray-300 mt-4 mb-4">
                  <p>{entry.summary}</p>
                </div>
                {entry.diary_action_items && entry.diary_action_items.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-200 mb-2">Action Items from this entry:</h4>
                    <ul className="space-y-1 list-inside">
                      {entry.diary_action_items.map(actionItem => (
                        <li key={actionItem.id} className="flex items-center justify-between text-sm text-gray-400 group">
                          <div onClick={() => toggleActionItem(actionItem.id)} className="flex items-center cursor-pointer flex-grow hover:text-gray-200">
                            {actionItem.is_completed ? <FaCheckSquare className="mr-2 text-green-400 flex-shrink-0" /> : <FaRegSquare className="mr-2 text-yellow-400 flex-shrink-0" />}
                            <span className={actionItem.is_completed ? 'line-through text-gray-500' : ''}>{actionItem.text}</span>
                          </div>
                          <button
                            disabled={actionItem.sent_to_wip_at !== null}
                            className="ml-3 px-2 py-1 text-xs bg-sky-700 hover:bg-sky-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed transition-opacity duration-150 opacity-0 group-hover:opacity-100 focus:opacity-100"
                          >
                            {actionItem.sent_to_wip_at ? 'Sent' : 'Send to WIP'}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
        {!isLoadingEntries && !errorLoadingEntries && entries.length === 0 && (
          <p className="text-gray-500 italic text-center py-8">No diary entries yet. Click "Add New Diary Entry" to create the first one!</p>
        )}

      </main>

      {showAddEntryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-gray-850 p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-2xl border border-gray-700 my-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-white">Add New Diary Entry</h2>
              <button onClick={() => setShowAddEntryModal(false)} className="text-gray-400 hover:text-gray-200" disabled={isSubmittingEntry}>
                <FaTimes size={20} />
              </button>
            </div>
            <form onSubmit={handleAddEntryModalSubmit}>
              <div className="mb-4">
                <label htmlFor="newEntryTitle" className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                <input 
                  type="text" 
                  id="newEntryTitle"
                  value={newEntryTitle}
                  onChange={(e) => setNewEntryTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="newEntrySummary" className="block text-sm font-medium text-gray-300 mb-1">Summary (Your Narrative)</label>
                <textarea 
                  id="newEntrySummary"
                  value={newEntrySummary}
                  onChange={(e) => setNewEntrySummary(e.target.value)}
                  required
                  rows={5}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
                  placeholder="Describe the discussion, decisions, and context..."
                />
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-200 mb-2">Action Items</h3>
                {newEntryActionItemTexts.map((text, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input 
                      type="text"
                      value={text}
                      onChange={(e) => handleActionItemTextChange(index, e.target.value)}
                      placeholder={`Action Item ${index + 1}`}
                      className="flex-grow px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-200 focus:ring-1 focus:ring-sky-500 focus:border-sky-500 outline-none text-sm"
                    />
                    {newEntryActionItemTexts.length > 1 && (
                      <button 
                        type="button"
                        onClick={() => removeActionItemInput(index)}
                        className="p-2 text-red-500 hover:text-red-400"
                        aria-label="Remove Action Item"
                      >
                        <FaTrash />
                      </button>
                    )}
                  </div>
                ))}
                <button 
                  type="button"
                  onClick={addActionItemInput}
                  className="mt-1 text-sm text-sky-400 hover:text-sky-300 inline-flex items-center"
                >
                  <FaPlusCircle className="mr-1.5" /> Add Action Item
                </button>
              </div>
              
              <div className="flex justify-end space-x-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowAddEntryModal(false)} 
                  disabled={isSubmittingEntry}
                  className="px-4 py-2 text-sm font-medium text-gray-300 bg-gray-700 hover:bg-gray-600 rounded-md transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmittingEntry || !newEntryTitle.trim() || !newEntrySummary.trim()}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-500 rounded-md transition-colors disabled:opacity-50"
                >
                  {isSubmittingEntry ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 