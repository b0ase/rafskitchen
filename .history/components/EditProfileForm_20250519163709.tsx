'use client';

import React, { FormEvent, ChangeEvent } from 'react';
import { FaSave, FaUserCircle, FaSignature, FaInfoCircle, FaLink, FaSpinner } from 'react-icons/fa';

// Assuming Profile and ProfileForUpdate interfaces are defined elsewhere and imported, or define them here
interface ProfileForUpdate {
  username?: string | null;
  display_name?: string | null;
  full_name?: string | null;
  bio?: string | null;
  website_url?: string | null;
  twitter_url?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  instagram_url?: string | null;
  discord_url?: string | null;
  phone_whatsapp?: string | null;
  updated_at: string;
}

interface EditProfileFormProps {
  newUsername: string;
  newDisplayName: string;
  newFullName: string;
  newBio: string;
  newWebsiteUrl: string;
  newTwitterUrl: string;
  newLinkedInUrl: string;
  newGitHubUrl: string;
  newInstagramUrl: string;
  newDiscordUrl: string;
  newPhoneWhatsapp: string;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  avatarUploadError: string | null; // Include avatar upload error here as it's part of status messages
  onUsernameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDisplayNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFullNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBioChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onWebsiteUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTwitterUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLinkedInUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onGitHubUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInstagramUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDiscordUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPhoneWhatsappChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => Promise<void>;
}

export default function EditProfileForm({
  newUsername,
  newDisplayName,
  newFullName,
  newBio,
  newWebsiteUrl,
  newTwitterUrl,
  newLinkedInUrl,
  newGitHubUrl,
  newInstagramUrl,
  newDiscordUrl,
  newPhoneWhatsapp,
  saving,
  error,
  successMessage,
  avatarUploadError,
  onUsernameChange,
  onDisplayNameChange,
  onFullNameChange,
  onBioChange,
  onWebsiteUrlChange,
  onTwitterUrlChange,
  onLinkedInUrlChange,
  onGitHubUrlChange,
  onInstagramUrlChange,
  onDiscordUrlChange,
  onPhoneWhatsappChange,
  onSubmit,
}: EditProfileFormProps) {
  return (
    <section className="pb-6 w-full mt-6 md:mt-8 p-6 bg-black rounded-xl shadow-md border border-gray-800">
      <h2 className="text-2xl font-semibold mb-6 text-white flex items-center"><FaUserCircle className="mr-3 text-gray-400"/> Edit Your Profile</h2>
      <form id="profile-form" onSubmit={onSubmit} className="space-y-6">
        {/* Status Messages */}
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {successMessage && <p className="text-gray-300 text-sm">{successMessage}</p>}
         {avatarUploadError && <p className="text-red-400 text-sm">{avatarUploadError}</p>}
        
        {/* Form Fields */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-300 flex items-center"><FaSignature className="mr-2 text-gray-400"/> Username</label>
          <input
            type="text"
            id="username"
            value={newUsername}
            onChange={onUsernameChange}
            required
            className="mt-1 block w-full rounded-md bg-black border-gray-600 shadow-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm"
            placeholder="Your unique username"
          />
        </div>
        <div>
          <label htmlFor="display_name" className="block text-sm font-medium text-gray-300 flex items-center"><FaUserCircle className="mr-2 text-gray-400"/> Display Name</label>
          <input
            type="text"
            id="display_name"
            value={newDisplayName}
            onChange={onDisplayNameChange}
            className="mt-1 block w-full rounded-md bg-black border-gray-600 shadow-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm"
            placeholder="Name shown publicly (defaults to username)"
          />
        </div>
         <div>
          <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 flex items-center"><FaSignature className="mr-2 text-gray-400"/> Full Name</label>
          <input
            type="text"
            id="full_name"
            value={newFullName}
            onChange={onFullNameChange}
            className="mt-1 block w-full rounded-md bg-black border-gray-600 shadow-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm"
            placeholder="Your full legal name (optional)"
          />
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-300 flex items-center"><FaInfoCircle className="mr-2 text-gray-400"/> Bio</label>
          <textarea
            id="bio"
            rows={4}
            value={newBio}
            onChange={onBioChange}
            className="mt-1 block w-full rounded-md bg-black border-gray-600 shadow-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm"
            placeholder="Tell us about yourself..."
          ></textarea>
        </div>

        {/* Social & Contact Links */}
        <h3 className="text-lg font-semibold mt-8 mb-4 text-gray-300">Links & Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="website_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Website URL</label>
            <input
              type="url"
              id="website_url"
              value={newWebsiteUrl}
              onChange={onWebsiteUrlChange}
              className="mt-1 block w-full rounded-md bg-black border-gray-600 shadow-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm"
              placeholder="https://yourwebsite.com"
            />
          </div>
          <div>
            <label htmlFor="github_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> GitHub URL</label>
            <input
              type="url"
              id="github_url"
              value={newGitHubUrl}
              onChange={onGitHubUrlChange}
              className="mt-1 block w-full rounded-md bg-black border-gray-600 shadow-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm"
              placeholder="https://github.com/yourprofile"
            />
          </div>
           <div>
            <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> LinkedIn URL</label>
            <input
              type="url"
              id="linkedin_url"
              value={newLinkedInUrl}
              onChange={onLinkedInUrlChange}
              className="mt-1 block w-full rounded-md bg-black border-gray-600 shadow-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm"
              placeholder="https://linkedin.com/in/yourprofile"
            />
          </div>
           <div>
            <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Twitter URL</label>
            <input
              type="url"
              id="twitter_url"
              value={newTwitterUrl}
              onChange={onTwitterUrlChange}
              className="mt-1 block w-full rounded-md bg-black border-gray-600 shadow-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm"
              placeholder="https://twitter.com/yourhandle"
            />
          </div>
           <div>
            <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Instagram URL</label>
            <input
              type="url"
              id="instagram_url"
              value={newInstagramUrl}
              onChange={onInstagramUrlChange}
              className="mt-1 block w-full rounded-md bg-black border-gray-600 shadow-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm"
              placeholder="https://instagram.com/yourhandle"
            />
          </div>
           <div>
            <label htmlFor="discord_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Discord URL</label>
            <input
              type="url"
              id="discord_url"
              value={newDiscordUrl}
              onChange={onDiscordUrlChange}
              className="mt-1 block w-full rounded-md bg-black border-gray-600 shadow-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm"
              placeholder="Your Discord invite link or tag"
            />
          </div>
           <div>
            <label htmlFor="phone_whatsapp" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Phone/WhatsApp</label>
            <input
              type="text"
              id="phone_whatsapp"
              value={newPhoneWhatsapp}
              onChange={onPhoneWhatsappChange}
              className="mt-1 block w-full rounded-md bg-black border-gray-600 shadow-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm"
              placeholder="Your phone or WhatsApp number (optional)"
            />
          </div>
        </div>

        {/* The submit button will be handled by the parent component */}

      </form>
    </section>
  );
} 