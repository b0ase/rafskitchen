'use client';

import Link from 'next/link';

const services = [
  {
    name: 'Web Design & Development',
    description: 'Building responsive, performant websites & applications using modern tech, including Web3, crypto & blockchain integrations.',
    rate: 'Est. Rate: £120/hr | £480/day',
    slug: 'web-design-and-development'
  },
  {
    name: 'Software Development',
    description: 'App development and technical support for start-ups, with a special focus on crypto, blockchain, and AI innovation.',
    rate: 'Est. Rate: £120/hr | £480/day',
    slug: 'software-development'
  },
  {
    name: 'Content & Copywriting',
    description: 'Crafting compelling narratives, articles, and website copy tailored to your audience.',
    rate: 'Est. Rate: £100/hr | £400/day',
    slug: 'content-and-copywriting'
  },
  {
    name: 'Video Production & Photography',
    description: 'From concept and shooting to editing and final delivery for promotional or creative needs, including high-quality photography.',
    rate: 'Est. Rate: £110/hr | £450/day',
    slug: 'video-production-and-photography'
  },
  {
    name: 'Logo Design & Branding',
    description: 'Crafting unique logos and visual identities that effectively represent your brand.',
    rate: 'Est. Rate: £90/hr | Project-based',
    slug: 'logo-design-and-branding'
  },
  {
    name: 'SEO & Digital Marketing',
    description: 'Optimizing online presence and content strategy to drive organic growth.',
    rate: 'Est. Rate: £110/hr | £450/day',
    slug: 'seo-and-digital-marketing'
  },
  {
    name: 'Social Media Management',
    description: 'Developing strategies, creating content, and managing social media presence to grow engagement and reach.',
    rate: 'Est. Rate: £80/hr | Retainer',
    slug: 'social-media-management'
  },
  {
    name: 'Technical Consulting',
    description: 'Providing expert advice and strategy for your digital projects and technical challenges.',
    rate: 'Est. Rate: £150/hr',
    slug: 'technical-consulting'
  },
  {
    name: 'Support & Maintenance',
    description: 'Ongoing technical support, updates, and optimization to ensure your digital assets run smoothly and securely.',
    rate: 'Retainer-based | Ad-hoc rates available',
    slug: 'support-and-maintenance'
  }
];

export default function SubNavigation() {
  return (
    <nav className="w-full bg-gray-900 shadow-sm py-2 border-b border-gray-700 sticky top-[60px] z-30">
      <div className="px-4 mx-auto max-w-7xl">
        <div className="flex justify-between items-center">
          <ul className="flex space-x-4 md:space-x-6 overflow-x-auto whitespace-nowrap py-1">
            {services.map((service) => (
              <li key={service.slug}>
                <Link
                  href={`/services/${service.slug}`}
                  className="text-gray-300 hover:text-sky-400 dark:hover:text-sky-400 transition-colors duration-200 text-sm font-medium py-1 px-2 rounded-md"
                >
                  {service.name}
                </Link>
              </li>
            ))}
          </ul>

          <ul className="hidden md:flex space-x-4 md:space-x-5 py-1">
            <li>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm py-1 flex items-center">
                Fiverr
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            </li>
             <li>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm py-1 flex items-center">
                Upwork
                <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            </li>
             <li>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors duration-200 text-sm py-1 flex items-center">
                Freelancer
                 <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
} 