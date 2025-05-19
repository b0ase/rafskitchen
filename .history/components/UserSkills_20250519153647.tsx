'use client';

import React from 'react';
import Link from 'next/link';
import { FaBrain, FaPlus, FaPlusSquare, FaSpinner } from 'react-icons/fa';

// Import or define necessary interfaces
interface Skill {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
}

// --- Skill Badge Styling Function --- (Keep or import if used elsewhere)
const getSkillBadgeStyle = (category: string | null): string => {
  const baseStyle = "px-3 py-1.5 text-xs font-semibold rounded-full shadow-md flex items-center justify-center";
  switch (category?.toLowerCase().trim()) {
    case 'frontend development': return `${baseStyle} bg-green-600 text-green-100 border border-green-500`;
    case 'backend development': return `${baseStyle} bg-blue-600 text-blue-100 border border-blue-500`;
    case 'programming': return `${baseStyle} bg-indigo-600 text-indigo-100 border border-indigo-500`;
    case 'design': return `${baseStyle} bg-pink-600 text-pink-100 border border-pink-500`;
    case 'management': return `${baseStyle} bg-purple-600 text-purple-100 border border-purple-500`;
    case 'databases': return `${baseStyle} bg-yellow-500 text-yellow-900 border border-yellow-400`;
    case 'devops': return `${baseStyle} bg-red-600 text-red-100 border border-red-500`;
    case 'cloud computing': return `${baseStyle} bg-cyan-600 text-cyan-100 border border-cyan-500`;
    case 'marketing': return `${baseStyle} bg-orange-600 text-orange-100 border border-orange-500`;
    case 'user-defined': return `${baseStyle} bg-teal-600 text-teal-100 border border-teal-500`;
    default: return `${baseStyle} bg-gray-600 text-gray-100 border border-gray-500`;
  }
};
// --- END Skill Badge Styling Function ---

interface UserSkillsProps {
  selectedSkills: Skill[];
  allSkills: Skill[];
  userSkillIds: Set<string>;
  loadingSkills: boolean;
  savingSkills: boolean;
  customSkillInput: string;
  skillChoiceInAdder: string;
  onSkillToggle: (skillId: string, isCurrentlySelected: boolean) => Promise<void>;
  onAddCustomSkill: (skillName: string) => Promise<void>;
  onCustomSkillInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSkillChoiceInAdderChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function UserSkills({
  selectedSkills,
  allSkills,
  userSkillIds,
  loadingSkills,
  savingSkills,
  customSkillInput,
  skillChoiceInAdder,
  onSkillToggle,
  onAddCustomSkill,
  onCustomSkillInputChange,
  onSkillChoiceInAdderChange,
}: UserSkillsProps) {
  return (
    <section className="pb-6 lg:w-1/2 p-6 bg-gray-800 rounded-xl shadow-inner border border-gray-700">
      <h2 className="text-2xl font-semibold mb-6 text-sky-400 flex items-center">
        <FaBrain className="mr-3 text-sky-300"/>
        <Link href="/skills" className="hover:underline">
          Your Skills
        </Link>
      </h2>
      {loadingSkills ? (
        <div className="flex items-center text-gray-400"><FaSpinner className="animate-spin mr-2" /> Loading skills...</div>
      ) : (
        <>
          <div className="flex flex-wrap gap-3 mb-6">
            {selectedSkills.length === 0 ? (
              <p className="text-gray-400">No skills added yet.</p>
            ) : (
              selectedSkills.map(skill => (
                <span 
                  key={skill.id} 
                  className={`${getSkillBadgeStyle(skill.category)} cursor-pointer hover:opacity-80 transition-opacity`}
                  onClick={() => onSkillToggle(skill.id, true)} // Pass true as it's currently selected
                  title="Click to remove"
                >
                  {skill.name} 
                  {savingSkills && userSkillIds.has(skill.id) && <FaSpinner className="ml-2 animate-spin text-xs" />} {/* Show spinner if saving and this skill is involved */}
                </span>
              ))
            )}
          </div>

          {/* Skill Adder - Dropdown for Existing Skills */}
          <div className="mb-4">
            <label htmlFor="skill-adder" className="block text-sm font-medium text-gray-300 mb-2">Add Existing Skill:</label>
            <div className="flex gap-2">
              <select
                id="skill-adder"
                value={skillChoiceInAdder}
                onChange={onSkillChoiceInAdderChange}
                disabled={savingSkills}
                className="block w-full px-4 py-2 pr-8 rounded-md bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              >
                <option value="">-- Select a Skill --</option>
                {allSkills
                  .filter(skill => !userSkillIds.has(skill.id)) // Only show skills not already selected by the user
                  .map(skill => (
                    <option key={skill.id} value={skill.id}>{skill.name}</option>
                  ))
                }
              </select>
               <button
                onClick={() => {
                  if (skillChoiceInAdder) {
                    onSkillToggle(skillChoiceInAdder, false); // Pass false as it's NOT currently selected by the user
                    // Reset dropdown handled by parent component after successful toggle
                  }
                }}
                disabled={!skillChoiceInAdder || savingSkills}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Add Selected Skill"
              >
                 <FaPlus className="mr-2" /> Add
               </button>
            </div>
          </div>

          {/* Skill Adder - Input for Custom Skills */}
          <div className="mb-4">
             <label htmlFor="custom-skill-input" className="block text-sm font-medium text-gray-300 mb-2">Add Custom Skill:</label>
             <div className="flex gap-2">
              <input
                 id="custom-skill-input"
                 type="text"
                 value={customSkillInput}
                 onChange={onCustomSkillInputChange}
                 disabled={savingSkills}
                 placeholder="e.g., Quantum Computing"
                 className="block w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
              />
               <button
                 onClick={() => onAddCustomSkill(customSkillInput)}
                 disabled={!customSkillInput.trim() || savingSkills}
                 className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 title="Add Custom Skill"
               >
                 <FaPlusSquare className="mr-2" /> Create & Add
               </button>
             </div>
          </div>
        </>
      )}
       {/* Skill Saving Status */}
       {savingSkills && <p className="mt-4 text-sm text-sky-300 flex items-center"><FaSpinner className="animate-spin mr-2"/> Saving skill...</p>}
    </section>
  );
} 