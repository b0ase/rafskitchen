'use client';

import React from 'react';
import Link from 'next/link';
import { FaBriefcase, FaFileUpload, FaClipboardList, FaEnvelope, FaUserTie, FaDollarSign } from 'react-icons/fa';

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-12 text-center">
          <FaBriefcase className="text-sky-400 text-6xl mx-auto mb-4" />
          <h1 className="text-4xl md:text-5xl font-bold text-white">Join Our Team at b0ase.com</h1>
          <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
            We're building the future of project collaboration and are always looking for passionate, talented individuals to help us grow. 
            Explore opportunities to contribute your skills and be part of an innovative team.
          </p>
        </header>

        {/* General Application Section Placeholder */}
        <section className="mb-16 p-6 md:p-8 bg-gray-850 border border-gray-700 rounded-lg shadow-xl">
          <div className="flex items-center mb-6">
            <FaUserTie className="text-3xl text-green-400 mr-4" />
            <h2 className="text-3xl font-semibold text-white">General Application</h2>
          </div>
          <p className="text-gray-400 mb-6">
            Don't see a specific role that fits? We're still keen to hear from you! 
            Tell us about yourself, your skills, and how you envision contributing to b0ase.com.
          </p>
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input type="text" name="name" id="name" autoComplete="name" className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-gray-500" placeholder="e.g., Jane Doe" disabled />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input type="email" name="email" id="email" autoComplete="email" className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-gray-500" placeholder="you@example.com" disabled />
            </div>
            <div>
              <label htmlFor="cv" className="block text-sm font-medium text-gray-300 mb-1">Upload CV/Resume</label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md bg-gray-700/50 cursor-not-allowed">
                <div className="space-y-1 text-center">
                  <FaFileUpload className="mx-auto h-12 w-12 text-gray-500" />
                  <div className="flex text-sm text-gray-500">
                    <p className="pl-1">Upload a file (PDF, DOCX, up to 5MB)</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Cover Letter / Message</label>
              <textarea id="message" name="message" rows={4} className="w-full px-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-gray-500" placeholder="Tell us about your aspirations and why you'd be a great fit..." disabled></textarea>
            </div>
             <div>
              <label htmlFor="salary" className="block text-sm font-medium text-gray-300 mb-1">Salary Expectations (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaDollarSign className="h-5 w-5 text-gray-500" />
                </div>
                <input type="text" name="salary" id="salary" className="w-full pl-10 pr-4 py-2.5 bg-gray-700 border border-gray-600 rounded-md text-gray-200 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none placeholder-gray-500" placeholder="e.g., 60,000 USD per year / 50 USD per hour" disabled />
              </div>
            </div>
            <button 
              type="submit"
              disabled 
              className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 disabled:opacity-50 cursor-not-allowed"
            >
              Submit Application (Coming Soon)
            </button>
          </div>
          <p className="mt-6 text-xs text-center text-gray-500">
            We are currently setting up our application system. Please check back soon!
          </p>
        </section>

        {/* Current Openings Section Placeholder */}
        <section className="p-6 md:p-8 bg-gray-850 border border-gray-700 rounded-lg shadow-xl">
          <div className="flex items-center mb-6">
             <FaClipboardList className="text-3xl text-amber-400 mr-4" />
            <h2 className="text-3xl font-semibold text-white">Current Openings</h2>
          </div>
          <p className="text-gray-400 mb-4">
            While we are gearing up, we'll be listing specific freelance and contract opportunities here. Stay tuned!
          </p>
          {/* Example of how a job listing might look (placeholder) */}
          <div className="bg-gray-800 p-4 rounded-md border border-gray-700/50 opacity-50">
            <h3 className="text-xl font-semibold text-sky-300">Freelance Frontend Developer (React/Next.js)</h3>
            <p className="text-sm text-gray-500 mb-2">Remote | Contract</p>
            <p className="text-gray-400 text-sm">
              Looking for an experienced Next.js developer to help build out new features for our platform... (Details coming soon)
            </p>
            <button className="mt-3 text-sm text-sky-400 hover:text-sky-300 cursor-not-allowed">Learn More & Apply (Not Active)</button>
          </div>
          {/* Add more job listing placeholders as needed */}
        </section>

        <div className="mt-16 text-center">
          <Link href="/profile" className="text-sky-400 hover:text-sky-300 transition-colors">
            &larr; Back to Profile
          </Link>
        </div>
      </div>
    </div>
  );
} 