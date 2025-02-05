/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static optimization
  output: 'standalone',
  // Add environment variables that should be public
  env: {
    NEXT_PUBLIC_AIML_API_KEY: process.env.NEXT_PUBLIC_AIML_API_KEY,
  }
};

module.exports = nextConfig;
