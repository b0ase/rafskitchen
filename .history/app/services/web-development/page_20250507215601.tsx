'use client';

import React from 'react';
import Link from 'next/link';
import { FaCode, FaLaptopCode, FaMobileAlt, FaServer, FaShoppingCart, FaChartLine } from 'react-icons/fa';

export default function WebDevelopmentPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-400">//</span> Web Development</h1>
        <p className="text-xl text-gray-300 max-w-4xl">
          Building responsive, performant websites & applications using modern tech, 
          including Web3, crypto & blockchain integrations.
        </p>
      </header>

      {/* Pricing Information */}
      <section className="px-4 md:px-8 py-6 mb-8">
        <p className="text-gray-300 text-base">
          Est. Rate: £120/hr | £480/day. UK VAT added where applicable. Fixed-price projects negotiable.
        </p>
      </section>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaLaptopCode className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Custom Website Development</h3>
            </div>
            <p className="text-gray-400 flex-grow">Bespoke websites designed and built from scratch to meet your specific requirements and business goals.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaShoppingCart className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">E-commerce Solutions</h3>
            </div>
            <p className="text-gray-400 flex-grow">Fully-featured online stores with secure payment gateways, inventory management, and customer accounts.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaMobileAlt className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Responsive Web Apps</h3>
            </div>
            <p className="text-gray-400 flex-grow">Progressive web applications that work seamlessly across all devices and screen sizes.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaCode className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Web3 & Blockchain</h3>
            </div>
            <p className="text-gray-400 flex-grow">Integration of Web3 technologies, cryptocurrency payments, and blockchain features into your web solutions.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaServer className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">API Development</h3>
            </div>
            <p className="text-gray-400 flex-grow">Custom RESTful or GraphQL APIs to power your applications and integrate with third-party services.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaChartLine className="text-white mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Performance Optimization</h3>
            </div>
            <p className="text-gray-400 flex-grow">Speed up your existing website with advanced optimization techniques for faster load times and better user experience.</p>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Featured Work</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-800 relative">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <span className="text-gray-600 text-lg">[Project Image]</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">Project Example {item}</h3>
                <p className="text-gray-400 mb-3">
                  {item === 1 && "E-commerce platform with integrated payment processing and inventory management."}
                  {item === 2 && "Corporate web portal with secure document management and collaboration tools."}
                  {item === 3 && "Progressive web app with offline functionality and real-time data synchronization."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    item === 1 ? ['React', 'Node.js', 'MongoDB', 'Stripe'] : 
                    item === 2 ? ['Next.js', 'Firebase', 'Auth0', 'Material UI'] :
                    ['Vue.js', 'PWA', 'IndexedDB', 'WebSockets']
                  ].map((tech, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-800 text-cyan-400 text-xs rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Steps */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-900">
        <h2 className="text-2xl font-bold mb-6">Our Development Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">1. Discovery & Planning</h3>
            <p className="text-gray-400">We begin by understanding your business goals, target audience, and specific requirements to create a detailed project plan.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">2. Design & Prototyping</h3>
            <p className="text-gray-400">Our designers create wireframes and interactive prototypes to visualize the user journey and interface before development begins.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">3. Development</h3>
            <p className="text-gray-400">Our development team builds your solution using modern frameworks and clean, maintainable code following industry best practices.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">4. Testing & QA</h3>
            <p className="text-gray-400">Rigorous testing across devices and browsers ensures your site works flawlessly for all users and scenarios.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">5. Deployment</h3>
            <p className="text-gray-400">We handle the technical aspects of launching your site with proper configuration for optimal performance and security.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">6. Ongoing Support</h3>
            <p className="text-gray-400">Post-launch maintenance, monitoring, and optimization keep your site running at peak performance as your business grows.</p>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Client Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 rounded-lg relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-300 mb-4 italic">"The web development team at B0ASE delivered a site that exceeded our expectations. Our conversion rate increased by 40% within the first month after launch."</p>
              <div>
                <p className="font-semibold text-white">James Wilson</p>
                <p className="text-gray-400 text-sm">CEO, TechStart Inc.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-300 mb-4 italic">"Working with B0ASE was seamless from start to finish. Their team's technical expertise and attention to detail created a website that perfectly represents our brand."</p>
              <div>
                <p className="font-semibold text-white">Sarah Chen</p>
                <p className="text-gray-400 text-sm">Marketing Director, GreenPath Solutions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-300 mb-4 italic">"The e-commerce platform B0ASE built for us has been a game-changer. Sales are up, customer feedback is positive, and managing inventory is now effortless."</p>
              <div>
                <p className="font-semibold text-white">Michael Roberts</p>
                <p className="text-gray-400 text-sm">Founder, Urban Outfitters Online</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technologies */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Technologies We Work With</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['React', 'Next.js', 'TypeScript', 'Node.js', 'Vue.js', 'Angular',
            'Tailwind CSS', 'GraphQL', 'MongoDB', 'PostgreSQL', 'AWS', 'Firebase'].map((tech, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded-lg text-center">
              <span className="font-medium text-gray-300">{tech}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 md:px-8 py-12 text-center mb-8">
        <Link 
          href="/contact"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 transition duration-200"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  );
} 