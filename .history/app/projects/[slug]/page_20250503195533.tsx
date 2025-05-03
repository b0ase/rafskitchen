import React from 'react';
import ClientProjectPage from './ClientProjectPage';
import { portfolioData } from '@/lib/data';

interface ProjectDetailProps {
  params: {
    slug: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailProps) {
  const slug = params.slug;
  const project = portfolioData.projects.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="min-h-screen flex flex-col dark:bg-gradient-to-b dark:from-gray-950 dark:via-black dark:to-gray-950 dark:text-gray-300">
        <main className="flex-grow container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-red-600 dark:text-red-500">Project Not Found</h1>
          <p className="mt-4 text-gray-600 dark:text-gray-400">The requested project could not be found.</p>
        </main>
      </div>
    );
  }

  // Use Notion URL if available
  const notionUrl = project.notionUrl && project.notionUrl !== '#' ? project.notionUrl : undefined;

  return <ClientProjectPage projectSlug={slug} notionUrl={notionUrl} />;
} 