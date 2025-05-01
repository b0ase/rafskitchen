'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation'; // Use App Router's router
import Header from '../components/Header';
import Footer from '../components/Footer';
import { portfolioData } from '../lib/data'; // Import project data

export default function LoginPage() {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const router = useRouter();

  // Filter domain projects for the dropdown
  // Add type assertion to help with potential TS issues (though root cause remains)
  const domainProjects = (portfolioData.projects as any[]).filter(p => p.type === 'domain');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(''); // Clear previous errors

    // --- Placeholder Password Logic --- 
    // In a real app, you'd fetch the correct password for the selectedProject 
    // (e.g., from an environment variable map or a secure backend)
    // and compare hashes.
    
    // Example: Simple check (replace with actual secure logic)
    const expectedPassword = process.env[`NEXT_PUBLIC_PASSWORD_${selectedProject.toUpperCase().replace(/\.|-/g, '')}`];

    if (selectedProject && password && expectedPassword && password === expectedPassword) {
      // Password correct - redirect to a protected project page (e.g., /clients/[projectSlug])
      // For now, just log success and maybe redirect to home
      console.log('Login successful for:', selectedProject);
      alert('Login successful! (Placeholder - redirecting home)');
      router.push('/'); // Redirect to home for now
    } else if (!selectedProject) {
       setError('Please select a project.');
    } else if (!expectedPassword) {
       setError('Project not found or password not configured.'); // Or a generic error
    } else {
      setError('Incorrect password for selected project.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-black to-gray-950 text-gray-300 font-mono flex flex-col">
      <Header />
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
      <Footer />
    </div>
  );
} 