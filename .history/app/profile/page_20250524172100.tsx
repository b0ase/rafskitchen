'use client';

import React from 'react';
import Link from 'next/link';
import { FaRocket, FaUser, FaEnvelope, FaGithub, FaLinkedin, FaTwitter, FaEdit, FaCog } from 'react-icons/fa';

export default function ProfilePage() {
  // Mock user data for demo
  const mockUser = {
    name: 'Demo User',
    email: 'demo@rafskitchen.website',
    username: 'demo-user',
    bio: 'Welcome to your RafsKitchen dashboard! This is a demo profile showing what your personalized workspace would look like.',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    joinedDate: 'January 2024',
    projects: 3,
    teams: 2
  };

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <div className="bg-blue-600 text-white py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4">
            <img
              src={mockUser.avatar}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white"
            />
            <div>
              <h1 className="text-3xl font-bold">{mockUser.name}</h1>
              <p className="text-blue-100">@{mockUser.username}</p>
              <p className="text-blue-100">{mockUser.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Projects</h3>
            <p className="text-3xl font-bold text-blue-600">{mockUser.projects}</p>
            <p className="text-gray-600 text-sm">Active projects</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Teams</h3>
            <p className="text-3xl font-bold text-green-600">{mockUser.teams}</p>
            <p className="text-gray-600 text-sm">Team memberships</p>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Member Since</h3>
            <p className="text-lg font-semibold text-purple-600">{mockUser.joinedDate}</p>
            <p className="text-gray-600 text-sm">Join date</p>
          </div>
        </div>

        {/* Profile Info */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm mb-8">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-900">About</h2>
            <button className="text-blue-600 hover:text-blue-800 flex items-center">
              <FaEdit className="mr-2" />
              Edit Profile
            </button>
          </div>
          <p className="text-gray-700 mb-4">{mockUser.bio}</p>
          
          {/* Social Links */}
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <FaGithub size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <FaLinkedin size={20} />
            </a>
            <a href="#" className="text-gray-600 hover:text-blue-600">
              <FaTwitter size={20} />
            </a>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                href="/myprojects"
                className="block w-full text-left px-4 py-2 text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
              >
                View My Projects
              </Link>
              <Link
                href="/studio"
                className="block w-full text-left px-4 py-2 text-green-600 bg-green-50 rounded-md hover:bg-green-100 transition-colors"
              >
                Studio Dashboard
              </Link>
              <Link
                href="/token"
                className="block w-full text-left px-4 py-2 text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors"
              >
                $RAFS Token
              </Link>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <span>Joined RafsKitchen platform</span>
              </div>
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <span>Profile created successfully</span>
              </div>
              <div className="flex items-center text-gray-600">
                <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                <span>Demo mode activated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Demo Mode</h3>
          <p className="text-yellow-700">
            You're currently viewing a demo version of the RafsKitchen dashboard. 
            All functionality is simulated for demonstration purposes. In the full version, 
            you would be able to manage real projects, collaborate with teams, and access 
            all platform features.
          </p>
          <div className="mt-4">
            <Link
              href="/"
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}