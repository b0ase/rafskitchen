'use client';

import React from 'react';
import Header from './components/Header';

// Add back portfolio data (starting with 'about')
const portfolioData = {
  about: {
    name: 'Your Name', // Replace with your actual name
    title: 'Multifaceted Creative & Technologist', // Replace with your title
    bio: 'Passionate about building beautiful and functional web experiences, storytelling through various mediums, and driving business growth. Experienced in web development, journalism, filmmaking, graphic design, SEO, and copywriting.', // Update bio
    links: {
      github: 'https://github.com/yourusername', // Update link
      linkedin: 'https://linkedin.com/in/yourusername', // Update link
      // Add other relevant links (e.g., Twitter, personal site)
      // portfolio: 'https://yourportfolio.com' // Remove or update
    }
  },
  // Projects and Services will be added back later
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <Header />
      <main className="container mx-auto px-4 py-16">
        {/* Remove placeholder H1 */}
        {/* <h1 className="text-3xl font-bold text-white mb-6">Portfolio Page</h1> */}

        {/* Add About Me Section back */}
        <section id="about" className="mb-16 scroll-mt-16 text-center max-w-3xl mx-auto">
          {/* Use white or a light gray for name in dark mode */}
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">{portfolioData.about.name}</h1>
          {/* Use a lighter blue or teal for title */}
          <h2 className="text-2xl md:text-3xl text-blue-400 mb-6">{portfolioData.about.title}</h2>
          {/* Ensure bio text is readable (text-gray-200 or similar) */}
          <p className="text-lg md:text-xl text-gray-300 mb-6 leading-relaxed">{portfolioData.about.bio}</p>
          <div className="flex justify-center space-x-6">
            {Object.entries(portfolioData.about.links).map(([key, value]) => (
              <a 
                key={key} 
                href={value} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 hover:text-blue-300 underline transition-colors duration-200 text-lg"
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </a>
            ))}
          </div>
        </section>

        {/* Projects Section will go here */}

        {/* Services/Skills Section will go here */}

      </main>
    </div>
  );
}
