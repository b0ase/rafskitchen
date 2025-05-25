'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { NextPage } from 'next';
import { 
  FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaGlobe, 
  FaFacebookF, FaYoutube, FaDiscord, FaRedditAlien, FaPinterestP, FaTiktok, FaMediumM,
  FaSave, FaCheckCircle, FaExclamationCircle, FaSpinner
} from 'react-icons/fa';
import { useRouter } from 'next/navigation';

// Define the structure for a social platform
interface SocialPlatform {
  platform_id: string; // e.g., 'twitter', 'linkedin'
  name: string;        // e.g., 'Twitter', 'LinkedIn'
  href: string;
  icon_component_name: string; // e.g., 'FaTwitter'
  icon?: React.ElementType; // Optional: direct component for admin page convenience
}

// Define the mapping from icon_component_name to actual icon components
const iconMap: { [key: string]: React.ElementType } = {
  FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaGlobe,
  FaFacebookF, FaYoutube, FaDiscord, FaRedditAlien, FaPinterestP, FaTiktok, FaMediumM
};

// Initial state of social platforms - this would ideally be fetched from your database
const initialSocialPlatforms: SocialPlatform[] = [
  { platform_id: 'twitter', name: 'Twitter', href: '', icon_component_name: 'FaTwitter' },
  { platform_id: 'linkedin', name: 'LinkedIn', href: '', icon_component_name: 'FaLinkedin' },
  { platform_id: 'github', name: 'GitHub', href: '', icon_component_name: 'FaGithub' },
  { platform_id: 'instagram', name: 'Instagram', href: '', icon_component_name: 'FaInstagram' },
  { platform_id: 'website', name: 'Website', href: '', icon_component_name: 'FaGlobe' },
  { platform_id: 'facebook', name: 'Facebook', href: '', icon_component_name: 'FaFacebookF' },
  { platform_id: 'youtube', name: 'YouTube', href: '', icon_component_name: 'FaYoutube' },
  { platform_id: 'discord', name: 'Discord', href: '', icon_component_name: 'FaDiscord' },
  { platform_id: 'reddit', name: 'Reddit', href: '', icon_component_name: 'FaRedditAlien' },
  { platform_id: 'pinterest', name: 'Pinterest', href: '', icon_component_name: 'FaPinterestP' },
  { platform_id: 'tiktok', name: 'TikTok', href: '', icon_component_name: 'FaTiktok' },
  { platform_id: 'medium', name: 'Medium', href: '', icon_component_name: 'FaMediumM' },
].map(p => ({ ...p, icon: iconMap[p.icon_component_name] }));


// Mock API call functions
// In a real app, these would interact with your Supabase backend
const fetchSocialLinksFromAPI = async (): Promise<SocialPlatform[]> => {
  console.log('[AdminSocials] Fetching social links...');
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Simulate fetching data - in a real app, this might be from localStorage or a DB
  // For now, let's try to get it from localStorage if previously saved, or use initialSocialPlatforms
  const storedLinks = localStorage.getItem('adminSocialLinks');
  if (storedLinks) {
    try {
      const parsedLinks = JSON.parse(storedLinks) as SocialPlatform[];
      // Ensure all platforms are present and have icons
      return initialSocialPlatforms.map(isp => {
        const found = parsedLinks.find(sl => sl.platform_id === isp.platform_id);
        return { ...isp, href: found?.href || '' };
      });
    } catch (e) {
      console.error("Failed to parse stored links, using defaults.", e);
      return initialSocialPlatforms;
    }
  }
  return initialSocialPlatforms;
};

const saveSocialLinkToAPI = async (platform_id: string, href: string): Promise<boolean> => {
  console.log(`[AdminSocials] Saving ${platform_id} with URL: ${href}`);
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 700));
  // Simulate saving - in a real app, update your DB and then update localStorage
  const currentLinks = await fetchSocialLinksFromAPI(); // Get current state
  const updatedLinks = currentLinks.map(link => 
    link.platform_id === platform_id ? { ...link, href } : link
  );
  localStorage.setItem('adminSocialLinks', JSON.stringify(updatedLinks));
  // Simulate success/failure
  // return Math.random() > 0.1; // 90% success rate
  return true;
};


