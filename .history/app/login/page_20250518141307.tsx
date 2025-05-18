'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import getSupabaseBrowserClient from '@/lib/supabase/client';
import { FaGoogle, FaEnvelope, FaLock, FaUserPlus, FaEye, FaEyeSlash, FaGithub, FaTwitter, FaCreditCard, FaEthereum, FaBitcoin } from 'react-icons/fa';
import { SiSolana } from 'react-icons/si';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const supabase = getSupabaseBrowserClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthProcessing, setIsAuthProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRecoveryInput, setShowRecoveryInput] = useState(false);
  const [recoveryEmailSent, setRecoveryEmailSent] = useState(false);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // Determine the base URL for redirection
      // Use NEXT_PUBLIC_SITE_URL if available (for Vercel), otherwise fallback to window.location.origin
      const redirectURLBase = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

      const { error: signInError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          // Redirect to the auth callback handler
          redirectTo: `${redirectURLBase}/auth/callback`,
          queryParams: {
            access_type: 'offline', // Optional: if you need refresh tokens
            prompt: 'select_account',
          },
        },
      });

      if (signInError) {
        console.error('Google Sign-In Error:', signInError);
        setError(`Could not sign in with Google: ${signInError.message}`);
        setIsLoading(false);
      }
    } catch (e: any) {
      console.error('Unexpected Google Sign-In Error:', e);
      setError(`An unexpected error occurred: ${e.message}`);
      setIsLoading(false);
    }
  };

  const handleGitHubSignIn = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Attempting GitHub Sign-In...');
    // Placeholder for GitHub OAuth
    // const { error } = await supabase.auth.signInWithOAuth({ provider: 'github', options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback` } });
    // if (error) {
    //   setError(`Could not sign in with GitHub: ${error.message}`);
    // }
    setIsLoading(false);
    alert('GitHub Sign-In not yet implemented.');
  };

  const handleXSignIn = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Attempting X/Twitter Sign-In...');
    // Placeholder for X/Twitter OAuth
    // const { error } = await supabase.auth.signInWithOAuth({ provider: 'twitter', options: { redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || window.location.origin}/auth/callback` } });
    // if (error) {
    //   setError(`Could not sign in with X: ${error.message}`);
    // }
    setIsLoading(false);
    alert('X/Twitter Sign-In not yet implemented.');
  };

  const handlePhantomSignIn = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Attempting Phantom Wallet Sign-In...');
    // Placeholder for Phantom Wallet integration
    setIsLoading(false);
    alert('Phantom Wallet Sign-In not yet implemented.');
  };

  const handleHandCashSignIn = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Attempting HandCash Wallet Sign-In...');
    // Placeholder for HandCash Wallet integration
    setIsLoading(false);
    alert('HandCash Wallet Sign-In not yet implemented.');
  };

  const handleMetaMaskSignIn = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Attempting MetaMask Wallet Sign-In...');
    // Placeholder for MetaMask Wallet integration
    setIsLoading(false);
    alert('MetaMask Wallet Sign-In not yet implemented.');
  };

  const handleEmailPasswordSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSignUpMode) return;
    setIsAuthProcessing(true);
    setError(null);
    setSignUpMessage(null);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Email Sign-In Error:', signInError);
        setError(`Could not sign in: ${signInError.message}`);
      } else {
        // onAuthStateChange will handle redirect if successful
        // No explicit redirect here to avoid race conditions with listener
        // router.push('/profile'); // Typically handled by onAuthStateChange
      }
    } catch (e: any) {
      console.error('Unexpected Email Sign-In Error:', e);
      setError(`An unexpected error occurred: ${e.message}`);
    } finally {
      setIsAuthProcessing(false);
    }
  };

  const handlePasswordRecovery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsAuthProcessing(true);
    setError(null);
    setRecoveryEmailSent(false);
    try {
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/update-password`
      });

      if (resetError) {
        console.error('Password Reset Error:', resetError);
        setError(`Could not send recovery email: ${resetError.message}`);
      } else {
        setRecoveryEmailSent(true);
        setError(null);
      }
    } catch (e: any) {
      console.error('Unexpected Password Reset Error:', e);
      setError(`An unexpected error occurred: ${e.message}`);
    } finally {
      setIsAuthProcessing(false);
    }
  };

  const handleEmailPasswordSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isSignUpMode) return;
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setIsAuthProcessing(true);
    setError(null);
    setSignUpMessage(null);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (signUpError) {
        console.error('Email Sign-Up Error:', signUpError);
        setError(`Could not sign up: ${signUpError.message}`);
      } else if (data.user && data.user.identities && data.user.identities.length === 0) {
        setSignUpMessage('Sign-up successful. Please check your email to confirm your account if required.');
        setError(null);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else if (data.user) {
        setSignUpMessage('Sign-up successful! Please check your email to confirm your account.');
        setError(null);
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        setError('Sign up did not complete as expected. Please try again.');
      }
    } catch (e: any) {
      console.error('Unexpected Email Sign-Up Error:', e);
      setError(`An unexpected error occurred: ${e.message}`);
    } finally {
      setIsAuthProcessing(false);
    }
  };

  useEffect(() => {
    // If user is already on the login page, don't aggressively redirect them based on an existing session
    // unless it's a fresh SIGNED_IN event.
    // Let them interact with the page if they landed here explicitly.

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log(`[LoginPage] Auth Event: ${event}`);
      if (event === 'SIGNED_IN' && session) {
        console.log('[LoginPage] SIGNED_IN event, redirecting.');
        const searchParams = new URLSearchParams(window.location.search);
        const redirectedFrom = searchParams.get('redirectedFrom');
        router.push(redirectedFrom || '/profile');
        // router.refresh(); // Consider removing or conditionally calling refresh if issues persist
      } else if (event === 'SIGNED_OUT') {
        // User signed out, ensure they are not pushed away from login if they land here.
        console.log('[LoginPage] SIGNED_OUT event.');
      }
    });

    // Check initial session only to potentially offer a "continue to profile" option
    // rather than an immediate redirect if the user explicitly navigated to /login.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && window.location.pathname === '/login') {
        // User is logged in and on the login page.
        // Instead of auto-redirecting, you could show a message like "You are already logged in. Go to profile?"
        // For now, let's still redirect, but this is a point for future UX improvement.
        console.log('[LoginPage] Initial session exists and user is on /login. Redirecting.');
        const searchParams = new URLSearchParams(window.location.search);
        const redirectedFrom = searchParams.get('redirectedFrom');
        router.push(redirectedFrom || '/profile');
      } else if (!session) {
        console.log('[LoginPage] No initial session found.');
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, [supabase, router]);

  const currentFormHandler = isSignUpMode ? handleEmailPasswordSignUp : (showRecoveryInput ? handlePasswordRecovery : handleEmailPasswordSignIn);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 p-8 md:p-12 border border-gray-700 shadow-2xl rounded-lg text-center max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-white mb-6">{isSignUpMode ? 'Create Account' : 'Login'}</h1>
        <p className="text-gray-400 mb-8">
          {isSignUpMode ? 'Join us to access your profile and tools.' : 'Access your profile and application tools.'}
        </p>

        <form onSubmit={currentFormHandler} className="space-y-4 mb-6">
          {!recoveryEmailSent && (
            <div>
              <label htmlFor="email" className="sr-only">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-600 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                  placeholder="you@example.com"
                  disabled={isAuthProcessing}
                />
              </div>
            </div>
          )}

          {!isSignUpMode && !showRecoveryInput && !recoveryEmailSent && (
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-gray-500" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete={isSignUpMode ? "new-password" : "current-password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-600 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                  placeholder="Password"
                  disabled={isAuthProcessing}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 focus:outline-none"
                >
                  {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          )}

          {isSignUpMode && !recoveryEmailSent && (
            <>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-600 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                    placeholder="Password"
                    disabled={isAuthProcessing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 focus:outline-none"
                  >
                    {showPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 border border-gray-600 bg-gray-800 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 placeholder-gray-500"
                    placeholder="Confirm Password"
                    disabled={isAuthProcessing}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 focus:outline-none"
                  >
                    {showConfirmPassword ? <FaEyeSlash className="h-5 w-5" /> : <FaEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {!recoveryEmailSent && (
            <div>
              <button
                type="submit"
                disabled={isAuthProcessing || !email || (!isSignUpMode && !showRecoveryInput && !password) || (isSignUpMode && !confirmPassword)}
                className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
              >
                {isAuthProcessing ? (isSignUpMode ? 'Creating Account...' : (showRecoveryInput ? 'Sending Email...' : 'Signing in...')) : (isSignUpMode ? 'Sign Up' : (showRecoveryInput ? 'Send Recovery Email' : 'Sign in with Email'))}
              </button>
            </div>
          )}

          {!isSignUpMode && !showRecoveryInput && (
            <div className="text-center">
              <button
                type="button"
                onClick={() => setShowRecoveryInput(true)}
                className="text-sm font-medium text-sky-400 hover:text-sky-300 focus:outline-none"
              >
                Forgot password?
              </button>
            </div>
          )}

          {recoveryEmailSent && (
            <p className="my-3 text-sm text-green-400 bg-green-900/20 p-2 rounded-md">
              Password recovery email sent. Please check your inbox.
            </p>
          )}

        </form>

        {error && !recoveryEmailSent && (
          <p className="my-3 text-sm text-red-400 bg-red-900/20 p-2 rounded-md">{error}</p>
        )}
        {signUpMessage && !recoveryEmailSent && (
          <p className="my-3 text-sm text-green-400 bg-green-900/20 p-2 rounded-md">{signUpMessage}</p>
        )}

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-700" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-gray-900 text-sm text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <button
            onClick={handleGoogleSignIn}
            disabled={isLoading || isAuthProcessing}
            className="w-full inline-flex items-center justify-start px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-red-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            <FaGoogle className="mr-3 h-5 w-5" />
            {isLoading ? 'Redirecting to Google...' : 'Sign in with Google'}
          </button>
          {/* GitHub Sign-In Button */}
          <button
            onClick={handleGitHubSignIn}
            disabled={isLoading || isAuthProcessing}
            className="w-full inline-flex items-center justify-start px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            <FaGithub className="mr-3 h-5 w-5" />
            {'Sign in with GitHub'}
          </button>
          {/* X/Twitter Sign-In Button */}
          <button
            onClick={handleXSignIn}
            disabled={isLoading || isAuthProcessing}
            className="w-full inline-flex items-center justify-start px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-600 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            <FaTwitter className="mr-3 h-5 w-5" />
            {'Sign in with X.com'}
          </button>
          {/* Phantom Wallet Sign-In Button TODO: Update icon */}
          <button
            onClick={handlePhantomSignIn}
            disabled={isLoading || isAuthProcessing}
            className="w-full inline-flex items-center justify-start px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-purple-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            <SiSolana className="mr-3 h-5 w-5" />
            {'Sign in with Phantom'}
          </button>
          {/* HandCash Wallet Sign-In Button TODO: Update icon */}
          <button
            onClick={handleHandCashSignIn}
            disabled={isLoading || isAuthProcessing}
            className="w-full inline-flex items-center justify-start px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-green-400 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            <FaBitcoin className="mr-3 h-5 w-5" />
            {'Sign in with HandCash'}
          </button>
          {/* MetaMask Wallet Sign-In Button */}
          <button
            onClick={handleMetaMaskSignIn}
            disabled={isLoading || isAuthProcessing}
            className="w-full inline-flex items-center justify-start px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-orange-400 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
          >
            <FaEthereum className="mr-3 h-5 w-5" /> {/* Assuming FaEthereum is available */}
            {'Sign in with MetaMask'}
          </button>
        </div>
        <div className="mt-6 text-sm">
          {isSignUpMode ? (
            <p className="text-gray-400">
              Already have an account?{' '}
              <button 
                onClick={() => { setIsSignUpMode(false); setError(null); setSignUpMessage(null); }}
                className="font-medium text-sky-400 hover:text-sky-300"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p className="text-gray-400">
              Don't have an account?{' '}
              <button 
                onClick={() => { setIsSignUpMode(true); setError(null); setSignUpMessage(null); }}
                className="font-medium text-sky-400 hover:text-sky-300"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
        <div className="mt-8">
          <Link href="/"
            className="text-sky-400 hover:text-sky-300 transition-colors duration-150">
            &larr; Go back to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
} 