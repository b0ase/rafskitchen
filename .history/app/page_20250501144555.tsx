'use client';

import React from 'react';
// import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';

// Temporarily comment out icons
/*
const GitHubIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 ... z"/></svg>;
const XIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 ... z"/></svg>;
const NotionIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 ... v2z"/></svg>; 
const TokenIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 ... 1.85z"/></svg>; 
*/

// Temporarily comment out helper function
/*
const createProjectStub = (id: number, title: string, description: string, status: string = 'Concept', tech: string[] = []) => {
  const safeTitle = title.toLowerCase().replace('.com', '').replace('.ai', '').replace('.online', '').replace('.app', '').replace('.', '-');
  return {
    id,
    title,
    description,
    tech,
    githubUrl: `https://github.com/b0ase/${safeTitle}`, 
    xUrl: `https://x.com/${safeTitle}`, 
    notionUrl: '#', 
    tokenName: `$${safeTitle.toUpperCase()}`, 
    tokenMarketUrl: '#', 
    tokenPlatform: 'TBD', 
    status,
    type: 'domain' // Assume helper is for domain for now
  };
};
*/

const portfolioData = {
  about: {
    name: 'b0ase',
    bio: 'Exploring and developing diverse digital projects, from web applications and blockchain concepts to creative media. This space showcases works-in-progress, past experiments, and future ideas. Seeking collaboration and support to bring promising concepts to fruition. Also providing technical and creative services for clients.',
    links: {
      github: 'https://github.com/b0ase',
      linkedin: 'https://www.linkedin.com/in/richardboase/',
      x: 'https://x.com/b0ase',
      youtube: 'https://www.youtube.com/@richardboase',
    }
  },
  projects: [
    // Temporarily comment out projects using createProjectStub
    /*
    { ...createProjectStub(7, 'ninjapunkgirls.com', 'Concept for Ninja Punk Girls project.', 'Ltd Company'), type: 'domain' },
    { ...createProjectStub(8, 'Hyper-Flix.com', 'Concept for Hyper-Flix project.', 'Concept'), type: 'domain' },
    { ...createProjectStub(9, 'Tribify.ai', 'Concept for Tribify AI project.', 'Concept'), type: 'domain' },
    { ...createProjectStub(10, 'AITribes.online', 'Concept for AI Tribes online platform.', 'Concept'), type: 'domain' },
    { ...createProjectStub(11, 'lilithtattoo.com', 'Concept for Lilith Tattoo project.', 'Concept'), type: 'domain' },
    { ...createProjectStub(12, 'metagraph.app', 'Concept for Metagraph application.', 'Concept'), type: 'domain' },
    { ...createProjectStub(13, 'floop.online', 'Concept for Floop online service.', 'Concept'), type: 'domain' },
    { ...createProjectStub(14, 'dns-dex.com', 'Concept for DNS DEX project.', 'Concept'), type: 'domain' },
    { ...createProjectStub(15, 'tribeswallet.com', 'Concept for Tribes Wallet project.', 'Concept'), type: 'domain' },
    */

    // Keep only hardcoded GitHub Stubs 
    {
      id: 1, 
      title: 'AIOSX',
      description: 'Fork of AIOS: LLM Agent Operating System. Exploring potential applications.', 
      tech: ['Python'], 
      githubUrl: 'https://github.com/b0ase/AIOSX',
      xUrl: '#', 
      notionUrl: '#', 
      tokenName: '$AIOSX',
      tokenMarketUrl: '#',
      tokenPlatform: 'TBD',
      status: 'Exploration',
      type: 'github' 
    },
    {
      id: 2, 
      title: 'bitcoin (Fork)',
      description: 'Fork of Bitcoin Core integration/staging tree. For study and potential integration.', 
      tech: ['TypeScript'], 
      githubUrl: 'https://github.com/b0ase/bitcoin',
      xUrl: '#',
      notionUrl: '#',
      tokenName: '$BTC_FORK',
      tokenMarketUrl: '#',
      tokenPlatform: 'TBD',
      status: 'Study',
      type: 'github' 
    },
    {
      id: 3, 
      title: 'npgpublic',
      description: 'Public Go project. Purpose and potential to be defined.', 
      tech: ['Go'], 
      githubUrl: 'https://github.com/b0ase/npgpublic',
      xUrl: '#',
      notionUrl: '#',
      tokenName: '$NPG',
      tokenMarketUrl: '#',
      tokenPlatform: 'TBD',
      status: 'Concept',
      type: 'github' 
    },
    {
      id: 4, 
      title: 'Penshun',
      description: 'Fork of simply-stream: Lock to Stream Bitcoin. Investigating streaming payment models.', 
      tech: ['JavaScript'], 
      githubUrl: 'https://github.com/b0ase/Penshun',
      xUrl: '#',
      notionUrl: '#',
      tokenName: '$PENSHUN',
      tokenMarketUrl: '#',
      tokenPlatform: 'BSV', 
      status: 'Investigation',
      type: 'github' 
    },
    {
      id: 5, 
      title: 'Weight',
      description: 'Fork of hodlocker: Lock Bitcoins to Social Posts. Experimenting with social/economic weighting.', 
      tech: ['TypeScript'], 
      githubUrl: 'https://github.com/b0ase/Weight',
      xUrl: '#',
      notionUrl: '#',
      tokenName: '$WEIGHT',
      tokenMarketUrl: '#',
      tokenPlatform: 'BSV', 
      status: 'Experiment',
      type: 'github' 
    },
    {
      id: 6, 
      title: 'Yours-HandCash-Login',
      description: 'Fork of Yours Wallet: Yours/HandCash Integration exploration.', 
      tech: ['JavaScript'], 
      githubUrl: 'https://github.com/b0ase/Yours-HandCash-Login',
      xUrl: '#',
      notionUrl: '#',
      tokenName: '$YHC',
      tokenMarketUrl: '#',
      tokenPlatform: 'BSV', 
      status: 'Archived/Study',
      type: 'github' 
    },
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
          <h1 className="text-4xl md:text-5xl font-bold mb-5 text-white font-mono">{portfolioData.about.name}</h1> 
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
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-800 pb-2 text-white">Development Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioData.projects.map((project) => {
              const projectSlug = project.title.toLowerCase()
                                     .replace(/\.com|\.ai|\.online|\.app/g, '') // Remove common TLDs
                                     .replace(/\(fork\)/g, 'fork') // Handle (Fork)
                                     .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric/space/hyphen
                                     .replace(/\s+/g, '-') // Replace spaces with hyphens
                                     .replace(/-+/g, '-'); // Replace multiple hyphens with one
              const isDomainProject = project.type === 'domain';

              // Define base styles and conditional styles including gradients
              const cardBaseStyle = "p-6 shadow-lg flex flex-col relative group"; // Removed base bg
              const cardStyle = isDomainProject
                ? `${cardBaseStyle} bg-gradient-to-br from-white to-gray-100 text-gray-900` // Light gradient
                : `${cardBaseStyle} bg-gradient-to-br from-gray-900 to-gray-800 text-gray-300`; // Dark gradient

              const titleStyle = isDomainProject ? "text-gray-900" : "text-white";
              const descriptionStyle = isDomainProject ? "text-gray-700" : "text-gray-400";
              const techStyle = isDomainProject ? "text-gray-600" : "text-gray-500";
              const tokenNameStyle = isDomainProject ? "font-semibold text-gray-800" : "font-semibold text-gray-400";
              const tokenPlatformStyle = isDomainProject ? "text-gray-600" : "text-gray-500";
              const tokenLinkStyle = isDomainProject ? "text-gray-700 hover:text-black" : "text-gray-400 hover:text-white";
              const tokenDisabledStyle = isDomainProject ? "text-gray-400" : "text-gray-600";
              const statusBadgeStyle = isDomainProject ? "text-gray-400" : "text-gray-500";
              const externalLinksStyle = isDomainProject ? "text-gray-600 hover:text-black" : "text-gray-400 hover:text-white";
              const separatorStyle = isDomainProject ? "border-gray-200" : "border-gray-800";

              return (
                <div key={project.id} className={cardStyle}>
                  {/* Status Badge */}
                  <span className={`absolute top-2 right-2 text-xs font-medium z-10 ${statusBadgeStyle}`}>{project.status}</span>

                  {/* Main Content Area (No longer a link) */}
                  <div className="flex flex-col flex-grow mb-4 relative pt-2"> 
                    <h3 className={`text-xl font-bold mb-2 ${titleStyle}`}>{project.title}</h3>
                    {project.tech.length > 0 && (
                      <div className={`text-sm mb-3 ${techStyle}`}>
                        Tech: {project.tech.join(', ')}
                      </div>
                    )}
                    {/* Hide description here, show in overlay */}
                    {/* <p className={`mb-3 flex-grow ${descriptionStyle}`}>{project.description}</p> */}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                       <p className="text-white text-center text-sm">{project.description}</p>
                    </div>
                  </div>

                  {/* External Links Area */}
                  <div className={`mt-auto pt-4 border-t ${separatorStyle} flex justify-between items-center gap-4`}>
                    <div className="flex gap-3 items-center">
                      {project.githubUrl && project.githubUrl !== '#' && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" title="GitHub" className={externalLinksStyle}><GitHubIcon /></a>
                      )}
                      {project.xUrl && project.xUrl !== '#' && (
                        <a href={project.xUrl} target="_blank" rel="noopener noreferrer" title="X.com" className={externalLinksStyle}><XIcon /></a>
                      )}
                      {project.notionUrl && project.notionUrl !== '#' && (
                        <a href={project.notionUrl} target="_blank" rel="noopener noreferrer" title="Notion" className={externalLinksStyle}><NotionIcon /></a>
                      )}
                    </div>
                    {project.tokenMarketUrl && project.tokenMarketUrl !== '#' ? (
                      <a href={project.tokenMarketUrl} target="_blank" rel="noopener noreferrer" title={`View ${project.tokenName} ${project.tokenPlatform !== 'TBD' ? '(' + project.tokenPlatform + ')' : '' }`} className={`flex items-center gap-1 text-sm ${tokenLinkStyle}`}>
                        <TokenIcon /> <span className={tokenNameStyle}>{project.tokenName}</span> 
                        {project.tokenPlatform !== 'TBD' && <span className={tokenPlatformStyle}>({project.tokenPlatform})</span>}
                      </a>
                    ) : (
                      <span className={`flex items-center gap-1 text-sm ${tokenDisabledStyle}`} title="Token Not Available">
                         <TokenIcon /> <span className={tokenNameStyle}>{project.tokenName}</span> 
                         {project.tokenPlatform !== 'TBD' && <span className={tokenPlatformStyle}>({project.tokenPlatform})</span>}
                      </span>
                    )}
                  </div>

                  {/* View Details Button */}
                  <div className="mt-4">
                    <Link
                      href={`/projects/${projectSlug}`}
                </div>
              );
            })}
          </div>
        </section>

        {/* Technical Skills Section */}
        <section id="skills" className="mb-16 scroll-mt-16">
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-800 pb-2 text-white">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {portfolioData.skills.map((skill) => (
              <span 
                key={skill} 
                className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-300 text-sm font-medium px-3 py-1 shadow-md"
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
              <div key={key} className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 shadow-lg">
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
