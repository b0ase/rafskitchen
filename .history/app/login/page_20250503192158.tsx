'use client';

import React, { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { portfolioData } from '@/lib/data';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export default function LoginPage() {
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  // Filter domain projects for the dropdown
  const domainProjects = (portfolioData.projects as any[]).filter(p => p.type === 'domain');

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/client-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectSlug: selectedProject, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Find the selected project object
        const project = domainProjects.find((p) => p.title === selectedProject || p.slug === selectedProject);
        if (project && project.slug) {
          router.push(`/projects/${project.slug}`);
        } else {
          setError('Project not found.');
        }
      } else {
        setError(data.error || 'Incorrect password or project not found.');
      }
    } catch (err) {
      setError('Server error.');
    }
    setLoading(false);
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
                  <option key={project.id} value={project.slug}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                Your Email:
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"
              />
            </div>

            <div className="mb-6 relative">
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
                Password:
              </label>
              <input 
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm pr-10"
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-200 focus:outline-none"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
              disabled={loading || !selectedProject || !email || !password}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </main>
    </div>
  );
} 