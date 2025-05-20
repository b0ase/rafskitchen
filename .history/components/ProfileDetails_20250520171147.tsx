'use client';

import React from 'react';
import Link from 'next/link';
import { FaUserCircle, FaImage, FaSignature, FaInfoCircle, FaLink, FaSpinner, FaGlobe, FaGithub, FaLinkedin, FaTwitter, FaTiktok, FaTelegramPlane, FaFacebook, FaSave } from 'react-icons/fa';

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
  tiktok_url?: string | null;
  telegram_url?: string | null;
  facebook_url?: string | null;
}

interface ProfileDetailsProps {
  profile: Profile | null;
  isUploadingAvatar: boolean;
  avatarUploadError: string | null;
  onAvatarUpload?: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  onSaveProfile?: (e: React.FormEvent) => Promise<void>;
  saving?: boolean;
}

export default function ProfileDetails({
  profile,
  isUploadingAvatar,
  avatarUploadError,
  onAvatarUpload,
  onSaveProfile,
  saving,
}: ProfileDetailsProps) {
  return (
    <section className="relative mb-12 p-6 md:p-8 bg-gray-900 rounded-xl shadow-2xl text-white border border-gray-700 sticky top-[154px] z-20">
      {/* Save Profile Button - Top Right */}
      {onSaveProfile && (
        <button
          type="submit"
          form="profile-form"
          onClick={onSaveProfile}
          disabled={saving}
          className="absolute top-4 right-4 px-4 py-2 rounded-md text-sm font-medium flex items-center bg-sky-600 hover:bg-sky-700 text-white focus:outline-none focus:ring-2 focus:ring-sky-500 disabled:opacity-50"
          aria-label="Save Profile"
        >
          {saving ? (
            <FaSpinner className="animate-spin mr-2" />
          ) : (
            <FaSave className="mr-1.5 h-4 w-4" />
          )}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      )}

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
          <h1 className="text-4xl font-bold mb-1 tracking-tight">{profile?.display_name || profile?.username || 'New User'}</h1>
          {profile?.full_name && <p className="text-lg text-gray-200 mb-2">{profile.full_name}</p>}
          
          {/* Social and Website Links - Moved Here */}
          <div className="mt-3 mb-3 flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-2 text-gray-300">
            {profile?.website_url ? (
              <Link href={profile.website_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-400 transition-colors text-sm" title={profile.website_url}>
                <FaGlobe className="mr-1.5 text-sky-500" /> Website
              </Link>
            ) : (
              <a href="#website_url" className="flex items-center hover:text-sky-400 transition-colors text-sm" title="Go to Website URL field">
                <FaGlobe className="text-gray-500 hover:text-sky-500" />
              </a>
            )}
            {profile?.github_url ? (
              <Link href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-400 transition-colors text-sm" title={profile.github_url}>
                <FaGithub className="mr-1.5 text-sky-500" /> GitHub
              </Link>
            ) : (
              <a href="#github_url" className="flex items-center hover:text-sky-400 transition-colors text-sm" title="Go to GitHub URL field">
                <FaGithub className="text-gray-500 hover:text-sky-500" />
              </a>
            )}
            {profile?.linkedin_url ? (
              <Link href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-400 transition-colors text-sm" title={profile.linkedin_url}>
                <FaLinkedin className="mr-1.5 text-sky-500" /> LinkedIn
              </Link>
            ) : (
              <a href="#linkedin_url" className="flex items-center hover:text-sky-400 transition-colors text-sm" title="Go to LinkedIn URL field">
                <FaLinkedin className="text-gray-500 hover:text-sky-500" />
              </a>
            )}
            {profile?.twitter_url ? (
              <Link href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-400 transition-colors text-sm" title={profile.twitter_url}>
                <FaTwitter className="mr-1.5 text-sky-500" /> Twitter
              </Link>
            ) : (
              <a href="#twitter_url" className="flex items-center hover:text-sky-400 transition-colors text-sm" title="Go to Twitter URL field">
                <FaTwitter className="text-gray-500 hover:text-sky-500" />
              </a>
            )}
            {profile?.tiktok_url ? (
              <Link href={profile.tiktok_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-400 transition-colors text-sm" title={profile.tiktok_url}>
                <FaTiktok className="mr-1.5 text-sky-500" /> TikTok
              </Link>
            ) : (
              <a href="#tiktok_url" className="flex items-center hover:text-sky-400 transition-colors text-sm" title="Go to TikTok URL field">
                <FaTiktok className="text-gray-500 hover:text-sky-500" />
              </a>
            )}
            {profile?.telegram_url ? (
              <Link href={profile.telegram_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-400 transition-colors text-sm" title={profile.telegram_url}>
                <FaTelegramPlane className="mr-1.5 text-sky-500" /> Telegram
              </Link>
            ) : (
              <a href="#telegram_url" className="flex items-center hover:text-sky-400 transition-colors text-sm" title="Go to Telegram URL field">
                <FaTelegramPlane className="text-gray-500 hover:text-sky-500" />
              </a>
            )}
            {profile?.facebook_url ? (
              <Link href={profile.facebook_url} target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-sky-400 transition-colors text-sm" title={profile.facebook_url}>
                <FaFacebook className="mr-1.5 text-sky-500" /> Facebook
              </Link>
            ) : (
              <a href="#facebook_url" className="flex items-center hover:text-sky-400 transition-colors text-sm" title="Go to Facebook URL field">
                <FaFacebook className="text-gray-500 hover:text-sky-500" />
              </a>
            )}
            {/* Note: Instagram, Discord, Phone/WhatsApp are not shown here based on the latest request focused on these specific icons, but can be added if needed */}
          </div>

          {profile?.bio && <p className="text-md text-gray-300 leading-relaxed">{profile.bio}</p>}
        </div>
      </div>
      {avatarUploadError && <p className="text-red-400 text-sm mt-4">{avatarUploadError}</p>}
    </section>
  );
} 