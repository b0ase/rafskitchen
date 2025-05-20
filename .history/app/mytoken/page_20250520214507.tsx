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
  const [projects, setProjects] = useState<Project[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);

  // TODO: Fetch actual user profile, projects, and teams data
  // TODO: Implement wallet connection logic

  return (
    <div className="space-y-12 p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 md:mb-0 flex items-center">
          <FaCubes className="mr-3 text-sky-500" /> My Tokens Dashboard
        </h1>
        <button 
          className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-base font-medium transition-colors flex items-center"
          // onClick={handleConnectWallet} // TODO: Add connect wallet handler
        >
          Connect Wallet
        </button>
      </div>

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
          <div className="text-center py-4">
            <FaProjectDiagram className="mx-auto text-3xl text-gray-500 mb-3" />
            <p className="text-gray-400 mb-2">
              When you create or join projects, you'll be able to launch and manage their dedicated tokens from this section. 
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Project tokens can represent equity, utility, or rewards within your project's ecosystem.
            </p>
            <Link href="/myprojects" className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm transition-colors">
              Go to My Projects <FaExternalLinkAlt className="ml-2 w-3 h-3" />
            </Link>
          </div>
        )}
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
          <div className="text-center py-4">
            <FaUsers className="mx-auto text-3xl text-gray-500 mb-3" />
            <p className="text-gray-400 mb-2">
              Once you form or become part of a team, this area will allow you to launch and manage your team's token.
            </p>
            <p className="text-sm text-gray-500 mb-4">
              Team tokens can be used for governance, shared resources, or collaborative incentives.
            </p>
            <Link href="/team" className="inline-flex items-center px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-md text-sm transition-colors">
              Go to My Teams <FaExternalLinkAlt className="ml-2 w-3 h-3" />
            </Link>
          </div>
        )}
      </section>

    </div>
  );
};

export default MyTokenPage; 