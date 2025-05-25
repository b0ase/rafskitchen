'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaGlobe, 
  FaFacebookF, FaYoutube, FaDiscord, FaRedditAlien, FaPinterestP, FaTiktok, FaMediumM, FaSpinner
} from 'react-icons/fa';
import { NextPage } from 'next';

// Define the structure for a social platform (consistent with admin page)
interface SocialPlatform {
  platform_id: string;
  name: string;
  href: string;
  icon_component_name: string; 
  // For the public page, we might not need icon_component if we map directly
  // but keeping it for consistency with potential data source
  bgColor?: string; // Optional, if we want to drive this from data
  textColor?: string; // Optional
}

// Define the mapping from icon_component_name to actual icon components AND default styling
const platformDetails: { 
  [key: string]: { 
    icon: React.ElementType;
    defaultBgColor: string;
    defaultTextColor: string;
    defaultName: string;
  }
} = {
  FaTwitter: { icon: FaTwitter, defaultBgColor: 'bg-sky-500', defaultTextColor: 'text-white', defaultName: 'Twitter' },
  FaLinkedin: { icon: FaLinkedin, defaultBgColor: 'bg-blue-700', defaultTextColor: 'text-white', defaultName: 'LinkedIn' },
  FaGithub: { icon: FaGithub, defaultBgColor: 'bg-gray-800', defaultTextColor: 'text-white', defaultName: 'GitHub' },
  FaInstagram: { icon: FaInstagram, defaultBgColor: 'bg-pink-600', defaultTextColor: 'text-white', defaultName: 'Instagram' },
  FaGlobe: { icon: FaGlobe, defaultBgColor: 'bg-green-500', defaultTextColor: 'text-white', defaultName: 'Website' },
  FaFacebookF: { icon: FaFacebookF, defaultBgColor: 'bg-blue-600', defaultTextColor: 'text-white', defaultName: 'Facebook' },
  FaYoutube: { icon: FaYoutube, defaultBgColor: 'bg-red-600', defaultTextColor: 'text-white', defaultName: 'YouTube' },
  FaDiscord: { icon: FaDiscord, defaultBgColor: 'bg-indigo-600', defaultTextColor: 'text-white', defaultName: 'Discord' },
  FaRedditAlien: { icon: FaRedditAlien, defaultBgColor: 'bg-orange-500', defaultTextColor: 'text-white', defaultName: 'Reddit' },
  FaPinterestP: { icon: FaPinterestP, defaultBgColor: 'bg-red-700', defaultTextColor: 'text-white', defaultName: 'Pinterest' },
  FaTiktok: { icon: FaTiktok, defaultBgColor: 'bg-black', defaultTextColor: 'text-white', defaultName: 'TikTok' },
  FaMediumM: { icon: FaMediumM, defaultBgColor: 'bg-neutral-800', defaultTextColor: 'text-white', defaultName: 'Medium' },
};

// Expected structure from our mocked API (localStorage in this case)
const initialSocialPlatformKeys: SocialPlatform[] = [
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
];

// Mock API call to fetch links (reads from localStorage, similar to admin page)
const fetchPublicSocialLinks = async (): Promise<SocialPlatform[]> => {
  console.log('[SocialsPage] Fetching public social links...');
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate delay
  const storedLinks = localStorage.getItem('adminSocialLinks');
  if (storedLinks) {
    try {
      const parsedLinks = JSON.parse(storedLinks) as SocialPlatform[];
      // Filter out links that don't have an href and map to ensure all details are present
      return parsedLinks.filter(link => link.href && link.href.trim() !== '#' && link.href.trim() !== '')
        .map(link => { 
          const details = platformDetails[link.icon_component_name];
          return {
            ...link,
            name: details?.defaultName || link.name,
            bgColor: details?.defaultBgColor || 'bg-gray-500', // Fallback color
            textColor: details?.defaultTextColor || 'text-white',
          };
        });
    } catch (e) {
      console.error("Failed to parse stored links for public page.", e);
      return []; // Return empty if error or no valid links
    }
  }
  return []; // No links stored
};

const SocialsPage: NextPage = () => {
  const [activeSocialLinks, setActiveSocialLinks] = useState<SocialPlatform[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLinks = async () => {
      setLoading(true);
      const links = await fetchPublicSocialLinks();
      setActiveSocialLinks(links);
      setLoading(false);
    };
    loadLinks();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-cyan-400" />
        <p className="mt-3 text-xl">Loading social links...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl tracking-tight">
            Connect With Us
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            Follow us on our social media channels to stay updated.
          </p>
        </header>

        {activeSocialLinks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeSocialLinks.map((social) => {
              const IconComponent = platformDetails[social.icon_component_name]?.icon;
              if (!IconComponent) return null; // Should not happen if data is clean

              return (
                <Link href={social.href} key={social.platform_id} passHref legacyBehavior>
                  <a 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`group flex flex-col items-center justify-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out ${social.bgColor} ${social.textColor} transform hover:scale-105`}
                  >
                    <IconComponent className="w-12 h-12 mb-3 group-hover:opacity-80 transition-opacity" />
                    <span className="text-lg font-semibold">{social.name}</span>
                  </a>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-xl text-gray-500">No social media links have been configured yet.</p>
            <p className="mt-2 text-gray-400">
              Administrators can add them via the <Link href="/admin/socials" className="text-cyan-400 hover:underline">admin panel</Link>.
            </p>
          </div>
        )}

        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          <p className="mt-1">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              Back to Home
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SocialsPage; 