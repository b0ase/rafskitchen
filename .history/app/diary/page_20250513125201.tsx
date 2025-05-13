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
    title: 'Securing the Studio & Defining the Login Flow',
    summary: 'The critical need for privacy in the /studio workspace was top of mind. We discussed how all pages linked from the Studio (like Diary, WIP, Finances) are personal and must not be public. To address this, we first secured the b0ase_tasks database table by updating its Row Level Security policies to prevent anonymous access. Then, we implemented Next.js middleware. This middleware now intercepts requests to protected studio routes, checks for an active session, and redirects any unauthenticated users to a newly created /login page. This page currently serves as a placeholder, clearly stating that login is required, and will be the future home for the Google Sign-In functionality.',
    actionItems: [
      { id: 'da_sql', text: 'User ran SQL to update RLS for b0ase_tasks table', completed: true },
      { id: 'da_loginpage', text: 'Created basic /login page placeholder', completed: true },
      { id: 'da_middleware', text: 'Created middleware.ts for route protection and /login redirect', completed: true },
    ],
  },
  {
    id: 'entry1',
    timestamp: new Date().toISOString(), // Current time
    title: 'Conceptualizing the Diary & Refining Studio Workflow',
    summary: 'The vision for the Studio page evolved, with a new emphasis on a specific workflow: Diary first, then Work In Progress, then Calendar. This reflects a daily rhythm of discussing ideas (captured in the Diary by me, the AI), translating those into actionable tasks (in WIP), and then planning their execution (in Calendar). The Diary itself is envisioned not just as a log, but as my narrative of our collaborations – a space where I reflect back on your expressed thoughts, our discussions about the b0ase.com project, and the evolution of our work. This very entry is an example of that style, aiming to capture the \'why\' behind the tasks.',
    actionItems: [
      { id: 'da_studioreorder', text: 'Reordered cards on /studio page (Diary, WIP, Calendar first)', completed: true },
      { id: 'da_diarymvp', text: 'Created initial static Diary page with new narrative style', completed: true }, // Assuming this change counts as completing the MVP structure
      { id: 'da_diarydb', text: 'Next: Plan database table for Diary entries to make it dynamic', completed: false },
      { id: 'da_hydrationfix', text: 'Fixed Next.js hydration error for dates on Diary page', completed: true },
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

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">Diary</h1>

        {/* Quick Navigation Links to WIP and Calendar */}
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { 
              href: '/workinprogress', 
              title: 'Work In Progress', 
              description: 'View and manage current tasks and project statuses.', 
              bgColor: 'bg-purple-700/30', // Example color, can be adjusted
              hoverBgColor: 'hover:bg-purple-600/40',
              borderColor: 'border-purple-600/50',
              titleColor: 'text-purple-300'
            },
            { 
              href: '/gigs/calendar', 
              title: 'Calendar', 
              description: 'Check deadlines, scheduled learning, and important dates.',
              bgColor: 'bg-teal-700/30', // Example color, can be adjusted
              hoverBgColor: 'hover:bg-teal-600/40',
              borderColor: 'border-teal-600/50',
              titleColor: 'text-teal-300'
            },
          ].map((card) => (
            <Link 
              key={card.href} 
              href={card.href} 
              className={`block p-6 border shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1 group ${card.bgColor} ${card.hoverBgColor} ${card.borderColor}`}
            >
              <h3 className={`text-xl font-semibold mb-2 group-hover:text-white ${card.titleColor}`}>{card.title}</h3>
              <p className="text-sm text-gray-400 group-hover:text-gray-300">{card.description}</p>
            </Link>
          ))}
        </div>

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
                <header className="pb-3 border-b border-gray-700">
                  <div className="mb-3">
                    <p className="text-lg font-medium text-gray-400">
                      {isClient ? 
                        new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) 
                        : 'Loading date...' 
                      }
                    </p>
                    <p className="text-sm text-gray-500">
                      {isClient ? 
                        `${new Date(entry.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute:'2-digit' })} (${( (Date.now() - new Date(entry.timestamp).getTime()) / (1000 * 60 * 60) ).toFixed(1)} hours ago)`
                        : 'Loading time...'
                      }
                    </p>
                  </div>
                  <h2 className="text-2xl font-semibold text-sky-400">{entry.title}</h2>
                </header>
                <div className="prose prose-sm prose-invert max-w-none text-gray-300 mt-4 mb-4">
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