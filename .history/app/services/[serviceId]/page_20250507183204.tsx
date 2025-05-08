'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation'; // To get the serviceId from the URL

// Define services data directly in this file or import from a shared location
// For simplicity, we'll redefine it here. In a real app, this would be in a shared data file.
const services = [
  {
    id: 'bespoke-web-forging',
    title: 'Bespoke Web Forging',
    description: "Forget cookie-cutter templates. We are digital blacksmiths, forging unique online presences from the ground up. Whether it's a sleek corporate portal, an engaging portfolio, or a dynamic informational hub, we meticulously craft responsive, high-performance websites that are as visually stunning as they are intuitively functional. We blend cutting-edge technology with timeless design principles to create a digital home your brand deserves.",
    longDescription: "Our Bespoke Web Forging process begins with a deep dive into your brand, objectives, and target audience. We don't just build websites; we craft digital experiences tailored to your unique identity. This includes comprehensive UI/UX design, custom front-end development with modern frameworks (like Next.js or React), and robust back-end solutions if needed. We ensure your site is SEO-friendly, accessible, and performs flawlessly across all devices. Expect a collaborative process, transparent communication, and a final product that truly represents your vision and drives results."
  },
  {
    id: 'ecommerce-alchemy',
    title: 'E-commerce Alchemy',
    description: "Transform browsers into buyers with our E-commerce Alchemy. We conjure seamless online shopping experiences that captivate customers and convert clicks into commerce. From intuitive product showcases and secure payment gateways to streamlined inventory management, we build robust e-commerce platforms that not only look magical but work effortlessly to grow your digital storefront.",
    longDescription: "With E-commerce Alchemy, we create more than just online stores; we build powerful sales engines. Our expertise covers platform selection (e.g., Shopify, WooCommerce, or custom builds), payment gateway integration, inventory management systems, customer accounts, and conversion rate optimization. We focus on creating a user journey that is intuitive, secure, and encourages purchases. From product photography guidance to post-launch analytics, we provide a comprehensive solution to thrive in the competitive online marketplace."
  },
  {
    id: 'digital-dreamweaving',
    title: 'Digital Dreamweaving',
    description: "Have a complex idea that needs more than a standard website? Our Digital Dreamweavers specialize in architecting sophisticated web applications. We translate intricate business logic into powerful, scalable, and user-friendly platforms – from custom SaaS solutions and interactive dashboards to collaborative tools that empower your team and delight your users.",
    longDescription: "Digital Dreamweaving is where your most ambitious ideas take flight. We specialize in building custom web applications, SaaS products, APIs, and complex platforms. Our process involves detailed requirement analysis, robust architecture design, agile development sprints, and rigorous testing. We leverage modern technology stacks (e.g., Node.js, Python, Ruby on Rails, and various database solutions) to build scalable, secure, and maintainable applications that solve real-world problems and provide significant business value."
  },
  {
    id: 'ui-ux-enchantment',
    title: 'UI/UX Enchantment',
    description: "User experience is the soul of any digital product. Our UI/UX Enchanters dive deep into your audience's needs and behaviors to design interfaces that are not just beautiful, but a joy to interact with. We focus on creating intuitive navigation, compelling visuals, and frictionless journeys that keep users engaged and coming back for more.",
    longDescription: "UI/UX Enchantment is about creating digital magic through user-centered design. Our process includes user research, persona development, wireframing, prototyping, and usability testing. We craft visually appealing interfaces that are also intuitive, accessible, and aligned with your brand identity. The result is a seamless user experience that reduces friction, increases engagement, and achieves your business objectives, whether it's for a website, web application, or mobile app."
  },
  {
    id: 'brand-cartography',
    title: 'Brand Cartography',
    description: "Navigate the crowded digital world with a brand that stands out. Our Brand Cartographers help you map out a unique identity, from a memorable logo and compelling visual language to a consistent brand voice. We craft identities that resonate with your target audience and tell your story with clarity and impact.",
    longDescription: "Brand Cartography is our comprehensive approach to building memorable and impactful brands. This service includes market research, competitor analysis, brand strategy development, logo design, visual identity systems (color palettes, typography, imagery), and brand guidelines. We work with you to define your brand's core message and create a cohesive identity that effectively communicates your values and differentiates you in the marketplace."
  },
  {
    id: 'digital-horizon-scanning',
    title: 'Digital Horizon Scanning',
    description: "Launch your brand into the digital stratosphere. Our Digital Horizon Scanners employ strategic SEO and innovative digital marketing techniques to ensure you're not just seen, but sought after. We optimize your online presence, craft engaging content, and develop targeted campaigns to attract, convert, and retain your ideal customers.",
    longDescription: "With Digital Horizon Scanning, we chart your course to online visibility and growth. Our services include comprehensive SEO audits, keyword research, on-page and off-page optimization, technical SEO, content marketing strategy, and analytics tracking. We stay ahead of algorithm changes and digital trends to ensure your brand reaches its target audience effectively and achieves sustainable growth in search rankings and organic traffic."
  },
  {
    id: 'tech-guardianship',
    title: 'Tech Guardianship',
    description: "Your digital assets need constant care. Our Tech Guardians provide ongoing maintenance and support to keep your website and applications running smoothly, securely, and up-to-date. We're your vigilant partners, ensuring peak performance so you can focus on your core business.",
    longDescription: "Tech Guardianship offers peace of mind by ensuring your digital platforms are always performing optimally. This includes regular updates, security monitoring and patching, performance optimization, bug fixes, backups, and technical support. We offer various retainers and support packages tailored to your needs, ensuring your website or application remains a reliable and secure asset for your business."
  },
  {
    id: 'strategic-divination',
    title: 'Strategic Divination',
    description: "Unsure how to navigate the digital landscape? Our Strategic Diviners offer expert consultation to help you chart a course for success. We analyze your goals, identify opportunities, and develop actionable digital strategies that align with your vision and deliver measurable results.",
    longDescription: "Our Strategic Divination service provides clarity and direction for your digital journey. We offer workshops, audits, and consulting sessions to help you define your digital strategy, identify key performance indicators (KPIs), choose the right technologies, and plan your product roadmap. Whether you're a startup or an established business, we provide the insights and guidance needed to make informed decisions and achieve digital success."
  },
  {
    id: 'web-development',
    title: 'Foundation Web Presence',
    description: "Laying the cornerstone of your digital identity. We build clean, efficient, and professional websites perfect for showcasing your business, portfolio, or passion project to the world.",
    longDescription: "Our Foundation Web Presence service is designed for those who need a robust and professional website that clearly communicates their message and brand. We focus on creating fast-loading, responsive designs that look great on any device. This service typically includes information architecture, content strategy, custom design (or premium theme customization), development on reliable platforms, basic SEO setup, and training for content updates. Whether you're a startup, a small business, or an individual, we'll provide a high-quality website that serves as a strong foundation for your online success."
  }
];

