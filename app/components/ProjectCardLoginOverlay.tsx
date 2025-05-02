'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/lib/data'; 

interface ProjectCardLoginOverlayProps {
  project: Project;
  isVisible: boolean; // To control visibility via parent hover state
}

const HARDCODED_PASSWORD = 'password'; // Simple hardcoded password

export default function ProjectCardLoginOverlay({ project, isVisible }: ProjectCardLoginOverlayProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  if (!project) {
    return null; 
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); 

    if (password === HARDCODED_PASSWORD) {
      console.log(`Login successful for ${project.title}. Redirecting...`);
      // No need for onClose, just redirect
      router.push(`/projects/${project.slug}`); 
    } else {
      console.log('Login failed: Incorrect password');
      setError('Incorrect password.');
      setPassword(''); // Clear password field on error
    }
  };

  return (
    <div 
      className={`absolute inset-0 z-10 flex items-center justify-center p-4 bg-black bg-opacity-80 backdrop-blur-sm transition-opacity duration-300 ${isVisible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      // Prevent click propagation if needed, though maybe not necessary if parent handles hover
      onClick={e => e.stopPropagation()}
    >
      <div className="w-full max-w-xs">
        <h3 className="text-lg font-semibold text-white mb-3 text-center truncate" title={project.title}>
          Login: {project.title}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label htmlFor={`password-${project.slug}`} className="sr-only">
              Password
            </label>
            <input
              type="password"
              id={`password-${project.slug}`} // Unique ID per card
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-600 bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {error && (
            <p className="text-red-400 text-xs text-center">{error}</p>
          )}

          <button 
            type="submit"
            className="w-full px-4 py-2 bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
          >
            Access Project
          </button>
        </form>
      </div>
    </div>
  );
} 