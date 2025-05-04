'use client';

import Link from 'next/link';
import { FaUsersCog } from 'react-icons/fa';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4 md:px-8">
      <h1 className="text-4xl font-bold mb-12 text-center">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        
        {/* Client Approvals Card */}
        <div className="bg-gradient-to-br from-blue-900/80 to-gray-900/80 rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
          <FaUsersCog size={40} className="mb-3 text-blue-400" />
          <h2 className="text-2xl font-semibold mb-2">Client Approvals</h2>
          <p className="text-gray-300 mb-5 text-sm flex-grow">Review, approve, or reject new client sign-up requests.</p>
          <Link href="/admin/clients">
            <button className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg shadow transition-all">
              Manage Requests
            </button>
          </Link>
        </div>

        {/* User Management Card */}
        <div className="bg-gradient-to-br from-purple-900/80 to-gray-900/80 rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
          {/* Placeholder Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
          <h2 className="text-2xl font-semibold mb-2">User Management</h2>
          <p className="text-gray-300 mb-5 text-sm flex-grow">View and manage registered users and their roles.</p>
          <Link href="/admin/users">
            <button className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-6 rounded-lg shadow transition-all">
              Manage Users
            </button>
          </Link>
        </div>

        {/* Project Management Card */}
        <div className="bg-gradient-to-br from-green-900/80 to-gray-900/80 rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
           {/* Placeholder Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
          <h2 className="text-2xl font-semibold mb-2">Project Management</h2>
          <p className="text-gray-300 mb-5 text-sm flex-grow">View and manage client projects created through the platform.</p>
          <Link href="/admin/projects">
            <button className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow transition-all">
              Manage Projects
            </button>
          </Link>
        </div>

        {/* Website Settings Card */}
        <div className="bg-gradient-to-br from-yellow-900/80 to-gray-900/80 rounded-xl shadow-lg p-6 flex flex-col items-center text-center">
           {/* Placeholder Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          <h2 className="text-2xl font-semibold mb-2">Website Settings</h2>
          <p className="text-gray-300 mb-5 text-sm flex-grow">Configure global site settings, integrations, or themes.</p>
          <Link href="/admin/settings">
            <button className="w-full bg-yellow-700 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg shadow transition-all">
              Configure Settings
            </button>
          </Link>
        </div>

         {/* Analytics Overview Card - Kept Simple */}
        <div className="bg-gradient-to-br from-red-900/80 to-gray-900/80 rounded-xl shadow-lg p-6 flex flex-col items-center text-center md:col-span-2">
           {/* Placeholder Icon */}
           <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mb-3 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
          <h2 className="text-2xl font-semibold mb-2">Analytics Overview</h2>
          <p className="text-gray-300 mb-5 text-sm flex-grow">View key website metrics and performance indicators.</p>
          <Link href="/admin/analytics">
            <button className="w-full max-w-xs bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow transition-all">
              View Analytics
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
} 