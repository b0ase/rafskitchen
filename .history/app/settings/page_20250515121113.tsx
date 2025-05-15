'use client';

import React from 'react';

export default function SettingsPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-slate-800 shadow-xl rounded-lg p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-6 border-b border-slate-700 pb-4">
          Settings
        </h1>
        
        <div className="space-y-8">
          {/* Placeholder for Account Settings */}
          <section>
            <h2 className="text-xl font-semibold text-sky-300 mb-3">Account</h2>
            <div className="bg-slate-700/50 p-4 rounded-md border border-slate-600">
              <p className="text-gray-300">Manage your account details, password, and email preferences here.</p>
              {/* Example Form Field (non-functional) */}
              <div className="mt-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  disabled 
                  placeholder="user@example.com" 
                  className="mt-1 block w-full bg-slate-600 border-slate-500 rounded-md shadow-sm py-2 px-3 text-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm cursor-not-allowed" 
                />
              </div>
            </div>
          </section>

          {/* Placeholder for Profile Settings */}
          <section>
            <h2 className="text-xl font-semibold text-sky-300 mb-3">Profile Customization</h2>
            <div className="bg-slate-700/50 p-4 rounded-md border border-slate-600">
              <p className="text-gray-300">Update your public profile information, avatar, and social links.</p>
               <button 
                  type="button"
                  disabled
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800 cursor-not-allowed opacity-70"
                >
                  Edit Profile (Coming Soon)
                </button>
            </div>
          </section>

          {/* Placeholder for Notification Settings */}
          <section>
            <h2 className="text-xl font-semibold text-sky-300 mb-3">Notifications</h2>
            <div className="bg-slate-700/50 p-4 rounded-md border border-slate-600">
              <p className="text-gray-300">Configure your notification preferences for projects, tasks, and messages.</p>
            </div>
          </section>

          {/* Placeholder for Theme/Appearance Settings */}
          <section>
            <h2 className="text-xl font-semibold text-sky-300 mb-3">Appearance</h2>
            <div className="bg-slate-700/50 p-4 rounded-md border border-slate-600">
              <p className="text-gray-300">Choose your preferred theme (Light/Dark) and other display settings.</p>
            </div>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-700 text-center">
          <p className="text-sm text-gray-500">More settings will be available soon.</p>
        </div>
      </div>
    </div>
  );
} 