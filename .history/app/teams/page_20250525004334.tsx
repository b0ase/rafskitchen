'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
      avatar: '/images/avatars/raf_profile.jpg',
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
    <div className="min-h-screen bg-white text-black p-4 sm:p-6 md:p-8">
      {/* Header Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg text-black mb-8">
        <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <FaUsers className="text-3xl text-black" />
              <div>
                <h1 className="text-3xl font-bold text-black">My Teams</h1>
                <p className="text-gray-600">Collaborate with other innovators and build amazing projects together</p>
              </div>
            </div>
            {/* Optional: Add a button here if needed, like "New Team" if not covered by quick actions */}
        </div>
      </div>

      <div className="mx-auto">
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link
            href="/teams/new"
            className="block bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center">
                <FaPlus className="text-2xl mr-4 text-blue-600 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-lg text-black">Create a Team</h3>
                  <p className="text-gray-600 text-sm">Start a new team and invite collaborators</p>
                </div>
            </div>
          </Link>
          
          <Link
            href="/teams/join"
            className="block bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow group"
          >
            <div className="flex items-center">
                <FaUserPlus className="text-2xl mr-4 text-green-600 group-hover:scale-110 transition-transform" />
                <div>
                  <h3 className="font-semibold text-lg text-black">Join a Team</h3>
                  <p className="text-gray-600 text-sm">Find and join existing teams</p>
                </div>
            </div>
          </Link>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockTeams.map((team) => (
            <div
              key={team.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all"
            >
              {/* Team Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <Image
                    src={team.avatar}
                    alt={team.name}
                    className="w-12 h-12 rounded-lg object-cover mr-3"
                    width={48}
                    height={48}
                  />
                  <div>
                    <h3 className="font-semibold text-lg text-black">{team.name}</h3>
                    <div className="flex items-center text-sm text-gray-600">
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
              <p className="text-gray-700 text-sm mb-4 line-clamp-2">
                {team.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {team.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Role Badge */}
              <div className="flex items-center justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  team.role === 'Owner' 
                    ? 'bg-yellow-100 text-yellow-800 border-yellow-200' 
                    : 'bg-blue-100 text-blue-800 border-blue-200'
                }`}>
                  {team.role}
                </span>
                
                <Link
                  href={`/teams/${team.id}`}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Team →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State or Additional Content */}
        <div className="mt-12 text-center">
          <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md mx-auto shadow-lg">
            <FaRocket className="text-4xl text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-black mb-2">Ready to Build?</h3>
            <p className="text-gray-600 text-sm mb-4">
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
                className="px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded-md text-sm font-medium transition-colors"
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