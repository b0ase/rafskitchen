'use client';

import React from 'react';

// Placeholder data - we'll replace this later
const portfolioData = {
  about: {
    name: 'Your Name',
    title: 'Multifaceted Creative & Technologist',
    bio: 'Passionate about building beautiful and functional web experiences, storytelling through various mediums, and driving business growth. Experienced in web development, journalism, filmmaking, graphic design, SEO, and copywriting.',
    links: {
      github: 'https://github.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
      portfolio: 'https://yourportfolio.com' // Or remove if this is the portfolio itself
    }
  },
  projects: [
    { id: 1, title: 'Project One', description: 'Description of a website or project you built.', tech: ['React', 'Next.js', 'TailwindCSS'], link: '#', image: '/placeholder.svg' },
    { id: 2, title: 'Project Two', description: 'Another cool project showcase.', tech: ['WordPress', 'SEO', 'Content Strategy'], link: '#', image: '/placeholder.svg' },
    // Add more projects
  ],
  services: {
    webDevelopment: { title: 'Web Development', description: 'Building responsive, performant websites and web applications.' },
    journalism: { title: 'Journalism', description: 'Investigative reporting, feature writing, and content creation.' },
    filmmaking: { title: 'Filmmaking', description: 'From concept to final cut - videography and editing.' },
    graphicDesign: { title: 'Graphic Design', description: 'Visual identity, branding, and marketing materials.' },
    seo: { title: 'SEO & Marketing', description: 'Optimizing online presence and driving organic growth.' },
    copywriting: { title: 'Copywriting', description: 'Crafting compelling copy for websites, marketing, and more.' }
    // Add more services/skills
  }
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      {/* Navigation will go here */}
      {/* <Header /> */}

      <main className="container mx-auto px-4 py-16">

        {/* About Me Section */}
        <section id="about" className="mb-16 scroll-mt-16">
          <h1 className="text-4xl font-bold mb-4">{portfolioData.about.name}</h1>
          <h2 className="text-2xl text-blue-600 mb-6">{portfolioData.about.title}</h2>
          <p className="text-lg mb-6">{portfolioData.about.bio}</p>
          <div className="flex space-x-4">
            {Object.entries(portfolioData.about.links).map(([key, value]) => (
              <a key={key} href={value} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </a>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-16 scroll-mt-16">
          <h2 className="text-3xl font-semibold mb-8 border-b pb-2">Featured Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioData.projects.map((project) => (
              <div key={project.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                {/* Placeholder for image */}
                <div className="w-full h-40 bg-gray-300 rounded mb-4 flex items-center justify-center">
                   <span className="text-gray-500">Project Image</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-3">{project.description}</p>
                <div className="text-sm text-gray-500 mb-4">
                  Tech: {project.tech.join(', ')}
                </div>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  View Project →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Services/Skills Section */}
        <section id="services" className="mb-16 scroll-mt-16">
          <h2 className="text-3xl font-semibold mb-8 border-b pb-2">Skills & Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(portfolioData.services).map(([key, service]) => (
              <div key={key} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section (Optional - Add later) */}
        {/* <section id="contact" className="scroll-mt-16">
          <h2 className="text-3xl font-semibold mb-8 border-b pb-2">Get In Touch</h2>
          {/* Contact form or details */}
        </section>

      </main>

      {/* Footer will go here */}
      {/* <Footer /> */}
    </div>
  );
}
