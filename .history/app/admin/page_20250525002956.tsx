'use client';

import Link from 'next/link';
import { FaUsersCog, FaUserEdit, FaProjectDiagram, FaCogs, FaChartBar, FaShareSquare } from 'react-icons/fa';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4 md:px-8">
      <h1 className="text-5xl font-bold mb-16 text-center">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        
        {/* Client Approvals Card */}
        <div className="bg-gradient-to-br from-blue-900/90 to-gray-800/70 rounded-xl shadow-xl p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
          <FaUsersCog size={48} className="mb-4 text-blue-400" />
          <h2 className="text-2xl font-semibold mb-3">Client Approvals</h2>
          <p className="text-gray-300 mb-6 text-sm flex-grow px-2">Review, approve, or reject new client sign-up requests.</p>
          <Link href="/admin/clients" className="w-full mt-auto">
            <button className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150">
              Manage Requests
            </button>
          </Link>
        </div>

        {/* User Management Card */}
        <div className="bg-gradient-to-br from-purple-900/90 to-gray-800/70 rounded-xl shadow-xl p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
          <FaUserEdit size={48} className="mb-4 text-purple-400" />
          <h2 className="text-2xl font-semibold mb-3">User Management</h2>
          <p className="text-gray-300 mb-6 text-sm flex-grow px-2">View and manage registered users and their roles.</p>
          <Link href="/admin/users" className="w-full mt-auto">
            <button className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150">
              Manage Users
            </button>
          </Link>
        </div>

        {/* Project Management Card */}
        <div className="bg-gradient-to-br from-green-900/90 to-gray-800/70 rounded-xl shadow-xl p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
           <FaProjectDiagram size={48} className="mb-4 text-green-400" />
          <h2 className="text-2xl font-semibold mb-3">Project Management</h2>
          <p className="text-gray-300 mb-6 text-sm flex-grow px-2">View and manage client projects created through the platform.</p>
          <Link href="/admin/projects" className="w-full mt-auto">
            <button className="w-full bg-green-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150">
              Manage Projects
            </button>
          </Link>
        </div>

        {/* Website Settings Card */}
        <div className="bg-gradient-to-br from-yellow-800/90 to-gray-800/70 rounded-xl shadow-xl p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
           <FaCogs size={48} className="mb-4 text-yellow-400" />
          <h2 className="text-2xl font-semibold mb-3">Website Settings</h2>
          <p className="text-gray-300 mb-6 text-sm flex-grow px-2">Configure global site settings, integrations, or themes.</p>
          <Link href="/admin/settings" className="w-full mt-auto">
            <button className="w-full bg-yellow-600 hover:bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150">
              Configure Settings
            </button>
          </Link>
        </div>
        
        {/* Social Media Links Card - NEW */}
        <div className="bg-gradient-to-br from-teal-900/90 to-gray-800/70 rounded-xl shadow-xl p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
           <FaShareSquare size={48} className="mb-4 text-teal-400" />
          <h2 className="text-2xl font-semibold mb-3">Social Media Links</h2>
          <p className="text-gray-300 mb-6 text-sm flex-grow px-2">Manage the URLs for your social media profiles displayed on the site.</p>
          <Link href="/admin/socials" className="w-full mt-auto">
            <button className="w-full bg-teal-700 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150">
              Manage Socials
            </button>
          </Link>
        </div>

         {/* Analytics Overview Card */}
        <div className="bg-gradient-to-br from-red-900/90 to-gray-800/70 rounded-xl shadow-xl p-6 flex flex-col items-center text-center transform hover:scale-105 transition-transform duration-300">
           <FaChartBar size={48} className="mb-4 text-red-400" />
          <h2 className="text-2xl font-semibold mb-2">Analytics Overview</h2>
          <p className="text-gray-300 mb-5 text-sm flex-grow px-2">View key website metrics and performance indicators.</p>
          <Link href="/admin/analytics" className="w-full mt-auto">
            <button className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-150">
              View Analytics
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
} 