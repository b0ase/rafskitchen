'use client';

import React from 'react';
import Link from 'next/link';
import { FaUsers, FaQuestionCircle, FaSpinner, FaDatabase, FaPalette, FaBolt, FaCloud, FaLightbulb, FaBrain } from 'react-icons/fa';

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
    <section className="pb-6 lg:w-1/2 p-6 bg-gray-800 rounded-xl shadow-inner border border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-orange-400 flex items-center"><FaHandshake className="mr-3 text-orange-300"/> Your Teams</h2>
      {loadingUserTeams ? (
         <div className="flex items-center text-gray-400"><FaSpinner className="animate-spin mr-2" /> Loading teams...</div>
      ) : (
        userTeams.length === 0 ? (
          <p className="text-gray-400">Not a member of any teams yet.</p>
        ) : (
          <div className="flex flex-wrap gap-4">
            {userTeams.map(team => {
               // Dynamically get the icon component, defaulting to FaQuestionCircle
              const IconComponent = iconMap[team.icon_name || 'FaQuestionCircle'] || FaQuestionCircle;
              
              // Use the color scheme from the team data, with fallback
              const bgColorClass = team.color_scheme?.bgColor || 'bg-gray-700';
              const textColorClass = team.color_scheme?.textColor || 'text-gray-100';
              const borderColorClass = team.color_scheme?.borderColor || 'border-gray-500';
              
              return (
                <Link 
                  key={team.id} 
                  href={`/teams/${team.slug || team.id}`} // Link to team page, use slug if available
                  className={`flex items-center ${bgColorClass} ${textColorClass} ${borderColorClass} border px-4 py-2 rounded-lg shadow-md hover:opacity-90 transition-opacity`}
                >
                  <IconComponent className="mr-2 text-lg"/>
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
