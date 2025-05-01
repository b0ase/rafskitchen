'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import SubNavigation from './components/SubNavigation';

// Uncomment icons
const GitHubIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>;
const XIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const NotionIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>; 
const TokenIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1.143A6.857 6.857 0 1 1 8 1.143a6.857 6.857 0 0 1 0 13.714z"/><path d="M6.29 8.51H4.844V6.66h.33L6.29 8.51zm2.47-1.615c0-.58-.4-1.047-1.063-1.047H6.42v4.33h1.374c.68 0 1.086-.467 1.086-1.08V6.895zm-1.22 1.857H6.81V6.24h.74c.39 0 .625.246.625.6v1.867c0 .348-.248.602-.64.602zM11.156 8.51h-1.45v-1.85h.33l1.12 1.85z"/></svg>; 

// Uncomment helper function
const createProjectStub = (id: number, title: string, description: string, status: string = 'Concept', tech: string[] = [], tokenName: string = '', tokenProgressPercent: number = 0) => {
  const safeTitle = title.toLowerCase().replace('.com', '').replace('.ai', '').replace('.online', '').replace('.app', '').replace('.', '-');
  return {
    id,
    title,
    description,
    tech,
    githubUrl: `https://github.com/b0ase/${safeTitle}`, 
    xUrl: `https://x.com/${safeTitle}`, 
    notionUrl: '#', 
    tokenName,
    tokenProgressPercent,
    status,
    type: 'domain' // Assume helper is for domain for now
  };
};

