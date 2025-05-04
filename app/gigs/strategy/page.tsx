"use client";
import React from 'react'; // Adding explicit import just in case
// Removed useState as it's not used currently

export default function StrategyPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gigs - Strategy</h1>
      
      <div className="space-y-8">
        
        {/* Core Gig Offerings */}
        <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
          <h3 className="text-xl font-semibold mb-3 text-purple-400">Core Gig Offerings</h3>
          <p className="text-gray-400 mb-4">Based on research indicating demand (Web Dev, E-commerce, AI) and our defined platform expertise, B0ASE will initially focus on offering Fiverr gigs in the following core areas:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            <li>**Shopify Development:** Full store setups, theme customization, app integration. (Leverages E-commerce trend)</li>
            <li>**WordPress Development:** Site builds, theme/plugin work, WooCommerce. (Popular platform)</li>
            <li>**React.js Frontend Development:** Custom components, full frontend builds (Next.js). (Modern web standard)</li>
            <li>**Node.js Backend Development:** REST APIs, backend logic, database integration. (Modern web standard)</li>
            <li>**Figma UI/UX Design:** Web/app design, prototyping, design systems. (Supports development offerings)</li>
            <li>**AWS Cloud Services:** Infrastructure setup, deployment, serverless functions. (Essential for modern apps)</li>
            <li>**OpenAI API Integration:** Custom chatbots, AI feature development, prompt engineering. (Leverages AI trend)</li>
          </ul>
          <p className="text-gray-400 mt-3 text-xs">These leverage identified market demands and B0ASE's technical strengths.</p>
        </div>

        {/* Unique Selling Points (USPs) */}
        <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
          <h3 className="text-xl font-semibold mb-3 text-cyan-400">Unique Selling Points (USPs)</h3>
          <p className="text-gray-400 mb-4">To stand out on Fiverr, B0ASE gigs will emphasize the following USPs:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            <li>**Modern Technology Focus:** Specializing in React, Node.js, Next.js, AWS, and AI integrations.</li>
            <li>**High-Quality Code & Design:** Delivering clean, maintainable code and aesthetically pleasing, user-friendly designs (leveraging Figma expertise).</li>
            <li>**Full-Stack Capability:** Offering end-to-end solutions by combining frontend, backend, and cloud expertise.</li>
            <li>**Performance & Optimization:** Focus on speed and efficiency in development and deployment (e.g., Shopify/WordPress speed optimization, efficient AWS usage).</li>
            <li>**Clear Communication:** Providing responsive and transparent communication throughout the project lifecycle.</li>
            <li>**AI Integration Expertise:** Ability to incorporate cutting-edge AI features using OpenAI.</li>
          </ul>
          <p className="text-gray-400 mt-3 text-xs">These USPs should be woven into gig descriptions, titles, and visuals.</p>
        </div>
        
        {/* Pricing Model */}
        <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
          <h3 className="text-xl font-semibold mb-3 text-green-400">Pricing Model</h3>
          <p className="text-gray-400 mb-4">Aligning with common Fiverr practices identified in research, gigs will primarily use a 3-tier pricing structure:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            <li>**Basic:** Entry-level package with core deliverables for a specific, limited scope.</li>
            <li>**Standard:** A balanced offering with more features, revisions, or complexity.</li>
            <li>**Premium:** Comprehensive package including advanced features, full scope, extensive support, or faster delivery.</li>
          </ul>
          <p className="text-gray-400 my-4">Additionally:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            <li>**Gig Extras:** Offer common and relevant upsells identified in research (e.g., additional pages/screens, faster delivery, source files, SEO setup, extended support) tailored to each gig type.</li>
            <li>**Custom Offers:** Be prepared to create custom offers for clients with unique requirements outside the standard tiers.</li>
            <li>**Competitive Analysis:** Regularly review competitor pricing within our chosen categories to remain competitive.</li>
          </ul>
           <p className="text-gray-400 mt-3 text-xs">The goal is to offer clear value at each tier while maximizing potential revenue through extras.</p>
       </div>

        {/* Go-to-Market Approach */}
        <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
          <h3 className="text-xl font-semibold mb-3 text-orange-400">Go-to-Market Approach</h3>
          <p className="text-gray-400 mb-4">The initial launch on Fiverr will involve:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-300">
            <li>**Optimized Gig Creation:** Follow research findings on successful gig structures:
                <ul className="list-disc list-inside ml-6 text-xs text-gray-400">
                    <li>Use clear, keyword-rich titles (incorporating terms like "Shopify", "React", "Next.js", "Node.js API", "Figma UI UX", "AWS Deployment", "OpenAI Chatbot").</li>
                    <li>Write detailed descriptions clearly outlining scope, deliverables, process, and highlighting B0ASE USPs.</li>
                    <li>Create high-quality visuals (images/videos) showcasing portfolio examples, technical diagrams, or UI mockups relevant to the gig.</li>
                </ul>
            </li>
            <li>**Portfolio Development:** Ensure portfolio items are ready to be showcased for each gig category (links to live sites, GitHub repos, Figma prototypes).</li>
            <li>**Introductory Offers (Optional):** Consider slightly lower pricing or included extras for the first few orders to gain initial traction and positive reviews.</li>
            <li>**Cross-Promotion:** Link to the B0ASE Fiverr profile/gigs from the main B0ASE.COM website (potentially from the `/gigs` hub page).</li>
            <li>**Review Management:** Actively encourage and respond to client reviews to build social proof.</li>
          </ul>
           <p className="text-gray-400 mt-3 text-xs">Focus on building a strong reputation through quality delivery and positive client interactions.</p>
        </div>

      </div>
    </div>
  );
} 