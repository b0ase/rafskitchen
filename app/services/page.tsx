'use client';

import React from 'react';
import Link from 'next/link';

// We can add actual icons later if desired, e.g., from react-icons
// import { FaMagic, FaShoppingCart, FaLaptopCode, FaMobileAlt, FaPalette, FaBullhorn, FaShieldAlt, FaLightbulb } from 'react-icons/fa';

const services = [
  {
    id: 'bespoke-web-forging',
    title: 'Bespoke Web Forging',
    description: "Forget cookie-cutter templates. We are digital blacksmiths, forging unique online presences from the ground up. Whether it's a sleek corporate portal, an engaging portfolio, or a dynamic informational hub, we meticulously craft responsive, high-performance websites that are as visually stunning as they are intuitively functional. We blend cutting-edge technology with timeless design principles to create a digital home your brand deserves.",
    // icon: <FaLaptopCode />, // Example
  },
  {
    id: 'ecommerce-alchemy',
    title: 'E-commerce Alchemy',
    description: "Transform browsers into buyers with our E-commerce Alchemy. We conjure seamless online shopping experiences that captivate customers and convert clicks into commerce. From intuitive product showcases and secure payment gateways to streamlined inventory management, we build robust e-commerce platforms that not only look magical but work effortlessly to grow your digital storefront.",
    // icon: <FaShoppingCart />,
  },
  {
    id: 'digital-dreamweaving',
    title: 'Digital Dreamweaving',
    description: "Have a complex idea that needs more than a standard website? Our Digital Dreamweavers specialize in architecting sophisticated web applications. We translate intricate business logic into powerful, scalable, and user-friendly platforms – from custom SaaS solutions and interactive dashboards to collaborative tools that empower your team and delight your users.",
    // icon: <FaLaptopCode />, 
  },
  {
    id: 'ui-ux-enchantment',
    title: 'UI/UX Enchantment',
    description: "User experience is the soul of any digital product. Our UI/UX Enchanters dive deep into your audience's needs and behaviors to design interfaces that are not just beautiful, but a joy to interact with. We focus on creating intuitive navigation, compelling visuals, and frictionless journeys that keep users engaged and coming back for more.",
    // icon: <FaPalette />,
  },
  {
    id: 'brand-cartography',
    title: 'Brand Cartography',
    description: "Navigate the crowded digital world with a brand that stands out. Our Brand Cartographers help you map out a unique identity, from a memorable logo and compelling visual language to a consistent brand voice. We craft identities that resonate with your target audience and tell your story with clarity and impact.",
    // icon: <FaMagic />, 
  },
  {
    id: 'digital-horizon-scanning',
    title: 'Digital Horizon Scanning',
    description: "Launch your brand into the digital stratosphere. Our Digital Horizon Scanners employ strategic SEO and innovative digital marketing techniques to ensure you're not just seen, but sought after. We optimize your online presence, craft engaging content, and develop targeted campaigns to attract, convert, and retain your ideal customers.",
    // icon: <FaBullhorn />,
  },
  {
    id: 'tech-guardianship',
    title: 'Tech Guardianship',
    description: "Your digital assets need constant care. Our Tech Guardians provide ongoing maintenance and support to keep your website and applications running smoothly, securely, and up-to-date. We're your vigilant partners, ensuring peak performance so you can focus on your core business.",
    // icon: <FaShieldAlt />,
  },
  {
    id: 'strategic-divination',
    title: 'Strategic Divination',
    description: "Unsure how to navigate the digital landscape? Our Strategic Diviners offer expert consultation to help you chart a course for success. We analyze your goals, identify opportunities, and develop actionable digital strategies that align with your vision and deliver measurable results.",
    // icon: <FaLightbulb />,
  }
];

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-950 text-black p-4 md:p-8 lg:p-12">
      <header className="text-center mb-12 md:mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-cyan-600 mb-4">
          Crafting Digital Excellence: Our Services
        </h1>
        <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
          At b0ase, we don't just build websites; we architect digital experiences. We're a collective of dreamers, designers, and developers passionate about transforming your vision into reality. Our services are meticulously crafted to elevate your brand, engage your audience, and drive tangible results in the digital landscape.
        </p>
      </header>

      <main>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white p-6 border border-gray-200 shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 ease-in-out flex flex-col transform hover:-translate-y-1">
              {/* 
              // Placeholder for icon if you wish to add one later
              <div className="text-cyan-600 mb-4 text-4xl mx-auto">
                {service.icon || <FaLaptopCode />} 
              </div>
              */}
              <h2 className="text-2xl font-semibold text-black mb-3">{service.title}</h2>
              <p className="text-gray-600 text-base leading-relaxed mb-6 flex-grow">{service.description}</p>
              <div className="mt-auto pt-4 border-t border-gray-700">
                <Link 
                  href={`/services/${service.id}`}
                  className="block w-full text-center bg-cyan-600 hover:bg-cyan-700 text-black font-semibold py-2.5 px-4 rounded transition duration-200 text-sm"
                >
                  Learn More
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <footer className="text-center mt-16 md:mt-20 py-8 border-t border-gray-200">
        <p className="text-gray-500 text-lg">
          Ready to transform your digital presence?{' '}
          <Link href="/contact" className="text-cyan-600 hover:underline font-semibold">
            Get in touch
          </Link>
          {' '}and let's build something amazing together.
        </p>
      </footer>
    </div>
  );
} 