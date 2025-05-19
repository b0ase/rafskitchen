'use client';

import React, { FormEvent, ChangeEvent, useState } from 'react';
import { FaUserCircle, FaSignature, FaInfoCircle, FaLink, FaTiktok, FaTelegramPlane, FaFacebook, FaDollarSign, FaRocket, FaCoins } from 'react-icons/fa';

// Assuming Profile and ProfileForUpdate interfaces are defined elsewhere and imported, or define them here
interface ProfileForUpdate {
  username?: string | null;
  display_name?: string | null;
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
  dollar_handle?: string | null;
  token_name?: string | null;
  supply?: string | null;
  updated_at: string;
}

interface EditProfileFormProps {
  newUsername: string;
  newDisplayName: string;
  newBio: string;
  newWebsiteUrl: string;
  newTwitterUrl: string;
  newLinkedInUrl: string;
  newGitHubUrl: string;
  newInstagramUrl: string;
  newDiscordUrl: string;
  newPhoneWhatsapp: string;
  newTikTokUrl: string;
  newTelegramUrl: string;
  newFacebookUrl: string;
  newDollarHandle: string;
  newTokenName: string;
  newSupply: string;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
  avatarUploadError: string | null;
  onUsernameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDisplayNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBioChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onWebsiteUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTwitterUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onLinkedInUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onGitHubUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onInstagramUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDiscordUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onPhoneWhatsappChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTikTokUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTelegramUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onFacebookUrlChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onDollarHandleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onTokenNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSupplyChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: FormEvent) => Promise<void>;
}

