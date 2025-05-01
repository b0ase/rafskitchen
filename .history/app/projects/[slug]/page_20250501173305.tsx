import React from 'react';
// Remove incorrect PageProps import
import Header from '../../components/Header'; // Adjust path
import Footer from '../../components/Footer'; // Adjust path

// Revert to simple inline type for props
export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  // TODO: Fetch project data based on slug from portfolioData or an API
  // For now, just display the slug
  // Explicitly type 'l' as string in the replace callback
  const projectName = params.slug.replace(/-/g, ' ').replace(/\b\w/g, (l: string) => l.toUpperCase()); 

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