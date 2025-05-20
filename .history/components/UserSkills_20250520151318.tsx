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
  const baseStyle = "px-3 py-1.5 text-xs font-semibold rounded-full shadow-md flex items-center justify-center hover:opacity-90 transition-opacity";
  switch (category?.toLowerCase().trim()) {
    case 'frontend development': return `${baseStyle} bg-green-800 text-green-200 border border-green-700`;
    case 'backend development': return `${baseStyle} bg-blue-800 text-blue-200 border border-blue-700`;
    case 'programming': return `${baseStyle} bg-indigo-800 text-indigo-200 border border-indigo-700`;
    case 'design': return `${baseStyle} bg-pink-800 text-pink-200 border border-pink-700`;
    case 'management': return `${baseStyle} bg-purple-800 text-purple-200 border border-purple-700`;
    case 'databases': return `${baseStyle} bg-yellow-700 text-yellow-100 border border-yellow-600`;
    case 'devops': return `${baseStyle} bg-red-800 text-red-200 border border-red-700`;
    case 'cloud computing': return `${baseStyle} bg-cyan-800 text-cyan-200 border border-cyan-700`;
    case 'marketing': return `${baseStyle} bg-orange-800 text-orange-200 border border-orange-700`;
    case 'user-defined': return `${baseStyle} bg-teal-800 text-teal-200 border border-teal-700`;
    default: return `${baseStyle} bg-gray-700 text-gray-200 border border-gray-600`;
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
  onSkillToggle?: (skillId: string, isCurrentlySelected: boolean) => Promise<void>;
  onAddCustomSkill?: (skillName: string) => Promise<void>;
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
    <section className="pb-6 lg:w-1/2 p-6 bg-black rounded-xl shadow-md border border-gray-800">
      <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
        <FaBrain className="mr-3 text-sky-500"/>
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
                  onClick={() => onSkillToggle && onSkillToggle(skill.id, true)}
                  title="Click to remove"
                >
                  {skill.name} 
                  {savingSkills && userSkillIds.has(skill.id) && <FaSpinner className="ml-2 animate-spin text-xs" />}
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
                className="block w-full px-4 py-2 pr-8 rounded-md bg-black border border-gray-700 text-gray-300 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              >
                <option value="">-- Select a Skill --</option>
                {allSkills
                  .filter(skill => !userSkillIds.has(skill.id))
                  .map(skill => (
                    <option key={skill.id} value={skill.id}>{skill.name}</option>
                  ))
                }
              </select>
               <button
                onClick={() => {
                  if (skillChoiceInAdder) {
                    onSkillToggle && onSkillToggle(skillChoiceInAdder, false);
                  }
                }}
                disabled={!skillChoiceInAdder || savingSkills}
                className="inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
                 className="block w-full px-4 py-2 rounded-md bg-black border border-gray-700 shadow-sm text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 sm:text-sm"
              />
               <button
                 onClick={() => onAddCustomSkill && onAddCustomSkill(customSkillInput)}
                 disabled={!customSkillInput.trim() || savingSkills}
                 className="inline-flex items-center px-4 py-2 border border-gray-700 text-sm font-medium rounded-md shadow-sm text-gray-300 bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                 title="Add Custom Skill"
               >
                 <FaPlusSquare className="mr-2" /> Create & Add
               </button>
             </div>
          </div>
        </>
      )}
       {/* Skill Saving Status */}
       {savingSkills && <p className="mt-4 text-sm text-gray-400 flex items-center"><FaSpinner className="animate-spin mr-2"/> Saving skill...</p>}
    </section>
  );
} 