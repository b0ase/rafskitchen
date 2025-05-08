"use client";
import React from 'react'; // Adding explicit import just in case
import Link from 'next/link';

export default function ActionPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link href="/gigs" className="text-blue-400 hover:text-blue-300 flex items-center gap-2">
          <span>←</span> Back to Gigs Hub
        </Link>
      </div>
      
      <h1 className="text-3xl font-bold mb-6">Gigs - Action Plan</h1>

      <div>
        <h3 className="text-xl font-semibold mb-4">Action Plan per Gig Category</h3>
        <p className="text-gray-400 mb-2">Outline the steps needed to prepare and launch gigs for each key platform/technology area.</p>
        
        <div className="space-y-8">

          {/* Shopify Action Plan */}
          <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
            <h4 className="text-lg font-semibold mb-3 text-green-400">Shopify Gigs - Action Plan</h4>
            <ul className="list-decimal list-inside space-y-1 text-sm text-gray-300">
              <li>**Define Specific Gigs:** (e.g., Full Store Setup, Theme Customization, App Integration)
                <ul className="list-disc list-inside ml-6 text-xs text-gray-400"><li>Detail Basic/Standard/Premium packages for each.</li></ul>
              </li>
              <li>**Write Titles & Descriptions:** Optimize with Shopify-related keywords. Clearly define scope & deliverables. **Highlight USPs (e.g., quality, speed, communication).**</li>
              <li>**Create Visuals:** Design professional images/video showcasing Shopify expertise & results. **Reflect USPs visually.**</li>
              <li>**Set Pricing & Extras:** Research competitor pricing. Define relevant extras (e.g., more products, faster delivery, SEO setup). Align with 3-tier model.</li>
              <li>**Define Requirements:** List needed info (logo, content, product details, objectives).</li>
              <li>**Build Portfolio:** Gather examples of Shopify stores, themes, or apps developed.</li>
              <li>**Publish & Promote:** Launch gigs, potentially offer introductory pricing for reviews.</li>
            </ul>
          </div>

          {/* WordPress Action Plan */}
          <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
            <h4 className="text-lg font-semibold mb-3 text-blue-400">WordPress Gigs - Action Plan</h4>
            <ul className="list-decimal list-inside space-y-1 text-sm text-gray-300">
              <li>**Define Specific Gigs:** (e.g., Full Site Build, Theme/Plugin Dev, WooCommerce Setup, Optimization)
                <ul className="list-disc list-inside ml-6 text-xs text-gray-400"><li>Detail Basic/Standard/Premium packages for each.</li></ul>
              </li>
              <li>**Write Titles & Descriptions:** Use WP keywords (WordPress, WooCommerce, Elementor, etc.). Clearly define scope. **Highlight USPs.**</li>
              <li>**Create Visuals:** Design images/video showcasing WP skills (site examples, backend shots). **Reflect USPs visually.**</li>
              <li>**Set Pricing & Extras:** Price competitively. Offer extras (more pages, SEO, security, maintenance). Align with 3-tier model.</li>
              <li>**Define Requirements:** Ask for content, hosting access (if needed), design preferences.</li>
              <li>**Build Portfolio:** Gather examples of WP sites, themes, or plugins developed.</li>
              <li>**Publish & Promote:** Launch gigs, aim for initial positive reviews.</li>
            </ul>
          </div>

          {/* React.js Action Plan */}
          <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
            <h4 className="text-lg font-semibold mb-3 text-cyan-400">React.js Gigs - Action Plan</h4>
            <ul className="list-decimal list-inside space-y-1 text-sm text-gray-300">
              <li>**Define Specific Gigs:** (e.g., Custom Component, Frontend Dev, Next.js App, Bug Fixing)
                <ul className="list-disc list-inside ml-6 text-xs text-gray-400"><li>Detail packages based on complexity/features.</li></ul>
              </li>
              <li>**Write Titles & Descriptions:** Use keywords (React, Next.js, Frontend, Component). Specify deliverables. **Highlight USPs (e.g., modern tech, clean code).**</li>
              <li>**Create Visuals:** Show code snippets (cleanly formatted), UI examples, architecture diagrams. **Reflect USPs visually.**</li>
              <li>**Set Pricing & Extras:** Tier pricing by complexity. Offer extras (testing, state management setup, performance tuning). Align with 3-tier model.</li>
              <li>**Define Requirements:** Need design files (Figma?), API endpoints, project goals.</li>
              <li>**Build Portfolio:** Showcase React projects on GitHub or live demos.</li>
              <li>**Publish & Promote:** Target clients needing frontend expertise.</li>
            </ul>
          </div>

          {/* Node.js Action Plan */}
          <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
            <h4 className="text-lg font-semibold mb-3 text-lime-400">Node.js Gigs - Action Plan</h4>
            <ul className="list-decimal list-inside space-y-1 text-sm text-gray-300">
              <li>**Define Specific Gigs:** (e.g., REST API Dev, Backend Build, Express/NestJS App, Microservice)
                 <ul className="list-disc list-inside ml-6 text-xs text-gray-400"><li>Detail packages by endpoints, features, database integration.</li></ul>
             </li>
              <li>**Write Titles & Descriptions:** Use keywords (Node.js, Express, API, Backend, Microservice). Detail tech stack. **Highlight USPs (e.g., performance, reliability).**</li>
              <li>**Create Visuals:** Show API documentation examples (Swagger?), code structure, deployment flow. **Reflect USPs visually.**</li>
              <li>**Set Pricing & Extras:** Price based on API complexity/scale. Extras: authentication, database setup, deployment assistance. Align with 3-tier model.</li>
              <li>**Define Requirements:** Need project scope, data models, frontend details (if applicable).</li>
              <li>**Build Portfolio:** Host API examples, provide GitHub links to backend projects.</li>
              <li>**Publish & Promote:** Target clients needing backend or API services.</li>
            </ul>
          </div>

          {/* Figma Action Plan */}
          <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
            <h4 className="text-lg font-semibold mb-3 text-purple-400">Figma Gigs - Action Plan</h4>
            <ul className="list-decimal list-inside space-y-1 text-sm text-gray-300">
              <li>**Define Specific Gigs:** (e.g., Web UI/UX, Mobile UI/UX, Prototyping, Design System)
                <ul className="list-disc list-inside ml-6 text-xs text-gray-400"><li>Detail packages by screens, components, prototype complexity.</li></ul>
              </li>
              <li>**Write Titles & Descriptions:** Use keywords (Figma, UI, UX, Prototype, Design System). Emphasize process. **Highlight USPs (e.g., design quality, user-centricity).**</li>
              <li>**Create Visuals:** High-quality mockups, prototype demos (GIFs/videos), design system examples. **Reflect USPs visually.**</li>
              <li>**Set Pricing & Extras:** Tier by scope/deliverables. Extras: responsive versions, interactive prototyping, style guide. Align with 3-tier model.</li>
              <li>**Define Requirements:** Ask for brief, target audience, brand guidelines, user flows (if available).</li>
              <li>**Build Portfolio:** Showcase stunning Figma designs on Behance/Dribbble or personal site.</li>
              <li>**Publish & Promote:** Target clients needing design or prototyping.</li>
            </ul>
          </div>

          {/* AWS Action Plan */}
          <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
            <h4 className="text-lg font-semibold mb-3 text-orange-400">AWS Gigs - Action Plan</h4>
            <ul className="list-decimal list-inside space-y-1 text-sm text-gray-300">
              <li>**Define Specific Gigs:** (e.g., Infrastructure Setup, App Deployment, Serverless API, Cost Audit)
                <ul className="list-disc list-inside ml-6 text-xs text-gray-400"><li>Detail packages by services used, complexity, scale.</li></ul>
              </li>
              <li>**Write Titles & Descriptions:** Use AWS service keywords (EC2, S3, Lambda, RDS). Specify problem solved. **Highlight USPs (e.g., scalability, reliability).**</li>
              <li>**Create Visuals:** Architecture diagrams, screenshots of AWS console/configs, performance graphs. **Reflect USPs visually.**</li>
              <li>**Set Pricing & Extras:** Price based on scope/complexity. Extras: monitoring setup, documentation, ongoing support. Align with 3-tier model.</li>
              <li>**Define Requirements:** Need project details, current setup (if any), access credentials (securely).</li>
              <li>**Build Portfolio:** Describe past AWS projects, certifications (if any).</li>
              <li>**Publish & Promote:** Target clients needing cloud infrastructure or deployment.</li>
            </ul>
          </div>
          
          {/* OpenAI API Action Plan */}
          <div className="p-4 border border-gray-700 rounded-lg bg-gray-850">
            <h4 className="text-lg font-semibold mb-3 text-teal-400">OpenAI API Gigs - Action Plan</h4>
            <ul className="list-decimal list-inside space-y-1 text-sm text-gray-300">
              <li>**Define Specific Gigs:** (e.g., API Integration, Custom Chatbot, Content Gen Tool, Prompt Engineering)
                <ul className="list-disc list-inside ml-6 text-xs text-gray-400"><li>Detail packages by features, complexity, usage limits.</li></ul>
              </li>
              <li>**Write Titles & Descriptions:** Use keywords (OpenAI, GPT, Chatbot, AI Integration). Explain use case clearly. **Highlight USPs (e.g., AI expertise, innovative solutions).**</li>
              <li>**Create Visuals:** Demo videos of the AI tool in action, flowcharts, example outputs. **Reflect USPs visually.**</li>
              <li>**Set Pricing & Extras:** Tier by features/complexity. Extras: fine-tuning help, usage monitoring setup, extended support. Align with 3-tier model.</li>
              <li>**Define Requirements:** Need target application details, desired AI functionality, API key handling plan.</li>
              <li>**Build Portfolio:** Showcase AI integration projects, demo chatbots or tools.</li>
              <li>**Publish & Promote:** Target clients looking to add AI features.</li>
            </ul>
          </div>

          {/* Placeholder for other action plans */}
          {/* <button className="text-sm text-blue-400 hover:text-blue-300">+ Add Another Gig Plan</button> */} 
        </div>
      </div>
    </div>
  );
} 