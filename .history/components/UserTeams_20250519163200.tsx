'use client';

import React from 'react';
import Link from 'next/link';
import { FaUsers, FaQuestionCircle, FaSpinner, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain, FaHandshake } from 'react-icons/fa';

// Import or define necessary interfaces and iconMap
const iconMap: { [key: string]: React.ElementType } = {
  FaDatabase,
  FaPalette,
  FaBolt,
  FaCloud,
  FaLightbulb,
  FaBrain,
  FaUsers, // For a generic team icon
  FaQuestionCircle, // Default
  FaSpinner, // For loading states
};

interface ColorScheme {
  bgColor: string;
  textColor: string;
  borderColor: string;
}

interface Team {
  id: string;
  name: string;
  slug: string | null;
  icon_name: string | null;
  color_scheme: ColorScheme | null;
}

interface UserTeamsProps {
  userTeams: Team[];
  loadingUserTeams: boolean;
  errorUserTeams: string | null;
}

export default function UserTeams({
  userTeams,
  loadingUserTeams,
  errorUserTeams,
}: UserTeamsProps) {
  return (
    <section className="pb-6 lg:w-1/2 p-6 bg-black rounded-xl shadow-md border border-gray-800">
      <h2 className="text-2xl font-semibold mb-6 text-white flex items-center"><FaHandshake className="mr-3 text-gray-400"/> Your Teams</h2>
      {loadingUserTeams ? (
         <div className="flex items-center text-gray-400"><FaSpinner className="animate-spin mr-2" /> Loading teams...</div>
      ) : (
        userTeams.length === 0 ? (
          <p className="text-gray-400">Not a member of any teams yet.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {userTeams.map(team => {
              const IconComponent = iconMap[team.icon_name || 'FaQuestionCircle'] || FaQuestionCircle;
              
              // Vercel-like monochrome style for team badges
              const badgeBaseStyle = "flex items-center px-4 py-2 rounded-lg shadow-sm border transition-colors duration-150 ease-in-out";
              const monochromeStyle = "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white";
              
              return (
                <Link 
                  key={team.id} 
                  href={`/teams/${team.slug || team.id}`}
                  className={`${badgeBaseStyle} ${monochromeStyle}`}
                >
                  <IconComponent className="mr-2 text-lg text-gray-400"/>
                  <span className="font-medium">{team.name}</span>
                </Link>
              );
            })}
          </div>
        )
      )}
       {errorUserTeams && <p className="mt-4 text-sm text-red-400">{errorUserTeams}</p>}
    </section>
  );
}
