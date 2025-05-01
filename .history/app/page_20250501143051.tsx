'use client';

import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer';

// Helper function to create placeholders
const createProjectStub = (id: number, title: string, description: string, status: string = 'Concept', tech: string[] = []) => {
  const safeTitle = title.toLowerCase().replace('.com', '').replace('.ai', '').replace('.online', '').replace('.app', '').replace('.', '-');
  return {
    id,
    title,
    description,
    tech,
    githubUrl: `https://github.com/b0ase/${safeTitle}`, // Placeholder
    xUrl: `https://x.com/${safeTitle}`, // Placeholder
    notionUrl: '#', // Placeholder
    tokenName: `$${safeTitle.toUpperCase()}_TBD`, // Placeholder
    tokenMarketUrl: '#', // Placeholder
    tokenPlatform: 'TBD', // Placeholder
    status,
  };
};

// Add back portfolio data (starting with 'about')
const portfolioData = {
  about: {
    name: 'Richard Boase',
    title: 'Digital Project Incubator & Service Provider',
    bio: 'Exploring and developing diverse digital projects, from web applications and blockchain concepts to creative media. This space showcases works-in-progress, past experiments, and future ideas. Seeking collaboration and support to bring promising concepts to fruition. Also providing technical and creative services for clients.',
    links: {
      github: 'https://github.com/b0ase',
      linkedin: 'https://www.linkedin.com/in/richardboase/',
      x: 'https://x.com/b0ase',
      youtube: 'https://www.youtube.com/@richardboase',
    }
  },
  projects: [
    {
      id: 1, 
      title: 'AIOSX',
      description: 'Fork of AIOS: LLM Agent Operating System. Exploring potential applications.', 
      tech: ['Python'],
      githubUrl: 'https://github.com/b0ase/AIOSX',
      xUrl: '#',
      notionUrl: '#',
      tokenName: '$AIOSX_TBD',
      tokenMarketUrl: '#',
      tokenPlatform: 'TBD',
      status: 'Exploration'
    },
    {
      id: 2, 
      title: 'bitcoin (Fork)',
      description: 'Fork of Bitcoin Core integration/staging tree. For study and potential integration.', 
      tech: ['TypeScript'],
      githubUrl: 'https://github.com/b0ase/bitcoin',
      xUrl: '#',
      notionUrl: '#',
      tokenName: '$BTC_FORK_TBD',
      tokenMarketUrl: '#',
      tokenPlatform: 'TBD',
      status: 'Study'
    },
    {
      id: 3, 
      title: 'npgpublic',
      description: 'Public Go project. Purpose and potential to be defined.', 
      tech: ['Go'],
      githubUrl: 'https://github.com/b0ase/npgpublic',
      xUrl: '#',
      notionUrl: '#',
      tokenName: '$NPG_TBD',
      tokenMarketUrl: '#',
      tokenPlatform: 'TBD',
      status: 'Concept'
    },
    {
      id: 4, 
      title: 'Penshun',
      description: 'Fork of simply-stream: Lock to Stream Bitcoin. Investigating streaming payment models.', 
      tech: ['JavaScript'],
      githubUrl: 'https://github.com/b0ase/Penshun',
      xUrl: '#',
      notionUrl: '#',
      tokenName: '$PENSHUN_TBD',
      tokenMarketUrl: '#',
      tokenPlatform: 'BSV',
      status: 'Investigation'
    },
    {
      id: 5, 
      title: 'Weight',
      description: 'Fork of hodlocker: Lock Bitcoins to Social Posts. Experimenting with social/economic weighting.', 
      tech: ['TypeScript'],
      githubUrl: 'https://github.com/b0ase/Weight',
      xUrl: '#',
      notionUrl: '#',
      tokenName: '$WEIGHT_TBD',
      tokenMarketUrl: '#',
      tokenPlatform: 'BSV',
      status: 'Experiment'
    },
    {
      id: 6, 
      title: 'Yours-HandCash-Login',
      description: 'Fork of Yours Wallet: Yours/HandCash Integration exploration.', 
      tech: ['JavaScript'],
      githubUrl: 'https://github.com/b0ase/Yours-HandCash-Login',
      xUrl: '#',
      notionUrl: '#',
      tokenName: '$YHC_TBD',
      tokenMarketUrl: '#',
      tokenPlatform: 'BSV',
      status: 'Archived/Study'
    },
    // New Domain-based Project Stubs
    createProjectStub(7, 'ninjapunkgirls.com', 'Concept for Ninja Punk Girls project.', 'Concept'),
    createProjectStub(8, 'Hyper-Flix.com', 'Concept for Hyper-Flix project.', 'Concept'),
    createProjectStub(9, 'Tribify.ai', 'Concept for Tribify AI project.', 'Concept'),
    createProjectStub(10, 'AITribes.online', 'Concept for AI Tribes online platform.', 'Concept'),
    createProjectStub(11, 'lilithtattoo.com', 'Concept for Lilith Tattoo project.', 'Concept'),
    createProjectStub(12, 'metagraph.app', 'Concept for Metagraph application.', 'Concept'),
    createProjectStub(13, 'floop.online', 'Concept for Floop online service.', 'Concept'),
    createProjectStub(14, 'dns-dex.com', 'Concept for DNS DEX project.', 'Concept'),
    createProjectStub(15, 'tribeswallet.com', 'Concept for Tribes Wallet project.', 'Concept'),
  ],
  skills: [
    'JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML5', 'CSS3',
    'React', 'Next.js', 'Tailwind CSS', 'Vue.js',
    'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'MySQL',
    'Docker', 'Kubernetes', 'AWS Basics', 'Google Cloud Basics', 'Git', 'CI/CD',
    'Figma', 'Adobe Photoshop', 'Motion Graphics', 'Video Production', 'API Integration', 'SEO Principles'
  ],
  services: {
    webDevelopment: { title: 'Web Development', description: 'Building responsive, performant websites and web applications using modern technologies.' },
    journalism: { title: 'Content & Copywriting', description: 'Crafting compelling narratives, articles, and website copy tailored to your audience.' },
    filmmaking: { title: 'Video Production', description: 'From concept and shooting to editing and final delivery for promotional or creative needs.' },
    graphicDesign: { title: 'Graphic Design', description: 'Creating visual identities, branding assets, and marketing materials.' },
    seo: { title: 'SEO & Digital Marketing', description: 'Optimizing online presence and content strategy to drive organic growth.' },
  }
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans">
      <Header />
      <main className="container px-4 py-16">
        {/* Remove placeholder H1 */}
        {/* <h1 className="text-3xl font-bold text-white mb-6">Portfolio Page</h1> */}

        {/* Add About Me Section back - Technical Layout */}
        <section 
          id="about" 
          className="mb-16 scroll-mt-16 p-6 md:p-8 bg-gray-900 shadow-lg max-w-4xl"
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
              <div key={project.id} className="bg-gray-900 p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col relative">
                {/* Project Status Badge */}
                <span className="absolute top-2 right-2 bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-0.5">{project.status}</span>
                
                {/* Project Details */}
                <div className="flex-grow mb-4 pt-4">
                  <h3 className="text-xl font-bold mb-2 text-white">{project.title}</h3>
                  {project.tech.length > 0 && (
                    <div className="text-sm text-gray-500 mb-3">
                      Tech: {project.tech.join(', ')}
                    </div>
                  )}
                  <p className="text-gray-400 mb-3 flex-grow">{project.description}</p>
                  {/* Token Info */}
                  <div className="text-sm text-gray-500">
                    Token: <span className="font-semibold text-gray-400">{project.tokenName}</span> ({project.tokenPlatform})
                  </div>
                </div>
                
                {/* Links Area */}
                <div className="mt-auto pt-4 border-t border-gray-800 flex justify-between items-center gap-4">
                  {/* View Token Link */}
                  <a 
                    href={project.tokenMarketUrl}
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={`text-sm px-3 py-1 ${project.tokenMarketUrl === '#' 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'} transition-colors duration-200`}
                    aria-disabled={project.tokenMarketUrl === '#'}
                  >
                    {project.tokenMarketUrl === '#' ? 'Token TBD' : 'View Token'}
                  </a>
                  {/* View Code Link */}
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl}
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-sm text-gray-400 hover:text-white underline"
                    >
                      View Code
                    </a>
                  )}
                </div>
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
                className="bg-gray-800 text-gray-300 text-sm font-medium px-3 py-1 shadow-md"
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
              (<div key={key} className="bg-gray-900 p-6 shadow-lg">
                <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                <p className="text-gray-400">{service.description}</p>
              </div>)
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-16 scroll-mt-16">
          {/* Section Title */}
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-800 pb-2 text-white">Get In Touch</h2>
          
          {/* Contact Form - Basic Structure */}
          <form className="max-w-xl bg-gray-900 p-6 md:p-8 shadow-lg">
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-400 text-sm font-bold mb-2">Name</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                required 
                className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-400 text-sm font-bold mb-2">Email</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                required 
                className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="message" className="block text-gray-400 text-sm font-bold mb-2">Message</label>
              <textarea 
                id="message" 
                name="message" 
                rows={4} 
                required 
                className="w-full px-3 py-2 bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-600"
              ></textarea>
            </div>
            <div className="text-left">
              <button 
                type="submit" 
                className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 focus:outline-none focus:shadow-outline transition-colors duration-200"
              >
                Send Message
              </button>
            </div>
          </form>
          {/* Add email address below form */}
          <div className="max-w-xl mt-6">
            <p className="text-gray-500">
              Or reach me directly via Email: <a href="mailto:richardwboase@gmail.com" className="text-gray-400 hover:text-white underline">richardwboase@gmail.com</a>
            </p>
            {/* Add WhatsApp link */}
            <p className="text-gray-500 mt-2">
              WhatsApp: <a href="https://wa.me/447412922288" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white underline">+44 7412 922 288</a>
            </p>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
