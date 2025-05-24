'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';
import Footer from './components/Footer';
import ProjectCardImage from './components/ProjectCardImage';
import ProjectCardLoginOverlay from './components/ProjectCardLoginOverlay';
import { portfolioData, Project } from '@/lib/data';
import { FaExternalLinkAlt, FaGithub, FaInfoCircle, FaArrowRight, FaLinkedin, FaLock, FaLaptopCode, FaPencilRuler, FaVideo, FaBullhorn, FaHandsHelping, FaCog, FaComments, FaTools, FaTwitter, FaTelegramPlane, FaDiscord, FaRocket, FaUsers, FaChartLine, FaEnvelope } from 'react-icons/fa';
import { BsCurrencyBitcoin } from "react-icons/bs";
import CharacterCycle from './components/CharacterCycle';

// Uncomment icons
const GitHubIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>;
const XIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const NotionIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>; 
const TokenIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm0-1.143A6.857 6.857 0 1 1 8 1.143a6.857 6.857 0 0 1 0 13.714z"/><path d="M6.29 8.51H4.844V6.66h.33L6.29 8.51zm2.47-1.615c0-.58-.4-1.047-1.063-1.047H6.42v4.33h1.374c.68 0 1.086-.467 1.086-1.08V6.895zm-1.22 1.857H6.81V6.24h.74c.39 0 .625.246.625.6v1.867c0 .348-.248.602-.64.602zM11.156 8.51h-1.45v-1.85h.33l1.12 1.85z"/></svg>; 

const services = [
  {
    id: 'startup-incubation',
    slug: 'startup-incubation',
    title: 'Tech Startup Incubation',
    description: 'End-to-end incubation services for tech startups, from ideation to market launch, including mentorship, technical guidance, and business development support.',
    Icon: FaRocket,
  },
  {
    id: 'saas-blockchain',
    slug: 'saas-blockchain',
    title: 'SaaS on Blockchain',
    description: 'Build scalable Software-as-a-Service platforms on blockchain infrastructure with integrated tokenization, smart contracts, and decentralized features.',
    Icon: FaCog,
  },
  {
    id: 'defi-exchange',
    slug: 'defi-exchange',
    title: 'DeFi Exchange Development',
    description: 'Create decentralized finance exchanges with automated market makers, liquidity pools, yield farming, and cross-chain interoperability.',
    Icon: FaTools,
  },
  {
    id: 'blockchain-platform',
    slug: 'blockchain-platform',
    title: 'Blockchain Platform Development',
    description: 'Custom blockchain platform development with consensus mechanisms, smart contract capabilities, and scalable network architecture.',
    Icon: FaLaptopCode,
  },
  {
    id: 'tokenization-services',
    slug: 'tokenization-services',
    title: 'Tokenization & Digital Assets',
    description: 'Asset tokenization services, stablecoin development, digital payment systems, and blockchain-based record keeping solutions.',
    Icon: FaBullhorn,
  },
  {
    id: 'capital-raising',
    slug: 'capital-raising',
    title: 'Capital Raising & Team Building',
    description: 'Strategic capital raising through ICOs, STOs, private placements, and comprehensive team building for technical and business roles.',
    Icon: FaUsers,
  },
  {
    id: 'business-development',
    slug: 'business-development',
    title: 'Business Development & Strategy',
    description: 'Go-to-market strategy, partnership development, market analysis, and business model optimization for tech companies.',
    Icon: FaChartLine,
  },
  {
    id: 'stablecoin-payments',
    slug: 'stablecoin-payments',
    title: 'Stablecoin Payment Systems',
    description: 'Design and implement stablecoin-based payment infrastructure with multi-currency support, instant settlements, and regulatory compliance.',
    Icon: FaHandsHelping,
  },
  {
    id: 'technical-consulting',
    slug: 'technical-consulting',
    title: 'Technical Architecture Consulting',
    description: 'Expert technical consulting for complex blockchain projects, system architecture design, and technology stack optimization.',
    Icon: FaComments,
  }
];

