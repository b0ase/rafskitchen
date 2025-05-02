'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaTwitter, FaBars, FaTimes } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';
import { portfolioData } from '@/lib/data'; // Import portfolioData for external links

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define link groups - These are ONLY used for the mobile dropdown now
  const sectionLinks = [
    { name: 'About', href: '/#about' }, // Ensure leading / for smooth scroll
    { name: 'Services', href: '/#services' },
    { name: 'Skills', href: '/#skills' },
    { name: 'Client Projects', href: '/#projects' },
    { name: 'Development', href: '/#development' },
    { name: 'Contact', href: '/#contact' },
  ];

  const externalLinks = [
    { name: 'Fiverr', href: portfolioData.about.socials.fiverr },
    { name: 'Upwork', href: portfolioData.about.socials.upwork },
    { name: 'Freelancer', href: portfolioData.about.socials.freelancer },
  ].filter(link => link.href && link.href !== '#');

  // These are rendered directly in the header
  const utilityLinks = [
    { name: 'Client Login', href: '/login' },
    { name: 'Studio', href: '/studio' },
    { name: '$BOASE', href: '/token' },
  ];

  const socialLinks = [
    { Icon: FaGithub, href: 'https://github.com/richardboase' },
    { Icon: FaLinkedin, href: 'https://linkedin.com/in/richardboase' },
    { Icon: FaTwitter, href: 'https://x.com/richardboase' },
    { Icon: FaEnvelope, href: 'mailto:richard@b0ase.com' },
    { Icon: FaWhatsapp, href: 'https://wa.me/yourphonenumber' },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white dark:bg-black border-b border-gray-200 dark:border-gray-800 text-black dark:text-white py-3 shadow-sm px-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-xl font-bold hover:opacity-80 transition-opacity font-mono" 
          onClick={handleMobileLinkClick} // Close mobile menu if logo clicked
        >
          B0ASE.COM
        </Link>

        {/* Container for right-side elements */}
        <div className="flex items-center space-x-4">

          {/* Desktop Utility Links - Rendered directly */}
          <div className="hidden md:flex items-center space-x-4">
            {utilityLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Social Icons & Theme Toggle - Rendered directly */}
          <div className="flex items-center space-x-3">
            {socialLinks.map((link, index) => (
              <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors">
                <link.Icon size={18} />
              </a>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} aria-label="Toggle menu" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white focus:outline-none">
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* --- Mobile Menu Dropdown --- Contains ONLY Section and External links --- */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 shadow-lg py-4 px-4">
          {/* Section Links */} 
          <nav className="flex flex-col space-y-3 mb-4">
            {sectionLinks.map((link) => (
              <Link key={`mobile-${link.name}`} href={link.href} className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" onClick={handleMobileLinkClick}>
                {link.name}
              </Link>
            ))}
          </nav>
          
          {/* External Platform Links */} 
          {externalLinks.length > 0 && (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex flex-col space-y-3">
              <span className="px-1 py-1 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">Platforms</span>
              {externalLinks.map((link) => (
                <Link key={`mobile-${link.name}`} href={link.href} target="_blank" rel="noopener noreferrer" className="block text-base font-medium text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors" onClick={handleMobileLinkClick}>
                  {link.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </header>
  );
} 