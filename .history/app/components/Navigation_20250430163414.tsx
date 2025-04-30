'use client';

import Link from 'next/link'; // Use Next.js Link for internal navigation
// import { useMenu } from '../context/MenuContext'; // Remove MenuContext dependency

export default function Navigation() {
  // const { isMenuOpen, setIsMenuOpen } = useMenu(); // Remove state related to old menu

  // Define navigation links for the portfolio
  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#services' },
    // { name: 'Contact', href: '#contact' }, // Add later if contact section is added
  ];

  return (
    // Simple horizontal navigation
    <nav>
      <ul className="flex space-x-4 md:space-x-6">
        {navLinks.map((link) => (
          <li key={link.name}>
            <Link href={link.href} className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm md:text-base">
              {link.name}
            </Link>
          </li>
        ))}
      </ul>
      {/* Remove old menu overlay logic */}
    </nav>
  );
} 