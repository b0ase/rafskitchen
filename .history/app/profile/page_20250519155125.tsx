'use client';

import React, { useEffect } from 'react';
import Link from 'next/link'; 
import { FaRocket, FaSave, FaSpinner } from 'react-icons/fa'; // Only keep icons needed for the main page JSX
import useProfileData from '@/lib/hooks/useProfileData'; // Import the custom hook
import ProfileDetails from '@/components/ProfileDetails'; // Import the new component
import UserSkills from '@/components/UserSkills'; // Import the new UserSkills component
import UserTeams from '@/components/UserTeams'; // Import the new UserTeams component
import EditProfileForm from '@/components/EditProfileForm'; // Import the new EditProfileForm component

export default function ProfilePage() {
  // Use the custom hook to get data and handlers
  const {
    user,
    profile,
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
    setNewFullName,
    setNewBio,
    setNewWebsiteUrl,
    setNewTwitterUrl,
    setNewLinkedInUrl,
    setNewGitHubUrl,
    setNewInstagramUrl,
    setNewDiscordUrl,
    setNewPhoneWhatsapp,
    setCustomSkillInput,
    setSkillChoiceInAdder,
    handleUpdateProfile,
    handleSimpleAvatarUpload,
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
      {/* Save Profile Button - Moved to the top and made sticky */}
      {/* Position it before the main content so it overlays */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
        <button
          form="profile-form" // Associate button with the form by id
          type="submit"
          disabled={saving}
          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? <FaSpinner className="animate-spin mr-3" /> : <FaSave className="mr-3" />}
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </div>

      <main className="flex-grow bg-black pt-20"> {/* Add padding-top to prevent content being hidden behind sticky button */}
        <div className="mx-auto bg-black">
          {/* Render ProfileDetails Component */}
          <ProfileDetails
            profile={profile}
            isUploadingAvatar={isUploadingAvatar}
            avatarUploadError={avatarUploadError}
            onAvatarUpload={handleSimpleAvatarUpload}
          />

          {/* Main Content Sections */}
          <div className="mt-10">
            <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
              {/* Render UserSkills Component */}
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

              {/* Render UserTeams Component */}
              <UserTeams
                userTeams={userTeams}
                loadingUserTeams={loadingUserTeams}
                errorUserTeams={errorUserTeams}
              />
            </div>

            {/* Render EditProfileForm Component */}
            <EditProfileForm
              newUsername={newUsername}
              newDisplayName={newDisplayName}
              newFullName={newFullName}
              newBio={newBio}
              newWebsiteUrl={newWebsiteUrl}
              newTwitterUrl={newTwitterUrl}
              newLinkedInUrl={newLinkedInUrl}
              newGitHubUrl={newGitHubUrl}
              newInstagramUrl={newInstagramUrl}
              newDiscordUrl={newDiscordUrl}
              newPhoneWhatsapp={newPhoneWhatsapp}
              saving={saving}
              error={error}
              successMessage={successMessage}
              avatarUploadError={avatarUploadError}
              onUsernameChange={(e) => setNewUsername(e.target.value)}
              onDisplayNameChange={(e) => setNewDisplayName(e.target.value)}
              onFullNameChange={(e) => setNewFullName(e.target.value)}
              onBioChange={(e) => setNewBio(e.target.value)}
              onWebsiteUrlChange={(e) => setNewWebsiteUrl(e.target.value)}
              onTwitterUrlChange={(e) => setNewTwitterUrl(e.target.value)}
              onLinkedInUrlChange={(e) => setNewLinkedInUrl(e.target.value)}
              onGitHubUrlChange={(e) => setNewGitHubUrl(e.target.value)}
              onInstagramUrlChange={(e) => setNewInstagramUrl(e.target.value)}
              onDiscordUrlChange={(e) => setNewDiscordUrl(e.target.value)}
              onPhoneWhatsappChange={(e) => setNewPhoneWhatsapp(e.target.value)}
              onSubmit={handleUpdateProfile}
            />
           </div>
        </div>
      </main>
    </div>
  );
} 