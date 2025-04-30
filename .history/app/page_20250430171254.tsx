'use client';

import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Add back portfolio data (starting with 'about')
const portfolioData = {
  about: {
    name: 'Richard Boase', // Updated name
    title: 'Multifaceted Creative & Technologist', // Replace with your title
    bio: 'Passionate about building beautiful and functional web experiences, storytelling through various mediums, and driving business growth. Experienced in web development, journalism, filmmaking, graphic design, SEO, and copywriting.', // Update bio
    links: {
      github: 'https://github.com/b0ase', // Updated GitHub link
      linkedin: 'https://www.linkedin.com/in/richardboase/', // Updated LinkedIn link
      x: 'https://x.com/b0ase', // Add X.com link
      youtube: 'https://www.youtube.com/@richardboase', // Added YouTube link
      // Add other relevant links (e.g., personal site)
      // portfolio: 'https://yourportfolio.com' // Remove or update
    }
  },
  projects: [
    { id: 1, title: 'Project One', description: 'Description of a website or project you built.', tech: ['React', 'Next.js', 'TailwindCSS'], link: '#', image: '/placeholder.svg' },
    { id: 2, title: 'Project Two', description: 'Another cool project showcase.', tech: ['WordPress', 'SEO', 'Content Strategy'], link: '#', image: '/placeholder.svg' },
    // Add more projects
  ],
  // Updated Skills array with a broader range
  skills: [
    // Core Languages
    'JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML5', 'CSS3',
    // Frontend Frameworks & Libraries
    'React', 'Next.js', 'Tailwind CSS', 'Vue.js',
    // Backend & Databases
    'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'MySQL',
    // Cloud, DevOps & Tools
    'Docker', 'Kubernetes', 'AWS Basics', 'Google Cloud Basics', 'Git', 'CI/CD',
    // Design & Other
    'Figma', 'Adobe Photoshop', 'API Integration', 'SEO Principles'
    // Add/remove/refine based on target roles/clients
  ],
  // Keep services for descriptions
  services: {
    webDevelopment: { title: 'Web Development', description: 'Building responsive, performant websites and web applications using modern technologies.' },
    journalism: { title: 'Content & Copywriting', description: 'Crafting compelling narratives, articles, and website copy tailored to your audience.' }, // Adjusted title slightly
    filmmaking: { title: 'Video Production', description: 'From concept and shooting to editing and final delivery for promotional or creative needs.' }, // Adjusted title slightly
    graphicDesign: { title: 'Graphic Design', description: 'Creating visual identities, branding assets, and marketing materials.' },
    seo: { title: 'SEO & Digital Marketing', description: 'Optimizing online presence and content strategy to drive organic growth.' }, // Adjusted title slightly
    // Add/remove/edit your actual services
  }
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Remove placeholder H1 */}
        {/* <h1 className="text-3xl font-bold text-white mb-6">Portfolio Page</h1> */}

        {/* Add About Me Section back - Technical Layout */}
        <section 
          id="about" 
          className="mb-16 scroll-mt-16 p-6 md:p-8 bg-gray-900 rounded-lg shadow-lg max-w-4xl mx-auto"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">{portfolioData.about.name}</h1> 
          <h2 className="text-xl md:text-2xl text-gray-400 mb-5">{portfolioData.about.title}</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">{portfolioData.about.bio}</p>
          <div className="flex space-x-6">
            {Object.entries(portfolioData.about.links).map(([key, value]) => (
              <a 
                key={key} 
                href={value} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-gray-400 hover:text-white underline transition-colors duration-200 text-lg"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </a>
            ))}
          </div>
        </section>

        {/* Projects Section */}
        <section id="projects" className="mb-16 scroll-mt-16">
          {/* Section Title */}
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-700 pb-2 text-white">Featured Projects</h2>
          {/* Grid Layout for Projects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioData.projects.map((project) => (
              // Project Card - Dark Mode Styling
              <div key={project.id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                {/* Placeholder Image - Darker Background */}
                <div className="w-full h-48 bg-gray-700 rounded mb-4 flex items-center justify-center text-gray-400">
                   <span>Project Image</span>
                </div>
                {/* Project Details */}
                <div className="flex-grow">
                  <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                  <p className="text-gray-300 mb-3 flex-grow">{project.description}</p>
                  <div className="text-sm text-gray-400 mb-4">
                    Tech: {project.tech.join(', ')}
                  </div>
                </div>
                {/* View Project Link */}
                <a 
                  href={project.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-gray-400 hover:text-white underline mt-auto"
                >
                  View Project →
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Skills Section */}
        <section id="skills" className="mb-16 scroll-mt-16">
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-800 pb-2 text-white">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {portfolioData.skills.map((skill) => (
              <span 
                key={skill} 
                className="bg-gray-800 text-gray-300 text-sm font-medium px-3 py-1 rounded-full shadow-md"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Services Section (formerly combined) */}
        <section id="services" className="mb-16 scroll-mt-16">
          {/* Section Title */}
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-800 pb-2 text-white">Services</h2>
          {/* Grid Layout for Skills/Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(portfolioData.services).map(([key, service]) => (
              // Skill/Service Card - Dark Mode Styling
              <div key={key} className="bg-gray-900 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-16 scroll-mt-16">
          {/* Section Title */}
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-800 pb-2 text-white">Get In Touch</h2>
          
          {/* Contact Form - Basic Structure */}
          <form className="max-w-xl mx-auto bg-gray-900 p-6 md:p-8 rounded-lg shadow-lg">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-400 text-sm font-bold mb-2">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-400 text-sm font-bold mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-400 text-sm font-bold mb-2">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows={4} 
                required 
                className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
              ></textarea>
            </div>
            <div className="text-center">
              <button 
                type="submit" 
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline transition-colors duration-200"
              >
                Send Message
              </button>
            </div>
          </form>
          {/* Add email address below form */}
          <p className="text-center text-gray-500 mt-6">
            Or reach me directly via Email: <a href="mailto:richarewboase@gmail.com" className="text-gray-400 hover:text-white underline">richarewboase@gmail.com</a>
          </p>
          {/* Add WhatsApp link */}
          <p className="text-center text-gray-500 mt-2">
            WhatsApp: <a href="https://wa.me/447412922288" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white underline">+44 7412 922 288</a>
          </p>
        </section>

      </main>
      <Footer />
    </div>
  );
}
