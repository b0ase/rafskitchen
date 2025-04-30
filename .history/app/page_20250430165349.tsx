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

        {/* Add About Me Section back - Technical Layout */}
        <section 
          id="about" 
          className="mb-16 scroll-mt-16 p-6 md:p-8 bg-gray-800 rounded-lg shadow-lg max-w-4xl mx-auto" // Left align, add padding, bg, rounded corners, shadow
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-white">{portfolioData.about.name}</h1> 
          <h2 className="text-xl md:text-2xl text-blue-400 mb-5">{portfolioData.about.title}</h2>
          <p className="text-base md:text-lg text-gray-300 mb-6 leading-relaxed">{portfolioData.about.bio}</p>
          <div className="flex space-x-6"> {/* Keep links left-aligned */} 
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
