import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  async redirects() {
    try {
      const redirects = require('./redirects.json');
      return redirects;
    } catch (error) {
      console.warn('⚠️ redirects.json not found, skipping redirects.');
      return [];
    }
  },
};

export default nextConfig;
