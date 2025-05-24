'use client';

import React from 'react';
import Link from 'next/link';
import { FaRocket, FaBrain, FaUsers, FaChartLine, FaCog, FaDollarSign, FaArrowRight } from 'react-icons/fa';

export default function StartupIncubationPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="w-full px-6 md:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-300 to-teal-300 bg-clip-text text-transparent">
              Tech Startup Incubation
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-4xl leading-relaxed">
            End-to-end incubation services for tech startups, from ideation to market launch, including mentorship, technical guidance, and business development support.
          </p>
        </div>
      </header>

      {/* Services Grid */}
      <section className="px-6 md:px-12 py-12 mb-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
            <span className="bg-gradient-to-r from-purple-300 to-teal-300 bg-clip-text text-transparent">
              Our Incubation Services
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-xl p-8 border border-white/20 shadow-xl rounded-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/20">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-teal-500 rounded-xl mr-4">
                  <FaBrain className="text-white text-xl" />
                </div>
                <h3 className="font-bold text-xl text-white">Ideation & Validation</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">Transform innovative ideas into viable business concepts with market validation, competitive analysis, and business model development.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl p-8 border border-white/20 shadow-xl rounded-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/20">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-teal-500 rounded-xl mr-4">
                  <FaCog className="text-white text-xl" />
                </div>
                <h3 className="font-bold text-xl text-white">Technical Development</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">Full-stack development services, blockchain integration, AI/ML implementation, and technical architecture design for scalable solutions.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl p-8 border border-white/20 shadow-xl rounded-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/20">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-teal-500 rounded-xl mr-4">
                  <FaUsers className="text-white text-xl" />
                </div>
                <h3 className="font-bold text-xl text-white">Team Building</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">Recruit top-tier technical talent, build cross-functional teams, and establish effective organizational structures and processes.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl p-8 border border-white/20 shadow-xl rounded-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/20">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-teal-500 rounded-xl mr-4">
                  <FaDollarSign className="text-white text-xl" />
                </div>
                <h3 className="font-bold text-xl text-white">Funding & Investment</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">Strategic fundraising support including investor introductions, pitch deck development, and token-based funding mechanisms.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl p-8 border border-white/20 shadow-xl rounded-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/20">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-teal-500 rounded-xl mr-4">
                  <FaChartLine className="text-white text-xl" />
                </div>
                <h3 className="font-bold text-xl text-white">Market Strategy</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">Go-to-market planning, customer acquisition strategies, partnership development, and growth optimization frameworks.</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-xl p-8 border border-white/20 shadow-xl rounded-2xl transition-all duration-300 hover:transform hover:scale-105 hover:bg-white/20">
              <div className="flex items-center mb-6">
                <div className="p-3 bg-gradient-to-r from-purple-500 to-teal-500 rounded-xl mr-4">
                  <FaRocket className="text-white text-xl" />
                </div>
                <h3 className="font-bold text-xl text-white">Launch & Scale</h3>
              </div>
              <p className="text-gray-300 leading-relaxed">Product launch execution, performance monitoring, iterative improvement, and scaling strategies for rapid growth.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Incubation Process */}
      <section className="px-6 md:px-12 py-12 mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl p-8 md:p-12 border border-white/20 shadow-xl rounded-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">
              <span className="bg-gradient-to-r from-purple-300 to-teal-300 bg-clip-text text-transparent">
                Our Incubation Process
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="p-6 border-l-4 border-gradient-to-b from-purple-400 to-teal-400">
                <h3 className="font-bold text-xl mb-3 text-white">1. Application & Assessment</h3>
                <p className="text-gray-300 leading-relaxed">Comprehensive evaluation of your startup idea, team capabilities, market potential, and technical feasibility.</p>
              </div>
              
              <div className="p-6 border-l-4 border-gradient-to-b from-purple-400 to-teal-400">
                <h3 className="font-bold text-xl mb-3 text-white">2. Strategic Planning</h3>
                <p className="text-gray-300 leading-relaxed">Develop detailed business plan, technical roadmap, funding strategy, and milestone-based execution framework.</p>
              </div>
              
              <div className="p-6 border-l-4 border-gradient-to-b from-purple-400 to-teal-400">
                <h3 className="font-bold text-xl mb-3 text-white">3. Development Phase</h3>
                <p className="text-gray-300 leading-relaxed">Intensive development period with dedicated technical teams, regular mentorship sessions, and progress monitoring.</p>
              </div>
              
              <div className="p-6 border-l-4 border-gradient-to-b from-purple-400 to-teal-400">
                <h3 className="font-bold text-xl mb-3 text-white">4. Testing & Iteration</h3>
                <p className="text-gray-300 leading-relaxed">Beta testing, user feedback integration, performance optimization, and product refinement based on market response.</p>
              </div>
              
              <div className="p-6 border-l-4 border-gradient-to-b from-purple-400 to-teal-400">
                <h3 className="font-bold text-xl mb-3 text-white">5. Launch Preparation</h3>
                <p className="text-gray-300 leading-relaxed">Marketing campaign development, investor relations, partnership establishment, and launch strategy execution.</p>
              </div>
              
              <div className="p-6 border-l-4 border-gradient-to-b from-purple-400 to-teal-400">
                <h3 className="font-bold text-xl mb-3 text-white">6. Growth & Scale</h3>
                <p className="text-gray-300 leading-relaxed">Post-launch support, growth acceleration, additional funding rounds, and expansion strategy implementation.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-6 md:px-12 py-16 text-center mb-12">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">Ready to Transform Your Startup Idea?</h3>
          <p className="text-gray-300 text-lg mb-8 leading-relaxed">
            Join our incubation program and turn your innovative concept into a successful, scalable business.
          </p>
          <Link 
            href="/signup"
            className="inline-flex items-center bg-gradient-to-r from-purple-600 to-teal-600 text-white font-bold py-4 px-8 rounded-xl shadow-xl hover:from-purple-700 hover:to-teal-700 transition-all duration-300 transform hover:scale-105"
          >
            Apply for Incubation
            <FaArrowRight className="ml-3" />
          </Link>
        </div>
      </section>
    </div>
  );
} 