export default function PortfolioPage() {
  const projects: Project[] = portfolioData.projects as Project[];
  const [isAboutVisible, setIsAboutVisible] = useState(false);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsAboutVisible(true);
    }, 100);
    // Set the new RafsKitchen theme
    document.documentElement.classList.remove('dark');
    document.body.style.background = 'linear-gradient(135deg, #1e1b4b 0%, #7c3aed 25%, #0891b2 75%, #134e4a 100%)';
    return () => {
      clearTimeout(timer);
    };
  }, []);

  console.log("Name prop for CharacterCycle:", portfolioData.about.name); 

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* <ClientForm /> */}
      <main className="px-6 py-12 md:py-16 flex-grow">
        {/* About Section - Apply fade-in with new design */}
        <section id="about" className="mb-16 md:mb-24 scroll-mt-20">
          {/* Modern glass-morphism card */}
          <div className={`relative bg-white/10 backdrop-blur-xl p-8 md:p-12 border border-white/20 shadow-2xl rounded-2xl transition-all duration-700 ease-in-out ${isAboutVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-10'}`}>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-teal-500/10 rounded-2xl"></div>
            
            <div className="relative z-10">
              <h1 className="relative text-4xl md:text-6xl text-white mb-6 font-bold min-h-[3rem] bg-gradient-to-r from-purple-300 to-teal-300 bg-clip-text text-transparent">
                  <span className="invisible">{portfolioData.about.name}</span>
                  <span className="absolute inset-0">
                    <CharacterCycle text={portfolioData.about.name} cycleDuration={50} />
                  </span>
              </h1>
              <p className="relative text-xl md:text-2xl text-purple-100 mb-6 font-medium">
                <span className="invisible">{portfolioData.about.tagline}</span>
                <span className="absolute inset-0">
                  <CharacterCycle text={portfolioData.about.tagline} cycleDuration={20} />
                </span>
              </p>
              <p className="relative text-base md:text-lg text-gray-300 mb-8 whitespace-pre-line leading-relaxed">
                 <span className="invisible">{portfolioData.about.bio}</span>
                 <span className="absolute inset-0">
                   <CharacterCycle text={portfolioData.about.bio} cycleDuration={5} />
                  </span>
              </p>
              
              {/* Social Links - Modern floating design */}
              <div className="mt-8 flex justify-center md:justify-start space-x-4">
                {portfolioData.about.socials.github && (
                   <a href={portfolioData.about.socials.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-all duration-300 rounded-xl border border-white/20 hover:border-white/30 backdrop-blur-sm transform hover:scale-110">
                     <FaGithub size={24} />
                   </a>
                )}
                {portfolioData.about.socials.linkedin && (
                  <a href={portfolioData.about.socials.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-all duration-300 rounded-xl border border-white/20 hover:border-white/30 backdrop-blur-sm transform hover:scale-110">
                    <FaLinkedin size={24} />
                  </a>
                )}
                {portfolioData.about.socials.x && (
                  <a href={portfolioData.about.socials.x} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-all duration-300 rounded-xl border border-white/20 hover:border-white/30 backdrop-blur-sm transform hover:scale-110">
                    <XIcon />
                  </a>
                )}
                 {portfolioData.about.socials.telegram && portfolioData.about.socials.telegram !== '#telegram' && (
                  <a href={portfolioData.about.socials.telegram} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-all duration-300 rounded-xl border border-white/20 hover:border-white/30 backdrop-blur-sm transform hover:scale-110">
                    <FaTelegramPlane size={24} />
                  </a>
                )}
                 {portfolioData.about.socials.discord && portfolioData.about.socials.discord !== '#discord' && (
                  <a href={portfolioData.about.socials.discord} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/20 text-purple-200 hover:text-white transition-all duration-300 rounded-xl border border-white/20 hover:border-white/30 backdrop-blur-sm transform hover:scale-110">
                    <FaDiscord size={24} />
                  </a>
                )}
              </div>
            </div>
            
            {/* Floating token badge - redesigned */}
            <div className="absolute top-6 right-6 bg-gradient-to-r from-purple-600 to-teal-600 px-4 py-3 rounded-xl text-white shadow-xl border border-white/20 backdrop-blur-sm z-20">
              <a 
                href="https://1sat.market"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-semibold hover:scale-105 transition-transform duration-300"
              >
                Trade $RAFS <FaExternalLinkAlt className="ml-2" />
              </a>
            </div>
          </div>
        </section>

        {/* Services Section - Modern card design */}
        <section id="services" className="mb-16 md:mb-24 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-purple-300 to-teal-300 bg-clip-text text-transparent">
              Our Services
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <Link 
                key={service.id} 
                href={`/services/${service.slug}`}
                className="group block bg-white/10 backdrop-blur-xl p-8 border border-white/20 shadow-xl rounded-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/20 hover:border-white/30"
              >
                <div className="flex items-center mb-4">
                  <div className="p-3 bg-gradient-to-r from-purple-500 to-teal-500 rounded-xl mr-4">
                    <service.Icon className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-white group-hover:text-purple-200 transition-colors">
                    {service.title}
                  </h3>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">{service.description}</p>
                <div className="mt-4 flex items-center text-purple-300 text-sm font-medium">
                  Learn more <FaArrowRight className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Skills Section - Modern glassmorphism design */}
        <section id="skills" className="mb-16 md:mb-24 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-purple-300 to-teal-300 bg-clip-text text-transparent">
              Technical Skills
            </span>
          </h2>
          <div className="bg-white/10 backdrop-blur-xl p-8 md:p-12 border border-white/20 shadow-xl rounded-2xl">
            <div className="flex flex-wrap gap-3">
              {portfolioData.skills.technical.map((skill) => (
                <span 
                  key={skill} 
                  className="inline-block bg-gradient-to-r from-purple-500/20 to-teal-500/20 text-white px-4 py-2 rounded-full text-sm font-medium border border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300 hover:scale-105"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section - Modern card grid */}
        <section id="projects" className="mb-16 md:mb-24 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-purple-300 to-teal-300 bg-clip-text text-transparent">
              Featured Projects
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 6).map((project) => (
              <div 
                key={project.id}
                className="group bg-white/10 backdrop-blur-xl p-6 border border-white/20 shadow-xl rounded-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/20"
                onMouseEnter={() => setHoveredProjectId(project.id)}
                onMouseLeave={() => setHoveredProjectId(null)}
              >
                <div className="relative overflow-hidden rounded-xl mb-4">
                  <ProjectCardImage 
                    imageUrls={project.cardImageUrls || []} 
                    alt={`${project.title} logo`}
                  />
                  {hoveredProjectId === project.id && (
                    <ProjectCardLoginOverlay 
                      project={project} 
                      isVisible={hoveredProjectId === project.id} 
                    />
                  )}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-200 transition-colors">
                  {project.title}
                </h3>
                <p className="text-gray-300 text-sm mb-4 leading-relaxed">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.slice(0, 3).map((tech) => (
                    <span 
                      key={tech} 
                      className="text-xs bg-purple-500/20 text-purple-200 px-2 py-1 rounded-md border border-purple-300/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Development (GitHub Repos) Section */}
        <section id="development" className="mb-16 md:mb-24 scroll-mt-20">
            <h2 className="text-2xl md:text-3xl font-bold text-black dark:text-white mb-6 border-b border-gray-200 dark:border-gray-800 pb-2">
                <span className="text-purple-500 dark:text-purple-400">#</span> Open Source / Development
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.filter(p => p.type === 'github').map((project) => (
                    <div key={project.id} className="bg-white dark:bg-black p-6 border border-gray-200 dark:border-gray-800 shadow-md dark:shadow-xl flex flex-col transition-transform duration-300 ease-in-out hover:scale-[1.02] hover:brightness-110 dark:hover:brightness-125">
                        <h3 className="text-lg font-semibold text-black dark:text-white mb-1">{project.title}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 flex-grow">{project.description}</p>
                        {project.status && (
                           <span className={`text-xs font-medium mr-2 px-2 py-0.5 mb-2 inline-block w-max border
                           ${project.status === 'Live' ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-300' : 
                           project.status === 'Archived' ? 'bg-gray-100 border-gray-300 text-gray-800 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400' : 
                           'bg-yellow-100 border-yellow-300 text-yellow-800 dark:bg-yellow-900 dark:border-yellow-700 dark:text-yellow-300'}
                           `}>
                           {project.status}
                           </span>
                        )}
                        <div className="mt-auto pt-3 border-t border-gray-100 dark:border-gray-700 flex space-x-3">
                  {project.githubUrl && project.githubUrl !== '#' && (
                    <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors" title="View Repository">
                      <FaGithub size={16}/>
                    </a>
                  )}
                  {project.xUrl && project.xUrl !== '#' && (
                    <a href={project.xUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors" title="Visit X Profile">
                                    <FaExternalLinkAlt size={16}/>
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </section>

        {/* Contact Section - Modern design */}
        <section id="contact" className="mb-16 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
            <span className="bg-gradient-to-r from-purple-300 to-teal-300 bg-clip-text text-transparent">
              Get In Touch
            </span>
          </h2>
          <div className="bg-white/10 backdrop-blur-xl p-8 md:p-12 border border-white/20 shadow-xl rounded-2xl text-center">
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              Ready to transform your ideas into reality? Let's build something amazing together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a 
                href={`mailto:${portfolioData.contact.email}`}
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-teal-600 text-white font-semibold rounded-xl shadow-xl hover:from-purple-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
              >
                <FaEnvelope className="mr-3" />
                Start a Project
              </a>
              <Link 
                href="/signup"
                className="inline-flex items-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl border border-white/20 hover:border-white/30 backdrop-blur-sm transition-all duration-300 transform hover:scale-105"
              >
                <FaUsers className="mr-3" />
                Join Our Platform
              </Link>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}