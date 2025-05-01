'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';
import Footer from './components/Footer';
import SubNavigation from './components/SubNavigation';
import { portfolioData } from '../lib/data';
import { FaExternalLinkAlt, FaGithub, FaInfoCircle, FaArrowRight } from 'react-icons/fa';
import { BsCurrencyBitcoin } from "react-icons/bs";

// Uncomment icons
const GitHubIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>;
const XIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const NotionIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>; 
const TokenIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1.143A6.857 6.857 0 1 1 8 1.143a6.857 6.857 0 0 1 0 13.714z"/><path d="M6.29 8.51H4.844V6.66h.33L6.29 8.51zm2.47-1.615c0-.58-.4-1.047-1.063-1.047H6.42v4.33h1.374c.68 0 1.086-.467 1.086-1.08V6.895zm-1.22 1.857H6.81V6.24h.74c.39 0 .625.246.625.6v1.867c0 .348-.248.602-.64.602zM11.156 8.51h-1.45v-1.85h.33l1.12 1.85z"/></svg>; 

export default function PortfolioPage() {
  // Filter projects by type (now using imported portfolioData)
  const domainProjects = portfolioData.projects.filter(p => p.type === 'domain');
  const githubRepos = portfolioData.projects.filter(p => p.type === 'github');

  // Type assertion for projects and development arrays
  const projects = portfolioData.projects as any[];
  const development = portfolioData.development as any[];

  return (
    <div className="bg-gray-50 text-gray-900 flex flex-col">
      <Header />
      <SubNavigation />
      <main className="container mx-auto px-4 py-12 md:py-16 flex-grow">
        {/* About Section */}
        <section id="about" className="mb-16 md:mb-24 scroll-mt-20">
          <div className="bg-white p-6 md:p-8 border border-gray-200 shadow-sm">
            <h1 className="text-3xl md:text-4xl font-bold text-black mb-4">{portfolioData.about.name}</h1>
            <p className="text-lg md:text-xl text-gray-700 mb-4">{portfolioData.about.tagline}</p>
            <p className="text-base text-gray-600 mb-6 whitespace-pre-line">{portfolioData.about.bio}</p>
            <div className="flex space-x-4 mb-6">
              <a href={portfolioData.about.socials.github} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">
                <FaGithub size={24} />
              </a>
              <a href={portfolioData.about.socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">
                <FaLinkedin size={24} /> 
              </a>
              {/* Add X/Twitter if available in data */}
              {/* <a href={portfolioData.about.socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">
                <FaTwitter size={24} />
              </a> */}
              {/* Add YouTube if available */}
              {/* <a href={portfolioData.about.socials.youtube} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors">
                <FaYoutube size={24} />
              </a> */}
            </div>
            <div className="bg-gray-100 p-4 border border-gray-200 text-sm text-gray-700">
              <h3 className="font-semibold text-black mb-2 flex items-center">
                <BsCurrencyBitcoin className="mr-2" /> {portfolioData.about.token.name} ({portfolioData.about.token.ticker})
              </h3>
              <p className="mb-2">{portfolioData.about.token.description}</p>
              <a 
                href={portfolioData.about.token.marketLink}
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-xs font-medium hover:bg-blue-700 transition-colors shadow-sm"
              >
                View Market <FaExternalLinkAlt className="ml-2" />
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="mb-16 md:mb-24 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioData.services.map((service) => (
              <div key={service.id} className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col">
                <h3 className="text-xl font-semibold text-black mb-2">{service.title}</h3>
                <p className="text-gray-600 text-sm mb-4 flex-grow">{service.description}</p>
                {service.priceInfo && (
                  <p className="text-xs text-gray-500 italic mt-auto pt-2 border-t border-gray-100">{service.priceInfo}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" className="mb-16 md:mb-24 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">Technical Skills</h2>
          <div className="flex flex-wrap gap-2">
            {portfolioData.skills.technical.map((skill) => (
              <span key={skill} className="bg-gray-100 text-gray-700 text-xs font-medium px-2.5 py-0.5 border border-gray-300 shadow-sm">
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* Projects (Domains) Section */}
        <section id="projects" className="mb-16 md:mb-24 scroll-mt-20">
          <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">Client Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.filter(p => p.type === 'domain').map((project) => (
              <div key={project.id} className="bg-white border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                {project.imageUrl && (
                   <div className="relative w-full h-40 bg-gray-200"> 
                    <Image 
                        src={project.imageUrl}
                        alt={`${project.title} screenshot`}
                        layout="fill" 
                        objectFit="cover"
                        className="transition-transform duration-300 ease-in-out group-hover:scale-105" 
                    />
                   </div>
                )}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold text-black mb-1">{project.title}</h3>
                  <p className="text-sm text-gray-600 mb-3 flex-grow">{project.description}</p>
                  
                  {/* Status/Token Badge - Light Theme */}
                  {project.status && (
                    <span className={`text-xs font-medium mr-2 px-2 py-0.5 mb-2 inline-block w-max 
                      ${project.status === 'Live' ? 'bg-green-100 text-green-800 border border-green-300' : 
                       project.status === 'In Development' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' : 
                       'bg-gray-100 text-gray-800 border border-gray-300'}
                    `}>
                       {project.status}
                    </span>
                  )}
                  {project.tokenName && (
                    <span className="bg-purple-100 text-purple-800 border border-purple-300 text-xs font-medium mr-2 px-2 py-0.5 mb-2 inline-block w-max">
                      Token: {project.tokenName}
                    </span>
                  )}

                  {/* Progress Bar - Optional */}
                  {typeof project.tokenProgressPercent === 'number' && (
                    <div className="w-full bg-gray-200 h-1 mb-3">
                      <div className="bg-blue-500 h-1" style={{ width: `${project.tokenProgressPercent}%` }}></div>
                    </div>
                  )}

                  {/* Links - Light Theme */}
                  <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex space-x-3">
                          {project.liveUrl && (
                              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors" title="Visit Live Site">
                                  <FaExternalLinkAlt size={16} />
                              </a>
                          )}
                          {project.repoUrl && (
                              <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors" title="View Repository">
                                  <FaGithub size={16} />
                              </a>
                          )}
                      </div>
                      {/* Details Link - Light Theme */}
                      <Link href={`/projects/${project.slug}`} className="text-xs text-blue-600 hover:text-blue-800 font-medium inline-flex items-center">
                         Details <FaArrowRight className="ml-1" size={10}/>
                      </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Development (GitHub Repos) Section */}
        <section id="development" className="mb-16 md:mb-24 scroll-mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-black mb-6">Open Source / Development</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {development.filter(p => p.type === 'github').map((project) => (
                    <div key={project.id} className="bg-white p-6 border border-gray-200 shadow-sm flex flex-col">
                        <h3 className="text-lg font-semibold text-black mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 mb-3 flex-grow">{project.description}</p>
                        {/* Status Badge - Light Theme */}
                        {project.status && (
                           <span className={`text-xs font-medium mr-2 px-2 py-0.5 mb-2 inline-block w-max 
                           ${project.status === 'Live' ? 'bg-green-100 text-green-800 border border-green-300' : 
                           project.status === 'Archived' ? 'bg-gray-100 text-gray-800 border border-gray-300' : 
                           'bg-yellow-100 text-yellow-800 border border-yellow-300'}
                           `}>
                           {project.status}
                           </span>
                        )}
                        {/* Links - Light Theme */}
                        <div className="mt-auto pt-3 border-t border-gray-100 flex space-x-3">
                            {project.liveUrl && (
                                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 transition-colors" title="Visit Live Site">
                                    <FaExternalLinkAlt size={16}/>
                                </a>
                            )}
                            {project.repoUrl && (
                                <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-black transition-colors" title="View Repository">
                                    <FaGithub size={16}/>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="mb-16 md:mb-24 scroll-mt-20">
            <div className="bg-white p-6 md:p-8 border border-gray-200 shadow-sm text-center">
                <h2 className="text-2xl md:text-3xl font-bold text-black mb-4">Get in Touch</h2>
                <p className="text-gray-700 mb-6">Interested in collaborating or discussing a project? Reach out via email.</p>
                <a 
                    href={`mailto:${portfolioData.contact.email}`}
                    className="inline-flex items-center px-6 py-3 bg-black text-white text-base font-medium hover:bg-gray-800 transition-colors shadow-sm"
                >
                   Contact B0ASE
                </a>
                {/* Optional: Add other contact methods like WhatsApp link */}
                {/* <p className="text-sm text-gray-500 mt-4">Or message on WhatsApp: <a href="https://wa.me/yournumber" className="text-blue-600 hover:underline">Start Chat</a></p> */}
            </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}