'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FaTwitter, FaLinkedin, FaGithub, FaInstagram, FaGlobe, 
  FaFacebookF, FaYoutube, FaDiscord, FaRedditAlien, FaPinterestP, FaTiktok, FaMediumM 
} from 'react-icons/fa';
import { NextPage } from 'next';

interface SocialLink {
  name: string;
  href: string;
  icon: React.ElementType;
  bgColor: string;
  textColor: string;
}

const socialLinks: SocialLink[] = [
  { name: 'Twitter', href: '#', icon: FaTwitter, bgColor: 'bg-sky-500', textColor: 'text-white' },
  { name: 'LinkedIn', href: '#', icon: FaLinkedin, bgColor: 'bg-blue-700', textColor: 'text-white' },
  { name: 'GitHub', href: '#', icon: FaGithub, bgColor: 'bg-gray-800', textColor: 'text-white' },
  { name: 'Instagram', href: '#', icon: FaInstagram, bgColor: 'bg-pink-600', textColor: 'text-white' },
  { name: 'Website', href: '#', icon: FaGlobe, bgColor: 'bg-green-500', textColor: 'text-white' },
  { name: 'Facebook', href: '#', icon: FaFacebookF, bgColor: 'bg-blue-600', textColor: 'text-white' },
  { name: 'YouTube', href: '#', icon: FaYoutube, bgColor: 'bg-red-600', textColor: 'text-white' },
  { name: 'Discord', href: '#', icon: FaDiscord, bgColor: 'bg-indigo-600', textColor: 'text-white' },
  { name: 'Reddit', href: '#', icon: FaRedditAlien, bgColor: 'bg-orange-500', textColor: 'text-white' },
  { name: 'Pinterest', href: '#', icon: FaPinterestP, bgColor: 'bg-red-700', textColor: 'text-white' },
  { name: 'TikTok', href: '#', icon: FaTiktok, bgColor: 'bg-black', textColor: 'text-white' },
  { name: 'Medium', href: '#', icon: FaMediumM, bgColor: 'bg-neutral-800', textColor: 'text-white' },
];

const SocialsPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <header className="mb-12 text-center">
          <h1 className="text-4xl font-extrabold sm:text-5xl tracking-tight">
            Connect With Us
          </h1>
          <p className="mt-4 text-xl text-gray-400">
            Follow us on our social media channels to stay updated.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {socialLinks.map((social) => (
            <Link href={social.href} key={social.name} passHref legacyBehavior>
              <a 
                target="_blank" 
                rel="noopener noreferrer"
                className={`group flex flex-col items-center justify-center p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out ${social.bgColor} ${social.textColor} transform hover:scale-105`}
              >
                <social.icon className="w-12 h-12 mb-3 group-hover:opacity-80 transition-opacity" />
                <span className="text-lg font-semibold">{social.name}</span>
              </a>
            </Link>
          ))}
        </div>

        <footer className="mt-16 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
          <p className="mt-1">
            <Link href="/" className="hover:text-cyan-400 transition-colors">
              Back to Home
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default SocialsPage; 