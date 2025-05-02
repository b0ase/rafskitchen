'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaTimes } from 'react-icons/fa';
import { Project } from '@/lib/data'; // Assuming Project type is exported from data.ts

interface LoginModalProps {
  project: Project | null;
  onClose: () => void;
}

// Define the Project type locally if not exported (adjust properties as needed)
// interface Project {
//   id: number;
//   title: string;
//   slug: string; // Make sure slug exists on the project object
//   // Add other necessary properties
// }

const HARDCODED_PASSWORD = 'password'; // Simple hardcoded password

export default function LoginModal({ project, onClose }: LoginModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  // Reset form when project changes or modal opens/closes
  useEffect(() => {
    setPassword('');
    setError('');
  }, [project]);

  if (!project) {
    return null; // Don't render anything if no project is selected
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (password === HARDCODED_PASSWORD) {
      console.log(`Login successful for ${project.title}. Redirecting...`);
      onClose(); // Close the modal
      router.push(`/projects/${project.slug}`); // Redirect to project page
    } else {
      console.log('Login failed: Incorrect password');
      setError('Incorrect password. Please try again.');
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm" 
      onClick={onClose} // Close modal on background click
    >
      <div 
        className="bg-white dark:bg-gray-900 p-6 md:p-8 border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-md relative text-black dark:text-white"
        onClick={e => e.stopPropagation()} // Prevent background click when clicking inside modal
      >
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
          aria-label="Close modal"
        >
          <FaTimes size={20} />
        </button>
        
        <h2 className="text-xl md:text-2xl font-semibold mb-4">
          Client Login: {project.title}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {error && (
            <p className="text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>
          )}

          <button 
            type="submit"
            className="w-full px-4 py-2 bg-black dark:bg-blue-600 text-white dark:text-white font-medium hover:bg-gray-800 dark:hover:bg-blue-700 transition-colors shadow-sm dark:shadow-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
} 