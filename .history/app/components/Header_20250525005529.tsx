'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaBars, FaTimes, FaLock, FaTelegramPlane, FaDiscord, FaRocket } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { portfolioData } from '@/lib/data';

// Define XIcon component locally
const XIcon = () => <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [backendConnected, setBackendConnected] = useState(false);

  // Check backend connection on mount
  useEffect(() => {
    async function checkConnection() {
      try {
        const res = await fetch('/api/clients', { method: 'GET' });
        setBackendConnected(res.ok);
      } catch {
        setBackendConnected(false);
      }
    }
    checkConnection();
  }, []);

  const sectionLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' }, // Combined Projects/Development
    { name: 'Contact', href: '#contact' },
  ];

  const utilityLinks = [
    { name: 'Login', href: '/login' },
    { name: 'Studio', href: '/studio' },
    { name: '$RAFS', href: '/token' },
  ];

  const socialLinks = [
    { Icon: FaGithub, href: portfolioData.about.socials.github },
    { Icon: FaLinkedin, href: portfolioData.about.socials.linkedin },
    { Icon: XIcon, href: portfolioData.about.socials.x },
    { Icon: FaTelegramPlane, href: portfolioData.about.socials.telegram },
    { Icon: FaDiscord, href: portfolioData.about.socials.discord },
    { Icon: FaEnvelope, href: `mailto:${portfolioData.contact.email}` },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close menu when a link is clicked (optional, good UX)
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-gray-200 text-black py-4 shadow-lg px-6">
      <div className="flex items-center justify-between">
        {/* Left Group: Logo and Main Navigation */}
        <div className="flex items-center space-x-8">
          {/* Logo - Updated to RafsKitchen with icon */}
          <Link 
            href="/" 
            className="text-xl text-black hover:text-cyan-600 transition-all duration-300 transform hover:scale-105 font-bold flex items-center gap-3"
            onClick={handleMobileLinkClick}
          >
            <div className="p-2 bg-cyan-600 rounded-lg shadow-lg">
              <FaRocket className="text-white" />
            </div>
            <span className="text-black font-mono tracking-wide">
              RAFSKITCHEN
            </span>
          </Link>

          {/* Desktop Navigation Links (Moved here) */}
          <nav className="hidden md:flex items-center space-x-6">
            {sectionLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="text-sm font-medium text-gray-700 hover:text-black transition-all duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-cyan-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Right side container (Utility links, Social Icons, Mobile Menu Button) */}
        <div className="flex items-center space-x-4">
          {/* Desktop Utility Links */}
          <div className="hidden md:flex items-center space-x-4">
            {utilityLinks.map((link) => (
              <span key={link.name} className="flex items-center gap-1">
                <Link 
                  href={link.href} 
                  className="text-sm font-medium px-3 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-black transition-all duration-300 border border-gray-300 hover:border-gray-400"
                >
                  {link.name}
                </Link>
                {/* Show flashing green light next to 'New Clients' ONLY if backend is connected */}
                {link.name === 'New Clients' && backendConnected && (
                  <span className="relative flex h-2.5 w-2.5 ml-1" title="Backend Connected">
                    <span className="animate-ping-slow absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Social Icons and Theme Toggle Container */}
          <div className="flex items-center space-x-3">
            {socialLinks
              .filter(link => link.href && !link.href.includes('#') && link.href !== '')
              .map((link, index) => (
              <a 
                key={index} 
                href={link.href} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 rounded-lg text-gray-600 hover:text-black bg-gray-100 hover:bg-gray-200 transition-all duration-300 transform hover:scale-110 border border-gray-300 hover:border-gray-400"
              >
                <link.Icon size={16} />
              </a>
            ))}
            {/* Admin Link (padlock icon) */}
            <Link 
              href="/admin" 
              aria-label="Admin Dashboard" 
              className="p-2 rounded-lg text-gray-600 hover:text-yellow-600 bg-gray-100 hover:bg-yellow-100 transition-all duration-300 transform hover:scale-110 border border-gray-300 hover:border-yellow-400"
            >
              <FaLock size={16} />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button 
              onClick={toggleMobileMenu} 
              aria-label="Toggle menu" 
              className="p-2 rounded-lg text-gray-700 hover:text-black bg-gray-100 hover:bg-gray-200 focus:outline-none transition-all duration-300 border border-gray-300"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - New white design */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-xl py-6 px-6">
          <nav className="flex flex-col space-y-4 mb-6">
            {sectionLinks.map((link) => (
              <Link 
                key={`mobile-${link.name}`} 
                href={link.href} 
                className="block text-base font-medium text-gray-700 hover:text-black transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gray-100 border border-transparent hover:border-gray-300" 
                onClick={handleMobileLinkClick}
              >
                {link.name}
              </Link>
            ))}
            {/* Admin Link in mobile menu */}
            <Link 
              href="/admin" 
              aria-label="Admin Dashboard" 
              className="block text-base font-medium text-gray-700 hover:text-yellow-600 transition-all duration-300 py-2 px-4 rounded-lg hover:bg-yellow-100 border border-transparent hover:border-yellow-300" 
              onClick={handleMobileLinkClick}
            >
              <span className="inline-flex items-center gap-2"><FaLock size={16} /> Admin</span>
            </Link>
          </nav>
          
          <div className="border-t border-gray-200 pt-6 flex flex-col space-y-4 mb-6"> 
             {utilityLinks.map((link) => (
              <Link 
                key={`mobile-${link.name}`} 
                href={link.href} 
                className="block text-base font-medium text-gray-700 hover:text-black transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gray-100 border border-transparent hover:border-gray-300" 
                onClick={handleMobileLinkClick}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Service Links */}
          <div className="border-t border-gray-200 pt-6 flex flex-col space-y-3">
             <span className="px-4 py-2 text-xs font-semibold text-gray-600 uppercase tracking-wider">Services</span>
             {portfolioData.services.map((service) => (
                <Link 
                  key={`mobile-service-${service.slug}`} 
                  href={`/services/${service.slug}`} 
                  className="block text-sm font-medium text-gray-700 hover:text-black transition-all duration-300 py-2 px-4 rounded-lg hover:bg-gray-100 border border-transparent hover:border-gray-300" 
                  onClick={handleMobileLinkClick}
                >
                  {service.title}
                </Link>
             ))}
          </div>
        </div>
      )}
    </header>
  );
} 