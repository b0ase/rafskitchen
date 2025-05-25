'use client';

import React from 'react';
import Link from 'next/link';
import { FaRocket, FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex justify-center space-x-6 md:order-2">
            {socials.map((item) => (
              <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                <span className="sr-only">{item.name}</span>
                <item.icon className="h-6 w-6" aria-hidden="true" />
              </a>
            ))}
          </div>
          <div className="mt-8 md:mt-0 md:order-1 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {portfolioData.name}. All rights reserved. 
            <span className="ml-2">Built with <FaHeart className="text-red-400 mx-1 inline" size={12} /> by $BOASE <a href="https://b0ase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@b0ase.com</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
} 