'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaCheckCircle, FaCode, FaLaptopCode, FaMobileAlt, FaServer, FaShoppingCart, FaChartLine, FaUserFriends } from 'react-icons/fa';

export default function WebDevelopmentPage() {
  const pageTitle = "Website Design"; // From lib/data.ts (service.title)
  // Using service.detailedDescription from lib/data.ts for the main content here
  const description = "Our website design process focuses on creating a seamless user experience that converts visitors into customers. We work with you to understand your brand, goals, and target audience to deliver a website that not only looks great but also performs."; 
  const pricingInfo = "Est. Rate: £120/hr | £480/day. Fixed-price projects negotiable."; // From lib/data.ts (service.priceInfo)

  // Sample client logos - in a real app, these would come from your CMS or database
  const clients = [
    { name: 'TechCorp', industry: 'SaaS' },
    { name: 'EcoSolutions', industry: 'Green Energy' },
    { name: 'MediHealth', industry: 'Healthcare' },
    { name: 'FinTrust', industry: 'Finance' },
    { name: 'RetailGiant', industry: 'E-commerce' },
  ];

  // Sample portfolio items - would come from your CMS in a real app
  const portfolioItems = [
    {
      title: 'Dynamic E-commerce Platform',
      description: 'Custom-built online store with inventory management and payment processing integration.',
      technologies: ['Next.js', 'React', 'Node.js', 'MongoDB', 'Stripe'],
      imageUrl: '/images/portfolio/ecommerce-placeholder.jpg',
    },
    {
      title: 'Corporate Web Portal',
      description: 'Secure client portal with user authentication and document management.',
      technologies: ['React', 'Firebase', 'Material UI', 'Cloud Functions'],
      imageUrl: '/images/portfolio/corporate-placeholder.jpg',
    },
    {
      title: 'Progressive Web App',
      description: 'Mobile-first web application with offline capabilities and push notifications.',
      technologies: ['Vue.js', 'PWA', 'Workbox', 'IndexedDB'],
      imageUrl: '/images/portfolio/pwa-placeholder.jpg',
    }
  ];

  // Sample testimonials
  const testimonials = [
    {
      quote: "B0ASE transformed our outdated website into a modern, responsive platform that increased our conversion rate by 35%.",
      author: "Sarah Johnson",
      position: "Marketing Director, TechCorp",
    },
    {
      quote: "Their web development team not only delivered on time but exceeded our expectations with additional features we hadn't even considered.",
      author: "Michael Chen",
      position: "CTO, FinTrust",
    },
    {
      quote: "The custom e-commerce solution they built has streamlined our operations and significantly improved our customer experience.",
      author: "Emma Williams",
      position: "Owner, RetailGiant",
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <div className="px-4 md:px-8 pt-6">
        <Link href="/services" className="text-blue-400 hover:text-blue-300 transition-colors text-sm inline-flex items-center">
          ← Back to All Services
        </Link>
      </div>

      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8 border-b border-gray-800">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">// Web Development</h1>
        <p className="text-xl text-gray-300 max-w-4xl">
          Building responsive, performant websites & applications using modern tech, including Web3, crypto & blockchain integrations.
        </p>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-8 py-8">
        {/* Services Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">What We Offer</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
              <div className="flex items-center mb-4">
                <FaLaptopCode className="text-cyan-400 mr-3 text-xl" />
                <h3 className="font-semibold text-xl">Custom Website Development</h3>
              </div>
              <p className="text-gray-400 flex-grow">Bespoke websites designed and built from scratch to meet your specific requirements and business goals.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
              <div className="flex items-center mb-4">
                <FaShoppingCart className="text-cyan-400 mr-3 text-xl" />
                <h3 className="font-semibold text-xl">E-commerce Solutions</h3>
              </div>
              <p className="text-gray-400 flex-grow">Fully-featured online stores with secure payment gateways, inventory management, and customer accounts.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
              <div className="flex items-center mb-4">
                <FaMobileAlt className="text-cyan-400 mr-3 text-xl" />
                <h3 className="font-semibold text-xl">Responsive Web Apps</h3>
              </div>
              <p className="text-gray-400 flex-grow">Progressive web applications that work seamlessly across all devices and screen sizes.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
              <div className="flex items-center mb-4">
                <FaCode className="text-cyan-400 mr-3 text-xl" />
                <h3 className="font-semibold text-xl">Web3 & Blockchain</h3>
              </div>
              <p className="text-gray-400 flex-grow">Integration of Web3 technologies, cryptocurrency payments, and blockchain features into your web solutions.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
              <div className="flex items-center mb-4">
                <FaServer className="text-cyan-400 mr-3 text-xl" />
                <h3 className="font-semibold text-xl">API Development</h3>
              </div>
              <p className="text-gray-400 flex-grow">Custom RESTful or GraphQL APIs to power your applications and integrate with third-party services.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
              <div className="flex items-center mb-4">
                <FaChartLine className="text-cyan-400 mr-3 text-xl" />
                <h3 className="font-semibold text-xl">Performance Optimization</h3>
              </div>
              <p className="text-gray-400 flex-grow">Speed up your existing website with advanced optimization techniques for faster load times and better user experience.</p>
            </div>
          </div>
        </section>

        {/* Development Process */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">Our Development Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-900 p-6 rounded-lg border-t-2 border-cyan-500">
              <h3 className="font-bold text-xl mb-2">1. Discovery & Planning</h3>
              <p className="text-gray-400">We begin by understanding your business goals, target audience, and specific requirements for your web project.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border-t-2 border-cyan-500">
              <h3 className="font-bold text-xl mb-2">2. Design & Prototyping</h3>
              <p className="text-gray-400">Our designers create wireframes and interactive prototypes to visualize the user journey and interface design.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border-t-2 border-cyan-500">
              <h3 className="font-bold text-xl mb-2">3. Development</h3>
              <p className="text-gray-400">Our developers bring the designs to life, working with modern frameworks and best practices for clean, efficient code.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border-t-2 border-cyan-500">
              <h3 className="font-bold text-xl mb-2">4. Testing & QA</h3>
              <p className="text-gray-400">Rigorous testing across devices and browsers ensures your site works flawlessly for all users.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border-t-2 border-cyan-500">
              <h3 className="font-bold text-xl mb-2">5. Deployment</h3>
              <p className="text-gray-400">We handle the technical aspects of launching your site, ensuring a smooth transition to the live environment.</p>
            </div>
            
            <div className="bg-gray-900 p-6 rounded-lg border-t-2 border-cyan-500">
              <h3 className="font-bold text-xl mb-2">6. Ongoing Support</h3>
              <p className="text-gray-400">Post-launch maintenance, monitoring, and optimization keep your site running at peak performance.</p>
            </div>
          </div>
        </section>

        {/* Portfolio Showcase */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">Featured Work</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {portfolioItems.map((item, index) => (
              <div key={index} className="bg-gray-900 rounded-lg overflow-hidden">
                <div className="h-56 bg-gray-800 relative">
                  {/* Image placeholder - in a real app, you'd use next/image with actual images */}
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                    <span className="text-gray-600 text-lg">[Portfolio Image]</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-xl mb-2">{item.title}</h3>
                  <p className="text-gray-400 mb-3">{item.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {item.technologies.map((tech, techIndex) => (
                      <span key={techIndex} className="px-3 py-1 bg-gray-800 text-cyan-400 text-xs rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Client Logos */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">Clients We've Worked With</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {clients.map((client, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-gray-800 to-gray-700 rounded-full flex items-center justify-center">
                    <span className="text-gray-600">[Logo]</span>
                  </div>
                  <h3 className="font-semibold text-white">{client.name}</h3>
                  <p className="text-gray-400 text-sm">{client.industry}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">Client Testimonials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-900 p-6 rounded-lg relative">
                <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
                <div className="relative z-10">
                  <p className="text-gray-300 mb-4 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.author}</p>
                    <p className="text-gray-400 text-sm">{testimonial.position}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technologies */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">Technologies We Work With</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {['React', 'Next.js', 'TypeScript', 'Node.js', 'Vue.js', 'Angular',
              'Tailwind CSS', 'GraphQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Firebase'].map((tech, index) => (
              <div key={index} className="bg-gray-900 p-4 rounded-lg text-center">
                <span className="font-medium text-gray-300">{tech}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Information */}
        <section className="bg-gray-900 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-bold mb-6">Pricing Information</h2>
          <p className="text-gray-300 text-lg mb-4">
            Est. Rate: £120/hr | £480/day. UK VAT added where applicable. Fixed-price projects negotiable.
          </p>
          
          <div className="mt-8">
            <h3 className="text-xl font-semibold mb-3 text-cyan-400">Common Project Ranges</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Basic Website</h4>
                <p className="text-gray-400 mb-2">5-10 pages, responsive design, contact form</p>
                <p className="font-bold text-white">£2,400 - £4,800</p>
              </div>
              
              <div className="border border-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">E-commerce Site</h4>
                <p className="text-gray-400 mb-2">Product catalog, payment processing, user accounts</p>
                <p className="font-bold text-white">£7,200 - £14,400</p>
              </div>
              
              <div className="border border-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Web Application</h4>
                <p className="text-gray-400 mb-2">Custom functionality, user authentication, database</p>
                <p className="font-bold text-white">£9,600 - £24,000+</p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-cyan-400">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2">How long does it take to build a website?</h3>
              <p className="text-gray-400">Simple websites can be completed in 2-4 weeks, while more complex e-commerce sites or web applications typically take 2-6 months depending on requirements and complexity.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Do you provide website maintenance after launch?</h3>
              <p className="text-gray-400">Yes, we offer ongoing maintenance packages to keep your site secure, up-to-date, and performing optimally. See our Support & Maintenance service for details.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Can you integrate my website with other business systems?</h3>
              <p className="text-gray-400">Absolutely! We specialize in API integrations with CRMs, payment processors, marketing tools, and other business systems to create a seamless workflow.</p>
            </div>
            <div className="bg-gray-900 p-6 rounded-lg">
              <h3 className="font-bold text-xl mb-2">Will my website be SEO-friendly?</h3>
              <p className="text-gray-400">Yes, we implement SEO best practices during development including proper HTML structure, mobile optimization, fast load times, and schema markup to help your site rank better.</p>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center py-12 mb-8">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Web Project?</h2>
          <Link 
            href="/contact?service=web-development"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg shadow-lg hover:shadow-blue-500/30"
          >
            Contact Us About Web Development
          </Link>
        </section>
      </main>
    </div>
  );
} 