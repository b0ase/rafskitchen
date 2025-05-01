'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaTwitter, FaBars, FaTimes } from 'react-icons/fa';

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
    <header className="w-full bg-white border-b border-gray-200 text-gray-900 py-3 shadow-sm relative z-50">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-black hover:text-gray-700 transition-colors" onClick={handleMobileLinkClick}>
          B0ASE.COM
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {sectionLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Right side container */}
        <div className="flex items-center space-x-4">
          {/* Desktop Utility Links */}
          <div className="hidden md:flex items-center space-x-4">
            {utilityLinks.map((link) => (
              <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                {link.name}
              </Link>
            ))}
          </div>

          {/* Social Icons */}
          <div className="flex items-center space-x-3">
            {socialLinks.map((link, index) => (
              <a key={index} href={link.href} target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-black transition-colors">
                <link.Icon size={18} />
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button onClick={toggleMobileMenu} aria-label="Toggle menu" className="text-gray-600 hover:text-black focus:outline-none">
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown - Corrected Structure */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-200 shadow-lg py-4 px-4">
          <nav className="flex flex-col space-y-3 mb-4">
            {sectionLinks.map((link) => (
              <Link key={`mobile-${link.name}`} href={link.href} className="block text-base font-medium text-gray-700 hover:text-black transition-colors" onClick={handleMobileLinkClick}>
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="border-t border-gray-100 pt-4 flex flex-col space-y-3">
             {utilityLinks.map((link) => (
              <Link key={`mobile-${link.name}`} href={link.href} className="block text-base font-medium text-gray-700 hover:text-black transition-colors" onClick={handleMobileLinkClick}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
} 