'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaArrowLeft, FaPlusCircle, FaRegSquare, FaCheckSquare } from 'react-icons/fa';

interface ActionItem {
  id: string;
  text: string;
  completed: boolean;
}

interface DiaryEntry {
  id: string;
  timestamp: string;
  title: string;
  summary: string;
  actionItems?: ActionItem[];
}

const initialSampleDiaryEntries: DiaryEntry[] = [
  {
    id: 'entry2',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // Approx 1 hour ago
    title: 'Studio Page Security & Middleware',
    summary: 'User emphasized the private nature of the /studio and its sub-pages. Implemented Next.js middleware to protect these routes, redirecting unauthenticated users to a new /login page. Updated RLS policies for b0ase_tasks to remove anonymous read access.',
    actionItems: [
      { id: 'da_sql', text: 'User to run SQL to update RLS for b0ase_tasks table', completed: true },
      { id: 'da_loginpage', text: 'Create basic /login page', completed: true },
      { id: 'da_middleware', text: 'Create middleware.ts for route protection', completed: true },
    ],
  },
  {
    id: 'entry1',
    timestamp: new Date().toISOString(), // Current time
    title: 'Diary Page Concept & Studio Reordering',
    summary: 'Discussed the new ordering for /studio cards (Diary, WIP, Calendar first). User wants the Diary page to be a log of AI-User interactions, decisions, and action items, updated by the AI. This entry is the first example!',
    actionItems: [
      { id: 'da_studioreorder', text: 'Reorder cards on /studio page', completed: true },
      { id: 'da_diarymvp', text: 'Create initial static Diary page structure', completed: false },
      { id: 'da_diarydb', text: 'Plan database table for Diary entries', completed: false },
    ],
  },
];

export default function DiaryPage() {
  const [entries, setEntries] = useState<DiaryEntry[]>(initialSampleDiaryEntries);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Function to toggle action item completion (visual only for now)
  const toggleActionItem = (entryId: string, actionItemId: string) => {
    setEntries(prevEntries =>
      prevEntries.map(entry =>
        entry.id === entryId
          ? {
              ...entry,
              actionItems: entry.actionItems?.map(item =>
                item.id === actionItemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : entry
      )
    );
  };

  const allActionItems = entries.reduce((acc, entry) => {
    if (entry.actionItems) {
      acc.push(...entry.actionItems);
    }
    return acc;
  }, [] as ActionItem[]);

  const outstandingActionItems = allActionItems.filter(item => !item.completed);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        <div className="mb-8 flex justify-between items-center">
          <Link href="/studio" className="inline-flex items-center text-sky-400 hover:text-sky-300 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Studio
          </Link>
          <button 
            // onClick={handleAddNewEntry} // TODO: Implement this later
            disabled // Disabled until DB backend is ready
            className="inline-flex items-center bg-green-600 hover:bg-green-500 text-white font-medium py-2 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaPlusCircle className="mr-2" />
            Add New Diary Entry
          </button>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">Our Collaborative Diary</h1>

        {/* Consolidated Action Items Section */}
        {outstandingActionItems.length > 0 && (
          <section className="mb-10 p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-amber-400 mb-4">Action Items Hotlist ({outstandingActionItems.length} outstanding)</h2>
            <ul className="space-y-2">
              {outstandingActionItems.map(item => (
                <li key={item.id} className="flex items-center text-gray-300">
                  {/* This click won't work as toggle is per entry, but shows concept */}
                  {item.completed ? <FaCheckSquare className="mr-2 text-green-400" /> : <FaRegSquare className="mr-2 text-yellow-400" />}
                  {item.text}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Diary Entries Section */}
        <div className="space-y-8">
          {entries.length > 0 ? (
            entries.sort((a,b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).map(entry => (
              <article key={entry.id} className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-xl rounded-lg">
                <header className="mb-3 pb-3 border-b border-gray-700">
                  <h2 className="text-2xl font-semibold text-sky-400">{entry.title}</h2>
                  <p className="text-xs text-gray-500">
                    {isClient ? 
                      `${new Date(entry.timestamp).toLocaleString()} (${( (Date.now() - new Date(entry.timestamp).getTime()) / (1000 * 60 * 60) ).toFixed(1)} hours ago)`
                      : 'Loading date...' /* Or render nothing, or a placeholder */ 
                    }
                  </p>
                </header>
                <div className="prose prose-sm prose-invert max-w-none text-gray-300 mb-4">
                  <p>{entry.summary}</p>
                </div>
                {entry.actionItems && entry.actionItems.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-semibold text-gray-200 mb-2">Action Items from this entry:</h4>
                    <ul className="space-y-1 list-inside">
                      {entry.actionItems.map(actionItem => (
                        <li key={actionItem.id} 
                            className="flex items-center text-sm text-gray-400 cursor-pointer hover:text-gray-200"
                            onClick={() => toggleActionItem(entry.id, actionItem.id)}
                        >
                          {actionItem.completed ? 
                            <FaCheckSquare className="mr-2 text-green-400 flex-shrink-0" /> : 
                            <FaRegSquare className="mr-2 text-yellow-400 flex-shrink-0" />}
                          <span className={actionItem.completed ? 'line-through text-gray-500' : ''}>{actionItem.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))
          ) : (
            <p className="text-gray-500 italic text-center py-8">No diary entries yet. Start a discussion to create the first one!</p>
          )}
        </div>

      </main>
    </div>
  );
} 