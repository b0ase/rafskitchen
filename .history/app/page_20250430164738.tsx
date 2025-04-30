'use client';

import React from 'react';
import Header from './components/Header';

// Temporarily comment out data to isolate the build error
/*
const portfolioData = {
  about: {
    name: 'Your Name',
    title: 'Multifaceted Creative & Technologist',
    bio: 'Passionate about building beautiful and functional web experiences, storytelling through various mediums, and driving business growth. Experienced in web development, journalism, filmmaking, graphic design, SEO, and copywriting.',
    links: {
      github: 'https://github.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
      portfolio: 'https://yourportfolio.com' // Or remove if this is the portfolio itself
    }
  },
  projects: [
    { id: 1, title: 'Project One', description: 'Description of a website or project you built.', tech: ['React', 'Next.js', 'TailwindCSS'], link: '#', image: '/placeholder.svg' },
    { id: 2, title: 'Project Two', description: 'Another cool project showcase.', tech: ['WordPress', 'SEO', 'Content Strategy'], link: '#', image: '/placeholder.svg' },
    // Add more projects
  ],
  services: {
    webDevelopment: { title: 'Web Development', description: 'Building responsive, performant websites and web applications.' },
    journalism: { title: 'Journalism', description: 'Investigative reporting, feature writing, and content creation.' },
    filmmaking: { title: 'Filmmaking', description: 'From concept to final cut - videography and editing.' },
    graphicDesign: { title: 'Graphic Design', description: 'Visual identity, branding, and marketing materials.' },
    seo: { title: 'SEO & Marketing', description: 'Optimizing online presence and driving organic growth.' },
    copywriting: { title: 'Copywriting', description: 'Crafting compelling copy for websites, marketing, and more.' }
    // Add more services/skills
  }
}; // <-- Add semicolon here
*/

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Content will go here */}
        <h1>Portfolio Page</h1>
      </main>
    </div>
  );
}
