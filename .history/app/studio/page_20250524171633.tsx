import Link from 'next/link';
import { FaCode, FaRocket, FaBrain, FaPalette, FaUsers, FaChartLine } from 'react-icons/fa';

export default function StudioPage() {
  const features = [
    {
      icon: FaCode,
      title: 'Development Studio',
      description: 'Full-stack development environment with modern tools and frameworks',
      color: 'blue'
    },
    {
      icon: FaBrain,
      title: 'AI Integration',
      description: 'AI-powered tools and machine learning capabilities for your projects',
      color: 'purple'
    },
    {
      icon: FaPalette,
      title: 'Design Lab',
      description: 'Creative design workspace with advanced design tools and resources',
      color: 'pink'
    },
    {
      icon: FaUsers,
      title: 'Collaboration Hub',
      description: 'Team workspace for seamless collaboration and project management',
      color: 'green'
    },
    {
      icon: FaRocket,
      title: 'Launch Pad',
      description: 'Deploy and scale your applications with our cloud infrastructure',
      color: 'orange'
    },
    {
      icon: FaChartLine,
      title: 'Analytics Center',
      description: 'Comprehensive analytics and insights for your digital products',
      color: 'indigo'
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-800',
    purple: 'bg-purple-50 border-purple-200 text-purple-800',
    pink: 'bg-pink-50 border-pink-200 text-pink-800',
    green: 'bg-green-50 border-green-200 text-green-800',
    orange: 'bg-orange-50 border-orange-200 text-orange-800',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-800'
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">RafsKitchen Studio</h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Your creative workspace for digital innovation
          </p>
          <p className="text-lg text-blue-200 max-w-3xl mx-auto">
            The Studio is where ideas transform into reality. Access our comprehensive 
            suite of development tools, design resources, and collaboration platforms 
            to build the future of technology.
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-6xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border-2 transition-all duration-300 hover:shadow-lg hover:scale-105 ${
                colorClasses[feature.color as keyof typeof colorClasses]
              }`}
            >
              <feature.icon className="text-4xl mb-4" />
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Start Building?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Join the RafsKitchen ecosystem and turn your innovative ideas into digital reality.
          </p>
          <div className="space-y-4 md:space-y-0 md:space-x-4 md:flex md:justify-center">
            <Link
              href="/profile"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Access Dashboard
            </Link>
            <Link
              href="/login"
              className="inline-block bg-white border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-yellow-50 border-t border-yellow-200 py-8 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">Demo Environment</h3>
          <p className="text-yellow-700">
            This is a demonstration of the RafsKitchen Studio interface. 
            All tools and features shown are representative of the full platform experience.
          </p>
        </div>
      </div>
    </div>
  );
} 