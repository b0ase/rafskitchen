'use client';

import React from 'react';
import Link from 'next/link';
import { FaRocket, FaSave, FaSpinner } from 'react-icons/fa'; // Only keep icons needed for the main page JSX

import ProfileDetails from '@/components/ProfileDetails'; // Import the new component
import UserSkills from '@/components/UserSkills'; // Import the new UserSkills component
import UserTeams from '@/components/UserTeams'; // Import the new UserTeams component
import EditProfileForm from '@/components/EditProfileForm'; // Import the new EditProfileForm component

// Import the custom hook
import useProfileData from '@/lib/hooks/useProfileData';


export default function ProfilePage() {
  // Use the custom hook to get data and handlers
  const {
    user,
    profile,
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
    loading,
    saving,
    error,
    successMessage,
    isUploadingAvatar,
    avatarUploadError,
    allSkills,
    selectedSkills,
    userSkillIds,
    loadingSkills,
    savingSkills,
    userTeams,
    loadingUserTeams,
    errorUserTeams,
    customSkillInput,
    skillChoiceInAdder,
    setNewUsername,
    setNewDisplayName,
    setNewBio,
    setNewWebsiteUrl,
    setNewTwitterUrl,
    setNewLinkedInUrl,
    setNewGitHubUrl,
    setNewInstagramUrl,
    setNewDiscordUrl,
    setNewPhoneWhatsapp,
    setNewTikTokUrl,
    setNewTelegramUrl,
    setNewFacebookUrl,
    setNewDollarHandle,
    setNewTokenName,
    setNewSupply,
    setCustomSkillInput,
    setSkillChoiceInAdder,
    handleSaveProfile,
    handleSkillToggle,
    handleAddCustomSkill,
  } = useProfileData();

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center">
        <FaRocket className="text-6xl text-sky-500 mb-4 animate-pulse" />
        <p className="text-xl text-gray-400">Loading your universe...</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-white px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 overflow-x-hidden">
      <main className="flex-grow bg-black">
        <div className="mx-auto bg-black pt-8 max-w-7xl">
          <ProfileDetails
            profile={profile}
            isUploadingAvatar={isUploadingAvatar}
            avatarUploadError={avatarUploadError}
            onSaveProfile={handleSaveProfile}
            saving={saving}
            editProfileFormComponent={(
              <EditProfileForm
                newUsername={newUsername}
                newDisplayName={newDisplayName}
                newBio={newBio}
                newWebsiteUrl={newWebsiteUrl}
                newTwitterUrl={newTwitterUrl}
                newLinkedInUrl={newLinkedInUrl}
                newGitHubUrl={newGitHubUrl}
                newInstagramUrl={newInstagramUrl}
                newDiscordUrl={newDiscordUrl}
                newPhoneWhatsapp={newPhoneWhatsapp}
                newTikTokUrl={newTikTokUrl}
                newTelegramUrl={newTelegramUrl}
                newFacebookUrl={newFacebookUrl}
                newDollarHandle={newDollarHandle}
                newTokenName={newTokenName}
                newSupply={newSupply}
                saving={saving}
                error={error}
                successMessage={successMessage}
                avatarUploadError={avatarUploadError}
                onUsernameChange={(e) => setNewUsername(e.target.value)}
                onDisplayNameChange={(e) => setNewDisplayName(e.target.value)}
                onBioChange={(e) => setNewBio(e.target.value)}
                onWebsiteUrlChange={(e) => setNewWebsiteUrl(e.target.value)}
                onTwitterUrlChange={(e) => setNewTwitterUrl(e.target.value)}
                onLinkedInUrlChange={(e) => setNewLinkedInUrl(e.target.value)}
                onGitHubUrlChange={(e) => setNewGitHubUrl(e.target.value)}
                onInstagramUrlChange={(e) => setNewInstagramUrl(e.target.value)}
                onDiscordUrlChange={(e) => setNewDiscordUrl(e.target.value)}
                onPhoneWhatsappChange={(e) => setNewPhoneWhatsapp(e.target.value)}
                onTikTokUrlChange={(e) => setNewTikTokUrl(e.target.value)}
                onTelegramUrlChange={(e) => setNewTelegramUrl(e.target.value)}
                onFacebookUrlChange={(e) => setNewFacebookUrl(e.target.value)}
                onDollarHandleChange={(e) => setNewDollarHandle(e.target.value)}
                onTokenNameChange={(e) => setNewTokenName(e.target.value)}
                onSupplyChange={(e) => setNewSupply(e.target.value)}
                onSubmit={handleSaveProfile}
              />
            )}
            userSkillsComponent={(
              <UserSkills
                selectedSkills={selectedSkills}
                allSkills={allSkills}
                userSkillIds={userSkillIds}
                loadingSkills={loadingSkills}
                savingSkills={savingSkills}
                customSkillInput={customSkillInput}
                skillChoiceInAdder={skillChoiceInAdder}
                onSkillToggle={handleSkillToggle}
                onAddCustomSkill={handleAddCustomSkill}
                onCustomSkillInputChange={(e) => setCustomSkillInput(e.target.value)}
                onSkillChoiceInAdderChange={(e) => setSkillChoiceInAdder(e.target.value)}
              />
            )}
            userTeamsComponent={(
              <UserTeams
                userTeams={userTeams}
                loadingUserTeams={loadingUserTeams}
                errorUserTeams={errorUserTeams}
                userId={user.id}
              />
            )}
          />
        </div>
      </main>

      {/* Fixed Save Profile Button Container */}
      {user && profile && (
        <div className="fixed bottom-0 left-0 right-0 z-50 pointer-events-none">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-4 md:pb-6 lg:pb-8 flex justify-end pointer-events-auto">
            <button
              type="submit" // Submits the form with id="profile-form"
              form="profile-form" // Explicitly link to the form in EditProfileForm
              onClick={handleSaveProfile} // Use the existing save handler
              disabled={saving}
              className="px-6 py-3 rounded-lg text-base font-semibold flex items-center bg-sky-600 hover:bg-sky-700 text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-sky-500 disabled:opacity-60 shadow-xl transition-all duration-150 ease-in-out transform hover:scale-105"
              aria-label="Save Profile Changes"
            >
              {saving ? (
                <FaSpinner className="animate-spin mr-2 h-5 w-5" />
              ) : (
                <FaSave className="mr-2 h-5 w-5" />
              )}
              {saving ? 'Saving Profile...' : 'Save Profile'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}