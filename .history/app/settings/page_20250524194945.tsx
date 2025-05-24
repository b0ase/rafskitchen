'use client';

import React from 'react';
import Link from 'next/link';
import { FaCog, FaUser, FaBell, FaShieldAlt, FaPalette, FaDatabase, FaKey, FaGlobe } from 'react-icons/fa';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-600">//</span> Settings</h1>
        <p className="text-xl text-gray-700 max-w-4xl">
          Manage your account preferences, security settings, and platform configuration.
        </p>
      </header>

      {/* Settings Categories */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-gray-200 shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
              <FaUser className="text-cyan-600 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Profile Settings</h3>
            </div>
            <p className="text-gray-600 mb-4">Update your personal information, avatar, and bio.</p>
            <Link
              href="/profile"
              className="inline-flex items-center text-cyan-600 hover:text-cyan-700 font-medium"
            >
              Manage Profile →
            </Link>
          </div>

          <div className="bg-white p-6 border border-gray-200 shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-gray-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-700">Security</h3>
            </div>
            <p className="text-gray-600 mb-4">Manage passwords, two-factor authentication, and login sessions.</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>

          <div className="bg-white p-6 border border-gray-200 shadow-lg rounded-lg">
            <div className="flex items-center mb-4">
              <FaBell className="text-gray-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl text-gray-700">Notifications</h3>
            </div>
            <p className="text-gray-600 mb-4">Configure email, push, and in-app notification preferences.</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </section>

      {/* Platform Settings */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-50 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Platform Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">Theme & Appearance</h3>
            <p className="text-gray-600 mb-4">Customize the look and feel of your dashboard</p>
            <div className="text-gray-500 text-sm">
              Currently: Light Theme
            </div>
          </div>

          <div className="p-6 border-l-2 border-gray-300">
            <h3 className="font-bold text-xl mb-2 text-gray-700">Language & Region</h3>
            <p className="text-gray-600 mb-4">Set your preferred language and regional settings</p>
            <div className="text-gray-500 text-sm">
              Currently: English (US)
            </div>
          </div>

          <div className="p-6 border-l-2 border-gray-300">
            <h3 className="font-bold text-xl mb-2 text-gray-700">Data & Privacy</h3>
            <p className="text-gray-600 mb-4">Manage your data preferences and privacy settings</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>

          <div className="p-6 border-l-2 border-gray-300">
            <h3 className="font-bold text-xl mb-2 text-gray-700">API Access</h3>
            <p className="text-gray-600 mb-4">Generate and manage API keys for integrations</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </section>

      {/* Integration Settings */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Integrations</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FaDatabase className="text-cyan-600 mr-3 text-xl" />
              <h3 className="font-bold text-lg">Database</h3>
            </div>
            <p className="text-gray-600 mb-4">Supabase connection and data management</p>
            <div className="text-green-600 text-sm font-medium">
              ✓ Connected
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FaGlobe className="text-gray-400 mr-3 text-xl" />
              <h3 className="font-bold text-lg text-gray-700">External APIs</h3>
            </div>
            <p className="text-gray-600 mb-4">Third-party service integrations</p>
            <div className="text-gray-500 text-sm">
              Not Connected
            </div>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <div className="flex items-center mb-4">
              <FaKey className="text-gray-400 mr-3 text-xl" />
              <h3 className="font-bold text-lg text-gray-700">Webhooks</h3>
            </div>
            <p className="text-gray-600 mb-4">Configure webhook endpoints</p>
            <div className="text-gray-500 text-sm">
              Coming Soon
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Account Management</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <Link href="/profile" className="hover:text-cyan-600">Edit Profile</Link></li>
              <li>• <Link href="/teams" className="hover:text-cyan-600">Manage Teams</Link></li>
              <li>• <Link href="/projects" className="hover:text-cyan-600">Project Settings</Link></li>
              <li>• <span className="text-gray-500">Change Password (Coming Soon)</span></li>
            </ul>
          </div>

          <div className="bg-white border border-gray-200 shadow-lg p-6">
            <h3 className="font-bold text-xl mb-4 text-cyan-600">Platform Features</h3>
            <ul className="space-y-2 text-gray-700">
              <li>• <Link href="/tokens" className="hover:text-cyan-600">Token Settings</Link></li>
              <li>• <Link href="/finances" className="hover:text-cyan-600">Financial Preferences</Link></li>
              <li>• <Link href="/diary" className="hover:text-cyan-600">Diary Configuration</Link></li>
              <li>• <Link href="/workinprogress" className="hover:text-cyan-600">Task Management</Link></li>
            </ul>
          </div>
        </div>
      </section>

      {/* Advanced Settings */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-red-50 border border-red-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-red-800">Advanced Settings</h2>
        <div className="space-y-4">
          <div className="p-4 border-l-2 border-red-500">
            <h3 className="font-bold text-lg text-red-800 mb-2">Export Data</h3>
            <p className="text-red-700 mb-4">Download all your data in a portable format</p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm">
              Request Data Export
            </button>
          </div>

          <div className="p-4 border-l-2 border-red-500">
            <h3 className="font-bold text-lg text-red-800 mb-2">Delete Account</h3>
            <p className="text-red-700 mb-4">Permanently delete your account and all associated data</p>
            <button className="px-4 py-2 bg-red-700 text-white rounded-md hover:bg-red-800 transition-colors text-sm">
              Delete Account
            </button>
          </div>
        </div>
      </section>

      {/* Demo Notice */}
      <section className="px-4 md:px-8 py-16 text-center mb-12">
        <div className="max-w-4xl mx-auto bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Demo Mode</h3>
          <p className="text-yellow-700 mb-4">
            You're viewing a demo version of the settings page. In the full version, you would have access to:
          </p>
          <ul className="text-yellow-700 text-sm space-y-1 mb-4">
            <li>• Complete security and privacy controls</li>
            <li>• Advanced notification management</li>
            <li>• Full API key and webhook configuration</li>
            <li>• Theme customization and personalization</li>
            <li>• Data export and account management tools</li>
          </ul>
          <Link
            href="/"
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors font-medium"
          >
            ← Back to Home
          </Link>
        </div>
      </section>
    </div>
  );
} 