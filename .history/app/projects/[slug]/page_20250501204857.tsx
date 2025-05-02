import React from 'react';
import { portfolioData } from '@/lib/data'; // Use alias path
import Link from 'next/link'; // Import Link

// Header/Footer are handled by layout.tsx, no need to import here
// import Header from '../../components/Header'; 
// import Footer from '../../components/Footer'; 

interface ProjectDetailProps {
  params: { 
    slug: string; 
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailProps) {
  const slug = params.slug;
  // Fetch project data based on slug 
  const project = portfolioData.projects.find(p => 
    // Generate a slug from title for matching (simple example)
    (p.title || '').toLowerCase().replace(/\s+/g, '-').replace(/[.]/g, '') === slug
  );

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-gradient-to-b dark:from-gray-950 dark:via-black dark:to-gray-950 dark:text-gray-300">
          <main className="flex-grow container mx-auto px-4 py-16 text-center">
              <h1 className="text-2xl font-bold text-red-600 dark:text-red-500">Project Not Found</h1>
              <p className="mt-4 text-gray-600 dark:text-gray-400">The requested project could not be found.</p>
              <Link href="/#projects" className="mt-6 inline-block px-6 py-2 bg-blue-700 text-white font-medium hover:bg-blue-600 transition-colors shadow-md">
                  Back to Projects
              </Link>
          </main>
      </div>
    );
  }

  return (
    // Use dark theme background from globals.css implicitly via layout
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto px-4 py-12 md:py-16">
        {/* Project Title */}
        <h1 className="text-3xl md:text-4xl font-bold text-black dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-3">
           <span className="text-purple-500 dark:text-purple-400">#</span> {project.title}
        </h1>

        {/* Project Description */}
        <div className="bg-white dark:bg-black p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl mb-8">
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {project.description}
            </p>
        </div>

        {/* Placeholder for more details (tech stack, status, links etc) */}
        <div className="bg-gray-100 dark:bg-gray-900 p-4 border border-gray-200 dark:border-gray-700 text-sm text-gray-700 dark:text-gray-400 mb-8">
            <h3 className="font-semibold text-black dark:text-white mb-2">More Details</h3>
            <p className="italic">More project details (tech stack, status, links) coming soon...</p>
            {/* TODO: Add Tech stack list, status badge, links (GitHub, Live etc.) */}
        </div>

         <div className="text-center">
            <Link href="/#projects" className="inline-block px-6 py-3 bg-blue-700 text-white font-medium hover:bg-blue-600 transition-colors shadow-md">
                Back to Projects
            </Link>
        </div>

      </main>
    </div>
  );
} 