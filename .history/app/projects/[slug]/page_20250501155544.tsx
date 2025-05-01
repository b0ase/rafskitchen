import React from 'react';
import Header from '../../components/Header'; // Adjust path
import Footer from '../../components/Footer'; // Adjust path

// Use inline type definition matching Next.js pattern
export default function ProjectDetailPage({
  params,
}: {
  params: { slug: string };
  // searchParams?: { [key: string]: string | string[] | undefined }; // Add if needed
}) {
  // TODO: Fetch project data based on slug from portfolioData or an API
  // For now, just display the slug
  const projectName = params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()); // Basic formatting

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans flex flex-col">
      <Header />
      <main className="flex-grow container px-4 py-16">
        <h1 className="text-3xl font-bold text-white mb-6">Project: {projectName}</h1>
        <p className="mb-4">Details about this project will go here.</p>

        {/* Placeholder for Tabs/Roadmap/Resources */}
        <div className="bg-gray-900 p-6 shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Roadmap & Resources</h2>
          <p className="text-gray-400">Coming soon...</p>
          {/* Tabs would go here */}
        </div>
      </main>
      <Footer />
    </div>
  );
} 