'use client';

import Link from 'next/link';
import { FaGithub, FaLinkedin, FaEnvelope, FaWhatsapp, FaTwitter /* FaYoutube */ } from 'react-icons/fa';

export default function Header() {
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

  return (
    <header className="w-full bg-white border-b border-gray-200 text-gray-900 py-3 shadow-sm">
      <div className="container mx-auto px-4 flex flex-wrap items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-black hover:text-gray-700 transition-colors">
          B0ASE.COM
        </Link>

        {/* Main Navigation Links */}
        <nav className="hidden md:flex items-center space-x-6">
          {sectionLinks.map((link) => (
            <Link key={link.name} href={link.href} className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Utility & Social Links */}
        <div className="flex items-center space-x-4">
          {/* Utility Links */}
          <div className="hidden sm:flex items-center space-x-4">
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
          
          {/* Add Mobile Menu Button Here Later if needed */}
        </div>
      </div>
    </header>
  );
} 