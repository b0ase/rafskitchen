'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaUserCircle, FaProjectDiagram, FaUsers, FaPlusCircle, FaCubes, FaExternalLinkAlt } from 'react-icons/fa';

// Dummy data - replace with actual data fetching
interface Project {
  id: string;
  name: string;
  hasToken: boolean;
  tokenSymbol?: string;
}

interface Team {
  id: string;
  name: string;
  hasToken: boolean;
  tokenSymbol?: string;
}

const MyTokenPage = () => {
  const [userProfile, setUserProfile] = useState({ hasToken: false, tokenSymbol: '' });
  const [projects, setProjects] = useState<Project[]>([
    { id: 'proj1', name: 'Project Alpha', hasToken: true, tokenSymbol: 'ALPHA' },
    { id: 'proj2', name: 'Project Beta', hasToken: false },
  ]);
  const [teams, setTeams] = useState<Team[]>([
    { id: 'team1', name: 'Team Innovate', hasToken: false },
  ]);

  // TODO: Fetch actual user profile, projects, and teams data

  return (
    <div className="space-y-12 p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-white mb-8 flex items-center">
        <FaCubes className="mr-3 text-sky-500" /> My Tokens Dashboard
      </h1>

      {/* Profile Token Section */}
      <section className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
          <FaUserCircle className="mr-2 text-sky-400" /> Profile Token
        </h2>
        {userProfile.hasToken ? (
          <div>
            <p className="text-gray-300 mb-2">Your profile token <span className="font-semibold text-sky-400">(${userProfile.tokenSymbol})</span> is active.</p>
            <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm transition-colors">
              Manage Profile Token
            </button>
          </div>
        ) : (
          <div>
            <p className="text-gray-300 mb-3">You haven't launched a profile token yet.</p>
            <button className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors">
              <FaPlusCircle className="mr-2" /> Launch Profile Token
            </button>
          </div>
        )}
      </section>

      {/* Project Tokens Section */}
      <section className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
          <FaProjectDiagram className="mr-2 text-sky-400" /> Project Tokens
        </h2>
        {projects.length > 0 ? (
          <ul className="space-y-4">
            {projects.map((project) => (
              <li key={project.id} className="p-4 bg-gray-750 rounded-md border border-gray-600 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-white">{project.name}</h3>
                  {project.hasToken && project.tokenSymbol && (
                    <p className="text-xs text-sky-400">Token: ${project.tokenSymbol}</p>
                  )}
                </div>
                {project.hasToken ? (
                  <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs transition-colors">
                    Manage Token
                  </button>
                ) : (
                  <button className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs transition-colors">
                    <FaPlusCircle className="mr-1.5" /> Launch Token
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">You are not associated with any projects yet. <Link href="/myprojects" className="text-sky-500 hover:underline">Create or join a project</Link>.</p>
        )}
         <div className="mt-6">
            <Link href="/myprojects" className="inline-flex items-center text-sm text-sky-500 hover:text-sky-400 transition-colors">
                Go to My Projects <FaExternalLinkAlt className="ml-1.5 w-3 h-3" />
            </Link>
        </div>
      </section>

      {/* Team Tokens Section */}
      <section className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-xl">
        <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
          <FaUsers className="mr-2 text-sky-400" /> Team Tokens
        </h2>
        {teams.length > 0 ? (
          <ul className="space-y-4">
            {teams.map((team) => (
              <li key={team.id} className="p-4 bg-gray-750 rounded-md border border-gray-600 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-medium text-white">{team.name}</h3>
                  {team.hasToken && team.tokenSymbol && (
                     <p className="text-xs text-sky-400">Token: ${team.tokenSymbol}</p>
                  )}
                </div>
                {team.hasToken ? (
                  <button className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs transition-colors">
                    Manage Token
                  </button>
                ) : (
                  <button className="inline-flex items-center px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-xs transition-colors">
                    <FaPlusCircle className="mr-1.5" /> Launch Token
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">You are not part of any teams yet. <Link href="/team" className="text-sky-500 hover:underline">Create or join a team</Link>.</p>
        )}
        <div className="mt-6">
            <Link href="/team" className="inline-flex items-center text-sm text-sky-500 hover:text-sky-400 transition-colors">
                Go to My Teams <FaExternalLinkAlt className="ml-1.5 w-3 h-3" />
            </Link>
        </div>
      </section>

    </div>
  );
};

export default MyTokenPage; 