const portfolioData = {
  about: {
    name: 'b0ase',
    bio: "b0ase.com is a dynamic digital agency, transforming concepts into digital experiences. We deliver client solutions in web development, blockchain, content, video, and social media, while also incubating our own projects. Explore our services, view our work, and contact us to build your next venture.",
    links: {
      github: 'https://github.com/b0ase',
      linkedin: 'https://www.linkedin.com/in/richardboase/',
      x: 'https://x.com/b0ase',
      youtube: 'https://www.youtube.com/@richardboase',
    },
    token: {
      name: '$BOASE',
      marketUrl: 'https://1sat.market/market/bsv21/c3bf2d7a4519ddc633bc91bbfd1022db1a77da71e16bb582b0acc0d8f7836161_1',
      platform: 'BSV21'
    }
  },
  projects: [
    // Uncomment projects using createProjectStub
    { ...createProjectStub(7, 'ninjapunkgirls.com', 'Concept for Ninja Punk Girls project.', 'Ltd Company', [], '$NPG', 85), type: 'domain' },
    { ...createProjectStub(8, 'hyper-flix.com', 'Concept for Hyper-Flix project.', 'Concept', [], '$HFLIX', 100), type: 'domain' },
    { ...createProjectStub(9, 'tribify.ai', 'Concept for Tribify AI project.', 'Concept', [], '$TRIBE', 100), type: 'domain' },
    { ...createProjectStub(10, 'aitribes.online', 'Concept for AI Tribes online platform.', 'Concept', [], '$AITR', 100), type: 'domain' },
    { ...createProjectStub(11, 'lilithtattoo.com', 'Concept for Lilith Tattoo project.', 'Concept', [], '$LILITH', 100), type: 'domain' },
    { ...createProjectStub(12, 'metagraph.app', 'Concept for Metagraph application.', 'Concept', [], '$META', 100), type: 'domain' },
    { ...createProjectStub(13, 'floop.online', 'Concept for Floop online service.', 'Concept', [], '$FLOOP', 100), type: 'domain' },
    { ...createProjectStub(14, 'dns-dex.com', 'Concept for DNS DEX project.', 'Concept', [], '$DNSD', 100), type: 'domain' },
    { ...createProjectStub(15, 'tribeswallet.com', 'Concept for Tribes Wallet project.', 'Concept', [], '$TWALL', 100), type: 'domain' },
    { ...createProjectStub(16, 'pennypics.store', 'Concept for PennyPics Store.', 'Concept', [], '$PICS', 100), type: 'domain' },
    { ...createProjectStub(17, 'missvoid.store', 'Concept for MissVoid Store.', 'Concept', [], '$VOID', 100), type: 'domain' },
    { ...createProjectStub(18, 'interiordesigns.website', 'Concept for Interior Designs website.', 'Concept', [], '$NTR', 100), type: 'domain' },
    
    // Keep GitHub Stubs 
    {
      id: 1, 
      title: 'AIOSX',
      description: 'Fork of AIOS: LLM Agent Operating System. Exploring potential applications.', 
      tech: ['Python'], 
      githubUrl: 'https://github.com/b0ase/AIOSX',
      xUrl: '#', 
      notionUrl: '#', 
      status: 'Exploration',
      type: 'github',
      tokenName: '$AIOSX', 
      tokenProgressPercent: 100 // Added progress 
    },
    {
      id: 2, 
      title: 'bitcoin (Fork)',
      description: 'Fork of Bitcoin Core integration/staging tree. For study and potential integration.', 
      tech: ['TypeScript'], 
      githubUrl: 'https://github.com/b0ase/bitcoin',
      xUrl: '#',
      notionUrl: '#',
      status: 'Study',
      type: 'github',
      tokenName: '$BTC_FORK', 
      tokenProgressPercent: 100 // Added progress
    },
    {
      id: 3, 
      title: 'npgpublic',
      description: 'Public Go project. Purpose and potential to be defined.', 
      tech: ['Go'], 
      githubUrl: 'https://github.com/b0ase/npgpublic',
      xUrl: '#',
      notionUrl: '#',
      status: 'Concept',
      type: 'github',
      tokenName: '$NPG_DEV', // Renamed slightly to distinguish from domain NPG
      tokenProgressPercent: 100 // Added progress
    },
    {
      id: 4, 
      title: 'Penshun',
      description: 'Fork of simply-stream: Lock to Stream Bitcoin. Investigating streaming payment models.', 
      tech: ['JavaScript'], 
      githubUrl: 'https://github.com/b0ase/Penshun',
      xUrl: '#',
      notionUrl: '#',
      status: 'Investigation',
      type: 'github',
      tokenName: '$PENSHUN',
      tokenProgressPercent: 100 // Added progress
    },
    {
      id: 5, 
      title: 'Weight',
      description: 'Fork of hodlocker: Lock Bitcoins to Social Posts. Experimenting with social/economic weighting.', 
      tech: ['TypeScript'], 
      githubUrl: 'https://github.com/b0ase/Weight',
      xUrl: '#',
      notionUrl: '#',
      status: 'Experiment',
      type: 'github',
      tokenName: '$WEIGHT',
      tokenProgressPercent: 100 // Added progress
    },
    {
      id: 6, 
      title: 'Yours-HandCash-Login',
      description: 'Fork of Yours Wallet: Yours/HandCash Integration exploration.', 
      tech: ['JavaScript'], 
      githubUrl: 'https://github.com/b0ase/Yours-HandCash-Login',
      xUrl: '#',
      notionUrl: '#',
      status: 'Archived/Study',
      type: 'github',
      tokenName: '$YHC', 
      tokenProgressPercent: 100 // Added progress
    },
    // ADDED Index Token Repo
    {
      id: 19, // Next available ID
      title: 'Index Token',
      description: 'Concept and development for an index-based token system.', 
      tech: ['Solidity', 'TypeScript'], // Example tech
      githubUrl: '#', // Placeholder
      xUrl: '#',
      notionUrl: '#',
      status: 'Development',
      type: 'github',
      tokenName: '$INDEX',
      tokenProgressPercent: 100, 
      imageUrl: '/images/index-token-bg.jpg' // Added image URL
    },
  ],
  skills: [
    'JavaScript', 'TypeScript', 'Python', 'SQL', 'HTML5', 'CSS3',
    'React', 'Next.js', 'Tailwind CSS', 'Vue.js',
    'Node.js', 'Express.js', 'PostgreSQL', 'MongoDB', 'MySQL',
    'Docker', 'Kubernetes', 'AWS Basics', 'Google Cloud Basics', 'Git', 'CI/CD',
    'Figma', 'Adobe Photoshop', 'Logo Design', 'Motion Graphics', 'Video Production', 'API Integration', 'SEO Principles',
    'Adobe After Effects', 'Adobe Premiere Pro', 'Cinema 4D', 'Blender', 
    'Final Cut Pro', 'DaVinci Resolve', 'Lottie/Bodymovin', 'Animation Principles', 
    'Compositing', 'VFX Basics', 'Adobe Illustrator', 'Adobe InDesign', 'Adobe Creative Suite'
  ],
  services: {
    webDevelopment: { title: 'Web Development', description: 'Building responsive, performant websites and web applications using modern technologies.' },
    journalism: { title: 'Content & Copywriting', description: 'Crafting compelling narratives, articles, and website copy tailored to your audience.' },
    filmmaking: { title: 'Video Production', description: 'From concept and shooting to editing and final delivery for promotional or creative needs.' },
    graphicDesign: { title: 'Graphic Design', description: 'Creating visual identities, branding assets, and marketing materials.' },
    seo: { title: 'SEO & Digital Marketing', description: 'Optimizing online presence and content strategy to drive organic growth.' },
    socialMedia: { title: 'Social Media Management', description: 'Developing strategies, creating content, and managing social media presence to grow engagement and reach.' }
  }
};