const AdminSocialsPage: NextPage = () => {
  const [socialPlatforms, setSocialPlatforms] = useState<SocialPlatform[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState<{ [key: string]: 'idle' | 'saving' | 'saved' | 'error' }>({});
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await fetchSocialLinksFromAPI();
      setSocialPlatforms(data);
      const initialSavingStatus: { [key: string]: 'idle' | 'saving' | 'saved' | 'error' } = {};
      data.forEach(p => initialSavingStatus[p.platform_id] = 'idle');
      setSavingStatus(initialSavingStatus);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleUrlChange = (platform_id: string, newHref: string) => {
    setSocialPlatforms(prev => 
      prev.map(p => p.platform_id === platform_id ? { ...p, href: newHref } : p)
    );
    // Trigger debounced save
    debouncedSave(platform_id, newHref);
  };

  const debouncedSave = useMemo(
    () => debounce(async (platform_id: string, href: string) => {
      setSavingStatus(prev => ({ ...prev, [platform_id]: 'saving' }));
      const success = await saveSocialLinkToAPI(platform_id, href);
      if (success) {
        setSavingStatus(prev => ({ ...prev, [platform_id]: 'saved' }));
        setTimeout(() => setSavingStatus(prev => ({ ...prev, [platform_id]: 'idle' })), 2000); // Reset after 2s
      } else {
        setSavingStatus(prev => ({ ...prev, [platform_id]: 'error' }));
        // Optionally, revert the change or prompt user
      }
    }, 1000),
  [] // Dependencies for useMemo: debounce, saveSocialLinkToAPI, setSavingStatus are stable.
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-cyan-400" />
        <p className="ml-3 text-xl">Loading social link settings...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Manage Social Links</h1>
            <p className="mt-2 text-gray-400">Enter the full URLs for your social media profiles. Changes are auto-saved.</p>
          </div>
          <button
            onClick={() => router.push('/socials')}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition-colors duration-150"
          >
            View Public Socials Page
          </button>
        </header>

        <div className="space-y-6">
          {socialPlatforms.map(platform => {
            const IconComponent = platform.icon;
            const status = savingStatus[platform.platform_id] || 'idle';
            return (
              <div key={platform.platform_id} className="bg-gray-800 p-6 rounded-lg shadow-lg flex items-center space-x-4">
                {IconComponent && <IconComponent className="w-8 h-8 text-gray-400 flex-shrink-0" />}
                <label htmlFor={platform.platform_id} className="w-32 text-lg font-medium text-gray-200 flex-shrink-0">
                  {platform.name}:
                </label>
                <input
                  type="url"
                  id={platform.platform_id}
                  name={platform.platform_id}
                  value={platform.href}
                  onChange={(e) => handleUrlChange(platform.platform_id, e.target.value)}
                  placeholder={`Enter ${platform.name} URL`}
                  className="flex-grow bg-gray-700 text-white border border-gray-600 rounded-md py-2 px-3 focus:ring-cyan-500 focus:border-cyan-500 transition-colors"
                />
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0">
                  {status === 'saving' && <FaSpinner className="animate-spin text-yellow-400" />}
                  {status === 'saved' && <FaCheckCircle className="text-green-400" />}
                  {status === 'error' && <FaExclamationCircle className="text-red-400" />}
                </div>
              </div>
            );
          })}
        </div>
        
        <footer className="mt-12 text-center text-gray-500">
          <p>Changes are saved automatically. Ensure URLs are correct before leaving.</p>
        </footer>
      </div>
    </div>
  );
};

// Basic debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    return new Promise(resolve => {
      if (timeout) {
        clearTimeout(timeout);
      }
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
  };
}

export default AdminSocialsPage; 