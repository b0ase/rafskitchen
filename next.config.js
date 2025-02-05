/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization
  output: 'standalone',
  // Add environment variables that should be public
  env: {
    NEXT_PUBLIC_AIML_API_KEY: process.env.NEXT_PUBLIC_AIML_API_KEY,
  },
  // Add this section for development server configuration
  webpack: (config, { dev, isServer }) => {
    // Custom webpack config if needed
    return config;
  },
  // Add this to allow connections from other devices
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
        ],
      },
    ];
  }
};

module.exports = nextConfig;
