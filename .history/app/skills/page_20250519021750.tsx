\'use client\';

import React, { useEffect, useState } from \'react\';
import { useRouter } from \'next/navigation\';
import getSupabaseBrowserClient from \'@/lib/supabase/client\';
import { User } from \'@supabase/supabase-js\';
import UserSidebar from \'@/app/components/UserSidebar\'; // Adjusted path
import { FaLightbulb, FaSpinner, FaCheckCircle, FaPlusCircle } from \'react-icons/fa\';
import Link from \'next/link\';

// Copied from app/profile/page.tsx - consider moving to a shared utils file
interface Skill {
  id: string;
  name: string;
  category: string | null;
  description: string | null;
}

// Copied from app/profile/page.tsx - consider moving to a shared utils file
const getSkillBadgeStyle = (category: string | null, isSelected: boolean): string => {
  const baseStyle = "px-4 py-2 text-sm font-semibold rounded-lg shadow-md flex items-center justify-center transition-all duration-200 ease-in-out cursor-pointer transform hover:scale-105";
  let categoryStyle = "";

  switch (category?.toLowerCase().trim()) {
    case \'frontend development\': categoryStyle = \'bg-green-600 text-green-100 border border-green-500 hover:bg-green-500\'; break;
    case \'backend development\': categoryStyle = \'bg-blue-600 text-blue-100 border border-blue-500 hover:bg-blue-500\'; break;
    case \'programming\': categoryStyle = \'bg-indigo-600 text-indigo-100 border border-indigo-500 hover:bg-indigo-500\'; break;
    case \'design\': categoryStyle = \'bg-pink-600 text-pink-100 border border-pink-500 hover:bg-pink-500\'; break;
    case \'management\': categoryStyle = \'bg-purple-600 text-purple-100 border border-purple-500 hover:bg-purple-500\'; break;
    case \'databases\': categoryStyle = \'bg-yellow-500 text-yellow-900 border border-yellow-400 hover:bg-yellow-400\'; break;
    case \'devops\': categoryStyle = \'bg-red-600 text-red-100 border border-red-500 hover:bg-red-500\'; break;
    case \'cloud computing\': categoryStyle = \'bg-cyan-600 text-cyan-100 border border-cyan-500 hover:bg-cyan-500\'; break;
    case \'marketing\': categoryStyle = \'bg-orange-600 text-orange-100 border border-orange-500 hover:bg-orange-500\'; break;
    case \'user-defined\': categoryStyle = \'bg-teal-600 text-teal-100 border border-teal-500 hover:bg-teal-500\'; break;
    default: categoryStyle = \'bg-gray-600 text-gray-100 border border-gray-500 hover:bg-gray-500\'; break;
  }

  if (isSelected) {
    // Darken the style for selected badges
    // Example: make it less opaque or use a darker shade if available
    // For simplicity, I\'ll add a specific class or modify existing ones.
    // Here, I\'m making it slightly less bright and adding an indicator.
    // This might need adjustment based on your actual color palette.
    return `${baseStyle} ${categoryStyle.replace(/bg-([a-z]+)-600/g, \'bg-$1-800\').replace(/bg-([a-z]+)-500/g, \'bg-$1-700\')} ring-2 ring-white ring-opacity-75`;
  }
  return `${baseStyle} ${categoryStyle}`;
};


