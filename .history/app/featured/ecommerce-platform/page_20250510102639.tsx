import Link from 'next/link';
import ProjectImage from '@/app/components/ProjectImage';

export default function EcommercePlatformPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8 border-b border-gray-800 mb-8">
        <Link href="/services/web-development" className="text-sky-400 hover:underline text-sm mb-4 inline-block">← Back to Web Development</Link>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">E-commerce Platform</h1>
        <p className="text-xl text-gray-300 max-w-3xl mb-2">
          E-commerce platform with integrated payment processing and inventory management.
        </p>
      </header>

      {/* Project Image */}
      <section className="px-4 md:px-8 mb-12">
        <div className="max-w-3xl mx-auto">
          <ProjectImage 
            service="web-development"
            projectId="ecommerce-platform"
            title="E-commerce Platform"
          />
        </div>
      </section>

      {/* Tech Stack */}
      <section className="px-4 md:px-8 mb-12">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Tech Stack</h2>
          <div className="flex flex-wrap gap-3 mb-2">
            {['React', 'Node.js', 'MongoDB', 'Stripe'].map((tech, index) => (
              <span key={index} className="px-4 py-2 bg-gray-800 text-cyan-400 text-sm rounded-full">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Project Highlights (Placeholder) */}
      <section className="px-4 md:px-8 mb-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Project Highlights</h2>
          <ul className="list-disc list-inside text-gray-300 space-y-2">
            <li>Custom product catalog and inventory management system</li>
            <li>Integrated Stripe payment gateway for secure transactions</li>
            <li>Responsive design for seamless shopping on all devices</li>
            <li>Admin dashboard for order and customer management</li>
            <li>Scalable backend built with Node.js and MongoDB</li>
          </ul>
        </div>
      </section>
    </div>
  );
} 