'use client';

import React from 'react';
import Link from 'next/link';
import { FaGoogle, FaEnvelope, FaLock, FaGithub, FaTwitter } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const handleDirectNavigation = () => {
    // Direct navigation to profile - no auth needed for demo
    router.push('/profile');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          {/* <h1 className="text-3xl font-bold mb-2">Demo Access</h1> */}
          {/* <p className="text-gray-600">Access the RafsKitchen demo dashboard</p> */}
        </div>

        {/* Demo Notice */}
        {/* 
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded text-sm">
          <strong>Demo Mode:</strong> Click any button below to access the demo dashboard instantly.
        </div> 
        */}

        {/* Simple Demo Buttons */}
        <div className="space-y-3 pt-8">
          {/* Main "Access Demo Dashboard" button - Removed */}
          {/* 
          <button
            onClick={handleDirectNavigation}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium"
          >
            Access Demo Dashboard
          </button> 
          */}

          <button
            onClick={handleDirectNavigation}
            className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium flex items-center justify-center"
          >
            <FaGoogle className="mr-2" />
            Continue with Google (Demo)
          </button>

          <button
            onClick={handleDirectNavigation}
            className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium flex items-center justify-center"
          >
            <FaGithub className="mr-2" />
            Continue with GitHub (Demo)
          </button>

          <button
            onClick={handleDirectNavigation}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium flex items-center justify-center"
          >
            <FaTwitter className="mr-2" />
            Continue with X (Demo)
          </button>
        </div>

        {/* Footer Links */}
        <div className="text-center space-y-2">
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