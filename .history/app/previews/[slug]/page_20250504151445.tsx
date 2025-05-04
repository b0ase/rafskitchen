'use client'; // Keep client-side for now, might become server component later

import Link from 'next/link';

// This component receives the slug from the dynamic route
export default function ProjectPreviewPage({ params }: { params: { slug: string } }) {
  const projectSlug = params.slug;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-4">Live Preview</h1>
      <p className="text-xl text-gray-300 mb-8">Project: <span className="font-semibold text-cyan-400">{projectSlug}</span></p>
      
      <div className="bg-gray-800 p-10 rounded-lg shadow-lg text-center">
        <p className="text-lg mb-4">This page will eventually display the live preview of the website being built for {projectSlug}.</p>
        <p className="text-sm text-gray-400">(Currently under construction)</p>
      </div>

      <div className="mt-10 flex gap-4">
          {/* Link back to the main project page */}
          <Link href={`/projects/${projectSlug}`}>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-5 rounded transition duration-200">
              Back to Project Hub
            </button>
          </Link>
          {/* Optionally link back to main site */}
          <Link href="/">
            <button className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-5 rounded transition duration-200">
              Back to B0ASE.COM
            </button>
          </Link>
      </div>
    </div>
  );
} 