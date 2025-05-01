'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaTwitter, FaBars, FaTimes } from 'react-icons/fa';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sectionLinks = [
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' }, // Combined Projects/Development
    { name: 'Contact', href: '#contact' },
  ];

  const utilityLinks = [
    { name: 'Client Login', href: '/login' },
    { name: 'Studio', href: '/studio' },
    { name: '$BOASE', href: '/token' },
  ];

  const socialLinks = [
    { Icon: FaGithub, href: 'https://github.com/richardboase' },
    { Icon: FaLinkedin, href: 'https://linkedin.com/in/richardboase' },
    { Icon: FaTwitter, href: 'https://x.com/richardboase' },
    // { Icon: FaYoutube, href: 'https://youtube.com' }, // Example
    { Icon: FaEnvelope, href: 'mailto:richard@b0ase.com' },
    { Icon: FaWhatsapp, href: 'https://wa.me/yourphonenumber' }, // Replace with actual number
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Close menu when a link is clicked (optional, good UX)
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="w-full bg-gray-950 dark:bg-gray-950 border-b border-gray-800 dark:border-gray-800 text-gray-300 dark:text-gray-300 py-3 shadow-md relative z-50">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-between">
        {/* Logo - Ensure white/light text in dark mode */}
        <Link 
          href="/" 
          className="text-xl font-bold text-white hover:text-gray-300 transition-colors font-mono" 
          onClick={handleMobileLinkClick}
        >
          B0ASE.COM
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {sectionLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side container */}
        <div className="flex items-center space-x-4">
          {/* Desktop Utility Links */}
          <div className="hidden md:flex items-center space-x-4">
            {utilityLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Social Icons and Theme Toggle Container */}
          <div className="flex items-center space-x-3">
            {socialLinks.map((link, index) => (
              <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">
                <link.Icon size={18} />
              </a>
            ))}
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} aria-label="Toggle menu" className="text-gray-300 hover:text-white focus:outline-none">
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Apply dark class explicitly? Maybe not needed if body handles it */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900 dark:bg-gray-900 border-t border-gray-800 dark:border-gray-800 shadow-lg py-4 px-4">
           {/* Ensure links have dark styles */} 
          <nav className="flex flex-col space-y-3 mb-4">
            {sectionLinks.map((link) => (
              <Link key={`mobile-${link.name}`} href={link.href} className="block text-base font-medium text-gray-300 hover:text-white transition-colors" onClick={handleMobileLinkClick}>
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-700 dark:border-gray-700 pt-4 flex flex-col space-y-3"> 
             {utilityLinks.map((link) => (
              <Link key={`mobile-${link.name}`} href={link.href} className="block text-base font-medium text-gray-300 hover:text-white transition-colors" onClick={handleMobileLinkClick}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
} 