export default function ServiceDetailPage() {
  const params = useParams();
  const serviceId = params.serviceId as string;
  const service = services.find(s => s.id === serviceId);

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-950 text-white p-8 flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">Service Not Found</h1>
        <p className="text-xl text-gray-300 mb-8">The service you're looking for doesn't exist or has been moved.</p>
        <Link href="/services" className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded transition duration-200">
          Back to All Services
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8 lg:p-12">
      <header className="mb-10 md:mb-12 border-b border-gray-800 pb-8">
        <nav className="mb-6">
          <Link href="/services" className="text-cyan-400 hover:text-cyan-300 transition-colors text-sm">
            &larr; Back to All Services
          </Link>
        </nav>
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-400 mb-3">{service.title}</h1>
        <p className="text-lg md:text-xl text-gray-400 italic">{service.description}</p>
      </header>

      <main className="max-w-3xl mx-auto">
        <article className="prose prose-invert prose-lg lg:prose-xl text-gray-300 leading-relaxed">
          {/* Using a simple paragraph for longDescription. For more complex HTML, you might use dangerouslySetInnerHTML or a markdown parser if the content was in Markdown format */}
          <p>{service.longDescription || "More details coming soon for this service."}</p>
        </article>

        <div className="mt-12 md:mt-16 pt-8 border-t border-gray-700 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold text-white mb-6">Interested in {service.title}?</h2>
          <Link 
            href={`/contact?service=${service.id}`}
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200 text-lg shadow-lg hover:shadow-green-500/30 transform hover:scale-105"
          >
            Discuss This Service
          </Link>
        </div>
      </main>

      <footer className="text-center mt-16 md:mt-20 py-8 border-t border-gray-800">
        <p className="text-gray-500">
          Explore other ways b0ase can help elevate your digital presence.{' '}
          <Link href="/services" className="text-cyan-400 hover:underline font-semibold">
            View All Services
          </Link>.
        </p>
      </footer>
    </div>
  );
} 