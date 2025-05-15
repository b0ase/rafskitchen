'use client';

import React, { useState, FormEvent } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function SettingsPage() {
  const supabase = createClientComponentClient();

  // State for password change form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    setMessage('');
    setError('');

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match.");
      setIsUpdating(false);
      return;
    }

    if (newPassword.length < 6) { // Example: Supabase default minimum password length
      setError("New password must be at least 6 characters long.");
      setIsUpdating(false);
      return;
    }

    // Supabase requires current password to update password IF "Secure password changes" is enabled in Auth settings
    // However, the JS library's updateUser method for password only takes the new password.
    // For updating email, it can take password.
    // For password reset flow (forgot password), it works without old password.
    // For direct password update while logged in, Supabase's default behavior might vary based on project settings (e.g. "Secure password changes" toggle)
    // The supabase.auth.updateUser({ password: new_password }) method is the standard way.
    // If "Secure password changes" is enabled, this call might internally fail if Supabase expects the old password
    // or if it's intended to be used with a flow that reauthenticates.
    // For now, we'll proceed with the standard client library call.
    // If this is an issue, we may need to guide the user to check their Supabase Auth settings or explore reauthentication.

    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      // A common error if "Secure password changes" is enabled and the user hasn't reauthenticated recently enough
      // or if the password doesn't meet policy requirements not caught by client-side checks.
      if (updateError.message.includes("requires a recent login") || updateError.message.includes("For security purposes, you need to re-authenticate")) {
        setError("For security reasons, you might need to log out and log back in before changing your password, or this operation requires a more recent login.");
      } else if (updateError.message.includes("same as the existing password")) {
        setError("The new password cannot be the same as your current password.");
      }
       else {
        setError(`Failed to update password: ${updateError.message}`);
      }
    } else {
      setMessage("Password updated successfully!");
      setCurrentPassword(''); // Clear fields on success
      setNewPassword('');
      setConfirmNewPassword('');
    }
    setIsUpdating(false);
  };

  return (
    <div className="p-4 md:p-8">
      <div className="max-w-2xl mx-auto bg-slate-800 shadow-xl rounded-lg p-6 md:p-8">
        <div className="space-y-8">
          {/* Account Settings Section with Change Password Form */}
          <section>
            <h2 className="text-xl font-semibold text-sky-300 mb-3">Account</h2>
            <div className="bg-slate-700/50 p-4 rounded-md border border-slate-600 space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">Email Address</label>
                <input 
                  type="email" 
                  name="email" 
                  id="email" 
                  disabled 
                  placeholder={supabase.auth.getSession() ? supabase.auth.getSession().data?.session?.user?.email || 'user@example.com' : 'user@example.com'}
                  className="mt-1 block w-full bg-slate-600 border-slate-500 rounded-md shadow-sm py-2 px-3 text-gray-400 focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm cursor-not-allowed" 
                />
                 <p className="text-xs text-gray-400 mt-1">Email addresses can be changed via a confirmation link sent to the new email.</p>
              </div>

              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="mt-1 block w-full bg-slate-700 border-slate-500 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-300">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmNewPassword"
                    id="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                    className="mt-1 block w-full bg-slate-700 border-slate-500 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                  />
                </div>
                <button 
                  type="submit"
                  disabled={isUpdating}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800 disabled:opacity-50"
                >
                  {isUpdating ? 'Updating...' : 'Update Password'}
                </button>
                {message && <p className="text-sm text-green-400">{message}</p>}
                {error && <p className="text-sm text-red-400">{error}</p>}
              </form>
            </div>
          </section>

          {/* Placeholder for Profile Settings */}
          <section>
            <h2 className="text-xl font-semibold text-sky-300 mb-3">Profile Customization</h2>
            <div className="bg-slate-700/50 p-4 rounded-md border border-slate-600">
              <p className="text-gray-300">Update your public profile information, avatar, and social links.</p>
               <button 
                  type="button"
                  disabled
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 focus:ring-offset-slate-800 cursor-not-allowed opacity-70"
                >
                  Edit Profile (Coming Soon)
                </button>
            </div>
          </section>

          {/* Placeholder for Notification Settings */}
          <section>
            <h2 className="text-xl font-semibold text-sky-300 mb-3">Notifications</h2>
            <div className="bg-slate-700/50 p-4 rounded-md border border-slate-600">
              <p className="text-gray-300">Configure your notification preferences for projects, tasks, and messages.</p>
            </div>
          </section>

          {/* Placeholder for Theme/Appearance Settings */}
          <section>
            <h2 className="text-xl font-semibold text-sky-300 mb-3">Appearance</h2>
            <div className="bg-slate-700/50 p-4 rounded-md border border-slate-600">
              <p className="text-gray-300">Choose your preferred theme (Light/Dark) and other display settings.</p>
            </div>
          </section>
        </div>

        <div className="mt-10 pt-6 border-t border-slate-700 text-center">
          <p className="text-sm text-gray-500">More settings will be available soon.</p>
        </div>
      </div>
    </div>
  );
} 