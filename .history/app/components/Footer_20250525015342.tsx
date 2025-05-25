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
            <a 
              href="https://github.com/rafskitchen" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">GitHub</span>
              <FaGithub className="h-6 w-6" aria-hidden="true" />
            </a>
            <a 
              href="https://linkedin.com/company/rafskitchen" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">LinkedIn</span>
              <FaLinkedin className="h-6 w-6" aria-hidden="true" />
            </a>
            <a 
              href="https://twitter.com/rafskitchen" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Twitter</span>
              <FaTwitter className="h-6 w-6" aria-hidden="true" />
            </a>
            <a 
              href="mailto:hello@rafskitchen.com"
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Email</span>
              <FaEnvelope className="h-6 w-6" aria-hidden="true" />
            </a>
          </div>
          <div className="mt-8 md:mt-0 md:order-1 text-center text-sm text-gray-500">
            &copy; {currentYear} RafsKitchen. All rights reserved. 
            <span className="ml-2">Built with <FaHeart className="text-red-400 mx-1 inline" size={12} /> by <a href="https://b0ase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@b0ase.com</a></span>
          </div>
        </div>
      </div>
    </footer>
  );
} 