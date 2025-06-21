'use client';

import React from 'react';
import Link from 'next/link';
import { FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart, FaUtensils } from 'react-icons/fa';
import { portfolioData } from '@/lib/data';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', href: portfolioData.about.socials.github, icon: FaGithub },
    { name: 'LinkedIn', href: portfolioData.about.socials.linkedin, icon: FaLinkedin },
    { name: 'Twitter', href: portfolioData.about.socials.x, icon: FaTwitter },
    { name: 'Email', href: `mailto:${portfolioData.contact.email}`, icon: FaEnvelope },
  ];

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16 py-12">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-mono">
                RAFSKITCHEN
              </span>
              <div className="p-2 bg-gradient-to-br from-purple-500 to-teal-400 rounded-lg shadow-lg">
                <FaUtensils className="text-white text-lg" />
              </div>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-4 max-w-md">
              A dynamic tech incubator transforming concepts into digital realities through 
              blockchain, AI, and emerging technologies.
            </p>
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="flex justify-center space-x-6">
              {socialLinks.map((item) => (
                <a key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} {portfolioData.about.name}. All rights reserved. 
          <span className="ml-2">Built with <FaHeart className="text-red-400 mx-1 inline" size={12} /> by $BOASE <a href="https://b0ase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">@b0ase.com</a></span>
        </div>
      </div>
    </footer>
  );
} 