'use client';

import React from 'react';
import Link from 'next/link';
import Header from './components/Header';
import Footer from './components/Footer';
import SubNavigation from './components/SubNavigation';
// Import portfolioData from the new location
import { portfolioData } from '../lib/data'; 

// Uncomment icons
const GitHubIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>;
const XIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const NotionIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>; 
const TokenIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1.143A6.857 6.857 0 1 1 8 1.143a6.857 6.857 0 0 1 0 13.714z"/><path d="M6.29 8.51H4.844V6.66h.33L6.29 8.51zm2.47-1.615c0-.58-.4-1.047-1.063-1.047H6.42v4.33h1.374c.68 0 1.086-.467 1.086-1.08V6.895zm-1.22 1.857H6.81V6.24h.74c.39 0 .625.246.625.6v1.867c0 .348-.248.602-.64.602zM11.156 8.51h-1.45v-1.85h.33l1.12 1.85z"/></svg>; 

export default function PortfolioPage() {
  // Filter projects by type (now using imported portfolioData)
  const domainProjects = portfolioData.projects.filter(p => p.type === 'domain');
  const githubRepos = portfolioData.projects.filter(p => p.type === 'github');

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
          className="mb-16 scroll-mt-16 p-6 md:p-8 bg-gray-950 shadow-lg border border-gray-800"
        >
          {/* Update text to light */}
          <h1 className="text-4xl md:text-5xl font-bold mb-5 text-white font-mono">{portfolioData.about.name}</h1> 
          <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">{portfolioData.about.bio}</p>
          <div className="flex space-x-6">
            {Object.entries(portfolioData.about.links).map(([key, value]) => (
              <a 
                key={key} 
                href={value} 
                target="_blank" 
                rel="noopener noreferrer" 
                 // Update link colors to light
                className="text-gray-400 hover:text-white underline transition-colors duration-200 text-lg"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </a>
            ))}
          </div>
          {/* Update Token Info Display for Dark Theme */}
          {portfolioData.about.token && (
            <div className="mt-6 pt-4 border-t border-gray-800 flex items-center space-x-4">
              <span className="text-lg font-semibold text-white">{portfolioData.about.token.name}</span>
              <span className="text-sm text-gray-400">({portfolioData.about.token.platform})</span>
              <a 
                href={portfolioData.about.token.marketUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                 // Update link colors to light
                className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200 flex items-center text-sm"
              >
                View Market
                 <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            </div>
          )}
        </section>

        {/* ===== NEW POSITION for Services Section ===== */}
        <section id="services" className="mb-16 scroll-mt-16">
          {/* Section Title */}
          <h2 className="text-3xl font-semibold mb-8 border-b border-gray-800 pb-2 text-white">Services</h2> 
          
          {/* Grid Layout for Skills/Services */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(portfolioData.services).map(([key, service]) => (
              // Apply bg-gray-950 background and border-gray-800
              (<div key={key} className="bg-gray-950 p-6 shadow-lg border border-gray-800">
                <h3 className="text-xl font-bold mb-2 text-white">{service.title}</h3>
                <p className="text-gray-300">{service.description}</p>
              </div>)
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
                // Use darker gray bg and lighter border for badges
                className="bg-gray-800 text-gray-300 text-sm font-medium px-3 py-1 shadow-sm border border-gray-700"
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
              
              // Apply consistent dark background and border
              const cardStyle = cardBaseStyle + " bg-gray-900 border-gray-700";

              // Ensure all text/link styles are LIGHT for dark backgrounds
              const titleStyle = "text-white";
              const descriptionStyle = "text-gray-300"; // Not currently used, but set for consistency
              const techStyle = "text-gray-400";
              const tokenNameStyle = "font-semibold text-gray-200";
              const tokenDisabledStyle = "text-gray-500"; // Keep this muted for progress/icon
              const statusBadgeStyle = "text-gray-200 bg-black bg-opacity-40 px-1 rounded"; // Light text on dark bg
              const externalLinksStyle = "text-gray-400 hover:text-white";
              const separatorStyle = "border-gray-700"; // Lighter separator for dark bg

              return (
                <div key={project.id} className={cardStyle}> {/* Apply consistent style */}
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

                  {/* Overlay Link for Project Details - REMOVE legacyBehavior & passHref, apply props directly */}
                  <Link 
                    href={`/projects/${projectSlug}`} 
                    className="absolute inset-0 z-0 group-hover:bg-black group-hover:bg-opacity-5 transition-opacity duration-300 rounded-md" 
                    aria-label={`View details for ${project.title}`}
                  >
                    {/* Remove the inner <a> tag */}
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
              const cardBaseStyle = "p-6 shadow-lg flex flex-col relative group border";
              
              // Apply consistent dark background and border - REMOVE conditional logic
              const cardStyle = cardBaseStyle + " bg-gray-900 border-gray-700";

              // Define consistent LIGHT text styles - REMOVE conditional logic
              const titleStyle = "text-white";
              const techStyle = "text-gray-400";
              const externalLinksStyle = "text-gray-400 hover:text-white";
              const separatorStyle = "border-gray-700"; 
              const tokenNameStyle = "font-semibold text-gray-200";
              const tokenProgressTextStyle = "text-gray-500"; // Keep progress text muted
              const statusBadgeStyle = "text-gray-200 bg-black bg-opacity-40 px-1 rounded"; // Light text on dark bg

              return (
                // Apply consistent dark style, remove image background/style logic
                <div 
                  key={project.id} 
                  className={cardStyle} // Apply consistent dark style
                >
                  {/* REMOVE Dark overlay gradient */}
                  {/* {project.imageUrl && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/60 to-black/40 z-0"></div>
                  )} */}

                  {/* Content container - ensure it's relative if needed, remove z-10 if overlay is gone*/}
                  <div className="relative flex flex-col h-full">
                    
                    {/* Status Badge - Apply consistent light-on-dark style */}
                    <span className={`absolute top-2 right-2 text-xs font-medium ${statusBadgeStyle} z-10`}>{project.status}</span> 

                    {/* Main Content Area */}
                    <div className="flex flex-col flex-grow mb-4 pt-2">
                      {/* Use consistent light text styles */}
                      <h3 className={`text-xl font-bold mb-2 ${titleStyle}`}>{project.title}</h3>
                      {project.tech.length > 0 && (
                        <div className={`text-sm mb-3 ${techStyle}`}>
                          Tech: {project.tech.join(', ')}
                        </div>
                      )}
                    </div>

                    {/* Separator - Use consistent light style */}
                    <hr className={`my-4 ${separatorStyle}`} />

                    {/* External Links - Use consistent light style */}
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

                    {/* Token Info - Use consistent light styles */}
                    {project.tokenName && (
                      <div className="flex justify-between items-center text-sm mt-auto"> 
                        <span className={`font-semibold ${tokenNameStyle}`}>{project.tokenName}</span>
                        {typeof project.tokenProgressPercent === 'number' && project.tokenProgressPercent >= 0 && (
                           <div className="flex items-center ml-2">
                             {/* Keep progress bar colors consistent, ensure contrast */}
                             <div className="w-16 h-2 bg-gray-700 rounded-full overflow-hidden mr-2"> {/* Darker track */}
                               <div 
                                 className="h-full bg-blue-500" // Keep bright fill
                                 style={{ width: `${100 - project.tokenProgressPercent}%` }} 
                               ></div>
                             </div>
                             <span className={`text-xs ${tokenProgressTextStyle}`}>{project.tokenProgressPercent}% Available</span>
                           </div>
                        )}
                      </div>
                    )}

                    {/* Overlay Link for Project Details - REMOVE legacyBehavior & passHref, apply props directly */}
                    <Link 
                      href={`/projects/${projectSlug}`} 
                      className="absolute inset-0 z-10 group-hover:bg-white group-hover:bg-opacity-10 transition-opacity duration-300 rounded-md" 
                      aria-label={`View details for ${project.title}`}
                    >
                       {/* Remove the inner <a> tag */} 
                       {/* This overlay link is now clickable *above* the background but *below* interactive elements like text links if needed */}
                    </Link>
                  </div> 
                </div> 
              );
            })}
          </div>
        </section>

        {/* ===== Contact Section - Apply bg-gray-950 Theme ===== */}
        <section 
          id="contact" 
          className="mb-16 scroll-mt-16 p-6 md:p-8 bg-gray-950 shadow-lg border border-gray-800"
        >
          {/* Update title text color */}
          <h2 className="text-3xl font-semibold mb-6 border-b border-gray-800 pb-2 text-white">Contact</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Update Contact Info Text Color */}
            <div>
              <p className="text-lg text-gray-300 mb-4">
                Interested in collaborating or need my services? Reach out:
              </p>
              <div className="space-y-3">
                 <p className="text-gray-400 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                  {/* Update link colors */}
                  <a href="mailto:richardwboase@gmail.com" className="text-blue-400 hover:text-blue-300 underline">richardwboase@gmail.com</a>
                 </p>
                 <p className="text-gray-400 flex items-center">
                   <svg className="w-5 h-5 mr-2 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.684 10.64C17.856 10.03 18 9.388 18 8.71c0-1.9-.833-3.606-2.177-4.812a6.14 6.14 0 00-4.738-2.016C8.688 1.882 6.76 3.35 6.08 5.434 5.737 6.53 6.01 7.71 6.67 8.613c.52.704 1.23 1.24 2.052 1.588.821.348 1.71.445 2.554.264l.286-.063c.948-.208 1.81-.72 2.492-1.438.213-.222.396-.47.546-.732l.44-.763-.017-.03zM4.316 9.36c-.172.61-.316 1.252-.316 1.93 0 1.9.833 3.606 2.177 4.812a6.14 6.14 0 004.738 2.016c2.398 0 4.326-1.468 5.006-3.554.344-1.104.07-2.284-.59-3.188-.52-.704-1.23-1.24-2.052-1.588-.821-.348-1.71-.445-2.554-.264l-.286.063c-.948.208-1.81.72-2.492 1.438-.213-.222-.396-.47-.546-.732l-.44.763.017.03z"></path></svg>
                   {/* Update link colors */}
                    <a href="https://wa.me/447412922288" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 underline">WhatsApp: +44 (0)7412 922288</a>
                 </p>
              </div>
            </div>
            
            {/* Update Contact Form for Dark Theme */}
            <form onSubmit={(e) => { e.preventDefault(); alert('Form submission placeholder'); }}>
              <div className="mb-4">
                {/* Update label text color */}
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                {/* Update input bg, border, text colors */}
                <input type="text" id="name" name="name" required className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm" />
              </div>
              <div className="mb-4">
                 {/* Update label text color */}
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                 {/* Update input bg, border, text colors */}
                <input type="email" id="email" name="email" required className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm" />
              </div>
              <div className="mb-4">
                 {/* Update label text color */}
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Message</label>
                 {/* Update textarea bg, border, text colors */}
                <textarea id="message" name="message" rows={4} required className="w-full px-3 py-2 bg-gray-800 border border-gray-600 text-gray-200 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none shadow-sm"></textarea>
              </div>
              {/* Update button colors */}
              <button type="submit" className="bg-blue-700 hover:bg-blue-600 text-white font-bold py-2 px-4 transition duration-300 shadow-md">
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