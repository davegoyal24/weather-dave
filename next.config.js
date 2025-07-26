/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: process.env.NODE_ENV === 'production',
  images: {
    unoptimized: true,
  },
  distDir: process.env.NODE_ENV === 'production' ? 'out' : '.next',
};

module.exports = nextConfig;