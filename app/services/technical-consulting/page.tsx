'use client';

import React from 'react';
import Link from 'next/link';
import { FaCode, FaServer, FaLaptopCode, FaLightbulb, FaProjectDiagram, FaShieldAlt } from 'react-icons/fa';
import ProjectImage from '@/app/components/ProjectImage';

export default function TechnicalConsultingPage() {
  return (
    <div className="min-h-screen bg-white text-black">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4"><span className="text-cyan-600">//</span> Technical Consulting</h1>
        <p className="text-xl text-gray-700 max-w-4xl">
          Providing expert advice and strategy for your digital projects and technical challenges.
        </p>
      </header>

      {/* Pricing Information */}
      <section className="px-4 md:px-8 py-6 mb-8">
        <p className="text-gray-700 text-base">
          Est. Rate: £150/hr. UK VAT added where applicable. Fixed-price projects negotiable.
        </p>
      </section>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Our Consulting Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaLightbulb className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Technology Strategy</h3>
            </div>
            <p className="text-gray-600 flex-grow">Strategic guidance on technology selection, implementation planning, and digital transformation roadmaps tailored to your business goals.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaProjectDiagram className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">System Architecture</h3>
            </div>
            <p className="text-gray-600 flex-grow">Design of scalable, resilient system architectures that align with your business requirements and performance expectations.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaLaptopCode className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Code Reviews</h3>
            </div>
            <p className="text-gray-600 flex-grow">Comprehensive code audits to identify issues, improve quality, optimize performance, and ensure maintainability of your software.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaShieldAlt className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Security Consulting</h3>
            </div>
            <p className="text-gray-600 flex-grow">Expert analysis of potential security vulnerabilities with actionable recommendations to protect your systems and data.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaServer className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Infrastructure Planning</h3>
            </div>
            <p className="text-gray-600 flex-grow">Guidance on cloud adoption, infrastructure optimization, and deployment strategies to ensure reliability and cost-efficiency.</p>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaCode className="text-black mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Technical Due Diligence</h3>
            </div>
            <p className="text-gray-600 flex-grow">Thorough evaluation of technology assets for investment decisions, mergers, acquisitions, and strategic partnerships.</p>
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Consulting Success Stories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Case Study 1: Startup Technology Stack */}
          <div className="bg-gray-50 border border-gray-200 shadow-lg overflow-hidden">
            <ProjectImage 
              service="technical-consulting"
              projectId="startup-tech-stack"
              title="Startup Technology Stack"
            />
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Startup Technology Stack</h3>
              <p className="text-gray-600 mb-3">
                Advised a fintech startup on technology stack selection and implementation, resulting in a scalable platform that successfully handled 1000% user growth in the first year.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Startup', 'Fintech', 'Technology Stack', 'Scalability'].map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-50 text-cyan-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Case Study 2: Enterprise Architecture Overhaul */}
          <div className="bg-gray-50 border border-gray-200 shadow-lg overflow-hidden">
            <ProjectImage 
              service="technical-consulting"
              projectId="enterprise-architecture-overhaul"
              title="Enterprise Architecture Overhaul"
            />
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Enterprise Architecture Overhaul</h3>
              <p className="text-gray-600 mb-3">
                Redesigned the system architecture for a large enterprise, reducing infrastructure costs by 35% while improving performance and reliability.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Enterprise', 'System Architecture', 'Cloud Migration', 'Cost Optimization'].map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-50 text-cyan-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {/* Case Study 3: Blockchain Integration Strategy */}
          <div className="bg-gray-50 border border-gray-200 shadow-lg overflow-hidden">
            <ProjectImage 
              service="technical-consulting"
              projectId="blockchain-integration-strategy"
              title="Blockchain Integration Strategy"
            />
            <div className="p-6">
              <h3 className="font-bold text-xl mb-2">Blockchain Integration Strategy</h3>
              <p className="text-gray-600 mb-3">
                Developed a comprehensive blockchain integration strategy for a supply chain company, creating a roadmap for transparent, secure product tracking.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Blockchain', 'Supply Chain', 'Strategy', 'Integration'].map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-gray-50 text-cyan-600 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consulting Process */}
      <section className="px-4 md:px-8 py-8 mb-16 bg-gray-50 border border-gray-200 shadow-lg">
        <h2 className="text-2xl font-bold mb-6">Our Consulting Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">1. Discovery</h3>
            <p className="text-gray-600">In-depth exploration of your current situation, technical challenges, business goals, and primary pain points to establish context.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">2. Assessment</h3>
            <p className="text-gray-600">Comprehensive evaluation of existing systems, processes, infrastructure, and team capabilities to identify strengths and opportunities.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">3. Strategic Planning</h3>
            <p className="text-gray-600">Development of tailored recommendations and actionable strategies based on industry best practices and cutting-edge technologies.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">4. Implementation Support</h3>
            <p className="text-gray-600">Hands-on guidance during the execution phase, helping your team overcome challenges and adapt to changing requirements.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">5. Knowledge Transfer</h3>
            <p className="text-gray-600">Sharing expertise and best practices with your team to build internal capabilities and ensure long-term success.</p>
          </div>
          
          <div className="p-6 border-l-2 border-cyan-500">
            <h3 className="font-bold text-xl mb-2">6. Continuous Improvement</h3>
            <p className="text-gray-600">Ongoing evaluation and refinement of implemented solutions to maximize ROI and adapt to evolving business needs.</p>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Client Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 border border-gray-200 shadow-lg relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-700 mb-4 italic">"The technical expertise provided by B0ASE was invaluable for our startup. Their guidance helped us make confident technology decisions that have scaled with our growth and saved us from costly mistakes."</p>
              <div>
                <p className="font-semibold text-black">Jason Reynolds</p>
                <p className="text-gray-600 text-sm">CTO, FinovateX</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-700 mb-4 italic">"Our legacy system was creating significant performance bottlenecks. B0ASE's consulting team identified the core issues and provided a clear modernization strategy that has transformed our operations."</p>
              <div>
                <p className="font-semibold text-black">Eliza Morgan</p>
                <p className="text-gray-600 text-sm">VP of Engineering, Global Systems Inc.</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 border border-gray-200 shadow-lg relative">
            <div className="text-4xl text-cyan-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-700 mb-4 italic">"The blockchain implementation strategy developed by B0ASE has given us a competitive edge in our industry. Their technical insights and strategic approach have been essential to our successful digital transformation."</p>
              <div>
                <p className="font-semibold text-black">Daniel Park</p>
                <p className="text-gray-600 text-sm">CEO, SupplyChain Solutions</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expertise Areas */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6">Our Areas of Expertise</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Cloud Architecture', 'DevOps', 'Microservices', 'Blockchain', 'AI/ML Integration', 'Cybersecurity',
            'Serverless', 'Containerization', 'Data Engineering', 'API Design', 'Software Architecture', 'Technical Debt'].map((area, index) => (
            <div key={index} className="bg-white p-4 border border-gray-200 shadow-lg text-center">
              <span className="font-medium text-gray-700">{area}</span>
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