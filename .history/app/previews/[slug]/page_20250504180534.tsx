'use client'; // Keep client-side for now, might become server component later

import Link from 'next/link';
import React from 'react'; // Import React if using components

// This component receives the slug from the dynamic route
export default function ProjectPreviewPage({ params }: { params: { slug: string } }) {
  const projectSlug = params.slug;

  // --- Mock Data (Replace with actual data or fetch later) ---
  const clientName = projectSlug; // Example: Use slug as client name for now
  const websiteName = "robust-ae.com"; // Target website name

  return (
    <div className="bg-gray-900 text-white min-h-screen flex flex-col">
      {/* --- Main Content Area --- */}
      <main className="flex-grow container mx-auto px-4 py-8 md:px-6 lg:px-8">

        {/* --- Hero Section Placeholder --- */}
        <section id="hero" className="text-center py-16 md:py-24 bg-gray-800 rounded-lg shadow-xl mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-white">Hardware Doesn't Have to Be Hard.</h1>
          <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            End-to-end product design for consumer products. We bring your ideas to life through a flexible and affordable engineering approach.
          </p>
          <button className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-8 rounded transition duration-200 text-lg">
            Discover More
          </button>
        </section>

        {/* --- Capabilities Section Placeholder --- */}
        <section id="capabilities" className="py-12">
          <h2 className="text-3xl font-semibold text-center mb-8 text-cyan-400">Our Capabilities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Repeat this block for each capability */}
            <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-white">Electronic Design</h3>
              <p className="text-gray-400 mb-4">From prototype to production, we build things that work.</p>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 font-semibold">Learn More &rarr;</a>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-white">Mechanical Design</h3>
              <p className="text-gray-400 mb-4">Concept to DFM with a tightly integrated approach.</p>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 font-semibold">Learn More &rarr;</a>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-white">Firmware Engineering</h3>
              <p className="text-gray-400 mb-4">Breathing life into hardware, making your product unique.</p>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 font-semibold">Learn More &rarr;</a>
            </div>
             <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-white">Production</h3>
              <p className="text-gray-400 mb-4">Bridging the gap between DIY production and mass manufacturing.</p>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 font-semibold">Learn More &rarr;</a>
            </div>
             <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-white">CTO Level Strategy</h3>
              <p className="text-gray-400 mb-4">Navigating the technology landscape with insights and guidance.</p>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 font-semibold">Learn More &rarr;</a>
            </div>
             <div className="bg-gray-800 p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold mb-3 text-white">Partnerships</h3>
              <p className="text-gray-400 mb-4">Integrating experienced engineers into your growing team.</p>
              <a href="#" className="text-cyan-400 hover:text-cyan-300 font-semibold">Learn More &rarr;</a>
            </div>
            {/* ... Add more capability blocks as needed */}
          </div>
        </section>

        {/* --- Testimonials Section Placeholder --- */}
        <section id="testimonials" className="py-12 bg-gray-800 rounded-lg shadow-lg my-12">
           <h2 className="text-3xl font-semibold text-center mb-8 text-cyan-400">Client Testimonials</h2>
           <div className="max-w-3xl mx-auto text-center px-4">
              <blockquote className="text-lg italic text-gray-300 mb-4">
                 "We have been fortunate in finding [Your Company Name] to help us... They worked with our internal team and external partners to transform prototype development boards into a production-ready piece of hardware."
              </blockquote>
              <p className="font-semibold text-white">- Andy King, CEO, Limetrack</p>
              {/* Add more testimonials */}
           </div>
        </section>

        {/* --- Clients Section Placeholder --- */}
        <section id="clients" className="py-12 text-center">
          <h2 className="text-3xl font-semibold mb-8 text-cyan-400">Some Of Our Clients</h2>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            {/* Placeholder Logos */}
            <div className="text-gray-500 text-2xl font-bold">[Client Logo 1]</div>
            <div className="text-gray-500 text-2xl font-bold">[Client Logo 2]</div>
            <div className="text-gray-500 text-2xl font-bold">[Client Logo 3]</div>
            <div className="text-gray-500 text-2xl font-bold">[Client Logo 4]</div>
            <div className="text-gray-500 text-2xl font-bold">[Client Logo 5]</div>
          </div>
        </section>

        {/* --- Mission Section Placeholder --- */}
        <section id="mission" className="py-12 bg-gray-800 rounded-lg shadow-lg my-12 px-6 md:px-10">
          <h2 className="text-3xl font-semibold text-center mb-8 text-cyan-400">Our Mission</h2>
          <div className="max-w-4xl mx-auto text-gray-300 space-y-6">
             <h3 className="text-2xl font-semibold text-white text-center">Hardware for everyone</h3>
             <p className="text-center italic">Affordable and ethical mechanical, electronics, and embedded firmware development.</p>
             <p>
                [Your Company Name] provides affordable engineering services to individuals and companies looking for professional prototypes and short-run production.
                Our goal is to lower the barrier to entering the amazing world of hardware by offering fair pricing, industry-insider knowledge, and project structures that give you useful output at every stage.
             </p>
             <div>
                <h4 className="text-xl font-semibold text-white mb-2">Fantastic Design</h4>
                <p>We design products that are reliable, long lasting, and won't cost the Earth. By designing for reliability, repair, and recycling, your product will delight your customers for longer...</p>
             </div>
              <div>
                <h4 className="text-xl font-semibold text-white mb-2">Useful Project Outputs</h4>
                <p>We understand that money and time can be in short supply... we always provide useful project outputs at every stage of work. This could take the shape of a quick prototype...</p>
             </div>
             {/* Add more points like Great Connections, Enthusiasm, Experience */}
          </div>
        </section>

        {/* --- Contact Section Placeholder --- */}
        <section id="contact" className="py-12">
          <h2 className="text-3xl font-semibold text-center mb-8 text-cyan-400">Get In Touch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-5xl mx-auto">
            {/* Contact Form */}
            <div className="bg-gray-800 p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-semibold mb-6 text-white">Send Us a Message</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">Your Name</label>
                  <input type="text" id="name" name="name" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-cyan-500 focus:border-cyan-500" placeholder="John Doe" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Your Email Address</label>
                  <input type="email" id="email" name="email" className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-cyan-500 focus:border-cyan-500" placeholder="you@example.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">Leave us a message...</label>
                  <textarea id="message" name="message" rows={4} className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:ring-cyan-500 focus:border-cyan-500" placeholder="Tell us about your project..."></textarea>
                </div>
                <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-3 px-6 rounded transition duration-200">
                  Send Message
                </button>
              </form>
            </div>
            {/* Contact Info */}
            <div className="text-gray-300">
               <h3 className="text-2xl font-semibold mb-6 text-white">Contact Information</h3>
               <div className="space-y-4">
                   <div>
                      <h4 className="text-lg font-semibold text-white">Address</h4>
                      <p>[Your Company Address Line 1]</p>
                      <p>[City, Postal Code]</p>
                      <p>[Country]</p>
                   </div>
                   <div>
                      <h4 className="text-lg font-semibold text-white">Email</h4>
                      <p><a href="mailto:hello@yourcompany.com" className="text-cyan-400 hover:underline">hello@yourcompany.com</a></p>
                   </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">Phone</h4>
                      <p><a href="tel:+440000000000" className="text-cyan-400 hover:underline">+44 (0) 000 000 0000</a></p>
                   </div>
                   {/* Add Social Links if needed */}
               </div>
            </div>
          </div>
        </section>

      </main>

      {/* --- Footer Placeholder --- */}
      <footer className="bg-gray-800 text-gray-400 text-sm py-6 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="mb-2">© {new Date().getFullYear()} {websiteName}. All rights reserved.</p>
          <p>Making hardware easy.</p>
          {/* Maybe add footer links */}
        </div>
      </footer>
    </div>
  );
} 