export default function SkillsPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loadingUser, setLoadingUser] = useState<boolean>(true);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [userSkillIds, setUserSkillIds] = useState<Set<string>>(new Set());
  const [loadingSkills, setLoadingSkills] = useState<boolean>(true);
  const [savingSkill, setSavingSkill] = useState<string | null>(null); // skill.id that is currently being saved
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // User Authentication and Initial Load
  useEffect(() => {
    const fetchUserAndInitialData = async () => {
      setLoadingUser(true);
      const { data: { user: fetchedUser }, error: userError } = await supabase.auth.getUser();

      if (userError || !fetchedUser) {
        console.error(\'[SkillsPage] User not authenticated or error fetching user:\', userError?.message);
        router.push(\'/login\');
        return;
      }
      
      console.log(\'[SkillsPage] User authenticated:\', fetchedUser.id);
      setUser(fetchedUser);
      setLoadingUser(false);
    };

    fetchUserAndInitialData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === \'SIGNED_OUT\') {
        router.push(\'/login\');
      } else if (event === \'SIGNED_IN\' || event === \'USER_UPDATED\') {
        setUser(session?.user ?? null);
        if (!session?.user) {
            router.push(\'/login\');
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase, router]);

  // Fetch all skills and user\'s selected skills
  useEffect(() => {
    if (!user) return; // Don\'t fetch if user is not loaded yet

    const loadSkillsData = async () => {
      setLoadingSkills(true);
      setError(null);
      try {
        // Fetch all available skills
        const { data: allSkillsData, error: allSkillsError } = await supabase
          .from(\'skills\')
          .select(\'id, name, category, description\')
          .order(\'category\', { ascending: true })
          .order(\'name\', { ascending: true });

        if (allSkillsError) throw allSkillsError;
        setAllSkills(allSkillsData || []);
        
        // If you want to create ~100 skills for display if not enough exist:
        // This is a placeholder. You\'d want a more robust way to manage/create these.
        if (allSkillsData && allSkillsData.length < 100) {
          const additionalSkillsNeeded = 100 - allSkillsData.length;
          const dummySkills: Skill[] = [];
          const categories = [\'Frontend Development\', \'Backend Development\', \'Programming\', \'Design\', \'Management\', \'Databases\', \'DevOps\', \'Cloud Computing\', \'Marketing\', \'User-defined\', \'AI/ML\', \'Game Development\', \'Mobile Development\', \'Cybersecurity\', \'Data Science\'];
          for (let i = 0; i < additionalSkillsNeeded; i++) {
            const catIndex = i % categories.length;
            dummySkills.push({
              id: `dummy-${i}-${Date.now()}`, // Ensure unique ID for keys
              name: `Sample Skill ${i + 1} in ${categories[catIndex].substring(0,10)}`,
              category: categories[catIndex],
              description: `This is a sample description for skill ${i + 1}.`
            });
          }
          setAllSkills(prev => [...prev, ...dummySkills].sort((a,b) => (a.category || \'\').localeCompare(b.category || \'\') || a.name.localeCompare(b.name) ));
        }


        // Fetch user\'s skills
        const { data: userSkillsData, error: userSkillsError } = await supabase
          .from(\'user_skills\')
          .select(\'skill_id\')
          .eq(\'user_id\', user.id);

        if (userSkillsError) throw userSkillsError;
        setUserSkillIds(new Set(userSkillsData?.map(us => us.skill_id) || []));

      } catch (err: any) {
        console.error(\'[SkillsPage] Error loading skills data:\', err);
        setError(\`Failed to load skills: \${err.message}\`);
      } finally {
        setLoadingSkills(false);
      }
    };

    loadSkillsData();
  }, [user, supabase]);

  // Handle Skill Toggle (copied and adapted from ProfilePage)
  const handleSkillToggle = async (skill: Skill) => {
    if (!user || savingSkill === skill.id) return;

    setSavingSkill(skill.id);
    setError(null);
    setSuccessMessage(null);

    const isCurrentlySelected = userSkillIds.has(skill.id);

    try {
      if (isCurrentlySelected) {
        // Remove skill
        if(skill.id.startsWith(\'dummy-\')) { // Don\'t try to delete dummy skills from DB
             setUserSkillIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(skill.id);
                return newSet;
            });
            setSuccessMessage(\`Skill "\${skill.name}" removed from your selection.\`);
        } else {
            const { error: deleteError } = await supabase
            .from(\'user_skills\')
            .delete()
            .match({ user_id: user.id, skill_id: skill.id });
            if (deleteError) throw deleteError;
            setUserSkillIds(prev => {
                const newSet = new Set(prev);
                newSet.delete(skill.id);
                return newSet;
            });
            setSuccessMessage(\`Skill "\${skill.name}" removed from your profile.\`);
        }
      } else {
        // Add skill
         if(skill.id.startsWith(\'dummy-\')) { // Don\'t try to add dummy skills to DB
            setUserSkillIds(prev => new Set(prev).add(skill.id));
            setSuccessMessage(\`Skill "\${skill.name}" added to your selection.\`);
        } else {
            const { error: insertError } = await supabase
            .from(\'user_skills\')
            .insert({ user_id: user.id, skill_id: skill.id });
            if (insertError) throw insertError;
            setUserSkillIds(prev => new Set(prev).add(skill.id));
            setSuccessMessage(\`Skill "\${skill.name}" added to your profile.\`);
        }
      }
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      console.error(\'[SkillsPage] Error toggling skill:\', err);
      setError(\`Failed to update skill "\${skill.name}": \${err.message}\`);
      // Revert optimistic update if DB operation failed
      // setUserSkillIds(prevUserSkillIds => { ... }); // More complex revert logic might be needed
    } finally {
      setSavingSkill(null);
    }
  };


  if (loadingUser || !user) {
    return (
      <div className=\"min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex items-center justify-center text-white\">
        <FaSpinner className=\"animate-spin text-4xl text-sky-500\" />
        <p className=\"ml-3 text-xl\">Loading user...</p>
      </div>
    );
  }
  
  // Group skills by category for display
  const groupedSkills: Record<string, Skill[]> = allSkills.reduce((acc, skill) => {
    const category = skill.category || \'Other\';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const sortedCategories = Object.keys(groupedSkills).sort();


  return (
    <div className=\"min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 flex text-white\">
      <UserSidebar user={user} />
      <main className=\"flex-1 p-6 md:p-10 overflow-y-auto\">
        <div className=\"max-w-7xl mx-auto\">
          <div className=\"flex justify-between items-center mb-8 pb-4 border-b border-gray-700\">
            <h1 className=\"text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 via-blue-500 to-purple-600 flex items-center\">
              <FaLightbulb className=\"mr-4 text-yellow-400\" />
              Explore & Add Skills
            </h1>
            <Link href=\"/profile\" legacyBehavior>
                <a className=\"px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-lg shadow-md transition duration-150 ease-in-out flex items-center\">
                    Back to Profile
                </a>
            </Link>
          </div>

          {error && <p className=\"mb-4 p-3 bg-red-800/70 text-red-200 rounded-md\">Error: {error}</p>}
          {successMessage && <p className=\"mb-4 p-3 bg-green-800/60 text-green-200 rounded-md\">{successMessage}</p>}

          {loadingSkills ? (
            <div className=\"flex items-center justify-center h-64\">
              <FaSpinner className=\"animate-spin text-5xl text-sky-500\" />
              <p className=\"ml-4 text-2xl text-gray-300\">Loading available skills...</p>
            </div>
          ) : (
            <div className=\"space-y-10\">
              {sortedCategories.map(category => (
                <section key={category}>
                  <h2 className=\"text-2xl font-semibold text-sky-300 mb-5 capitalize border-b border-gray-700 pb-2\">
                    {category}
                  </h2>
                  <div className=\"flex flex-wrap gap-3\">
                    {groupedSkills[category].map(skill => {
                      const isSelected = userSkillIds.has(skill.id);
                      const isCurrentlySaving = savingSkill === skill.id;
                      return (
                        <button
                          key={skill.id}
                          onClick={() => handleSkillToggle(skill)}
                          disabled={isCurrentlySaving}
                          className={`${getSkillBadgeStyle(skill.category, isSelected)} ${isCurrentlySaving ? \'opacity-50 cursor-wait\' : \'\'}`}
                          title={skill.description || skill.name}
                        >
                          {isCurrentlySaving ? <FaSpinner className="animate-spin mr-2" /> : (isSelected ? <FaCheckCircle className="mr-2 text-lg" /> : <FaPlusCircle className="mr-2 text-lg" />)}
                          {skill.name}
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}
              {allSkills.length === 0 && !loadingSkills && (
                 <div className=\"text-center py-10 px-6 border-2 border-dashed border-gray-700 rounded-lg bg-gray-800/50\">
                    <FaLightbulb className=\"mx-auto text-6xl text-gray-500 mb-4\" />
                    <p className=\"text-gray-400 text-xl mb-2\">No skills found in the database.</p>
                    <p className=\"text-gray-500\">You might want to add some skills through your admin panel or seed your database.</p>
                 </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 