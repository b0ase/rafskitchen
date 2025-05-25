'use client';

import React from 'react';
import Link from 'next/link';
import { FaRocket, FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaHeart } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 border-t border-gray-200 mt-16 py-12">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-gradient-to-br from-purple-500 to-teal-400 rounded-lg shadow-lg">
                <FaRocket className="text-white text-lg" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-mono">
                RAFSKITCHEN
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-4 max-w-md">
              A dynamic tech incubator transforming concepts into digital realities through 
              blockchain, AI, and emerging technologies.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://github.com/rafskitchen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900 rounded-lg transition-all duration-300"
              >
                <FaGithub size={18} />
              </a>
              <a 
                href="https://linkedin.com/company/rafskitchen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900 rounded-lg transition-all duration-300"
              >
                <FaLinkedin size={18} />
              </a>
              <a 
                href="https://twitter.com/rafskitchen" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900 rounded-lg transition-all duration-300"
              >
                <FaTwitter size={18} />
              </a>
              <a 
                href="mailto:hello@rafskitchen.com"
                className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-600 hover:text-gray-900 rounded-lg transition-all duration-300"
              >
                <FaEnvelope size={18} />
              </a>
            </div>
          </div>

          {/* Services Links */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/services/startup-incubation" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Startup Incubation
                </Link>
              </li>
              <li>
                <Link href="/services/blockchain-platform" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Blockchain Development
                </Link>
              </li>
              <li>
                <Link href="/services/defi-exchange" className="text-gray-600 hover:text-blue-600 transition-colors">
                  DeFi Solutions
                </Link>
              </li>
              <li>
                <Link href="/services/tokenization-services" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Tokenization
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-gray-800 font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Join Platform
                </Link>
              </li>
              <li>
                <Link href="/studio" className="text-gray-600 hover:text-blue-600 transition-colors">
                  Studio
                </Link>
              </li>
              <li>
                <Link href="/token" className="text-gray-600 hover:text-blue-600 transition-colors">
                  $RAFS Token
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} RafsKitchen. All rights reserved.
          </p>
          <p className="text-gray-500 text-sm flex items-center">
            Built with <FaHeart className="text-red-400 mx-1" size={12} /> by <a href="https://b0ase.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">b0ase.com</a>
          </p>
        </div>
      </div>
    </footer>
  );
} 