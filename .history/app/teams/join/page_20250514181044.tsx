'use client';

import React from 'react';
import { FaUsers, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaUserPlus } from 'react-icons/fa';

interface Team {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

const mockTeams: Team[] = [
  { 
    id: '1', 
    name: 'Database Monsters', 
    description: 'Wrangling data and taming wild queries with monstrous skill!', 
    icon: FaDatabase,
    bgColor: 'bg-red-700',
    textColor: 'text-red-100',
    borderColor: 'border-red-500',
  },
  { 
    id: '2', 
    name: 'Frontend Freaks', 
    description: 'Crafting pixel-perfect UIs with a touch of delightful madness!', 
    icon: FaPalette,
    bgColor: 'bg-green-700',
    textColor: 'text-green-100',
    borderColor: 'border-green-500',
  },
  { 
    id: '3', 
    name: 'API Avengers', 
    description: 'Assembling robust backends and connecting the digital universe!', 
    icon: FaBolt,
    bgColor: 'bg-blue-700',
    textColor: 'text-blue-100',
    borderColor: 'border-blue-500',
  },
  { 
    id: '4', 
    name: 'Cloud Commanders', 
    description: 'Orchestrating services and scaling to infinity... and beyond!', 
    icon: FaCloud,
    bgColor: 'bg-purple-700',
    textColor: 'text-purple-100',
    borderColor: 'border-purple-500',
  },
  { 
    id: '5', 
    name: 'UX Unicorns', 
    description: 'Making apps magically intuitive and delightful for every user.', 
    icon: FaLightbulb, // Using FaLightbulb as a stand-in for a Unicorn icon
    bgColor: 'bg-pink-700',
    textColor: 'text-pink-100',
    borderColor: 'border-pink-500',
  },
  { 
    id: '6', 
    name: 'AI Alchemists', 
    description: 'Transmuting raw data into intelligent gold with arcane algorithms.', 
    icon: FaBrain,
    bgColor: 'bg-yellow-600', // Adjusted for better contrast potentially
    textColor: 'text-yellow-100',
    borderColor: 'border-yellow-400',
  },
];

export default function JoinTeamPage() {
  const handleJoinTeam = (teamName: string) => {
    console.log(`Attempting to join team: ${teamName}`);
    // Placeholder for actual join logic
    alert(`You've clicked to join ${teamName}! Functionality coming soon.`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <header className="text-center mb-16">
        <FaUsers className="mx-auto text-6xl text-sky-500 mb-6" />
        <h1 className="text-5xl font-extrabold text-white tracking-tight">
          Find Your <span className="text-sky-400">Squad!</span>
        </h1>
        <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto">
          Join one of our elite teams and start collaborating on amazing projects. 
          Each team has a unique focus and a vibrant community.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {mockTeams.map((team) => {
          const IconComponent = team.icon;
          return (
            <div 
              key={team.id} 
              className={`rounded-xl shadow-2xl p-8 flex flex-col justify-between border-2 transition-all duration-300 ease-in-out hover:shadow-sky-500/50 hover:scale-105 ${team.bgColor} ${team.borderColor}`}
            >
              <div>
                <IconComponent className={`text-5xl mb-6 ${team.textColor} opacity-80`} />
                <h2 className={`text-3xl font-bold mb-3 ${team.textColor}`}>{team.name}</h2>
                <p className={`text-md mb-8 ${team.textColor} opacity-90 min-h-[60px]`}>{team.description}</p>
              </div>
              <button
                onClick={() => handleJoinTeam(team.name)}
                className={`w-full mt-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors duration-150
                            bg-white text-gray-800 hover:bg-gray-200 focus:ring-sky-400
                            dark:bg-gray-200 dark:text-gray-900 dark:hover:bg-gray-300 dark:focus:ring-sky-500`} // Example button styling
              >
                <FaUserPlus className="mr-2 -ml-1 h-5 w-5" />
                Join {team.name}
              </button>
            </div>
          );
        })}
      </div>

      <footer className="text-center mt-20 text-gray-500">
        <p>&copy; {new Date().getFullYear()} b0ase.com - Let's build something incredible together.</p>
      </footer>
    </div>
  );
} 