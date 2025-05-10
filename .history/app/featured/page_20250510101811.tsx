import Link from 'next/link';

const featuredWorks = [
  {
    title: 'E-commerce Platform',
    description: 'E-commerce platform with integrated payment processing and inventory management.',
    href: '/featured/ecommerce-platform',
    tech: ['React', 'Node.js', 'MongoDB', 'Stripe'],
  },
  {
    title: 'Corporate Web Portal',
    description: 'Corporate web portal with secure document management and collaboration tools.',
    href: '/featured/corporate-web-portal',
    tech: ['Next.js', 'Firebase', 'Auth0', 'Material UI'],
  },
  {
    title: 'Progressive Web App',
    description: 'Progressive web app with offline functionality and real-time data synchronization.',
    href: '/featured/progressive-web-app',
    tech: ['React', 'Service Workers', 'IndexedDB', 'WebSockets'],
  },
  {
    title: 'Crypto Trading Platform',
    description: 'Secure and user-friendly cryptocurrency trading platform with real-time market data and advanced order types.',
    href: '/featured/crypto-trading-platform',
    tech: ['React', 'Node.js', 'WebSockets', 'Blockchain APIs'],
  },
  {
    title: 'Smart Contract Audit Tool',
    description: 'Automated tool for analyzing and validating smart contracts across multiple blockchain networks.',
    href: '/featured/smart-contract-audit-tool',
    tech: ['Solidity', 'Python', 'Web3.js', 'Ethereum'],
  },
  {
    title: 'AI-Powered Analytics Dashboard',
    description: 'Business intelligence dashboard using machine learning to predict trends and provide actionable insights.',
    href: '/featured/ai-powered-analytics-dashboard',
    tech: ['TensorFlow', 'Python', 'D3.js', 'Docker'],
  },
];

export default function FeaturedWorkPage() {
  return (
    <div className="min-h-screen bg-black text-gray-100 px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">Featured Work</h1>
        <div className="grid md:grid-cols-3 gap-8">
          {featuredWorks.map((work) => (
            <Link
              key={work.title}
              href={work.href}
              className="block bg-gray-900 border border-white rounded-lg shadow-lg p-6 hover:border-sky-400 transition-colors duration-150 cursor-pointer transform hover:scale-105 hover:bg-gray-800"
            >
              <h2 className="text-2xl font-semibold mb-2 text-sky-400">{work.title}</h2>
              <p className="mb-4 text-gray-300 text-sm">{work.description}</p>
              <div className="mb-2">
                <span className="text-xs font-semibold text-gray-400">Tech Stack:</span>
                <ul className="list-disc list-inside text-gray-200 text-xs mt-1">
                  {work.tech.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <span className="inline-block mt-4 text-sky-400 text-xs hover:underline">View Project →</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 