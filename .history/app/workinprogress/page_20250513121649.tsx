'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowLeft } from 'react-icons/fa'; // Using react-icons for the back arrow

export default function WorkInProgressPage() {
  // Placeholder for actual action items - you'll replace these with dynamic data later
  const boaseActionItems = [
    { id: 'bp_nav', text: 'Finalize Main Navigation (Header/Footer content & structure)', status: 'PARTIAL' },
    { id: 'bp_studio_color', text: 'Resolve Studio Links Color Issue (Tailwind JIT)', status: 'ISSUE' },
    { id: 'bp_fin_overview', text: 'Complete Financial Overview Page (replace dummy data, full Open Banking)', status: 'PARTIAL' },
    { id: 'bp_google_auth', text: 'Implement General Google Authentication', status: 'TO_DO' },
    { id: 'bp_sheets_api', text: 'Integrate Google Sheets API for Finances', status: 'TO_DO' },
    { id: 'bp_schedule_modal', text: 'Develop Editable Daily Schedule Modal for Work Path', status: 'TO_DO' },
    { id: 'bp_gigs_calendar', text: 'Build Gigs Calendar Page functionality', status: 'PLANNED' },
    { id: 'bp_fiverr_explorer', text: 'Develop Fiverr Explorer Page functionality', status: 'PLANNED' },
  ];

  const otherActionItems = [
    { id: 'o1', text: 'NinjaPunkGirls.com - Complete character design for Void', status: 'IN_PROGRESS' },
    { id: 'o2', text: 'Miss Void Website - Finalize homepage copy', status: 'TO_DO' },
    { id: 'o3', text: 'Client X - Send revised proposal', status: 'DONE' },
  ];

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
        <div className="mb-8">
          <Link href="/studio" className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors">
            <FaArrowLeft className="mr-2" />
            Back to Studio
          </Link>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-white mb-10 text-center">Work In Progress Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* B0ase.com Action List */}
          <section className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-xl flex flex-col">
            <Link 
              href="/b0aseblueprint" 
              className="block bg-gray-800 hover:bg-gray-700 p-6 border border-gray-700 shadow-md transition-colors group text-center mb-6"
            >
              <h2 className={`text-2xl font-semibold text-purple-400 group-hover:text-purple-300`}>
                b0ase.com Blueprint
              </h2>
            </Link>
            <div className="space-y-3 flex-grow">
              {boaseActionItems.length > 0 ? (
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
                <p className="text-gray-500 italic text-center py-4">No b0ase.com tasks currently listed.</p>
              )}
            </div>
            {/* Placeholder for adding new b0ase tasks */}
            <button className="mt-6 w-full bg-purple-600 hover:bg-purple-500 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Add b0ase.com Task
            </button>
          </section>

          {/* Other Action List */}
          <section className="bg-gray-900 p-6 md:p-8 border border-gray-800 shadow-xl flex flex-col">
            <div 
              className="block bg-gray-800 p-6 border border-gray-700 shadow-md text-center mb-6"
            >
              <h2 className={`text-2xl font-semibold text-teal-400`}>
                Other
              </h2>
            </div>
            <div className="space-y-3 flex-grow">
              {otherActionItems.length > 0 ? (
                otherActionItems.map(item => (
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
                <p className="text-gray-500 italic text-center py-4">No other tasks currently listed.</p>
              )}
            </div>
            {/* Placeholder for adding new other tasks */}
            <button className="mt-6 w-full bg-teal-600 hover:bg-teal-500 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Add Other Task
            </button>
          </section>
        </div>
      </main>
    </div>
  );
} 