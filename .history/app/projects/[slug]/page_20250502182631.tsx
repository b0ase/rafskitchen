import React from 'react';
import { portfolioData } from '@/lib/data'; // Use alias path
import Link from 'next/link'; // Import Link
import { FaExternalLinkAlt, FaGithub } from 'react-icons/fa';

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
  const project = portfolioData.projects.find(p => p.slug === slug);

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

        {/* Project Links */}
        <div className="flex space-x-4 mb-8">
            {project.liveUrl && (
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium shadow-sm dark:shadow-md transition-colors">
                 <FaExternalLinkAlt className="mr-2" /> Visit Live Site
              </a>
            )}
             {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-700 hover:bg-gray-800 text-white text-sm font-medium shadow-sm dark:shadow-md transition-colors">
                 <FaGithub className="mr-2" /> View Code
              </a>
            )}
        </div>

        {/* Tech Stack */}
        <div className="bg-gray-100 dark:bg-gray-900 p-4 md:p-6 border border-gray-200 dark:border-gray-700 mb-8">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Technology Stack</h3>
            <div className="flex flex-wrap gap-2">
                {project.tech && project.tech.length > 0 ? (
                    project.tech.map((tech) => (
                        <span key={tech} className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs font-medium px-2.5 py-0.5 border border-gray-300 dark:border-gray-600 shadow-sm">
                            {tech}
                        </span>
                    ))
                ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-sm italic">Tech stack details unavailable.</p>
                )}
            </div>
        </div>

        {/* Key Features */}
        <div className="bg-white dark:bg-black p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl mb-8">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Key Features</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                <li>Placeholder Feature 1 (e.g., User Authentication)</li>
                <li>Placeholder Feature 2 (e.g., E-commerce Integration)</li>
                <li>Placeholder Feature 3 (e.g., Content Management System)</li>
                <li>Placeholder Feature 4 (e.g., Responsive Design)</li>
                {/* TODO: Populate with actual features */} 
            </ul>
        </div>
        
        {/* Image Gallery Placeholder */}
        <div className="bg-gray-100 dark:bg-gray-900 p-4 md:p-6 border border-gray-200 dark:border-gray-700 mb-8 text-center">
            <h3 className="text-lg font-semibold text-black dark:text-white mb-3">Screenshots / Gallery</h3>
            <div className="h-40 flex items-center justify-center bg-gray-200 dark:bg-gray-800 border border-dashed border-gray-400 dark:border-gray-600">
                 <p className="text-gray-500 dark:text-gray-400 italic">[Website Images Placeholder]</p>
            </div>
        </div>

        {/* Client Testimonial Placeholder */}
        <div className="bg-white dark:bg-black p-6 md:p-8 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl mb-8">
            <blockquote className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 italic text-gray-600 dark:text-gray-400">
                "Placeholder testimonial text goes here. This project exceeded expectations..."
                <footer className="mt-2 text-sm text-gray-500 dark:text-gray-500">- Placeholder Client Name, Placeholder Company</footer>
            </blockquote>
        </div>

         <div className="text-center mt-12">
            <Link href="/#projects" className="inline-block px-6 py-3 bg-blue-700 text-white font-medium hover:bg-blue-600 transition-colors shadow-md">
                Back to Projects
            </Link>
        </div>

      </main>
    </div>
  );
} 