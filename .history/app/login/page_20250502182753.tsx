'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Use App Router's router
import { portfolioData } from '@/lib/data'; // Use path alias

export default function LoginPage() {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // Filter domain projects for the dropdown
  const domainProjects = (portfolioData.projects as any[]).filter(p => p.type === 'domain');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    const expectedPassword = projectPasswords[selectedProject];

    if (selectedProject && password && expectedPassword && password === expectedPassword) {
      console.log('Login successful for:', selectedProject);
      // Find the selected project object
      const project = domainProjects.find((p) => p.title === selectedProject);
      if (project && project.slug) {
        router.push(`/projects/${project.slug}`);
      } else {
        setError('Project not found.');
      }
    } else if (!selectedProject) {
       setError('Please select a project.');
    } else {
      setError('Incorrect password or project not found.'); // Simplified error
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 flex flex-col">
      <main className="flex-grow flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-gray-900 p-8 shadow-lg border border-gray-800">
          <h1 className="text-2xl font-bold text-white mb-6 text-center">Client Project Login</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="project-select" className="block text-sm font-medium text-gray-300 mb-1">
                Select Project:
              </label>
              <select 
                id="project-select"
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
              >
                <option value="" disabled>-- Select Your Project --</option>
                {domainProjects.map((project) => (
                  <option key={project.id} value={project.title}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password:
              </label>
              <input 
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
            )}

            <button 
              type="submit"
              className="w-full bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 transition duration-300 shadow-md disabled:opacity-50"
              disabled={!selectedProject || !password}
            >
              Login
            </button>
          </form>
        </div>
      </main>
    </div>
  );
} 