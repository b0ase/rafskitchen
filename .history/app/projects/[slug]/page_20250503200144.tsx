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

  const notionUrl = project.notionUrl && project.notionUrl !== '#' ? project.notionUrl : undefined;
  const isRobust = slug === 'robust-ae-com';

  return (
    <div className="w-full">
      {isRobust && (
        <section className="bg-white dark:bg-black p-6 md:p-8 border-b border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl mb-8">
          <h1 className="text-3xl font-bold mb-4">Robust Engineering Platform</h1>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
            Robust-AE.com is a next-generation digital hub for engineering innovation, project delivery, and client collaboration. Built for George Haworth's forward-thinking engineering business, Robust-AE.com empowers clients and partners to achieve more through technology.
          </p>
          <h2 className="text-2xl font-semibold mb-2">Key Features</h2>
          <ul className="list-disc pl-6 mb-4 text-gray-600 dark:text-gray-300">
            <li><strong>Project Portfolio & Case Studies:</strong> Explore a curated showcase of engineering projects, from concept to completion, with interactive galleries and technical breakdowns.</li>
            <li><strong>Secure Client Portal:</strong> Clients log in to access project dashboards, download deliverables, and communicate directly with the engineering team.</li>
            <li><strong>AI-Powered Project Management:</strong> Automated scheduling, smart notifications, and predictive analytics help keep every project on track.</li>
            <li><strong>Real-Time Collaboration:</strong> Share files, CAD drawings, and feedback instantly with built-in chat and document annotation tools.</li>
            <li><strong>Automated Quoting & Proposals:</strong> Generate detailed, professional proposals and quotes in minutes, tailored to each client's needs.</li>
            <li><strong>Integration with CAD/BIM:</strong> Seamless import/export of engineering files, with version control and secure storage.</li>
            <li><strong>Sustainability & Compliance Dashboard:</strong> Track environmental impact, regulatory compliance, and project certifications in real time.</li>
            <li><strong>Engineering Insights Blog:</strong> Stay up to date with the latest trends, innovations, and best practices in engineering and construction.</li>
            <li><strong>Consultation Booking:</strong> Clients can schedule meetings, site visits, or virtual consultations directly from the platform.</li>
          </ul>
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            <strong>Purpose:</strong> Robust-AE.com is designed to position George Haworth's business as a leader in digital transformation for engineering, offering clients a transparent, efficient, and innovative project experience from start to finish.
          </p>
        </section>
      )}
      <ClientProjectPage projectSlug={slug} notionUrl={notionUrl} />
    </div>
  );
} 