// ADDED Tab Type
type InfoTabName = 'graphics' | 'logos' | 'photography'; // Renamed slightly to avoid clashes if needed

export default function PortfolioPage() {
  // Filter projects by type
  const domainProjects = portfolioData.projects.filter(p => p.type === 'domain');
  const githubRepos = portfolioData.projects.filter(p => p.type === 'github');

  // ADDED Tab State
  const [activeInfoTab, setActiveInfoTab] = useState<InfoTabName>('graphics');

  // ADDED Tab Helper Functions (adapted from graphics page)
  const renderInfoTabContent = () => {
    switch (activeInfoTab) {
      case 'photography':
        return (
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Photography Services</h3>
            <p className="text-gray-700">
              High-quality photography solutions for events, products, portraits, and more. We capture the moments that matter. 
              (Placeholder content)
            </p>
          </div>
        );
      case 'graphics':
        return (
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">General Graphic Design</h3>
            <p className="text-gray-700">
              Comprehensive graphic design services including branding assets, marketing materials, web graphics, illustrations, and custom visual solutions.
              (Placeholder content)
            </p>
          </div>
        );
      case 'logos':
        return (
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Logo Design & Branding</h3>
            <p className="text-gray-700">
              Crafting unique and memorable logos and visual identities that represent your brand effectively. From initial concept to final assets.
              (Placeholder content)
            </p>
          </div>
        );
      default:
        return null;
    }
  };

  const getInfoTabClassName = (tabName: InfoTabName) => {
    // Adjusted styling to fit main page context if needed (using dark bg for tabs)
    return `py-2 px-4 cursor-pointer transition-colors duration-200 border-b-2 ${
      activeInfoTab === tabName 
        ? 'border-blue-400 text-white' 
        : 'border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-500'
    }`;
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 font-sans">
      <Header />
      <SubNavigation />
      <main className="px-4 py-16">
        {/* Remove placeholder H1 */}
        {/* <h1 className="text-3xl font-bold text-white mb-6">Portfolio Page</h1> */}

        {/* Add About Me Section back - Update to Light Theme & Full Width */}
        <section 
          id="about" 
          className="mb-16 scroll-mt-16 p-6 md:p-8 bg-white shadow-lg border border-gray-300"
        >
          {/* Update text to dark */}
          <h1 className="text-4xl md:text-5xl font-bold mb-5 text-gray-900 font-mono">{portfolioData.about.name}</h1> 
          <p className="text-base md:text-lg text-gray-700 mb-6 leading-relaxed">{portfolioData.about.bio}</p>
          <div className="flex space-x-6">
            {Object.entries(portfolioData.about.links).map(([key, value]) => (
              <a 
                key={key} 
                href={value} 
                target="_blank" 
                rel="noopener noreferrer" 
                 // Update link colors
                className="text-gray-600 hover:text-black underline transition-colors duration-200 text-lg"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </a>
            ))}
          </div>
          {/* Update Token Info Display for Light Theme */}
          {portfolioData.about.token && (
            <div className="mt-6 pt-4 border-t border-gray-200 flex items-center space-x-4">
              <span className="text-lg font-semibold text-gray-900">{portfolioData.about.token.name}</span>
              <span className="text-sm text-gray-500">({portfolioData.about.token.platform})</span>
              <a 
                href={portfolioData.about.token.marketUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                 // Update link colors
                className="text-blue-600 hover:text-blue-800 underline transition-colors duration-200 flex items-center text-sm"
              >
                View Market
                 <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            </div>
          )}
        </section>

        {/* ===== ADDED Info Tabs Section ===== */}
        <section id="info-tabs" className="mb-16 scroll-mt-16">
          {/* Tab Navigation - Dark theme */}
          <div className="flex border-b border-gray-700 mb-0">
            <button 
              onClick={() => setActiveInfoTab('graphics')}
              className={getInfoTabClassName('graphics')}
            >
              Graphics
            </button>
            <button 
              onClick={() => setActiveInfoTab('logos')}
              className={getInfoTabClassName('logos')}
            >
              Logos
            </button>
            <button 
              onClick={() => setActiveInfoTab('photography')}
              className={getInfoTabClassName('photography')}
            >
              Photography
            </button>
            {/* Add more tabs here if needed */}
          </div>

          {/* Tab Content Area - Light Background - Separate div needed */}
          <div className="bg-white p-6 md:p-8 shadow-lg border border-gray-300 mt-0">
            {renderInfoTabContent()}
          </div>
        </section>

        {/* ===== NEW POSITION for Services Section ===== */}
        <section id="services" className="mb-16 scroll-mt-16">
          {/* Section Title */}
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-800 pb-2 text-white">Services</h2>
          {/* Grid Layout for Skills/Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(portfolioData.services).map(([key, service]) => (
              // Apply light gray background and dark text
              <div key={key} className="bg-gray-50 p-6 shadow-lg border border-gray-200">
                <h3 className="text-xl font-bold mb-2 text-gray-900">{service.title}</h3>
                <p className="text-gray-700">{service.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ===== NEW POSITION for Technical Skills Section ===== */}
        <section id="skills" className="mb-16 scroll-mt-16">
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-800 pb-2 text-white">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {portfolioData.skills.map((skill) => (
              <span 
                key={skill} 
                // Use light gray bg and dark text for badges
                className="bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1 shadow-sm border border-gray-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* ===== Projects Section (Previously Domain Projects) ===== */}
        <section id="projects" className="mb-16 scroll-mt-16">
          {/* Changed Title */}
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-800 pb-2 text-white">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {domainProjects.map((project) => { // Map over domainProjects
              const projectSlug = project.title.toLowerCase()
                                     .replace(/\.com|\.ai|\.online|\.app/g, '') // Remove common TLDs
                                     .replace(/\(fork\)/g, 'fork') // Handle (Fork)
                                     .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric/space/hyphen
                                     .replace(/\s+/g, '-') // Replace spaces with hyphens
                                     .replace(/-+/g, '-'); // Replace multiple hyphens with one

              // Define base styles
              const cardBaseStyle = "p-6 shadow-lg flex flex-col relative group border";
              
              // Simplified background/border style for all domain projects
              const cardStyle = cardBaseStyle + " bg-gray-100 border-gray-200";

              // Ensure all text/link styles are dark for light backgrounds
              const titleStyle = "text-gray-900";
              const descriptionStyle = "text-gray-700"; // Keep consistent even if unused for now
              const techStyle = "text-gray-600";
              const tokenNameStyle = "font-semibold text-gray-800";
              const tokenDisabledStyle = "text-gray-500";
              const statusBadgeStyle = "text-gray-500 bg-white bg-opacity-50 px-1 rounded"; // De-emphasized + slight background
              const externalLinksStyle = "text-gray-600 hover:text-black";
              const separatorStyle = "border-gray-300"; // Slightly darker separator for contrast

              return (
                <div key={project.id} className={cardStyle}> {/* Apply dynamic style */} 
                  {/* Status Badge - Adjusted style */}
                  <span className={`absolute top-2 right-2 text-xs font-medium z-10 ${statusBadgeStyle}`}>{project.status}</span>

                  {/* Main Content Area */} 
                  <div className="flex flex-col flex-grow mb-4 relative pt-2"> 
                    <h3 className={`text-xl font-bold mb-2 ${titleStyle}`}>{project.title}</h3>
                    {project.tech.length > 0 && (
                      <div className={`text-sm mb-3 ${techStyle}`}>
                        Tech: {project.tech.join(', ')}
                      </div>
                    )}
                    {/* Description could go here if needed later, currently omitted */}
                  </div>

                  {/* Separator - Adjusted style */}
                  <hr className={`my-4 ${separatorStyle}`} />

                  {/* External Links - Adjusted style */}
                  <div className="flex justify-start space-x-3 mb-4">
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={`${externalLinksStyle} transition-colors`} aria-label={`${project.title} GitHub Repository`}>
                        <GitHubIcon />
                      </a>
                    )}
                    {project.xUrl && project.xUrl !== '#' && (
                      <a href={project.xUrl} target="_blank" rel="noopener noreferrer" className={`${externalLinksStyle} transition-colors`} aria-label={`${project.title} X.com Profile`}>
                        <XIcon />
                      </a>
                    )}
                    {project.notionUrl && project.notionUrl !== '#' && (
                      <a href={project.notionUrl} target="_blank" rel="noopener noreferrer" className={`${externalLinksStyle} transition-colors`} aria-label={`${project.title} Notion Page`}>
                        <NotionIcon />
                      </a>
                    )}
                  </div>

                  {/* Token Info - Remove platform display */}
                  {project.tokenName && (
                    <div className="flex justify-between items-center text-sm">
                      <span className={tokenNameStyle}>{project.tokenName}</span>
                      {project.tokenProgressPercent > 0 ? (
                        <span className={tokenDisabledStyle}>{project.tokenProgressPercent}%</span>
                      ) : (
                        <span className={tokenDisabledStyle}><TokenIcon /></span>
                      )}
                    </div>
                  )}

                  {/* Overlay Link for Project Details - Add legacyBehavior */}
                  <Link href={`/projects/${projectSlug}`} passHref legacyBehavior>
                    <a className="absolute inset-0 z-0 group-hover:bg-black group-hover:bg-opacity-5 transition-opacity duration-300 rounded-md" aria-label={`View details for ${project.title}`}></a>
                  </Link>
                  {/* Add subtle hover effect via the overlay link */}

                </div>
              );
            })}
          </div>
        </section>

        {/* ===== Development Section (Previously GitHub Repos) ===== */}
        <section id="development" className="mb-16 scroll-mt-16">
          {/* Changed Title */}
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-800 pb-2 text-white">Development</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {githubRepos.map((project) => { // Map over githubRepos
              const projectSlug = project.title.toLowerCase()
                                     .replace(/\.com|\.ai|\.online|\.app/g, '') // Remove common TLDs
                                     .replace(/\(fork\)/g, 'fork') // Handle (Fork)
                                     .replace(/[^a-z0-9\s-]/g, '') // Remove non-alphanumeric/space/hyphen
                                     .replace(/\s+/g, '-') // Replace spaces with hyphens
                                     .replace(/-+/g, '-'); // Replace multiple hyphens with one
              const isDomainProject = false; // Always false in this section
              const isB0asePlatform = false; // Only applies to domains

              // Define base styles
              const cardBaseStyle = "p-6 shadow-lg flex flex-col relative group border"; // Added base border class
              
              // Define background and border styles for GitHub repos
              const cardStyle = cardBaseStyle + " bg-gray-200 border-gray-200"; // Darker gray for GitHub repos

              // Ensure all text/link styles are dark for light backgrounds
              const titleStyle = "text-gray-900";
              const descriptionStyle = "text-gray-700"; // Keep consistent even if unused for now
              const techStyle = "text-gray-600";
              const tokenNameStyle = "font-semibold text-gray-800";
              const tokenDisabledStyle = "text-gray-500";
              const statusBadgeStyle = "text-gray-500 bg-white bg-opacity-50 px-1 rounded"; // De-emphasized + slight background
              const externalLinksStyle = "text-gray-600 hover:text-black";
              const separatorStyle = "border-gray-300"; // Slightly darker separator for contrast

              return (
                <div key={project.id} className={cardStyle}> {/* Apply dynamic style */} 
                  {/* Status Badge - Adjusted style */}
                  <span className={`absolute top-2 right-2 text-xs font-medium z-10 ${statusBadgeStyle}`}>{project.status}</span>

                  {/* Main Content Area */} 
                  <div className="flex flex-col flex-grow mb-4 relative pt-2"> 
                    <h3 className={`text-xl font-bold mb-2 ${titleStyle}`}>{project.title}</h3>
                    {project.tech.length > 0 && (
                      <div className={`text-sm mb-3 ${techStyle}`}>
                        Tech: {project.tech.join(', ')}
                      </div>
                    )}
                    {/* Description could go here if needed later, currently omitted */}
                  </div>

                  {/* Separator - Adjusted style */}
                  <hr className={`my-4 ${separatorStyle}`} />

                  {/* External Links - Adjusted style */}
                  <div className="flex justify-start space-x-3 mb-4">
                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={`${externalLinksStyle} transition-colors`} aria-label={`${project.title} GitHub Repository`}>
                        <GitHubIcon />
                      </a>
                    )}
                    {project.xUrl && project.xUrl !== '#' && (
                      <a href={project.xUrl} target="_blank" rel="noopener noreferrer" className={`${externalLinksStyle} transition-colors`} aria-label={`${project.title} X.com Profile`}>
                        <XIcon />
                      </a>
                    )}
                    {project.notionUrl && project.notionUrl !== '#' && (
                      <a href={project.notionUrl} target="_blank" rel="noopener noreferrer" className={`${externalLinksStyle} transition-colors`} aria-label={`${project.title} Notion Page`}>
                        <NotionIcon />
                      </a>
                    )}
                  </div>

                  {/* Token Info - Remove platform display */}
                  {project.tokenName && (
                    <div className="flex justify-between items-center text-sm">
                      <span className={tokenNameStyle}>{project.tokenName}</span>
                      {project.tokenProgressPercent > 0 ? (
                        <span className={tokenDisabledStyle}>{project.tokenProgressPercent}%</span>
                      ) : (
                        <span className={tokenDisabledStyle}><TokenIcon /></span>
                      )}
                    </div>
                  )}

                  {/* Overlay Link for Project Details - Add legacyBehavior */}
                  <Link href={`/projects/${projectSlug}`} passHref legacyBehavior>
                    <a className="absolute inset-0 z-0 group-hover:bg-black group-hover:bg-opacity-5 transition-opacity duration-300 rounded-md" aria-label={`View details for ${project.title}`}></a>
                  </Link>
                  {/* Add subtle hover effect via the overlay link */}

                </div>
              );
            })}
          </div>
        </section>

        {/* ===== Contact Section ===== */}
        <section id="contact" className="mb-16 scroll-mt-16 p-6 md:p-8 bg-gray-50 shadow-lg border border-gray-200">
          <h2 className="text-3xl font-semibold mb-6 border-b border-gray-300 pb-2 text-gray-900">Contact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Update Contact Info Text */}
            <div>
              <p className="text-lg text-gray-700 mb-4">
                Interested in collaborating or need my services? Reach out:
              </p>
              <div className="space-y-3">
                 <p className="text-gray-600 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  {/* Update link colors */}
                  <a href="mailto:richardwboase@gmail.com" className="text-blue-600 hover:text-blue-800 underline">richardwboase@gmail.com</a>
                 </p>
                 <p className="text-gray-600 flex items-center">
                   <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.684 10.64C17.856 10.03 18 9.388 18 8.71c0-1.9-.833-3.606-2.177-4.812a6.14 6.14 0 00-4.738-2.016C8.688 1.882 6.76 3.35 6.08 5.434 5.737 6.53 6.01 7.71 6.67 8.613c.52.704 1.23 1.24 2.052 1.588.821.348 1.71.445 2.554.264l.286-.063c.948-.208 1.81-.72 2.492-1.438.213-.222.396-.47.546-.732l.44-.763-.017-.03zM4.316 9.36c-.172.61-.316 1.252-.316 1.93 0 1.9.833 3.606 2.177 4.812a6.14 6.14 0 004.738 2.016c2.398 0 4.326-1.468 5.006-3.554.344-1.104.07-2.284-.59-3.188-.52-.704-1.23-1.24-2.052-1.588-.821-.348-1.71-.445-2.554-.264l-.286.063c-.948.208-1.81.72-2.492 1.438-.213-.222-.396-.47-.546-.732l-.44.763.017.03z"></path></svg>
                   {/* Update link colors */}
                    <a href="https://wa.me/447412922288" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">WhatsApp: +44 (0)7412 922288</a>
                 </p>
              </div>
            </div>
            
            {/* Update Contact Form for Light Theme */}
            <form onSubmit={(e) => { e.preventDefault(); alert('Form submission placeholder'); }}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input type="text" id="name" name="name" required className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" id="email" name="email" required className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm" />
              </div>
              <div className="mb-4">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea id="message" name="message" rows={4} required className="w-full px-3 py-2 bg-white border border-gray-300 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"></textarea>
              </div>
              <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 transition duration-300 shadow-md">
                Send Message
              </button>
            </form>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}