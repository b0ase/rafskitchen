'use client';

import React from 'react';
import Link from 'next/link';
import { FaUsers, FaPlus, FaUserPlus, FaCrown, FaRocket, FaCode, FaDesktop, FaCloud } from 'react-icons/fa';

export default function TeamsPage() {
  // Mock teams data
  const mockTeams = [
    {
      id: 1,
      name: 'RafsKitchen Core',
      description: 'Main development team working on platform features',
      members: 8,
      role: 'Owner',
      avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop&crop=faces',
      tags: ['Development', 'Core']
    },
    {
      id: 2,
      name: 'Blockchain Innovators',
      description: 'Specialized team focused on DeFi and tokenization projects',
      members: 5,
      role: 'Member',
      avatar: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&h=100&fit=crop&crop=center',
      tags: ['Blockchain', 'DeFi']
    },
    {
      id: 3,
      name: 'AI Research Lab',
      description: 'Cutting-edge AI and machine learning research team',
      members: 6,
      role: 'Member',
      avatar: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop&crop=center',
      tags: ['AI', 'Research']
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">My Teams</h1>
          <p className="text-gray-400">Collaborate with other innovators and build amazing projects together</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/teams/new"
            className="flex items-center p-6 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors group"
          >
            <FaPlus className="text-2xl mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-lg">Create a Team</h3>
              <p className="text-blue-100">Start a new team and invite collaborators</p>
            </div>
          </Link>
          
          <Link
            href="/teams/join"
            className="flex items-center p-6 bg-green-600 hover:bg-green-700 rounded-lg transition-colors group"
          >
            <FaUserPlus className="text-2xl mr-4 group-hover:scale-110 transition-transform" />
            <div>
              <h3 className="font-semibold text-lg">Join a Team</h3>
              <p className="text-green-100">Find and join existing teams</p>
            </div>
          </Link>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTeams.map((team) => (
            <div
              key={team.id}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-all hover:shadow-lg"
            >
              {/* Team Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <img
                    src={team.avatar}
                    alt={team.name}
                    className="w-12 h-12 rounded-lg object-cover mr-3"
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-white">{team.name}</h3>
                    <div className="flex items-center text-sm text-gray-400">
                      <FaUsers className="mr-1" />
                      {team.members} members
                    </div>
                  </div>
                </div>
                {team.role === 'Owner' && (
                  <FaCrown className="text-yellow-500 text-lg" title="Team Owner" />
                )}
              </div>

              {/* Team Description */}
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">
                {team.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {team.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-800 text-gray-300 text-xs rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Role Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  team.role === 'Owner' 
                    ? 'bg-yellow-900 text-yellow-300' 
                    : 'bg-blue-900 text-blue-300'
                }`}>
                  {team.role}
                </span>
                
                <Link
                  href={`/teams/${team.id}`}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium"
                >
                  View Team →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State or Additional Content */}
        <div className="mt-12 text-center">
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
            <FaRocket className="text-4xl text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-300 mb-2">Ready to Build?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Teams are where innovation happens. Join forces with other builders and create something amazing.
            </p>
            <div className="flex gap-2 justify-center">
              <Link
                href="/teams/new"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium transition-colors"
              >
                Create Team
              </Link>
              <Link
                href="/projects/new"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-md text-sm font-medium transition-colors"
              >
                Start Project
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 