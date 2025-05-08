'use client';

import React from 'react';
import Link from 'next/link';
import { FaPen, FaNewspaper, FaFileAlt, FaSearchDollar, FaComments, FaBullhorn } from 'react-icons/fa';

export default function ContentCopywritingPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="w-full px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">// Content & Copywriting</h1>
        <p className="text-xl text-gray-300 max-w-4xl">
          Crafting compelling narratives, articles, and website copy tailored to your audience.
        </p>
      </header>

      {/* Pricing Information */}
      <section className="px-4 md:px-8 py-6 mb-8">
        <p className="text-gray-300 text-base">
          Est. Rate: £100/article | £400/day. UK VAT added where applicable. Fixed-price projects negotiable.
        </p>
      </section>

      {/* Services Grid */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-green-400">Our Content Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaFileAlt className="text-green-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Website Copy</h3>
            </div>
            <p className="text-gray-400 flex-grow">Persuasive, concise copy for landing pages, about sections, and product descriptions that convert visitors into customers.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaNewspaper className="text-green-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Blog Articles</h3>
            </div>
            <p className="text-gray-400 flex-grow">Informative, engaging articles that position your brand as an authority in your industry and drive organic traffic to your site.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaPen className="text-green-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Technical Writing</h3>
            </div>
            <p className="text-gray-400 flex-grow">Clear, precise documentation, whitepapers, and technical guides that explain complex concepts in accessible language.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaSearchDollar className="text-green-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">SEO Content</h3>
            </div>
            <p className="text-gray-400 flex-grow">Strategic, keyword-optimized content designed to improve search rankings while maintaining a natural, engaging tone.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaComments className="text-green-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Social Media Content</h3>
            </div>
            <p className="text-gray-400 flex-grow">Platform-specific content that resonates with your audience and drives engagement across various social channels.</p>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col">
            <div className="flex items-center mb-4">
              <FaBullhorn className="text-green-400 mr-3 text-xl" />
              <h3 className="font-semibold text-xl">Email Marketing</h3>
            </div>
            <p className="text-gray-400 flex-grow">Compelling email campaigns with persuasive copy that nurtures leads, builds relationships, and drives conversions.</p>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-green-400">Content Samples</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="bg-gray-900 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-800 relative">
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                  <span className="text-gray-600 text-lg">[Content Sample]</span>
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2">
                  {item === 1 && "Tech Industry Whitepaper"}
                  {item === 2 && "E-commerce Product Descriptions"}
                  {item === 3 && "Finance Blog Series"}
                </h3>
                <p className="text-gray-400 mb-3">
                  {item === 1 && "Comprehensive analysis of emerging technologies in the blockchain space, translating complex concepts for executive audiences."}
                  {item === 2 && "Persuasive product descriptions for a luxury retail brand that increased conversions by 32% within three months."}
                  {item === 3 && "Educational blog series on personal finance that established the client as a thought leader and increased organic traffic by 45%."}
                </p>
                <div className="flex flex-wrap gap-2">
                  {[
                    item === 1 ? ['Whitepaper', 'Technical', 'B2B', 'Blockchain'] : 
                    item === 2 ? ['E-commerce', 'Conversion', 'Product Copy', 'B2C'] :
                    ['Finance', 'Education', 'SEO', 'Series']
                  ].map((tag, index) => (
                    <span key={index} className="px-3 py-1 bg-gray-800 text-green-400 text-xs rounded-full">
                      {tag}
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
        <h2 className="text-2xl font-bold mb-6 text-green-400">Our Content Creation Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 border-l-2 border-green-500">
            <h3 className="font-bold text-xl mb-2">1. Discovery & Research</h3>
            <p className="text-gray-400">We begin by understanding your brand voice, target audience, and content goals to ensure alignment with your overall strategy.</p>
          </div>
          
          <div className="p-6 border-l-2 border-green-500">
            <h3 className="font-bold text-xl mb-2">2. Content Strategy</h3>
            <p className="text-gray-400">Development of a comprehensive content plan that addresses your specific business objectives and audience needs.</p>
          </div>
          
          <div className="p-6 border-l-2 border-green-500">
            <h3 className="font-bold text-xl mb-2">3. Content Creation</h3>
            <p className="text-gray-400">Our expert writers craft compelling, original content tailored to your brand voice and optimized for your specific channels.</p>
          </div>
          
          <div className="p-6 border-l-2 border-green-500">
            <h3 className="font-bold text-xl mb-2">4. Review & Editing</h3>
            <p className="text-gray-400">Rigorous editing and proofreading to ensure clarity, accuracy, and consistency throughout all content.</p>
          </div>
          
          <div className="p-6 border-l-2 border-green-500">
            <h3 className="font-bold text-xl mb-2">5. SEO Optimization</h3>
            <p className="text-gray-400">Strategic keyword integration and formatting to enhance search visibility while maintaining a natural reading experience.</p>
          </div>
          
          <div className="p-6 border-l-2 border-green-500">
            <h3 className="font-bold text-xl mb-2">6. Performance Analysis</h3>
            <p className="text-gray-400">Ongoing monitoring of content performance with insights and recommendations for continuous improvement.</p>
          </div>
        </div>
      </section>

      {/* Client Testimonials */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-green-400">Client Testimonials</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-6 rounded-lg relative">
            <div className="text-4xl text-green-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-300 mb-4 italic">"The content B0ASE created for our blog has been exceptional. They captured our voice perfectly and the SEO-optimized articles have significantly increased our organic traffic."</p>
              <div>
                <p className="font-semibold text-white">Rachel Greene</p>
                <p className="text-gray-400 text-sm">Marketing Manager, TechSolutions</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg relative">
            <div className="text-4xl text-green-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-300 mb-4 italic">"The whitepaper B0ASE produced for our blockchain product was outstanding. They took complex technical concepts and made them accessible without losing the sophistication our audience expects."</p>
              <div>
                <p className="font-semibold text-white">Marcus Chen</p>
                <p className="text-gray-400 text-sm">Founder, BlockChain Innovations</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-900 p-6 rounded-lg relative">
            <div className="text-4xl text-green-500 opacity-30 absolute top-4 left-4">"</div>
            <div className="relative z-10">
              <p className="text-gray-300 mb-4 italic">"Our website conversion rate jumped by 40% after implementing B0ASE's new copy. Their ability to craft persuasive messages that resonate with our audience is truly impressive."</p>
              <div>
                <p className="font-semibold text-white">Sophia Rodriguez</p>
                <p className="text-gray-400 text-sm">E-commerce Director, Luxe Living</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="px-4 md:px-8 py-8 mb-16">
        <h2 className="text-2xl font-bold mb-6 text-green-400">Industries We Specialize In</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Tech & SaaS', 'Finance', 'E-commerce', 'Healthcare', 'Blockchain', 'Education',
            'Real Estate', 'Legal', 'B2B Services', 'Manufacturing', 'Travel', 'Nonprofit'].map((industry, index) => (
            <div key={index} className="bg-gray-900 p-4 rounded-lg text-center">
              <span className="font-medium text-gray-300">{industry}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="px-4 md:px-8 py-12 text-center mb-8">
        <Link 
          href="/contact"
          className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 transition duration-200"
        >
          Get in Touch
        </Link>
      </section>
    </div>
  );
} 