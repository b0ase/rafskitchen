'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { FaGoogle, FaEnvelope, FaLock, FaUserPlus, FaEye, FaEyeSlash, FaGithub, FaTwitter } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [signUpMessage, setSignUpMessage] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showRecoveryInput, setShowRecoveryInput] = useState(false);

  const handleMockLogin = async (type: string) => {
    setIsLoading(true);
    setError(null);
    
    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock successful login
    setSignUpMessage(`Demo login successful! Redirecting to dashboard...`);
    
    // Redirect to a demo page after login
    setTimeout(() => {
      router.push('/profile');
    }, 1500);
    
    setIsLoading(false);
  };

  const handleEmailPasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (isSignUpMode && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    
    handleMockLogin('email');
  };

  const handlePasswordRecovery = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setSignUpMessage('Demo: Recovery email sent! (This is just a demo)');
    setIsLoading(false);
  };

  const currentFormHandler = isSignUpMode ? handleEmailPasswordSubmit : (showRecoveryInput ? handlePasswordRecovery : handleEmailPasswordSubmit);

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            {showRecoveryInput ? 'Password Recovery' : isSignUpMode ? 'Sign Up' : 'Sign In'}
          </h1>
          <p className="text-gray-600">
            {showRecoveryInput 
              ? 'Enter your email to receive a password reset link' 
              : isSignUpMode 
                ? 'Create your RafsKitchen account' 
                : 'Access your RafsKitchen dashboard'
            }
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {signUpMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {signUpMessage}
          </div>
        )}

        {/* Email/Password Form */}
        <form onSubmit={currentFormHandler} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </div>
          </div>

          {!showRecoveryInput && (
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          )}

          {isSignUpMode && !showRecoveryInput && (
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {isLoading ? 'Processing...' : showRecoveryInput ? 'Send Recovery Email' : isSignUpMode ? 'Create Account' : 'Sign In'}
          </button>
        </form>

        {/* OAuth Buttons */}
        {!showRecoveryInput && (
          <div className="space-y-3">
            <div className="text-center text-gray-500 text-sm">Or continue with</div>
            
            <button
              onClick={() => handleMockLogin('google')}
              disabled={isLoading}
              className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
            >
              <FaGoogle className="mr-2" />
              Continue with Google
            </button>

            <button
              onClick={() => handleMockLogin('github')}
              disabled={isLoading}
              className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
            >
              <FaGithub className="mr-2" />
              Continue with GitHub
            </button>

            <button
              onClick={() => handleMockLogin('twitter')}
              disabled={isLoading}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center"
            >
              <FaTwitter className="mr-2" />
              Continue with X
            </button>
          </div>
        )}

        {/* Footer Links */}
        <div className="text-center space-y-2">
          {!showRecoveryInput && !isSignUpMode && (
            <button
              onClick={() => setShowRecoveryInput(true)}
              className="text-blue-600 hover:underline text-sm"
              disabled={isLoading}
            >
              Forgot your password?
            </button>
          )}
          
          {showRecoveryInput ? (
            <button
              onClick={() => {
                setShowRecoveryInput(false);
                setError(null);
                setSignUpMessage(null);
              }}
              className="text-blue-600 hover:underline text-sm"
              disabled={isLoading}
            >
              Back to sign in
            </button>
          ) : (
            <div className="text-sm">
              {isSignUpMode ? "Already have an account?" : "Don't have an account?"}{' '}
              <button
                onClick={() => {
                  setIsSignUpMode(!isSignUpMode);
                  setError(null);
                  setSignUpMessage(null);
                  setEmail('');
                  setPassword('');
                  setConfirmPassword('');
                }}
                className="text-blue-600 hover:underline"
                disabled={isLoading}
              >
                {isSignUpMode ? 'Sign in' : 'Sign up'}
              </button>
            </div>
          )}
          
          <div className="pt-4">
            <Link href="/" className="text-gray-600 hover:text-gray-900 text-sm">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 