export default function EditProfileForm({
  newUsername,
  newDisplayName,
  newBio,
  newWebsiteUrl,
  newTwitterUrl,
  newLinkedInUrl,
  newGitHubUrl,
  newInstagramUrl,
  newDiscordUrl,
  newPhoneWhatsapp,
  newTikTokUrl,
  newTelegramUrl,
  newFacebookUrl,
  newDollarHandle,
  newTokenName,
  newSupply,
  saving,
  error,
  successMessage,
  avatarUploadError,
  onUsernameChange,
  onDisplayNameChange,
  onBioChange,
  onWebsiteUrlChange,
  onTwitterUrlChange,
  onLinkedInUrlChange,
  onGitHubUrlChange,
  onInstagramUrlChange,
  onDiscordUrlChange,
  onPhoneWhatsappChange,
  onTikTokUrlChange,
  onTelegramUrlChange,
  onFacebookUrlChange,
  onDollarHandleChange,
  onTokenNameChange,
  onSupplyChange,
  onSubmit,
}: EditProfileFormProps) {
  const inputBaseClass = "mt-1 block w-full rounded-md bg-gray-900 border-gray-700 shadow-sm text-gray-300 placeholder-gray-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 sm:text-sm p-3";
  const [showLaunchDialog, setShowLaunchDialog] = useState(false);

  return (
    <section className="pb-6 w-full mt-6 md:mt-8 p-6 bg-black rounded-xl shadow-md border border-gray-800">
      <h2 className="text-2xl font-semibold mb-6 text-white flex items-center"><FaUserCircle className="mr-3 text-gray-400"/> Edit Your Profile</h2>
      <form id="profile-form" onSubmit={onSubmit} className="space-y-6">
        {error && <p className="text-red-400 text-sm">{error}</p>}
        {successMessage && <p className="text-gray-300 text-sm">{successMessage}</p>}
        {avatarUploadError && <p className="text-red-400 text-sm">{avatarUploadError}</p>}
        
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 flex items-center"><FaSignature className="mr-2 text-gray-400"/> Username</label>
            <input type="text" id="username" value={newUsername} onChange={onUsernameChange} required className={inputBaseClass} placeholder="Your unique username" />
          </div>
          <div>
            <label htmlFor="display_name" className="block text-sm font-medium text-gray-300 flex items-center"><FaUserCircle className="mr-2 text-gray-400"/> Display Name</label>
            <input type="text" id="display_name" value={newDisplayName} onChange={onDisplayNameChange} className={inputBaseClass} placeholder="Name shown publicly" />
          </div>
          <div>
            <label htmlFor="token_name" className="block text-sm font-medium text-gray-300 flex items-center"><FaRocket className="mr-2 text-gray-400"/> Token Name</label>
            <div className="relative">
                <input type="text" id="token_name" value={newTokenName} onChange={onTokenNameChange} className={`${inputBaseClass} pr-20`} placeholder="Your token name" />
                <button 
                    type="button"
                    onClick={() => setShowLaunchDialog(true)} 
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-xs font-semibold text-sky-400 hover:text-sky-300 bg-gray-800 hover:bg-gray-700 rounded-r-md border-l border-gray-700"
                >
                    Launch
                </button>
            </div>
          </div>

          <div>
            <label htmlFor="supply" className="block text-sm font-medium text-gray-300 flex items-center"><FaCoins className="mr-2 text-gray-400"/> Supply</label>
            <input type="text" id="supply" value={newSupply} onChange={onSupplyChange} className={inputBaseClass} placeholder="e.g., 1,000,000,000" />
          </div>
          <div>
            <label htmlFor="phone_whatsapp" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Phone/WhatsApp</label>
            <input type="text" id="phone_whatsapp" value={newPhoneWhatsapp} onChange={onPhoneWhatsappChange} className={inputBaseClass} placeholder="Your phone or WhatsApp number (optional)" />
          </div>
          <div>
            <label htmlFor="dollar_handle" className="block text-sm font-medium text-gray-300 flex items-center"><FaDollarSign className="mr-2 text-gray-400"/> $handle</label>
            <input type="text" id="dollar_handle" value={newDollarHandle} onChange={onDollarHandleChange} className={inputBaseClass} placeholder="e.g., $yourname" />
          </div>
        </div>

        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-300 flex items-center"><FaInfoCircle className="mr-2 text-gray-400"/> Bio</label>
          <textarea id="bio" rows={4} value={newBio} onChange={onBioChange} className={inputBaseClass} placeholder="Tell us about yourself..."></textarea>
        </div>

        <h3 className="text-lg font-semibold mt-8 mb-4 text-gray-300">Links & Contact</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="website_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Website URL</label>
            <input type="url" id="website_url" value={newWebsiteUrl} onChange={onWebsiteUrlChange} className={inputBaseClass} placeholder="https://yourwebsite.com" />
          </div>
          <div>
            <label htmlFor="github_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> GitHub URL</label>
            <input type="url" id="github_url" value={newGitHubUrl} onChange={onGitHubUrlChange} className={inputBaseClass} placeholder="https://github.com/yourprofile" />
          </div>
          <div>
            <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> LinkedIn URL</label>
            <input type="url" id="linkedin_url" value={newLinkedInUrl} onChange={onLinkedInUrlChange} className={inputBaseClass} placeholder="https://linkedin.com/in/yourprofile" />
          </div>
          <div>
            <label htmlFor="twitter_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Twitter URL</label>
            <input type="url" id="twitter_url" value={newTwitterUrl} onChange={onTwitterUrlChange} className={inputBaseClass} placeholder="https://twitter.com/yourhandle" />
          </div>
          <div>
            <label htmlFor="instagram_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Instagram URL</label>
            <input type="url" id="instagram_url" value={newInstagramUrl} onChange={onInstagramUrlChange} className={inputBaseClass} placeholder="https://instagram.com/yourhandle" />
          </div>
          <div>
            <label htmlFor="discord_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaLink className="mr-2 text-gray-400"/> Discord URL</label>
            <input type="url" id="discord_url" value={newDiscordUrl} onChange={onDiscordUrlChange} className={inputBaseClass} placeholder="Your Discord invite link or tag" />
          </div>
          <div>
            <label htmlFor="tiktok_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaTiktok className="mr-2 text-gray-400"/> TikTok URL</label>
            <input type="url" id="tiktok_url" value={newTikTokUrl} onChange={onTikTokUrlChange} className={inputBaseClass} placeholder="https://tiktok.com/@yourhandle" />
          </div>
          <div>
            <label htmlFor="telegram_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaTelegramPlane className="mr-2 text-gray-400"/> Telegram URL</label>
            <input type="url" id="telegram_url" value={newTelegramUrl} onChange={onTelegramUrlChange} className={inputBaseClass} placeholder="https://t.me/yourhandle" />
          </div>
          <div>
            <label htmlFor="facebook_url" className="block text-sm font-medium text-gray-300 flex items-center"><FaFacebook className="mr-2 text-gray-400"/> Facebook URL</label>
            <input type="url" id="facebook_url" value={newFacebookUrl} onChange={onFacebookUrlChange} className={inputBaseClass} placeholder="https://facebook.com/yourprofile" />
          </div>
        </div>
      </form>

      {showLaunchDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-xl border border-gray-700 text-center w-full max-w-md">
            <FaRocket className="text-sky-500 text-5xl mb-6 mx-auto" />
            <h3 className="text-2xl font-semibold text-white mb-4">Feature Coming Soon!</h3>
            <p className="text-gray-400 mb-6">
              The token launching functionality is currently under development. Stay tuned!
            </p>
            <button 
              onClick={() => setShowLaunchDialog(false)}
              className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-colors"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </section>
  );
} 