'use client';

import React from 'react';
import Link from 'next/link';
import { FaUserCircle, FaImage, FaSignature, FaInfoCircle, FaLink, FaSpinner } from 'react-icons/fa';

// Assuming Profile interface is defined elsewhere and imported, or define it here if standalone
interface Profile {
  username: string | null;
  display_name: string | null;
  avatar_url?: string | null;
  full_name?: string | null;
  bio?: string | null;
  website_url?: string | null;
  twitter_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  instagram_url?: string | null;
  discord_url?: string | null;
  phone_whatsapp?: string | null;
}

interface ProfileDetailsProps {
  profile: Profile | null;
  isUploadingAvatar: boolean;
  avatarUploadError: string | null;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
}

export default function ProfileDetails({
  profile,
  isUploadingAvatar,
  avatarUploadError,
  onAvatarUpload,
}: ProfileDetailsProps) {
  return (
    <section className="mb-12 p-6 md:p-8 bg-gray-900 rounded-xl shadow-2xl text-white border border-gray-700">
      {/* Welcome card/Hero Section */}
      <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8">
        {/* Avatar */}
        <div className="relative w-32 h-32 md:w-40 md:h-40 flex-shrink-0 rounded-full overflow-hidden border-2 border-white shadow-lg z-10">
          {isUploadingAvatar ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-20">
              <FaSpinner className="text-gray-400 animate-spin text-3xl" />
            </div>
          ) : (
            <img
              src={profile?.avatar_url || 'https://klaputzxeqgypphzdxpr.supabase.co/storage/v1/object/public/avatars/public/user_icon.png'}
              alt={`${profile?.username || 'User'}'s avatar`}
              className="w-full h-full object-cover"
            />
          )}
          {/* Avatar Upload Button */}
          <label
            htmlFor="avatar-upload"
            className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full cursor-pointer border-2 border-gray-600 hover:bg-gray-600 transition-colors duration-200 ease-in-out shadow-md z-30"
            title="Upload new avatar"
          >
            <FaImage className="text-white text-lg" />
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={onAvatarUpload}
              disabled={isUploadingAvatar}
              className="hidden"
            />
          </label>
        </div>

        {/* Profile Info */}
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">{profile?.display_name || profile?.username || 'New User'}</h1>
          {profile?.full_name && <p className="text-lg text-gray-200 mb-2">{profile.full_name}</p>}
          {profile?.bio && <p className="text-md text-gray-300 leading-relaxed">{profile.bio}</p>}
          <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4 text-gray-200">
            {profile?.website_url && (
              <Link href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                <FaLink className="mr-2" /> Website
              </Link>
            )}
            {profile?.github_url && (
              <Link href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                <FaLink className="mr-2" /> GitHub
              </Link>
            )}
             {profile?.linkedin_url && (
              <Link href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                <FaLink className="mr-2" /> LinkedIn
              </Link>
            )}
             {profile?.twitter_url && (
              <Link href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                <FaLink className="mr-2" /> Twitter
              </Link>
            )}
             {profile?.instagram_url && (
              <Link href={profile.instagram_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                <FaLink className="mr-2" /> Instagram
              </Link>
            )}
             {profile?.discord_url && (
              <Link href={profile.discord_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-white transition-colors">
                <FaLink className="mr-2" /> Discord
              </Link>
            )}
             {profile?.phone_whatsapp && (
              <Link href={`tel:${profile.phone_whatsapp}`} className="flex items-center hover:text-white transition-colors">
                <FaLink className="mr-2" /> Phone/WhatsApp
              </Link>
             )}
          </div>
        </div>
      </div>
      {avatarUploadError && <p className="text-red-400 text-sm mt-4">{avatarUploadError}</p>}
    </section>
  );
} 